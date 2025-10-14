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

## Development Principles

### Test Driven Development (TDD)
- Write tests BEFORE implementing features (red-green-refactor)
- Write failing test first to reproduce bugs, then fix them
- Use Vitest (not Jest) for unit tests: `npm run test`
- When tests break after refactoring, investigate and ask before making changes
- Run and test code automatically, continue fixing errors until it works

### Code Quality
- **Priority**: Remove > Add > Modify code (removing code is very good)
- **Boy Scout Rule**: Leave codebase cleaner than found
- **Extend First**: Check if existing code can be extended before creating new functions/classes
- **Root Cause**: Solve underlying causes rather than symptoms, detect code smell
- **Refactoring**: Break down large files/functions into smaller ones
- **Cleanup**: Remove deprecated and dead code after migrations
- **Meaningful Names**: Use descriptive names for variables and functions
- **LOC Ratio**: Aim for good ratio of lines of code over features/bugs solved
- **No Hardcoding**: Do not hardcode user-facing text content in code

### Documentation
- Prefer self-explanatory code over written documentation
- Place all AI-generated `.md` files in `./docs` (development/, analysis/, history/)
- Check if existing `.md` files can be modified instead of creating new ones
- Save generated docs only after manual review and edits

### Testing Tools
- Playwright: Run headless locally (`npm run test:e2e`), use UI mode for debugging (`npm run test:e2e:ui`)
- Prefer self-terminating commands (avoid `--watch` flags)
- Tests must not generate images over 8000px in any dimension
