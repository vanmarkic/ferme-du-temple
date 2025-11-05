# Admin Authentication System

This document describes the admin authentication system for managing inscriptions (candidate applications).

## Features

- **Email/Password Authentication** using Supabase Auth
- **Protected Admin Routes** with automatic redirect to login
- **Inscription Dashboard** with table view and detail modal
- **Search & Filter** inscriptions by name or email
- **Export Functionality** (CSV, TXT formats)
- **Email List Copy** - Copy all candidate emails for bulk emailing
- **Sortable & Pageable Table** for easy navigation

## Setup

### 1. Run Database Migrations

Make sure your database has the required tables:

```bash
npm run migrate
```

This will run both migrations:
- `001_create_inscriptions_table.sql` - Creates the inscriptions table
- `002_create_admin_users_table.sql` - Creates the admin_users table with RLS policies

### 2. Create Your First Admin User

Use the interactive script to create an admin user:

```bash
npm run create-admin
```

You'll be prompted for:
- Admin email address
- Password (minimum 6 characters)
- Role (admin or super_admin)

**Note:** You'll need `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file for this to work.

## Environment Variables

Required environment variables in `.env`:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Connection (for migrations)
SUPABASE_DB_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Email Configuration
RESEND_API_KEY=re_...
FROM_EMAIL=contact@lafermedutemple.be
ADMIN_EMAIL=admin@lafermedutemple.be
```

## Admin Routes

### Login Page
- **URL:** `/admin/login`
- **Access:** Public
- **Features:**
  - Email/password form
  - Redirect to dashboard on success
  - Error messages for invalid credentials

### Dashboard
- **URL:** `/admin/dashboard` or `/admin`
- **Access:** Protected (requires admin authentication)
- **Features:**
  - View all inscriptions in table format
  - Sort by any column (click header to toggle)
  - Pagination (10, 20, or 50 per page)
  - Search across nom, prénom, email
  - Click row to view full details
  - Export buttons (CSV, TXT, Email list)
  - Logout button

## API Endpoints

### Login
```
POST /api/admin/login
Body: { email: string, password: string }
Response: { success: boolean, user: { id, email, role } }
```

### Logout
```
POST /api/admin/logout
Response: { success: boolean }
```

### Get Inscriptions
```
GET /api/admin/inscriptions?page=1&limit=20&sort=created_at&order=desc&search=keyword
Response: {
  data: Inscription[],
  pagination: {
    total: number,
    page: number,
    limit: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
}
```

## Database Schema

### admin_users table
```sql
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

The system uses Supabase RLS policies to secure data:

1. **inscriptions table:**
   - Public can INSERT (form submissions)
   - Only admin_users can SELECT (read inscriptions)

2. **admin_users table:**
   - Users can read their own record
   - Only super_admins can create new admins

## User Roles

### admin
- Can view all inscriptions
- Can export data
- Can logout

### super_admin
- All admin permissions
- Can create new admin users (via Supabase dashboard or SQL)

## Export Features

### CSV Export
- Downloads file: `inscriptions-YYYY-MM-DD.csv`
- Includes all fields with French headers
- Proper escaping for Excel compatibility
- UTF-8 with BOM for special characters

### TXT Export
- Downloads file: `inscriptions-YYYY-MM-DD.txt`
- Tab-separated format
- Plain text, no special formatting

### Email List Copy
- Copies to clipboard in format: `"Prénom Nom" <email@example.com>, ...`
- Ready to paste into email client "To" field
- Includes all visible inscriptions

## Security Features

- **JWT Token Authentication** via HTTP-only cookies
- **Row Level Security** on database level
- **Middleware Protection** for all `/admin/*` routes (except login)
- **Session Management** with automatic token refresh
- **Admin Verification** on every API request
- **Environment Variable Protection** during build

## Troubleshooting

### "Unauthorized: Admin access required"
- Your user exists in auth.users but not in admin_users table
- Run `npm run create-admin` to properly create an admin user

### "Missing Supabase environment variables"
- Check your `.env` file has all required variables
- Restart the dev server after adding env variables

### Can't access /admin/dashboard
- Make sure you're logged in at `/admin/login`
- Check that your user exists in both `auth.users` and `admin_users` tables
- Verify cookies are enabled in your browser

### Build errors
- The auth system is designed to work during build without env variables
- Admin routes use SSR (server-side rendering)
- Public pages are prerendered as static files

## Development

### Running locally
```bash
npm run dev
```

### Testing
The admin system should be tested with:
1. Login with valid/invalid credentials
2. Access protected routes without login
3. View, search, sort, and paginate inscriptions
4. Export functionality
5. Logout and session expiry

### Adding New Admins in Production
Use the Supabase dashboard to:
1. Create user in Authentication > Users
2. Get the user's UUID
3. Insert into `admin_users` table with email and role

Or use the `npm run create-admin` script with production env variables.

## Architecture

- **Frontend:** Astro + React with shadcn/ui components
- **Backend:** Astro API routes (SSR)
- **Database:** Supabase PostgreSQL with RLS
- **Auth:** Supabase Auth with JWT tokens
- **State:** React Query for data fetching and caching
- **Styling:** Tailwind CSS with project color scheme

## File Structure

```
src/
├── components/
│   ├── AdminLoginForm.tsx       # Login form component
│   ├── AdminDashboard.tsx       # Main dashboard component
│   ├── InscriptionTable.tsx     # Table with sorting/pagination
│   └── InscriptionDetail.tsx    # Full-screen detail modal
├── lib/
│   ├── auth.ts                  # Auth utilities and session management
│   └── export-utils.ts          # CSV/TXT export functions
├── middleware.ts                # Route protection middleware
├── pages/
│   ├── admin/
│   │   ├── index.astro          # Redirect to dashboard
│   │   ├── login.astro          # Login page
│   │   └── dashboard.astro      # Dashboard page (protected)
│   └── api/
│       └── admin/
│           ├── login.ts         # Login endpoint
│           ├── logout.ts        # Logout endpoint
│           └── inscriptions.ts  # Get inscriptions endpoint
├── scripts/
│   └── create-admin.js          # CLI script to create admin users
└── supabase/
    └── migrations/
        └── 002_create_admin_users_table.sql
```
