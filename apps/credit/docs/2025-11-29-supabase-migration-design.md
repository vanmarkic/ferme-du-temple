# Supabase Migration Design

**Date:** 2025-11-29
**Status:** Approved

## Problem

Current Firestore implementation has issues:
- Data corruption from complex sync logic (~1700 lines)
- Overhead for occasional edits (real-time sync overkill)
- Participant edits can corrupt other participants' data

## Solution

Migrate to Supabase Postgres with:
- Simple save/load (no real-time sync)
- Relational tables (isolated participant rows)
- Supabase Auth for access control

---

## User Journey

### Load
1. User navigates to `/admin/credit`
2. Auth check (Supabase) → redirect to login if needed
3. Fetch ALL project data from Supabase (single query)
4. Validate data shape
5. Display UI

### Edit
1. User edits fields (local state only)
2. UI shows "unsaved changes" indicator
3. Calculations update in real-time (local)
4. No network calls during editing

### Save
1. User clicks "Save" button
2. Validate ALL data
3. Send to Supabase (single transaction)
4. On success → clear "unsaved" indicator
5. On error → show error, keep local changes

### Discard
1. User clicks "Discard" button
2. Reload fresh data from DB
3. Clear local state

### Unsaved Changes Protection
- Browser warning only (standard "You have unsaved changes" dialog)

---

## Database Schema

```sql
-- Project-level settings (one row per project)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deed_date DATE NOT NULL,
  project_params JSONB NOT NULL,
  portage_formula JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Participants (one row per participant)
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  display_order INT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,  -- links to Supabase user (optional)
  enabled BOOLEAN DEFAULT true,
  is_founder BOOLEAN DEFAULT false,
  entry_date DATE,
  exit_date DATE,
  surface NUMERIC NOT NULL,
  capital_apporte NUMERIC NOT NULL DEFAULT 0,
  registration_fees_rate NUMERIC NOT NULL,
  interest_rate NUMERIC NOT NULL,
  duration_years INT NOT NULL,
  lots_owned JSONB DEFAULT '[]',
  purchase_details JSONB,
  -- Legacy fields
  unit_id INT,
  quantity INT DEFAULT 1,
  parachevements_per_m2 NUMERIC,
  casco_sqm NUMERIC,
  parachevements_sqm NUMERIC,
  -- Two-loan financing
  use_two_loans BOOLEAN DEFAULT false,
  loan2_delay_years INT,
  loan2_renovation_amount NUMERIC,
  capital_for_loan1 NUMERIC,
  capital_for_loan2 NUMERIC,
  -- Metadata
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),

  UNIQUE(project_id, display_order)
);

-- Indexes
CREATE INDEX idx_participants_project ON participants(project_id);
CREATE INDEX idx_participants_email ON participants(email);
```

---

## Validation Rules

### Date Rules
| Rule | Description |
|------|-------------|
| D1 | Founders: `entryDate` = `deedDate` (auto-set) |
| D2 | Non-founders: `entryDate` > `deedDate` (strictly after) |
| D3 | `exitDate` > `entryDate` (if set) |

### Surface Rules
| Rule | Description |
|------|-------------|
| A1 | `surface` must be > 0 for enabled participants |
| A2 | `totalSurface` (sum of all) must be > 0 |
| A3 | `surfacePurchased` must be > 0 and ≤ `totalBuildingSurface` |

### Lot Ownership Rules
| Rule | Description |
|------|-------------|
| B1 | `lotId` must be unique across all participants |
| B2 | Total lots ≤ `maxTotalLots` (default: 14) |
| B3 | `acquiredDate` must be ≥ `deedDate` |
| B4 | Lot cannot be sold before it's acquired |

### Participant State Rules
| Rule | Description |
|------|-------------|
| C1 | Founders: `isFounder === true` → `entryDate` = `deedDate` |
| C2 | Non-founders: `isFounder === false` → `entryDate` > `deedDate` |
| C3 | `exitDate` > `entryDate` (if set) |
| C4 | Disabled participants (`enabled === false`) excluded from calculations |
| C5 | At least one enabled participant required |

### Validation Layers
```
┌─────────────────────────────────────────────────────────┐
│                   VALIDATION LAYERS                     │
├─────────────────────────────────────────────────────────┤
│  1. Field-level      → type, format, range              │
│  2. Cross-field      → date relationships               │
│  3. Cross-entity     → lotId uniqueness, totals         │
│  4. Database         → constraints, triggers            │
└─────────────────────────────────────────────────────────┘
```

---

## API Layer

```typescript
// src/services/supabaseData.ts

async function loadProject(projectId: string): Promise<ProjectData> {
  const { data, error } = await supabase
    .from('projects')
    .select(`*, participants (*)`)
    .eq('id', projectId)
    .single();

  // Validate response shape
  return validateProjectData(data);
}

async function saveProject(
  projectId: string,
  data: ProjectData,
  userId: string
): Promise<{ success: boolean; error?: string }> {

  // 1. Validate before sending
  const validation = validateProjectData(data);
  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  // 2. Upsert project
  const { error: projectError } = await supabase
    .from('projects')
    .upsert({
      id: projectId,
      deed_date: data.deedDate,
      project_params: data.projectParams,
      portage_formula: data.portageFormula,
      updated_by: userId,
    });

  if (projectError) return { success: false, error: projectError.message };

  // 3. Upsert participants (batch)
  const { error: participantsError } = await supabase
    .from('participants')
    .upsert(
      data.participants.map((p, i) => ({
        ...toSnakeCase(p),
        project_id: projectId,
        display_order: i,
        updated_by: userId,
      }))
    );

  if (participantsError) return { success: false, error: participantsError.message };

  return { success: true };
}
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/services/supabaseData.ts` | Load/save with validation |
| `src/hooks/useProjectData.ts` | React hook for load/save/discard |
| `sql/migrations/001_initial.sql` | Supabase schema |

## Files to Delete

| File | Lines |
|------|-------|
| `src/services/firestoreSync.ts` | ~1300 |
| `src/services/participantSyncCoordinator.ts` | ~370 |
| `src/services/editLockService.ts` | ~200 |
| `src/services/firebase.ts` | ~100 |
| `src/services/firestoreAuth.ts` | ~150 |
| `src/hooks/useFirestoreSync.ts` | ~200 |

**Total removed:** ~2300 lines of sync complexity

---

## Beaver Integration

Since Credit Castor will move to `/admin/credit` in the Beaver project:
- Share Supabase instance with Beaver
- Use Beaver's existing auth system
- Single database for unified data management
