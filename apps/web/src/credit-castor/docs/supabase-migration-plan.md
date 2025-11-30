# Credit Castor Supabase Migration Plan

**Date:** 2025-11-30
**Status:** Implementation complete, pending SQL migration execution

## Overview

Migration of Credit Castor from standalone Firestore-based app to Supabase-integrated module within ferme-du-temple.

## Key Decisions

### 1. No Zod in Data Path

Per `/docs/zod-and-supabase.md` recommendation:
- Supabase types + DB constraints are sufficient for this calculator
- Simple transform functions convert snake_case ↔ camelCase
- Add Zod later only for specific pain points (form validation, CSV imports)

**If Zod is needed later:** Use [supazod](https://github.com/dohooo/supazod) to generate Zod schemas from Supabase-generated TypeScript types.

### 2. Explicit Save/Discard Pattern

- No auto-save (unlike Firestore real-time sync)
- `isDirty` state tracks unsaved changes
- Save/Discard buttons appear when changes exist
- `beforeunload` warning prevents accidental data loss

### 3. No Unlock System

- Authentication handled by ferme-du-temple's Supabase auth
- `/admin/credit` route requires admin role
- No separate password gate needed

## Architecture

```
ferme-du-temple/
├── src/
│   ├── pages/admin/credit.astro     # Entry point (SSR, auth check)
│   └── credit-castor/
│       ├── components/
│       │   ├── CreditCastorApp.tsx  # Root component
│       │   ├── EnDivisionCorrect.tsx # Main calculator UI
│       │   └── calculator/
│       │       └── CalculatorProvider.tsx # Data management
│       ├── services/
│       │   ├── supabase.ts          # Supabase client
│       │   └── supabaseData.ts      # Load/Save operations
│       ├── contexts/
│       │   └── CalculatorContext.tsx # React context
│       └── utils/
│           └── calculatorUtils.ts   # Business logic + types
└── sql/credit-castor/
    ├── 001_initial.sql              # Schema + RLS
    └── 002_seed_data.sql            # Seed data
```

## Data Flow

```
Load: Supabase DB → supabaseData.ts (transform) → CalculatorProvider → UI
Save: UI → CalculatorProvider → supabaseData.ts (transform) → Supabase DB
```

### Source of Truth

**Supabase database** is the single source of truth.

### Type System

- App types: `Participant`, `ProjectParams`, `PortageFormulaParams` from `calculatorUtils.ts`
- DB columns: snake_case (Postgres convention)
- Transform in `supabaseData.ts`: `transformParticipantRow()` and `participantToRow()`

## SQL Migration

### Step 1: Run Schema Migration

Execute in Supabase SQL Editor:

```sql
-- File: sql/credit-castor/001_initial.sql
-- Creates: projects, participants tables
-- Enables: RLS with policies for authenticated users
-- Adds: Indexes, triggers for updated_at
```

### Step 2: Run Seed Data

Execute in Supabase SQL Editor:

```sql
-- File: sql/credit-castor/002_seed_data.sql
-- Creates: Default project (id: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa)
-- Inserts: 9 participants (4 founders, 5 newcomers)
```

### Seed Data Summary

| # | Name | Type | Surface | Capital |
|---|------|------|---------|---------|
| 1 | Manuela/Dragan | Founder | 150m² | 50,000€ |
| 2 | Cathy/Jim | Founder | 225m² | 450,000€ |
| 3 | Annabelle/Colin | Founder | 200m² | 200,000€ |
| 4 | Julie/Séverin | Founder | 150m² | 245,000€ |
| 5 | Participant·e 5 | Newcomer | 60m² | 50,000€ |
| 6 | Participant·e 6 | Newcomer | 101m² | 100,000€ |
| 7 | Participant·e 7 | Newcomer | 100m² | 100,000€ |
| 8 | Participant·e 8 | Newcomer | 100m² | 100,000€ |
| 9 | Participant·e 9 | Newcomer | 100m² | 100,000€ |

## Testing

1. Start dev server: `npm run dev`
2. Navigate to `/admin/credit` (must be logged in as admin)
3. Verify calculator loads with seed data
4. Test Save/Discard functionality
5. Verify unsaved changes warning on page leave

## Files Changed

### Removed (Firebase-related)
- `services/firebase.ts`
- `services/firestoreSync.ts`
- `services/editLockService.ts`
- `services/dataLoader.ts`
- `services/participantSyncCoordinator.ts`
- `hooks/useFirestoreSync.ts`
- `hooks/useEditLock.ts`
- `hooks/useChangeNotifications.ts`
- `components/ConflictResolutionDialog.tsx`
- `components/shared/NotificationToast.tsx`
- `components/shared/EditLockBanner.tsx`

### Added/Modified
- `services/supabase.ts` - Supabase client
- `services/supabaseData.ts` - Load/Save with transforms
- `contexts/CalculatorContext.tsx` - Updated types (SyncMode, isDirty)
- `components/calculator/CalculatorProvider.tsx` - Explicit save/discard
- `components/EnDivisionCorrect.tsx` - Removed Firebase UI, added Save/Discard buttons
- `hooks/useProjectData.ts` - Updated imports

## Future Enhancements

### If Adding Zod Later

1. Generate Supabase types: `npx supabase gen types typescript --project-id "$PROJECT_REF" > database.types.ts`
2. Generate Zod schemas: Use supazod to convert types to Zod schemas
3. Add validation to forms or CSV import functionality

### Potential Improvements

- [ ] Generate Supabase types for better type safety
- [ ] Add form-level Zod validation for input fields
- [ ] CSV/Excel import with Zod validation
- [ ] Optimistic updates for better UX
- [ ] Offline support with service worker
