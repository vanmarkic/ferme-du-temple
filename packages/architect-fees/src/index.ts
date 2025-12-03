/**
 * Belgian Architect Fee Calculator
 *
 * Calculates professional fees (honoraires) for architectural projects
 * based on the official Belgian fee calculation methodology.
 *
 * The formula uses regression coefficients derived from industry data
 * to estimate required hours based on:
 * - Building surface area (m²)
 * - Net construction cost (€, excluding VAT and fees)
 *
 * @packageDocumentation
 */

/**
 * Project types for honoraire calculation.
 * Each type has different coefficients optimized for that building category.
 */
export type ProjectType =
  | 'EW' // Eénsgezinswoning (single-family home)
  | 'MW' // Meergezinswoning (multi-family building)
  | 'SH' // Sociale Huisvesting (social housing)
  | 'IL' // Industrieel/Logistiek (industrial/logistics)
  | 'PG' // Publiek Gebouw (public building)
  | 'BU' // Buitengewoon (exceptional/special)
  | 'ON'; // Onderzoek (research/other)

/**
 * Building type: new construction or renovation.
 */
export type BuildingType =
  | 'NB' // Nieuwbouw (new construction)
  | 'VB'; // Verbouwing (renovation)

/**
 * Result of the honoraire calculation with full breakdown.
 */
export interface HonoraireMoyenResult {
  /** Hours per m² coefficient */
  hoursPerM2: number;
  /** Total hours estimated from surface area */
  hoursFromSurface: number;
  /** Hours per €10,000 coefficient */
  hoursPer10000Euro: number;
  /** Total hours estimated from construction cost */
  hoursFromCost: number;
  /** Average of surface-based and cost-based hours */
  averageHours: number;
  /** Final fee in euros (averageHours × costPerHour) */
  honoraireMoyen: number;
}

/**
 * Configuration options for the calculation.
 */
export interface CalculationOptions {
  /** Cost per hour in € (default: 60) */
  costPerHour?: number;
  /** Type of project (default: 'MW') */
  projectType?: ProjectType;
  /** New construction or renovation (default: 'VB') */
  buildingType?: BuildingType;
}

/**
 * Internal coefficients for the formula.
 */
interface Coefficients {
  c: number; // coefficient for surface
  d: number; // exponent for surface
  e: number; // coefficient for cost
  f: number; // exponent for cost
}

/**
 * Coefficients for renovation (Verbouwing) projects.
 * Derived from Belgian architectural industry data.
 */
const VB_COEFFICIENTS: Record<ProjectType, Coefficients> = {
  EW: { c: 82.741, d: -0.625, e: 26886.3, f: -0.561 },
  MW: { c: 5.741, d: -0.165, e: 0.0000002, f: 11 }, // Special linear formula
  SH: { c: 7.741, d: -0.315, e: 30987.45, f: -0.553 },
  IL: { c: 40.741, d: -0.595, e: 6989.83, f: -0.474 },
  PG: { c: 12.752, d: -0.285, e: 3230.6, f: -0.375 },
  BU: { c: 12.752, d: -0.285, e: 4750.1, f: -0.379 },
  ON: { c: 12.7398, d: -0.226, e: 595.6, f: -0.226 },
};

/**
 * Coefficients for new construction (Nieuwbouw) projects.
 * Derived from Belgian architectural industry data.
 */
const NB_COEFFICIENTS: Record<ProjectType, Coefficients> = {
  EW: { c: 53.741, d: -0.657, e: 736.71, f: -0.3 },
  MW: { c: 50.741, d: -0.427, e: 750.71, f: -0.275 },
  SH: { c: 20.741, d: -0.381, e: 2100.71, f: -0.349 },
  IL: { c: 18.741, d: -0.381, e: 65, f: -0.14 },
  PG: { c: 19.741, d: -0.281, e: 1495.8, f: -0.295 },
  BU: { c: 33.741, d: -0.335, e: 1402.8, f: -0.298 },
  ON: { c: 33.741, d: -0.305, e: 1450.8, f: -0.291 },
};

/**
 * Get coefficients for a specific project and building type combination.
 */
function getCoefficients(
  projectType: ProjectType,
  buildingType: BuildingType
): Coefficients {
  return buildingType === 'NB'
    ? NB_COEFFICIENTS[projectType]
    : VB_COEFFICIENTS[projectType];
}

