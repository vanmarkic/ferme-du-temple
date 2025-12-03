import { describe, it, expect } from 'vitest';
import {
  calculateHonoraires,
  PROJECT_TYPE_LABELS,
  BUILDING_TYPE_LABELS,
  type ProjectType,
  type BuildingType,
} from './index';

describe('calculateHonoraires', () => {
  describe('VB/MW (multi-family renovation) - default', () => {
    it('should calculate ~214,860€ for 2300m² and 3,000,000€', () => {
      // Reference case from BRADA/ArchiMath calculator
      const result = calculateHonoraires(2300, 3_000_000);

      expect(result.hoursPerM2).toBeCloseTo(1.60, 2);
      expect(result.hoursFromSurface).toBe(3682);
      expect(result.hoursFromCost).toBe(3480);
      expect(result.averageHours).toBe(3581);
      expect(result.honoraireMoyen).toBeCloseTo(214860, -2); // within 100€
    });

    it('should use 60€/hour as default', () => {
      const result = calculateHonoraires(1000, 1_000_000);

      // Verify the relationship: honoraireMoyen ≈ averageHours × 60
      // (small rounding difference due to intermediate calculations)
      expect(result.honoraireMoyen).toBeCloseTo(result.averageHours * 60, -2);
    });
  });

  describe('VB/EW (single-family renovation)', () => {
    it('should calculate with EW coefficients', () => {
      const result = calculateHonoraires(200, 400_000, {
        projectType: 'EW',
        buildingType: 'VB',
      });

      // EW/VB coefficients: c=82.741, d=-0.625, e=26886.3, f=-0.561
      expect(result.hoursPerM2).toBeCloseTo(82.741 * Math.pow(200, -0.625), 2);
      expect(result.honoraireMoyen).toBeGreaterThan(0);
    });
  });

  describe('NB/EW (new single-family home)', () => {
    it('should use NB coefficients for new construction', () => {
      const result = calculateHonoraires(200, 400_000, {
        projectType: 'EW',
        buildingType: 'NB',
      });

      // NB/EW coefficients: c=53.741, d=-0.657
      expect(result.hoursPerM2).toBeCloseTo(53.741 * Math.pow(200, -0.657), 2);
      expect(result.honoraireMoyen).toBeGreaterThan(0);
    });
  });

  describe('custom hourly rate', () => {
    it('should apply custom cost per hour', () => {
      const at60 = calculateHonoraires(1000, 1_000_000, { costPerHour: 60 });
      const at75 = calculateHonoraires(1000, 1_000_000, { costPerHour: 75 });

      // Same hours, different rate
      expect(at60.averageHours).toBe(at75.averageHours);
      // Ratio should match the rate ratio
      expect(at75.honoraireMoyen / at60.honoraireMoyen).toBeCloseTo(75 / 60, 2);
    });
  });

  describe('all project types', () => {
    const projectTypes: ProjectType[] = ['EW', 'MW', 'SH', 'IL', 'PG', 'BU', 'ON'];
    const buildingTypes: BuildingType[] = ['NB', 'VB'];

    it.each(projectTypes)('should calculate for project type %s', (projectType) => {
      const result = calculateHonoraires(500, 500_000, {
        projectType,
        buildingType: 'VB',
      });

      expect(result.hoursPerM2).toBeGreaterThan(0);
      expect(result.hoursFromSurface).toBeGreaterThan(0);
      expect(result.hoursFromCost).toBeGreaterThan(0);
      expect(result.honoraireMoyen).toBeGreaterThan(0);
    });

    it.each(buildingTypes)('should calculate for building type %s', (buildingType) => {
      const result = calculateHonoraires(500, 500_000, {
        projectType: 'MW',
        buildingType,
      });

      expect(result.honoraireMoyen).toBeGreaterThan(0);
    });
  });

  describe('different project types give different results', () => {
    it('should produce different fees for different project types', () => {
      const ewResult = calculateHonoraires(500, 500_000, { projectType: 'EW' });
      const mwResult = calculateHonoraires(500, 500_000, { projectType: 'MW' });
      const ilResult = calculateHonoraires(500, 500_000, { projectType: 'IL' });

      // Different project types should give different results
      expect(ewResult.honoraireMoyen).not.toBe(mwResult.honoraireMoyen);
      expect(mwResult.honoraireMoyen).not.toBe(ilResult.honoraireMoyen);
    });

    it('should produce different fees for NB vs VB', () => {
      const nbResult = calculateHonoraires(500, 500_000, { buildingType: 'NB' });
      const vbResult = calculateHonoraires(500, 500_000, { buildingType: 'VB' });

      expect(nbResult.honoraireMoyen).not.toBe(vbResult.honoraireMoyen);
    });
  });

  describe('input validation', () => {
    it('should throw for zero surface', () => {
      expect(() => calculateHonoraires(0, 1_000_000)).toThrow(
        'Surface must be greater than 0'
      );
    });

    it('should throw for negative surface', () => {
      expect(() => calculateHonoraires(-100, 1_000_000)).toThrow(
        'Surface must be greater than 0'
      );
    });

    it('should throw for zero construction cost', () => {
      expect(() => calculateHonoraires(100, 0)).toThrow(
        'Construction cost must be greater than 0'
      );
    });

    it('should throw for negative construction cost', () => {
      expect(() => calculateHonoraires(100, -500_000)).toThrow(
        'Construction cost must be greater than 0'
      );
    });

    it('should throw for zero cost per hour', () => {
      expect(() =>
        calculateHonoraires(100, 500_000, { costPerHour: 0 })
      ).toThrow('Cost per hour must be greater than 0');
    });

    it('should throw for negative cost per hour', () => {
      expect(() =>
        calculateHonoraires(100, 500_000, { costPerHour: -50 })
      ).toThrow('Cost per hour must be greater than 0');
    });
  });

  describe('result structure', () => {
    it('should return all expected fields', () => {
      const result = calculateHonoraires(1000, 1_000_000);

      expect(result).toHaveProperty('hoursPerM2');
      expect(result).toHaveProperty('hoursFromSurface');
      expect(result).toHaveProperty('hoursPer10000Euro');
      expect(result).toHaveProperty('hoursFromCost');
      expect(result).toHaveProperty('averageHours');
      expect(result).toHaveProperty('honoraireMoyen');
    });

    it('should return rounded integer values for hours and fee', () => {
      const result = calculateHonoraires(1234, 1_234_567);

      expect(Number.isInteger(result.hoursFromSurface)).toBe(true);
      expect(Number.isInteger(result.hoursFromCost)).toBe(true);
      expect(Number.isInteger(result.averageHours)).toBe(true);
      expect(Number.isInteger(result.honoraireMoyen)).toBe(true);
    });
  });
});

