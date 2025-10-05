import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    const inscriptionData: InscriptionRequest = await req.json();

    console.log("Received inscription:", { email: inscriptionData.email });

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
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log("Inscription saved to database");

    // Send confirmation email
    const emailResponse = await resend.emails.send({
      from: "Beaver Project <onboarding@resend.dev>",
      to: [inscriptionData.email],
      subject: "Votre candidature au projet Beaver 🌱",
      html: `
        <h1>Bonjour ${inscriptionData.prenom} ${inscriptionData.nom} !</h1>
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
