# Vercel + Supabase Migration Guide

## Overview
This project has been migrated from Netlify to Vercel with Supabase for form data storage.

## Architecture

### Before
- **Hosting**: Netlify
- **Form Handling**: Netlify Forms (email notifications only)
- **Rendering**: Full SSG

### After
- **Hosting**: Vercel
- **Form Handling**: Custom API endpoint → Supabase
- **Rendering**: Hybrid (SSG + SSR for API routes)
- **Database**: Supabase PostgreSQL

## Setup Instructions

### 1. Supabase Configuration

#### Run the migration SQL
Execute the SQL script in your Supabase project:
```bash
# In Supabase SQL Editor, run:
supabase/migrations/001_create_inscriptions_table.sql
```

This creates:
- `inscriptions` table with all form fields
- RLS policies (public inserts, authenticated reads)
- Indexes for performance
- Auto-updating `updated_at` trigger

#### Get credentials
1. Go to Supabase Project Settings → API
2. Copy `Project URL` and `anon/public key`

### 2. Environment Variables

Create `.env` file in project root:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=habitatbeaver@gmail.com
FROM_EMAIL=noreply@ferme-du-temple.com
```

⚠️ **Important**: This file is gitignored. Never commit secrets.

#### Resend Setup

1. Create free account at [resend.com](https://resend.com) (3,000 emails/month free)
2. Get API key from Dashboard → API Keys
3. Verify your domain or use `onboarding@resend.dev` for testing
4. For production, add your domain in Resend dashboard

### 3. Vercel Deployment

#### Connect repository
```bash
npm install -g vercel
vercel login
vercel link
```

#### Set environment variables
```bash
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add RESEND_API_KEY production
vercel env add ADMIN_EMAIL production
vercel env add FROM_EMAIL production
```

Or set them in Vercel dashboard:
- Project Settings → Environment Variables
- Add: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `ADMIN_EMAIL`, `FROM_EMAIL`

#### Deploy
```bash
vercel --prod
```

### 4. Update Site URL
Once deployed, update in:
- `astro.config.mjs` (line 7): Change to your Vercel domain
- Supabase Project Settings → API Settings → Site URL

## Features

### Email Notifications
- **User confirmation email**: Sent automatically after successful submission
- **Admin notification email**: Sent to `ADMIN_EMAIL` with all submission details
- **Beautiful HTML templates**: Professional, responsive design
- **Graceful degradation**: Form submission succeeds even if emails fail

### Rate Limiting
- **3 submissions per hour** per IP address
- In-memory storage (resets on cold start)
- Can be upgraded to Upstash Redis for persistence

### Security
- ✅ Honeypot spam protection
- ✅ Server-side validation (required fields, email format)
- ✅ Supabase RLS policies
- ✅ Environment variables for credentials
- ✅ Rate limiting per IP

### Data Storage
All form submissions stored in Supabase with:
- `id` (UUID, auto-generated)
- `nom`, `prenom`, `email`, `telephone` (required)
- `motivation` (required)
- `besoins_specifiques`, `infos_prioritaires` (optional)
- `created_at`, `updated_at` (auto-managed)

## API Endpoint

### POST /api/submit-inscription

**Request:**
```json
{
  "nom": "Dupont",
  "prenom": "Marie",
  "email": "marie@example.com",
  "telephone": "0612345678",
  "motivation": "Participer à la vie de la ferme",
  "besoinsSpecifiques": "Régime végétarien",
  "infosPrioritaires": "Horaires flexibles",
  "bot-field": ""
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Inscription enregistrée avec succès."
}
```

**Response (Error):**
```json
{
  "error": "Trop de demandes. Veuillez réessayer plus tard."
}
```

**Status Codes:**
- `200`: Success
- `400`: Validation error / spam detected
- `429`: Rate limit exceeded
- `500`: Server error

## Viewing Submissions

### Supabase Dashboard
1. Go to Table Editor → `inscriptions`
2. View all submissions with filters/search
3. Export to CSV if needed

### Future: Admin Dashboard
Can be built with Supabase Auth:
- Protected route with login
- View/filter submissions
- Send notifications
- Export data

## Testing Locally

```bash
# Install dependencies
npm install

# Add .env file with credentials
cat > .env << EOF
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=habitatbeaver@gmail.com
FROM_EMAIL=noreply@ferme-du-temple.com
EOF

# Run dev server
npm run dev

# Test form at http://localhost:4321
```

**Testing emails:**
- Use `onboarding@resend.dev` as `FROM_EMAIL` for testing
- Check Resend dashboard for sent emails
- For production, verify your domain first

## Troubleshooting

### "Configuration du serveur incorrecte"
- Check `.env` file exists
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set
- Restart dev server

### "Erreur lors de l'enregistrement"
- Check Supabase RLS policies are enabled
- Verify table schema matches form fields
- Check Supabase logs in dashboard

### Rate limit not working
- In-memory storage resets on function cold start
- Consider Upstash Redis for production

### Form submissions not appearing
- Check Supabase Table Editor → `inscriptions`
- View API logs in Vercel dashboard
- Check browser network tab for errors

## Email Templates

Emails are defined in `src/lib/email-templates.ts`:
- `getUserConfirmationEmail()`: Sends confirmation to user with summary
- `getAdminNotificationEmail()`: Sends detailed notification to admin

Both templates are:
- Fully responsive (mobile-friendly)
- Beautiful HTML design with gradients and icons
- Include all submission data

To customize:
1. Edit templates in `src/lib/email-templates.ts`
2. Test locally with real Resend API key
3. Deploy changes

## Next Steps

- [x] Email notifications via Resend
- [ ] Build admin dashboard for viewing submissions
- [ ] Add Upstash Redis for persistent rate limiting
- [ ] Implement spam detection with ML/AI
- [ ] Add submission analytics
- [ ] Custom domain for email sender

## Files Changed
- `astro.config.mjs` - Added Vercel adapter, hybrid output
- `src/components/InscriptionForm.tsx` - API integration, error handling
- `src/pages/api/submit-inscription.ts` - New API endpoint
- `supabase/migrations/001_create_inscriptions_table.sql` - Database schema
- `vercel.json` - Vercel configuration
- `.gitignore` - Added Vercel folders
- Removed: `netlify.toml`
