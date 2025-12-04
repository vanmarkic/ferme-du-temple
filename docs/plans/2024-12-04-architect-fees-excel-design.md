# Architect Fees Excel Calculator - Design

## Overview

Create an Excel (.xlsx) file that ports the Belgian architect fee formula from `packages/architect-fees/src/index.ts`. The file should be both functional (calculate fees) and transparent (show the formula and coefficients).

## File Location

`packages/architect-fees/calculator.xlsx`

## Sheet Structure (Single Sheet)

```
┌─────────────────────────────────────────────────────────┐
│  INPUTS (rows 2-7)                                      │
│  - Surface (m²)                                         │
│  - Construction cost (€)                                │
│  - Cost per hour (€) [default: 60]                      │
│  - Project Type dropdown [EW - Single-family home, etc] │
│  - Building Type dropdown [NB - New construction, etc]  │
├─────────────────────────────────────────────────────────┤
│  RESULTS (rows 9-15)                                    │
│  - Hours per m²                                         │
│  - Hours from surface                                   │
│  - Hours per €10,000                                    │
│  - Hours from cost                                      │
│  - Average hours                                        │
│  - Final fee (€)                                        │
├─────────────────────────────────────────────────────────┤
│  FORMULA TRACE (rows 17-19)                             │
│  - Shows which coefficient row is being used            │
│  - Displays active c, d, e, f values                    │
├─────────────────────────────────────────────────────────┤
│  COEFFICIENT TABLES (rows 21+)                          │
│  - NB (New construction) table: 7 rows × 4 coefficients │
│  - VB (Renovation) table: 7 rows × 4 coefficients       │
└─────────────────────────────────────────────────────────┘
```

## Dropdown Options

**Project Type:**
- EW - Single-family home
- MW - Multi-family building
- SH - Social housing
- IL - Industrial/Logistics
- PG - Public building
- BU - Exceptional/Special
- ON - Research/Other

**Building Type:**
- NB - New construction
- VB - Renovation

## Coefficient Tables

### NEW CONSTRUCTION (NB) COEFFICIENTS

| Code | Description           |      c |      d |       e |      f |
|------|-----------------------|--------|--------|---------|--------|
| EW   | Single-family home    | 53.741 | -0.657 |  736.71 |  -0.30 |
| MW   | Multi-family building | 50.741 | -0.427 |  750.71 | -0.275 |
| SH   | Social housing        | 20.741 | -0.381 | 2100.71 | -0.349 |
| IL   | Industrial/Logistics  | 18.741 | -0.381 |   65.00 |  -0.14 |
| PG   | Public building       | 19.741 | -0.281 | 1495.80 | -0.295 |
| BU   | Exceptional/Special   | 33.741 | -0.335 | 1402.80 | -0.298 |
| ON   | Research/Other        | 33.741 | -0.305 | 1450.80 | -0.291 |

### RENOVATION (VB) COEFFICIENTS

| Code | Description           |      c |      d |          e |      f |
|------|-----------------------|--------|--------|------------|--------|
| EW   | Single-family home    | 82.741 | -0.625 |   26886.30 | -0.561 |
| MW   | Multi-family building |  5.741 | -0.165 | 0.0000002  |   11*  |
| SH   | Social housing        |  7.741 | -0.315 |   30987.45 | -0.553 |
| IL   | Industrial/Logistics  | 40.741 | -0.595 |    6989.83 | -0.474 |
| PG   | Public building       | 12.752 | -0.285 |    3230.60 | -0.375 |
| BU   | Exceptional/Special   | 12.752 | -0.285 |    4750.10 | -0.379 |
| ON   | Research/Other        | 12.7398| -0.226 |     595.60 | -0.226 |

\* MW + VB uses linear formula: `e × cost + f` (not power function)

## Formula Implementation

### Surface-based calculation
```
Hours per m² = c × surface^d
Hours from surface = surface × Hours per m²
```

### Cost-based calculation (standard)
```
Hours per €10,000 = e × cost^f
Hours from cost = (cost × Hours per €10,000) / 10000
```

### Cost-based calculation (MW + VB special case)
```
Hours per €10,000 = e × cost + f   ← linear, not power
```

Excel formula pattern:
```
=IF(AND(project="MW", building="VB"), linear_formula, power_formula)
```

### Final calculation
```
Average hours = (Hours from surface + Hours from cost) / 2
Final fee = Average hours × Cost per hour
```

## Test Cases (TDD)

### Test 1: MW + VB (special linear formula)

| Input        | Value     |
|--------------|-----------|
| Surface      | 2300      |
| Cost         | 3,000,000 |
| Cost/hour    | 60        |
| Project Type | MW        |
| Building Type| VB        |

| Output             | Expected   |
|--------------------|------------|
| Hours per m²       | 1.6007     |
| Hours from surface | 3682       |
| Hours per €10k     | 11.6       |
| Hours from cost    | 3480       |
| Average hours      | 3581       |
| **Final fee**      | **214,846**|

### Test 2: EW + NB (new construction single-family)

| Input        | Value   |
|--------------|---------|
| Surface      | 200     |
| Cost         | 400,000 |
| Cost/hour    | 60      |
| Project Type | EW      |
| Building Type| NB      |

| Output             | Expected   |
|--------------------|------------|
| Hours per m²       | 1.6540     |
| Hours from surface | 331        |
| Hours per €10k     | 15.3702    |
| Hours from cost    | 615        |
| Average hours      | 473        |
| **Final fee**      | **28,368** |

### Test 3: PG + VB (renovation public building)

| Input        | Value     |
|--------------|-----------|
| Surface      | 1000      |
| Cost         | 1,500,000 |
| Cost/hour    | 75        |
| Project Type | PG        |
| Building Type| VB        |

| Output             | Expected    |
|--------------------|-------------|
| Hours per m²       | 1.7806      |
| Hours from surface | 1781        |
| Hours per €10k     | 15.6045     |
| Hours from cost    | 2341        |
| Average hours      | 2061        |
| **Final fee**      | **154,549** |

### Test 4: IL + NB (industrial new construction)

| Input        | Value     |
|--------------|-----------|
| Surface      | 5000      |
| Cost         | 2,000,000 |
| Cost/hour    | 60        |
| Project Type | IL        |
| Building Type| NB        |

| Output             | Expected    |
|--------------------|-------------|
| Hours per m²       | 0.7303      |
| Hours from surface | 3651        |
| Hours per €10k     | 8.5265      |
| Hours from cost    | 1705        |
| Average hours      | 2678        |
| **Final fee**      | **160,700** |

## Deployment

1. Create `packages/architect-fees/calculator.xlsx`
2. Update `deploy.yml` to copy the xlsx to `deploy/architect-fees/`
3. Add download link to `packages/architect-fees/widget/index.html`
4. Push to GitHub, verify Pages deployment

## GitHub Pages Integration

Download-only approach: The xlsx file will be available at:
`https://vanmarkic.github.io/ferme-du-temple/architect-fees/calculator.xlsx`

A download button will be added to the existing widget page.
