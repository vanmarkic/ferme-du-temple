# La Ferme du Temple

Website for the participatory ecological housing project "Habitat Partagé Écologique" in Frameries, Belgium.

## Overview

This is an Astro-based website with React components, featuring:
- Project information and timeline
- Interactive map with Leaflet
- Inscription form for candidates
- Admin dashboard for managing applications
- Email notifications via Resend

## Tech Stack

- **Framework:** Astro 5.14.4 (SSR mode)
- **UI:** React 18 + shadcn/ui + Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Email:** Resend
- **Deployment:** Vercel
- **Testing:** Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Resend account (for emails)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ferme-du-temple
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for admin creation)
- `SUPABASE_DB_URL` - PostgreSQL connection string
- `RESEND_API_KEY` - Resend API key for emails
- `FROM_EMAIL` - Sender email address
- `ADMIN_EMAIL` - Admin notification email

4. **Run database migrations**
```bash
npm run migrate
```

This creates:
- `inscriptions` table for candidate applications
- `admin_users` table for admin access

5. **Create your first admin user**
```bash
npm run create-admin
```

Follow the prompts to set up your admin email and password.

6. **Start development server**
```bash
npm run dev
```

Visit http://localhost:4321

## Admin System

The project includes a complete admin authentication system for managing candidate inscriptions.

### Accessing the Admin Dashboard

1. Navigate to `/admin/login`
2. Login with your admin credentials
3. View, search, and export inscriptions

### Admin Features

- **View all inscriptions** in a sortable, paginated table
- **Search** by name or email
- **Full detail view** for each candidate
- **Export data** to CSV or TXT format
- **Copy email list** for bulk communication
- **Secure authentication** with JWT tokens

For detailed documentation, see [docs/ADMIN_SYSTEM.md](docs/ADMIN_SYSTEM.md)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:e2e:ui` - Run E2E tests with UI
- `npm run migrate` - Run database migrations
- `npm run create-admin` - Create admin user interactively
- `npm run lint` - Run ESLint

## Project Structure

```
ferme-du-temple/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLoginForm.tsx
│   │   ├── InscriptionForm.tsx
│   │   └── ...
│   ├── content/             # Markdown content files
│   ├── layouts/             # Astro layouts
│   ├── lib/                 # Utilities
│   │   ├── auth.ts          # Authentication utilities
│   │   ├── export-utils.ts  # Export functionality
│   │   └── utils.ts
│   ├── middleware.ts        # Auth middleware
│   └── pages/
│       ├── index.astro      # Homepage
│       ├── admin/           # Admin routes
│       │   ├── login.astro
│       │   └── dashboard.astro
│       └── api/             # API endpoints
│           ├── submit-inscription.ts
│           └── admin/
│               ├── login.ts
│               ├── logout.ts
│               └── inscriptions.ts
├── supabase/
│   └── migrations/          # SQL migrations
├── scripts/
│   ├── migrate.js           # Migration runner
│   └── create-admin.js      # Admin creation tool
├── docs/
│   └── ADMIN_SYSTEM.md      # Admin system docs
└── public/                  # Static assets
```

## Content Management

Content is managed via Astro Content Collections in `src/content/`:

- `inscription.md` - Form labels and text
- `navigation.md` - Menu items
- `hero.md` - Hero section
- `project.md` - Project description
- `location.md` - Address and map info
- `timeline.md` - Project timeline
- And more...

Edit these markdown files to update website content without touching code.

## Database Schema

### inscriptions
Stores candidate applications from the website form.

Fields: `id`, `nom`, `prenom`, `email`, `telephone`, `motivation`, `besoins_specifiques`, `infos_prioritaires`, `created_at`, `updated_at`

### admin_users
Stores admin users with role-based access.

Fields: `id`, `email`, `role`, `created_at`, `updated_at`

Roles: `admin`, `super_admin`

## Security

- Row Level Security (RLS) enabled on all tables
- JWT token authentication for admin routes
- HTTP-only cookies for session management
- Middleware protection for sensitive routes
- Environment variable isolation

## Deployment

This project is configured for Vercel deployment:

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

Make sure to:
- Run migrations on production database
- Create admin users in production
- Configure Resend for production emails

## Contributing

1. Follow the project conventions in `CLAUDE.md`
2. Write tests before implementing features (TDD)
3. Keep code clean and self-documenting
4. Use meaningful commit messages

## License

[License information]

## Contact

Contact: contact@lafermedutemple.be
