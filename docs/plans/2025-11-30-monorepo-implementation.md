# Monorepo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure ferme-du-temple as a Turborepo monorepo with pnpm, integrating credit-castor at `/admin/credit` with shared auth.

**Architecture:** Turborepo + pnpm workspace with two Astro apps (`apps/web`, `apps/credit`) sharing packages for auth, config, and optional UI components.

**Tech Stack:** pnpm, Turborepo, Astro, React, Supabase, TypeScript, Tailwind CSS

---

## Task 1: Initialize pnpm and Turborepo at Root

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `package.json` (root)

**Step 1: Install pnpm globally if needed**

Run: `npm install -g pnpm`

**Step 2: Create pnpm workspace config**

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**Step 3: Create root package.json**

Create `package.json`:

```json
{
  "name": "ferme-du-temple-monorepo",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "test": "turbo test",
    "dev:web": "turbo dev --filter=@repo/web",
    "dev:credit": "turbo dev --filter=@repo/credit"
  },
  "devDependencies": {
    "turbo": "^2.3.0"
  },
  "packageManager": "pnpm@9.14.2"
}
```

**Step 4: Create turbo.json**

Create `turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".astro/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Step 5: Commit**

```bash
git add pnpm-workspace.yaml turbo.json package.json
git commit -m "chore: initialize pnpm + turborepo monorepo structure"
```

---

## Task 2: Create apps Directory and Move ferme-du-temple

**Files:**
- Create: `apps/` directory
- Move: all current files → `apps/web/`

**Step 1: Create apps directory**

Run: `mkdir -p apps`

**Step 2: Move all project files to apps/web**

Run:
```bash
mkdir -p apps/web
# Move all files except node_modules, .git, and the new monorepo files
for item in astro.config.mjs components.json eslint.config.js keystatic.config.tsx postcss.config.js public scripts src tailwind.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json vitest.config.ts; do
  [ -e "$item" ] && mv "$item" apps/web/