/**
 * Calculate architect fees (honoraires) for a construction project.
 *
 * The calculation uses two approaches and averages them:
 * 1. **Surface-based**: Hours = c × surface^d
 * 2. **Cost-based**: Hours = e × cost^f (then scaled per €10,000)
 *
 * The final fee is: (averageHours) × costPerHour
 *
 * @param surface - Total building surface in m²
 * @param constructionCost - Net construction cost in € (excluding VAT and fees)
 * @param options - Optional configuration (costPerHour, projectType, buildingType)
 * @returns Full breakdown of the calculation
 *
 * @example
 * ```typescript
 * import { calculateHonoraires } from 'architect-fees-be';
 *
 * // Basic usage with defaults (VB/MW, 60€/hour)
 * const result = calculateHonoraires(2300, 3_000_000);
 * console.log(result.honoraireMoyen); // ~214,860€
 *
 * // Custom options
 * const result2 = calculateHonoraires(500, 500_000, {
 *   costPerHour: 75,
 *   projectType: 'EW',
 *   buildingType: 'NB'
 * });
 * ```
 */
export function calculateHonoraires(
  surface: number,
  constructionCost: number,
  options: CalculationOptions = {}
): HonoraireMoyenResult {
  const {
    costPerHour = 60,
    projectType = 'MW',
    buildingType = 'VB',
  } = options;

  // Validate inputs
  if (surface <= 0) {
    throw new Error('Surface must be greater than 0');
  }
  if (constructionCost <= 0) {
    throw new Error('Construction cost must be greater than 0');
  }
  if (costPerHour <= 0) {
    throw new Error('Cost per hour must be greater than 0');
  }

  const coef = getCoefficients(projectType, buildingType);

  // Calculate hours per m² using power function: c × surface^d
  const hoursPerM2 = coef.c * Math.pow(surface, coef.d);

  // Total hours from surface = surface × hoursPerM2
  const hoursFromSurface = surface * hoursPerM2;

  // Calculate hours per €10,000
  // Special case for MW + VB: linear formula (e × cost + f)
  let hoursPer10000Euro: number;
  if (projectType === 'MW' && buildingType === 'VB') {
    hoursPer10000Euro = coef.e * constructionCost + coef.f;
  } else {
    // Standard formula: e × cost^f
    hoursPer10000Euro = coef.e * Math.pow(constructionCost, coef.f);
  }

  // Total hours from cost = cost × hoursPer10000Euro / 10000
  const hoursFromCost = (constructionCost * hoursPer10000Euro) / 10000;

  // Average hours = (hoursFromSurface + hoursFromCost) / 2
  const averageHours = (hoursFromSurface + hoursFromCost) / 2;

  // Honoraire moyen = average hours × cost per hour
  const honoraireMoyen = averageHours * costPerHour;

  return {
    hoursPerM2,
    hoursFromSurface: Math.round(hoursFromSurface),
    hoursPer10000Euro,
    hoursFromCost: Math.round(hoursFromCost),
    averageHours: Math.round(averageHours),
    honoraireMoyen: Math.round(honoraireMoyen),
  };
}

/**
 * Project type descriptions for UI display.
 */
export const PROJECT_TYPE_LABELS: Record<ProjectType, { nl: string; fr: string; en: string }> = {
  EW: {
    nl: 'Eénsgezinswoning',
    fr: 'Maison unifamiliale',
    en: 'Single-family home',
  },
  MW: {
    nl: 'Meergezinswoning',
    fr: 'Immeuble à appartements',
    en: 'Multi-family building',
  },
  SH: {
    nl: 'Sociale Huisvesting',
    fr: 'Logement social',
    en: 'Social housing',
  },
  IL: {
    nl: 'Industrieel/Logistiek',
    fr: 'Industriel/Logistique',
    en: 'Industrial/Logistics',
  },
  PG: {
    nl: 'Publiek Gebouw',
    fr: 'Bâtiment public',
    en: 'Public building',
  },
  BU: {
    nl: 'Buitengewoon',
    fr: 'Exceptionnel',
    en: 'Exceptional/Special',
  },
  ON: {
    nl: 'Onderzoek/Overig',
    fr: 'Recherche/Autre',
    en: 'Research/Other',
  },
};

/**
 * Building type descriptions for UI display.
 */
export const BUILDING_TYPE_LABELS: Record<BuildingType, { nl: string; fr: string; en: string }> = {
  NB: {
    nl: 'Nieuwbouw',
    fr: 'Construction neuve',
    en: 'New construction',
  },
  VB: {
    nl: 'Verbouwing',
    fr: 'Rénovation',
    en: 'Renovation',
  },
};

// Default export for convenience
export default calculateHonoraires;
