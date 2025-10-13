# Agent Guidelines for Ferme du Temple

## Build & Test Commands
- **Dev**: `npm run dev` (Astro server on http://localhost:4321)
- **Build**: `npm run build` (production build)
- **Lint**: `npm run lint` (ESLint)
- **Test**: `npm run test` (Vitest unit tests)
- **Test Watch**: `npm run test:watch` (Vitest in watch mode)
- **E2E Tests**: `npm run test:e2e` (Playwright, headless by default)
- **E2E Tests UI**: `npm run test:e2e:ui` (Playwright with UI for debugging)
- **Single Test**: `npx vitest run <path/to/test.test.tsx>`

## Architecture
- **Framework**: Astro 5 with React integration, TypeScript, Tailwind CSS, shadcn-ui components
- **Structure**: `src/pages/` (Astro routes), `src/components/` (React TSX), `src/lib/` (utilities), `src/content/` (content collections), `src/layouts/` (Astro layouts)
- **Aliases**: Use `@/` for imports (resolves to `/src`)
- **Tests**: Unit tests (`*.test.ts/tsx` in `src/`) use Vitest + jsdom, E2E tests in `tests/` use Playwright

## Code Style & Conventions
- **Imports**: Use `@/` alias (e.g., `import { cn } from '@/lib/utils'`), group external then internal imports
- **Components**: React functional components with TypeScript, use `cn()` for conditional class names
- **Naming**: camelCase for variables/functions, PascalCase for components/interfaces
- **Error Handling**: Meaningful error messages, avoid silent failures
- **No Comments**: Code should be self-explanatory unless complexity requires context (see CLAUDE.md)

## Development Principles (from CLAUDE.md)
- **TDD**: Write tests BEFORE implementing features (red-green-refactor), use Vitest not Jest
- **Code Quality**: Extend existing code first, remove > add > modify code priority, apply boy scout rule
- **Root Cause**: Detect code smell and solve underlying causes rather than symptoms
- **Documentation**: Avoid documentation, prefer self-explanatory code; place generated docs in `./docs`