done
```

**Step 3: Move package.json to apps/web and rename**

Run: `mv package.json apps/web/` (after creating new root package.json)

Note: Actually, we need to do this in a different order. Let me restructure:

**Step 3: Rename current package.json temporarily**

Run: `mv package.json package.json.web`

**Step 4: Create root package.json first (from Task 1 Step 3)**

**Step 5: Create apps/web and move files**

Run:
```bash
mkdir -p apps/web
mv package.json.web apps/web/package.json
mv astro.config.mjs apps/web/
mv components.json apps/web/
mv eslint.config.js apps/web/
mv keystatic.config.tsx apps/web/
mv postcss.config.js apps/web/
mv public apps/web/
mv scripts apps/web/
mv src apps/web/
mv tailwind.config.ts apps/web/
mv tsconfig.json apps/web/
mv tsconfig.app.json apps/web/
mv tsconfig.node.json apps/web/
mv vitest.config.ts apps/web/
```

**Step 6: Update apps/web/package.json name**

Edit `apps/web/package.json`, change line 2:

```json
"name": "@repo/web",
```

**Step 7: Commit**

```bash
git add -A
git commit -m "refactor: move ferme-du-temple to apps/web"
```

---

## Task 3: Move credit-castor from src/ to apps/credit

**Files:**
- Move: `src/credit-castor/` → `apps/credit/src/`
- Create: `apps/credit/package.json`
- Create: `apps/credit/astro.config.mjs`
- Create: `apps/credit/tailwind.config.js`
- Create: `apps/credit/tsconfig.json`
- Create: `apps/credit/postcss.config.js`

**Note:** credit-castor source is already in the repo at `src/credit-castor/`. We need to restructure it as a proper Astro app.

**Step 1: Create apps/credit directory structure**

Run:
```bash
mkdir -p apps/credit/src
mkdir -p apps/credit/public
```

**Step 2: Move credit-castor source to apps/credit/src**

Run:
```bash
mv src/credit-castor/* apps/credit/src/
rmdir src/credit-castor
```

**Step 3: Create apps/credit/package.json**

Create `apps/credit/package.json`:

```json
{
  "name": "@repo/credit",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev --port 4322",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "lint": "eslint ."
  },
  "dependencies": {
    "@astrojs/react": "^4.4.0",
    "@astrojs/tailwind": "^6.0.2",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@repo/auth": "workspace:*",
    "@repo/config": "workspace:*",
    "@supabase/supabase-js": "^2.76.1",
    "astro": "^5.16.0",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.545.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.4",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3",
    "vitest": "^3.2.4"
  }
}
```

**Step 4: Create apps/credit/astro.config.mjs**

Create `apps/credit/astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://lafermedutemple.be',
  base: '/admin/credit',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
});
```

**Step 5: Create apps/credit/tailwind.config.js**

Create `apps/credit/tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,astro}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Step 6: Create apps/credit/tsconfig.json**

Create `apps/credit/tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "skipLibCheck": true
  }
}
```

**Step 7: Create apps/credit/postcss.config.js**

Create `apps/credit/postcss.config.js`:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Step 8: Commit**

```bash
git add apps/credit
git commit -m "feat: restructure credit-castor as apps/credit"
```

---

## Task 4: Create packages/config for Shared Configs

**Files:**
- Create: `packages/config/package.json`
- Create: `packages/config/tailwind.base.js`
- Create: `packages/config/tsconfig.base.json`
- Create: `packages/config/eslint.base.js`

**Step 1: Create packages/config directory**

Run: `mkdir -p packages/config`

**Step 2: Create packages/config/package.json**

Create `packages/config/package.json`:

```json
{
  "name": "@repo/config",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./tailwind": "./tailwind.base.js",
    "./tsconfig": "./tsconfig.base.json",
    "./eslint": "./eslint.base.js"
  }
}
```

**Step 3: Create base Tailwind config**

Create `packages/config/tailwind.base.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
```

**Step 4: Create base TypeScript config**

Create `packages/config/tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true
  }
}
```

**Step 5: Create base ESLint config**

Create `packages/config/eslint.base.js`:

```javascript
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
```

**Step 6: Commit**

```bash
git add packages/config
git commit -m "feat: add packages/config with shared configs"
```

---

## Task 5: Create packages/auth for Shared Supabase Auth

**Files:**
- Create: `packages/auth/package.json`
- Create: `packages/auth/src/index.ts`
- Create: `packages/auth/src/client.ts`
- Create: `packages/auth/src/middleware.ts`
- Create: `packages/auth/src/cookies.ts`
- Create: `packages/auth/tsconfig.json`

**Step 1: Create packages/auth directory**

Run: `mkdir -p packages/auth/src`

**Step 2: Create packages/auth/package.json**

Create `packages/auth/package.json`:

```json
{
  "name": "@repo/auth",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.76.1"
  },
  "peerDependencies": {
    "astro": "^5.0.0"
  }
}
```

**Step 3: Create packages/auth/tsconfig.json**

Create `packages/auth/tsconfig.json`:

```json
{
  "extends": "@repo/config/tsconfig",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "noEmit": false
  },
  "include": ["src/**/*"]
}
```

**Step 4: Create packages/auth/src/client.ts**

Create `packages/auth/src/client.ts`:

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type { SupabaseClient };

export function createSupabaseClient(url: string, anonKey: string): SupabaseClient {
  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

export function createServerSupabaseClient(url: string, anonKey: string): SupabaseClient {
  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
```

**Step 5: Create packages/auth/src/cookies.ts**

Create `packages/auth/src/cookies.ts`:

```typescript
import type { AstroCookies } from 'astro';

export function getAuthTokens(cookies: AstroCookies) {
  const accessToken = cookies.get('sb-access-token')?.value;
  const refreshToken = cookies.get('sb-refresh-token')?.value;
  return { accessToken, refreshToken };
}

export function setAuthCookies(
  cookies: AstroCookies,
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
  isProduction: boolean
) {
  cookies.set('sb-access-token', accessToken, {
    path: '/',
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: expiresIn,
  });

  cookies.set('sb-refresh-token', refreshToken, {
    path: '/',
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export function clearAuthCookies(cookies: AstroCookies) {
  cookies.delete('sb-access-token', { path: '/' });
  cookies.delete('sb-refresh-token', { path: '/' });
}
```

**Step 6: Create packages/auth/src/middleware.ts**

Create `packages/auth/src/middleware.ts`:

