# Two-Loan Financing Redesign

## Overview

Simplify the two-loan financing model by merging `capitalApporte` and `capitalForLoan1`, treating them as the same capital source (available at signature). When a participant enables two-loan mode, `capitalApporte` continues to represent signature capital, and a new `capitalForLoan2` field captures additional capital available later (e.g., from selling a house).

## Problem Statement

The current model treats `capitalForLoan1` and `capitalForLoan2` as allocations from a single `capitalApporte` pool. This creates:
1. Confusing UX with three capital fields
2. Artificial constraint: `capitalForLoan1 + capitalForLoan2 <= capitalApporte`
3. Complex renovation split slider that users rarely need

**Real use case:** "I have 50k savings now, and I'll have 100k more when I sell my house during construction."

## Design Decisions

| Question | Decision |
|----------|----------|
| Data model | Merge `capitalApporte` and `capitalForLoan1` - they're the same thing |
| Capital sources | Independent: signature capital (now) + construction capital (later) |
| Renovation split | Auto-allocate by phase, remove manual slider |
| Display metric | Show "À emprunter" per phase, not "À financer" |
| UI layout | Minimal two-column capital input when two-loan enabled |

## Data Model

### Before (v2)
```typescript
interface Participant {
  capitalApporte: number;           // Total capital
  capitalForLoan1?: number;         // Allocation from pool
  capitalForLoan2?: number;         // Allocation from pool
  loan2RenovationAmount?: number;   // Manual renovation split
  loan2DelayYears?: number;
  useTwoLoans?: boolean;
}
```

### After (v3)
```typescript
interface Participant {
  capitalApporte: number;           // Capital available NOW (at signature)
  useTwoLoans?: boolean;

  // Two-loan mode only:
  capitalForLoan2?: number;         // Additional capital available LATER
  loan2DelayYears?: number;         // When loan 2 starts (keep)
}
```

### Fields Removed
- `capitalForLoan1` - merged into `capitalApporte`
- `loan2IncludesParachevements` - removed (implicit in phase-based split)

### Fields Kept (with new semantics)
- `loan2RenovationAmount` - **optional override** for construction phase costs
  - Default: auto-calculated as `constructionCosts` (CASCO + travaux + parachèvements)
  - User can adjust manually for extra renovations not in the calculator

## Calculation Logic

### Phase-Based Cost Split
```typescript
// Signature phase (Loan 1)
signatureCosts = purchaseShare + droitEnregistrements + fraisNotaireFixe + sharedCosts

// Construction phase (Loan 2)
defaultConstructionCosts = casco + travauxCommuns + parachevements
// User can override with loan2RenovationAmount for extra renovations
effectiveConstructionCosts = loan2RenovationAmount ?? defaultConstructionCosts

// Two-loan mode:
loan1Amount = max(0, signatureCosts - capitalApporte)
loan2Amount = max(0, effectiveConstructionCosts - (capitalForLoan2 || 0))
loanNeeded = loan1Amount + loan2Amount

// Single-loan mode (unchanged):
loanNeeded = max(0, signatureCosts + constructionCosts - capitalApporte)
```

### Key Formulas
- **Total capital** (display only): `capitalApporte + (capitalForLoan2 || 0)`
- **Loan 1 monthly**: PMT(loan1Amount, interestRate, durationYears)
- **Loan 2 monthly**: PMT(loan2Amount, interestRate, durationYears - loan2DelayYears)
- **Max monthly** (overlap period): loan1Monthly + loan2Monthly

## UI Changes

### Single-Loan Mode (unchanged)
```
┌─ FINANCEMENT ────────────────────────────┐
│ Capital apporté:  [ 150,000 € ]          │
│                                          │
│ ○ Un seul prêt   ● Deux prêts            │
└──────────────────────────────────────────┘
```

