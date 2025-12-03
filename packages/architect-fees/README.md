# architect-fees-be

Belgian architect fee calculator based on official methodology. Calculate professional fees (honoraires) from surface area and construction costs.

## Installation

```bash
npm install architect-fees-be
# or
pnpm add architect-fees-be
# or
yarn add architect-fees-be
```

## Quick Start

```typescript
import { calculateHonoraires } from 'architect-fees-be';

// Calculate fees for a 2300m² renovation project costing €3,000,000
const result = calculateHonoraires(2300, 3_000_000);

console.log(result.honoraireMoyen); // ~214,860€
console.log(result.averageHours);   // 3581 hours
```

## How It Works

The calculator uses a dual-approach methodology:

1. **Surface-based estimation**: Calculates hours based on building area
2. **Cost-based estimation**: Calculates hours based on construction budget

The final fee is the average of both approaches, multiplied by an hourly rate.

### Formula

```
Hours per m² = c × surface^d
Hours from surface = surface × hoursPerM²

Hours per €10,000 = e × cost^f
Hours from cost = cost × hoursPer10000 / 10,000

Average hours = (hoursFromSurface + hoursFromCost) / 2
Honoraire = averageHours × costPerHour
```

The coefficients (c, d, e, f) vary by project type and building type, derived from Belgian architectural industry data.

## API

### `calculateHonoraires(surface, constructionCost, options?)`

Calculate architect fees for a construction project.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `surface` | `number` | Total building surface in m² |
| `constructionCost` | `number` | Net construction cost in € (excluding VAT and fees) |
| `options` | `CalculationOptions` | Optional configuration |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `costPerHour` | `number` | `60` | Hourly rate in € |
| `projectType` | `ProjectType` | `'MW'` | Type of building project |
| `buildingType` | `BuildingType` | `'VB'` | New construction or renovation |

#### Returns

```typescript
interface HonoraireMoyenResult {
  hoursPerM2: number;        // Hours per m² coefficient
  hoursFromSurface: number;  // Total hours from surface calculation
  hoursPer10000Euro: number; // Hours per €10,000 coefficient
  hoursFromCost: number;     // Total hours from cost calculation
  averageHours: number;      // Average of both approaches
  honoraireMoyen: number;    // Final fee in euros
}
```

## Project Types

| Code | Dutch | French | English |
|------|-------|--------|---------|
| `EW` | Eénsgezinswoning | Maison unifamiliale | Single-family home |
| `MW` | Meergezinswoning | Immeuble à appartements | Multi-family building |
| `SH` | Sociale Huisvesting | Logement social | Social housing |
| `IL` | Industrieel/Logistiek | Industriel/Logistique | Industrial/Logistics |
| `PG` | Publiek Gebouw | Bâtiment public | Public building |
| `BU` | Buitengewoon | Exceptionnel | Exceptional/Special |
| `ON` | Onderzoek/Overig | Recherche/Autre | Research/Other |

## Building Types

| Code | Dutch | French | English |
|------|-------|--------|---------|
| `NB` | Nieuwbouw | Construction neuve | New construction |
| `VB` | Verbouwing | Rénovation | Renovation |

## Examples

### Multi-family renovation (default)

```typescript
import { calculateHonoraires } from 'architect-fees-be';

const result = calculateHonoraires(2300, 3_000_000);
// Result: ~214,860€ for 3581 hours at 60€/hour
```

### New single-family home

```typescript
const result = calculateHonoraires(200, 400_000, {
  projectType: 'EW',
  buildingType: 'NB',
  costPerHour: 75
});
```

### Industrial building renovation

```typescript
const result = calculateHonoraires(5000, 2_000_000, {
  projectType: 'IL',
  buildingType: 'VB'
});
```

### Access labels for UI

```typescript
import { PROJECT_TYPE_LABELS, BUILDING_TYPE_LABELS } from 'architect-fees-be';

// Display in Dutch
console.log(PROJECT_TYPE_LABELS.MW.nl); // "Meergezinswoning"

// Display in French
console.log(BUILDING_TYPE_LABELS.VB.fr); // "Rénovation"
```

## Validation

The function throws errors for invalid inputs:

```typescript
calculateHonoraires(0, 1000000);    // Error: Surface must be greater than 0
calculateHonoraires(100, -5000);    // Error: Construction cost must be greater than 0
calculateHonoraires(100, 100000, { costPerHour: 0 }); // Error: Cost per hour must be greater than 0
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  ProjectType,
  BuildingType,
  HonoraireMoyenResult,
  CalculationOptions
} from 'architect-fees-be';
```

## Embeddable Widget

A ready-to-use HTML widget is included for embedding in any website.

### Option 1: Embed via iframe (Recommended)

Use the hosted widget on GitHub Pages:

```html
<iframe
  src="https://vanmarkic.github.io/ferme-du-temple/architect-fees/"
  width="100%"
  height="550"
  frameborder="0"
  style="max-width: 500px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
  title="Belgian Architect Fee Calculator"
></iframe>
```

### Option 2: Self-host the widget

Copy the `widget/index.html` file to your project and serve it directly:

```html
<!-- Direct include -->
<iframe src="/path/to/widget/index.html" width="100%" height="550" frameborder="0"></iframe>
```

### Option 3: Run locally

```bash
# From the package directory
pnpm widget:serve

# Then open http://localhost:3333
```

### Customization

The widget is a single HTML file with inline CSS/JS. You can easily customize:

- Colors: Edit the CSS variables in `:root`
- Language: Modify labels in the HTML
- Default values: Change the `value` attributes on inputs
- Styling: Adjust the CSS to match your brand

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgements

This package implements the formula from the **BRADA study** (Belgian Research on Architects' Design Activities), a comprehensive research project analyzing architectural workload and fee structures.

### Original Research

- **Study**: BRADA - Het Rapport (2016)
- **Report**: [BRADA_HET_RAPPORT_20160126_JR.pdf](https://archimath.systeme-d.com/BRADA_HET_RAPPORT_20160126_JR.pdf)
- **Online Calculator**: [ArchiMath - Systeme-D](https://archimath.systeme-d.com/)

The coefficients used in this package are derived from regression analysis of real-world architectural project data collected and analyzed by the BRADA research team.

## Credits

- Formula and coefficients: BRADA study / ArchiMath by Systeme-D
- TypeScript implementation: [La Ferme du Temple](https://lafermedutemple.be/architect-fees)
