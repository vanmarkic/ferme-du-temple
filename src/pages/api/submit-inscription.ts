import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

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

    // Validate required fields
    const requiredFields = ['nom', 'prenom', 'email', 'telephone', 'motivation'];
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

    // Insert into Supabase
    const { error: insertError } = await supabase.from('inscriptions').insert({
      nom: data.nom.trim(),
      prenom: data.prenom.trim(),
      email: data.email.trim().toLowerCase(),
      telephone: data.telephone.trim(),
      motivation: data.motivation.trim(),
      besoins_specifiques: data.besoinsSpecifiques?.trim() || null,
      infos_prioritaires: data.infosPrioritaires?.trim() || null,
    });

    if (insertError) {
      console.error('Supabase insert error:', insertError);
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