### Two-Loan Mode (new)
```
┌─ FINANCEMENT ────────────────────────────┐
│ ○ Un seul prêt   ● Deux prêts            │
│                                          │
│ ┌─ MON CAPITAL ────────────────────────┐ │
│ │                                      │ │
│ │  À la signature    Pendant travaux   │ │
│ │  [ 50,000 €    ]   [ 100,000 €   ]   │ │
│ │                                      │ │
│ │  Total: 150,000 €                    │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Prêt 2 commence après: [ 2 ] ans         │
│                                          │
│ ┌─ MONTANT CONSTRUCTION (optionnel) ───┐ │
│ │  Calculé: 357,854 €                  │ │
│ │  Ajuster: [ _________ € ]            │ │
│ │  (laisser vide = valeur calculée)    │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

### PaymentTimeline Summary (two-loan mode)
```
┌─────────────────────────────────────────────────────────────┐
│  SIGNATURE        CONSTRUCTION       TOTAL                  │
│  À emprunter      À emprunter        À emprunter            │
│  131,610 €        61,023 €           192,633 €              │
│  694 €/mois       339 €/mois         ~1,033 €/mois (max)    │
└─────────────────────────────────────────────────────────────┘
```

## Migration

### Version Bump
Schema version: 2 → 3 (breaking change)

### Migration Function
```typescript
function migrateV2ToV3(participant: ParticipantV2): ParticipantV3 {
  if (participant.useTwoLoans && participant.capitalForLoan1 !== undefined) {
    return {
      ...participant,
      capitalApporte: participant.capitalForLoan1,  // Signature capital
      capitalForLoan1: undefined,                   // Remove deprecated
      loan2IncludesParachevements: undefined,       // Remove deprecated
      // capitalForLoan2 stays as-is
      // loan2RenovationAmount stays as-is (now optional override)
    };
  }
  return {
    ...participant,
    capitalForLoan1: undefined,
    loan2IncludesParachevements: undefined,
  };
}
```

### Compatibility Note
Old scenarios (v2) with `capitalForLoan1` will be migrated on load. The migration preserves the intended meaning: capital for signature phase.

## Files to Modify

### Core Logic
- `src/utils/calculatorUtils.ts` - Update `calculateTwoLoanFinancing()`, remove `loan2RenovationAmount` handling
- `src/utils/phaseCostsCalculation.ts` - May need updates for phase-based split

### UI Components
- `src/components/shared/TwoLoanFinancingSection.tsx` - Complete redesign (simpler)
- `src/components/shared/PaymentTimeline.tsx` - Add per-phase loan display for two-loan mode
- `src/components/calculator/ParticipantDetailModal.tsx` - Update financing section

### Validation
- `src/utils/twoLoanValidation.ts` - Simplify (remove capital allocation constraint)

### Data & Schema
- `src/utils/version.ts` - Bump to v3
- `src/services/dataLoader.ts` - Add migration function
- `src/utils/schemaRegistry.ts` - Update participant fields
- `docs/schema/scenario-data-schema.json` - Update schema

### Tests
- `src/utils/calculatorUtils.test.ts` - Update two-loan test cases
- `src/components/shared/TwoLoanFinancingSection.test.tsx` - Rewrite for new UI
- Add migration tests

## Example Scenario

**Julie/Séverin (from real data):**
- Current: `capitalApporte: 245000, capitalForLoan1: 70000, capitalForLoan2: 175000`
- After migration: `capitalApporte: 70000, capitalForLoan2: 175000`
- Total capital displayed: 245,000 €
- Signature costs: 85,675 € → Loan 1: 15,675 € (after 70k capital)
- Construction costs: 357,854 € → Loan 2: 182,854 € (after 175k capital)
- Total loans: 198,529 €

## Success Criteria

1. ✅ Two capital inputs, not three
2. ✅ No manual renovation slider
3. ✅ "À emprunter" shown per phase
4. ✅ Existing v2 scenarios migrate correctly
5. ✅ Single-loan mode unchanged
6. ✅ All existing tests pass (with updates)
