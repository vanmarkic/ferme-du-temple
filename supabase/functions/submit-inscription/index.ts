import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Validation schema
const inscriptionSchema = z.object({
  nom: z.string().trim().min(1).max(100),
  prenom: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  telephone: z.string().trim().max(20).optional().or(z.literal("")),
  motivation: z.string().trim().min(1).max(2000),
  besoinsSpecifiques: z.string().trim().max(1000).optional().or(z.literal("")),
  newsletter: z.boolean(),
  rencontre: z.boolean(),
});

// HTML escape function to prevent XSS in emails
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InscriptionRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  motivation: string;
  besoinsSpecifiques?: string;
  newsletter: boolean;
  rencontre: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestData = await req.json();
    
    // Validate input data
    const validation = inscriptionSchema.safeParse(requestData);
    if (!validation.success) {
      console.error("Validation error:", validation.error.errors);
      return new Response(
        JSON.stringify({ error: "Invalid input data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const inscriptionData = validation.data;
    console.log("Received valid inscription:", { email: inscriptionData.email });

    // Insert into database
    const { data: inscription, error: dbError } = await supabase
      .from("inscriptions")
      .insert({
        nom: inscriptionData.nom,
        prenom: inscriptionData.prenom,
        email: inscriptionData.email,
        telephone: inscriptionData.telephone || null,
        motivation: inscriptionData.motivation,
        besoins_specifiques: inscriptionData.besoinsSpecifiques || null,
        newsletter: inscriptionData.newsletter,
        rencontre: inscriptionData.rencontre,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Unable to save your application. Please try again." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Inscription saved to database");

    // Send confirmation email with sanitized content
    const emailResponse = await resend.emails.send({
      from: "La Ferme du Temple <contact@lafermedutemple.be>",
      to: [inscriptionData.email],
      subject: "Votre candidature au projet Beaver 🌱",
      html: `
        <h1>Bonjour ${escapeHtml(inscriptionData.prenom)} ${escapeHtml(inscriptionData.nom)} !</h1>
        <p>Nous avons bien reçu votre candidature pour rejoindre le projet Beaver.</p>
        <p>Votre motivation nous touche et nous vous recontacterons très prochainement pour échanger sur votre projet.</p>
        <p>À très bientôt,<br>L'équipe Beaver</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        inscription,
        emailSent: true 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in submit-inscription function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again later." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
