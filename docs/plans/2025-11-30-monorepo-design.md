# Monorepo Design: ferme-du-temple + credit-castor

## Overview

Restructure ferme-du-temple as a Turborepo monorepo with pnpm, integrating credit-castor at `/admin/credit`.

## Decisions

- **Tooling:** pnpm + Turborepo (Vercel best practices)
- **Shared packages:** Supabase auth + configs (Tailwind, TS, ESLint)
- **Routing:** Hybrid - credit-castor is separate app, shares auth via package
- **Auth:** Shared `@repo/auth` package, both apps use same Supabase session cookies
- **Styling:** credit-castor keeps its visual style, extends base Tailwind config

## Structure

```
ferme-du-temple/                    # Root becomes monorepo
├── apps/
│   ├── web/                        # Current ferme-du-temple (renamed)
│   │   ├── src/
│   │   ├── astro.config.mjs
│   │   ├── vercel.json             # Rewrite rule for /admin/credit
│   │   └── package.json
│   └── credit/                     # credit-castor moves here
│       ├── src/
│       ├── astro.config.mjs
│       └── package.json
├── packages/
│   ├── auth/                       # Shared Supabase auth
│   │   ├── src/
│   │   │   ├── client.ts           # Supabase client singleton
│   │   │   ├── middleware.ts       # Auth middleware for Astro
│   │   │   └── index.ts
│   │   └── package.json
│   ├── config/                     # Shared configs
│   │   ├── tailwind.config.js      # Base Tailwind config
│   │   ├── tsconfig.base.json
│   │   └── eslint.config.js
│   └── ui/                         # Optional future shared components
│       └── package.json
├── turbo.json
├── pnpm-workspace.yaml
└── package.json                    # Root package.json
```

## Shared Auth Package

```typescript
// packages/auth/src/client.ts
import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = (url: string, anonKey: string) => {
  return createClient(url, anonKey);
};

// Server-side client with cookie handling
export const createServerClient = (url: string, anonKey: string, cookies: AstroCookies) => {
  // ... cookie-based session handling
};
```

```typescript
// packages/auth/src/middleware.ts
export const withAuth = (handler) => {
  return async (context) => {
    const supabase = createServerClient(/*...*/);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return context.redirect('/admin/login');
    }

    context.locals.user = user;
    return handler(context);
  };
};
```

**Usage in both apps:**

```typescript
// apps/web/src/middleware.ts
// apps/credit/src/middleware.ts
import { withAuth } from '@repo/auth';

export const onRequest = withAuth;
```

## Vercel Deployment

Turborepo monorepos work with Vercel out of the box.

**Setup:**
1. Import repo to Vercel twice (once per app)
2. Set root directory for each:
   - Project 1: `apps/web` → deploys to `lafermedutemple.be`
   - Project 2: `apps/credit` → deploys to `credit.lafermedutemple.be`

**Routing `/admin/credit`** in `apps/web/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/admin/credit/:path*",
      "destination": "https://credit.lafermedutemple.be/:path*"
    }
  ]
}
```

## Migration Phases

### Phase 1: Scaffold monorepo (no code changes)
1. Create `pnpm-workspace.yaml`, `turbo.json`, root `package.json`
2. Move ferme-du-temple contents → `apps/web/`
3. Move credit-castor → `apps/credit/`
4. Create `packages/auth/`, `packages/config/`

### Phase 2: Extract shared configs
1. Move base Tailwind/TS/ESLint configs → `packages/config/`
2. Apps extend base configs
3. credit-castor keeps its theme overrides

### Phase 3: Extract auth package
1. Move `apps/web/src/lib/auth.ts` → `packages/auth/`
2. Update imports in both apps
3. credit-castor replaces Firebase auth with `@repo/auth`

### Phase 4: Vercel setup
1. Add `vercel.json` rewrite rule to `apps/web`
2. Deploy both apps to Vercel
3. Test `/admin/credit` routing

## Environment Variables

Both apps use same Supabase project:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Each app has its own `.env` file with identical values.