```typescript
import type { AstroCookies } from 'astro';
import { createServerSupabaseClient } from './client';
import { getAuthTokens } from './cookies';

export interface AuthConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  adminTableName?: string;
  loginPath?: string;
}

export async function getSession(cookies: AstroCookies, config: AuthConfig) {
  const { accessToken, refreshToken } = getAuthTokens(cookies);

  if (!accessToken || !refreshToken) {
    return { session: null, user: null };
  }

  const supabase = createServerSupabaseClient(config.supabaseUrl, config.supabaseAnonKey);
  const { data: { session }, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error || !session) {
    return { session: null, user: null };
  }

  return { session, user: session.user };
}

export async function isAdmin(cookies: AstroCookies, config: AuthConfig): Promise<boolean> {
  const { session, user } = await getSession(cookies, config);

  if (!user || !session) {
    return false;
  }

  const supabase = createServerSupabaseClient(config.supabaseUrl, config.supabaseAnonKey);
  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  const tableName = config.adminTableName || 'admin_users';
  const { data, error } = await supabase
    .from(tableName)
    .select('id')
    .eq('id', user.id)
    .single();

  return !error && !!data;
}

export async function requireAdmin(cookies: AstroCookies, config: AuthConfig, redirectTo: string = '/admin') {
  const isAdminUser = await isAdmin(cookies, config);

  if (!isAdminUser) {
    const loginPath = config.loginPath || '/admin/login';
    return {
      authenticated: false,
      redirectTo: `${loginPath}?redirect=${encodeURIComponent(redirectTo)}`,
    };
  }

  const { user } = await getSession(cookies, config);
  return {
    authenticated: true,
    user,
  };
}
```

**Step 7: Create packages/auth/src/index.ts**

Create `packages/auth/src/index.ts`:

```typescript
export { createSupabaseClient, createServerSupabaseClient } from './client';
export type { SupabaseClient } from './client';
export { getAuthTokens, setAuthCookies, clearAuthCookies } from './cookies';
export { getSession, isAdmin, requireAdmin } from './middleware';
export type { AuthConfig } from './middleware';
```

**Step 8: Commit**

```bash
git add packages/auth
git commit -m "feat: add packages/auth with shared Supabase auth"
```

---

## Task 6: Update apps/web to Use Shared Packages

**Files:**
- Modify: `apps/web/package.json`
- Modify: `apps/web/src/lib/auth.ts`
- Modify: `apps/web/src/middleware.ts`

**Step 1: Add workspace dependencies to apps/web/package.json**

Edit `apps/web/package.json`, add to dependencies:

```json
"@repo/auth": "workspace:*",
"@repo/config": "workspace:*"
```

**Step 2: Update apps/web/src/lib/auth.ts**

Replace `apps/web/src/lib/auth.ts`:

```typescript
import type { AstroCookies } from 'astro';
import {
  createSupabaseClient,
  getSession as getSessionBase,
  isAdmin as isAdminBase,
  requireAdmin as requireAdminBase,
  setAuthCookies as setAuthCookiesBase,
  clearAuthCookies,
  type AuthConfig,
} from '@repo/auth';

const supabaseUrl = import.meta.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || '';

const authConfig: AuthConfig = {
  supabaseUrl,
  supabaseAnonKey,
  adminTableName: 'admin_users',
  loginPath: '/admin/login',
};

// Browser client (only created if credentials exist)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
  : null;

// Re-export with config applied
export async function getSession(cookies: AstroCookies) {
  return getSessionBase(cookies, authConfig);
}

export async function isAdmin(cookies: AstroCookies) {
  return isAdminBase(cookies, authConfig);
}

export async function requireAdmin(cookies: AstroCookies, redirectTo?: string) {
  return requireAdminBase(cookies, authConfig, redirectTo);
}

export function setAuthCookies(
  cookies: AstroCookies,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) {
  setAuthCookiesBase(cookies, accessToken, refreshToken, expiresIn, import.meta.env.PROD);
}

export { clearAuthCookies };
```

**Step 3: Verify apps/web/src/middleware.ts still works**

The middleware imports from `./lib/auth` which now uses `@repo/auth` internally. No changes needed.

**Step 4: Commit**

```bash
git add apps/web/package.json apps/web/src/lib/auth.ts
git commit -m "refactor: update apps/web to use @repo/auth"
```

---

## Task 7: Update apps/credit to Use Shared Auth