describe('PROJECT_TYPE_LABELS', () => {
  it('should have labels for all project types', () => {
    const types: ProjectType[] = ['EW', 'MW', 'SH', 'IL', 'PG', 'BU', 'ON'];

    types.forEach((type) => {
      expect(PROJECT_TYPE_LABELS[type]).toBeDefined();
      expect(PROJECT_TYPE_LABELS[type].nl).toBeTruthy();
      expect(PROJECT_TYPE_LABELS[type].fr).toBeTruthy();
      expect(PROJECT_TYPE_LABELS[type].en).toBeTruthy();
    });
  });

  it('should have correct Dutch labels', () => {
    expect(PROJECT_TYPE_LABELS.EW.nl).toBe('Eénsgezinswoning');
    expect(PROJECT_TYPE_LABELS.MW.nl).toBe('Meergezinswoning');
  });

  it('should have correct French labels', () => {
    expect(PROJECT_TYPE_LABELS.EW.fr).toBe('Maison unifamiliale');
    expect(PROJECT_TYPE_LABELS.MW.fr).toBe('Immeuble à appartements');
  });
});

describe('BUILDING_TYPE_LABELS', () => {
  it('should have labels for all building types', () => {
    const types: BuildingType[] = ['NB', 'VB'];

    types.forEach((type) => {
      expect(BUILDING_TYPE_LABELS[type]).toBeDefined();
      expect(BUILDING_TYPE_LABELS[type].nl).toBeTruthy();
      expect(BUILDING_TYPE_LABELS[type].fr).toBeTruthy();
      expect(BUILDING_TYPE_LABELS[type].en).toBeTruthy();
    });
  });

  it('should have correct labels', () => {
    expect(BUILDING_TYPE_LABELS.NB.nl).toBe('Nieuwbouw');
    expect(BUILDING_TYPE_LABELS.VB.fr).toBe('Rénovation');
  });
});
