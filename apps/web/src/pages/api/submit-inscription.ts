import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getUserConfirmationEmail, getAdminNotificationEmail, getNewsletterConfirmationEmail, getNewsletterAdminNotification } from '@/lib/email-templates';

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS = 3; // 3 submissions per hour per IP

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({
          error: 'Trop de demandes. Veuillez réessayer plus tard.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse form data
    const data = await request.json();

    // Detect if this is a newsletter-only submission
    const isNewsletterOnly = data.newsletterOnly === true;

    // Validate required fields (different for newsletter vs full application)
    const requiredFields = isNewsletterOnly
      ? ['email']
      : ['nom', 'prenom', 'email', 'telephone', 'motivation'];

    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        return new Response(
          JSON.stringify({
            error: `Le champ ${field} est requis.`,
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Check honeypot field (spam protection)
    if (data['bot-field']) {
      return new Response(
        JSON.stringify({ error: 'Spam détecté.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({
          error: "Format d'email invalide.",
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = import.meta.env.SUPABASE_URL;
    const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not configured');
      return new Response(
        JSON.stringify({
          error: 'Configuration du serveur incorrecte.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Prepare data for insert and emails
    const inscriptionData = isNewsletterOnly
      ? {
          nom: 'NEWSLETTER',
          prenom: 'NEWSLETTER',
          email: data.email.trim().toLowerCase(),
          telephone: 'N/A',
          motivation: 'Newsletter subscription only',
          besoinsSpecifiques: null,
          infosPrioritaires: null,
        }
      : {
          nom: data.nom.trim(),
          prenom: data.prenom.trim(),
          email: data.email.trim().toLowerCase(),
          telephone: data.telephone.trim(),
          motivation: data.motivation.trim(),
          besoinsSpecifiques: data.besoinsSpecifiques?.trim() || null,
          infosPrioritaires: data.infosPrioritaires?.trim() || null,
        };

    // Check if email already exists
    const { data: existingRow } = await supabase
      .from('inscriptions')
      .select('id, newsletter_only')
      .eq('email', inscriptionData.email)
      .single();

    let dbError = null;

    if (existingRow) {
      // Email exists - only update if upgrading from newsletter to full candidature
      // or if it's a full candidature updating another full candidature
      if (isNewsletterOnly && !existingRow.newsletter_only) {
        // Newsletter subscription for existing full candidate - do nothing, already subscribed
        // (they'll keep receiving newsletters as a candidate)
      } else {
        // Either: newsletter updating newsletter, or full candidature updating anything
        const { error } = await supabase
          .from('inscriptions')
          .update({
            nom: inscriptionData.nom,
            prenom: inscriptionData.prenom,
            telephone: inscriptionData.telephone,
            motivation: inscriptionData.motivation,
            besoins_specifiques: inscriptionData.besoinsSpecifiques,
            infos_prioritaires: inscriptionData.infosPrioritaires,
            newsletter_only: isNewsletterOnly,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingRow.id);
        dbError = error;
      }
    } else {
      // New email - insert
      const { error } = await supabase.from('inscriptions').insert({
        nom: inscriptionData.nom,
        prenom: inscriptionData.prenom,
        email: inscriptionData.email,
        telephone: inscriptionData.telephone,
        motivation: inscriptionData.motivation,
        besoins_specifiques: inscriptionData.besoinsSpecifiques,
        infos_prioritaires: inscriptionData.infosPrioritaires,
        newsletter_only: isNewsletterOnly,
      });
      dbError = error;
    }

    if (dbError) {
      console.error('Supabase error:', dbError);
      return new Response(
        JSON.stringify({
          error: "Erreur lors de l'enregistrement. Veuillez réessayer.",
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Send emails (don't block the response if emails fail)
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const adminEmail = import.meta.env.ADMIN_EMAIL;
    const baseFromEmail = import.meta.env.FROM_EMAIL || 'onboarding@resend.dev';
    const fromEmail = `"La Ferme du Temple" <${baseFromEmail}>`;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      try {
        // Send different emails based on submission type
        if (isNewsletterOnly) {
          // Send newsletter confirmation email to user
          const newsletterEmail = getNewsletterConfirmationEmail({ email: inscriptionData.email });
          await resend.emails.send({
            from: fromEmail,
            to: inscriptionData.email,
            subject: newsletterEmail.subject,
            html: newsletterEmail.html,
          });

          // Send newsletter notification to admin
          if (adminEmail) {
            const newsletterAdminEmail = getNewsletterAdminNotification({ email: inscriptionData.email });
            await resend.emails.send({
              from: fromEmail,
              to: adminEmail,
              subject: newsletterAdminEmail.subject,
              html: newsletterAdminEmail.html,
            });
          }
        } else {
          // Send full application confirmation email to user
          const userEmail = getUserConfirmationEmail(inscriptionData);
          await resend.emails.send({
            from: fromEmail,
            to: inscriptionData.email,
            subject: userEmail.subject,
            html: userEmail.html,
          });

          // Send full application notification to admin
          if (adminEmail) {
            const adminEmailContent = getAdminNotificationEmail(inscriptionData);
            await resend.emails.send({
              from: fromEmail,
              to: adminEmail,
              subject: adminEmailContent.subject,
              html: adminEmailContent.html,
            });
          }
        }
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error('Email sending error:', emailError);
      }
    } else {
      console.warn('RESEND_API_KEY not configured, emails not sent');
    }

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Inscription enregistrée avec succès.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Erreur serveur. Veuillez réessayer plus tard.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