**Files:**
- Create: `apps/credit/src/lib/auth.ts`
- Create: `apps/credit/src/middleware.ts`

**Note:** `@repo/auth` dependency already added in Task 3's package.json.

**Step 1: Create apps/credit/src/lib directory**

Run: `mkdir -p apps/credit/src/lib`

**Step 2: Create apps/credit/src/lib/auth.ts**

Create `apps/credit/src/lib/auth.ts` (this replaces the Firebase-based auth):

```typescript
import type { AstroCookies } from 'astro';
import {
  createSupabaseClient,
  getSession as getSessionBase,
  isAdmin as isAdminBase,
  type AuthConfig,
} from '@repo/auth';

const supabaseUrl = import.meta.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || '';

const authConfig: AuthConfig = {
  supabaseUrl,
  supabaseAnonKey,
  adminTableName: 'admin_users',
  loginPath: '/admin/login',  // Redirects to main app's login
};

export const supabase = supabaseUrl && supabaseAnonKey
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function getSession(cookies: AstroCookies) {
  return getSessionBase(cookies, authConfig);
}

export async function isAdmin(cookies: AstroCookies) {
  return isAdminBase(cookies, authConfig);
}
```

**Step 3: Create apps/credit/src/middleware.ts**

Create `apps/credit/src/middleware.ts`:

```typescript
import { defineMiddleware } from 'astro:middleware';
import { isAdmin } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;

  // All credit routes require admin auth
  const adminStatus = await isAdmin(cookies);

  if (!adminStatus) {
    // Redirect to main app's login
    const redirectTo = encodeURIComponent('/admin/credit' + url.pathname + url.search);
    return redirect(`/admin/login?redirect=${redirectTo}`);
  }

  return next();
});
```

**Step 4: Add env.d.ts types for Supabase env vars**

Edit `apps/credit/src/env.d.ts`, add:

```typescript
interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
}
```

**Step 5: Commit**

```bash
git add apps/credit/src/lib apps/credit/src/middleware.ts apps/credit/src/env.d.ts
git commit -m "feat: integrate apps/credit with @repo/auth"
```

---

## Task 8: Add Vercel Rewrite for /admin/credit

**Files:**
- Create: `apps/web/vercel.json`

**Step 1: Create apps/web/vercel.json**

Create `apps/web/vercel.json`:

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

**Step 2: Commit**

```bash
git add apps/web/vercel.json
git commit -m "feat: add Vercel rewrite for /admin/credit"
```

---

## Task 9: Clean Up and Install Dependencies

**Step 1: Remove old node_modules**

Run: `rm -rf node_modules apps/web/node_modules`

**Step 2: Create .gitignore at root if not exists**

Ensure root `.gitignore` includes:

```
node_modules
dist
.astro
.turbo
.env
.env.local
```

**Step 3: Install all dependencies**

Run: `pnpm install`

**Step 4: Verify turbo works**

Run: `pnpm dev:web`

Expected: apps/web starts on localhost:4321

**Step 5: Test apps/credit**

Run: `pnpm dev:credit`

Expected: apps/credit starts (may have Firebase errors until migration complete)

**Step 6: Final commit**

```bash
git add -A
git commit -m "chore: complete monorepo setup"
```

---

## Task 10: Create .env Files for Both Apps

**Files:**
- Create: `apps/web/.env` (copy from current .env)
- Create: `apps/credit/.env`

**Step 1: Ensure apps/web/.env exists**

If not already moved, copy the existing `.env` to `apps/web/.env`.

**Step 2: Create apps/credit/.env**

Create `apps/credit/.env` with same Supabase credentials:

```
SUPABASE_URL=<same as apps/web>
SUPABASE_ANON_KEY=<same as apps/web>
```

**Step 3: Add .env to .gitignore if not present**

Verify `.env` is in root `.gitignore`.

---

## Summary

After completing all tasks:

1. Monorepo structure with `apps/web` and `apps/credit`
2. Shared auth package at `packages/auth`
3. Shared configs at `packages/config`
4. Both apps use same Supabase session cookies
5. Vercel rewrite routes `/admin/credit/*` to credit subdomain
6. Run `pnpm dev` to start both apps, or `pnpm dev:web` / `pnpm dev:credit` individually
