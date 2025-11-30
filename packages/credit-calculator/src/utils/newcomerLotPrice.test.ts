/**
 * Test suite for newcomer lot price calculation across different dates and years
 *
 * Tests how lotPrice changes based on:
 * - Time elapsed since deed date (years held)
 * - Different entry dates within the same year
 * - Multi-year scenarios (1, 2, 5 years)
 *
 * Uses the actual calculateNewcomerPurchasePrice function from calculatorUtils
 */

import { describe, it, expect } from 'vitest';
import { calculateNewcomerPurchasePrice } from './calculatorUtils';
import type { Participant } from './calculatorUtils';

/**
 * Create a minimal participant for testing
 */
function createParticipant(
  name: string,
  surface: number,
  isFounder: boolean,
  entryDate?: string
): Participant {
  return {
    name,
    surface,
    unitId: Math.floor(Math.random() * 1000),
    capitalApporte: 0,
    registrationFeesRate: 12.5,
    interestRate: 4.5,
    durationYears: 25,
    isFounder,
    entryDate: entryDate ? new Date(entryDate) : undefined
  };
}

describe('Newcomer Lot Price - Date and Year Scenarios', () => {
  // Constants for all tests
  const DEED_DATE = '2025-01-01';
  const TOTAL_PROJECT_COST = 500_000; // €500,000
  const DEFAULT_INDEXATION_RATE = 2; // 2% per year

  describe('Same Year Purchase (Year 0)', () => {
    it('should calculate lotPrice with minimal indexation when buying same day as deed', () => {
      // Founders A and B with 100m² each
      const founderA = createParticipant('Alice', 100, true, DEED_DATE);
      const founderB = createParticipant('Bob', 100, true, DEED_DATE);

      // Newcomer C buys on the same day as deed date
      const newcomerC = createParticipant('Carol', 100, false, DEED_DATE);

      const allParticipants = [founderA, founderB, newcomerC];

      const result = calculateNewcomerPurchasePrice(
        newcomerC.surface,
        allParticipants,
        TOTAL_PROJECT_COST,
        DEED_DATE,
        DEED_DATE // Same day purchase
      );

      // Expected: quotité = 100/300 = 1/3
      expect(result.quotite).toBeCloseTo(1/3, 5);

      // Base price = 500,000 × (1/3) ≈ 166,666.67
      expect(result.basePrice).toBeCloseTo(166_666.67, 0);

      // Years held = 0 (same day)
      expect(result.yearsHeld).toBeCloseTo(0, 2);

      // Indexation = 0 (no time passed)
      expect(result.indexation).toBeCloseTo(0, 0);

      // Carrying costs = 0 (no months held)
      expect(result.carryingCostRecovery).toBeCloseTo(0, 0);

      // Total price ≈ base price (no indexation, no carrying costs)
      expect(result.totalPrice).toBeCloseTo(166_666.67, 0);
    });

    it('should calculate lotPrice with partial year indexation when buying 6 months after deed', () => {
      const founderA = createParticipant('Alice', 100, true, DEED_DATE);
      const founderB = createParticipant('Bob', 100, true, DEED_DATE);

      // Newcomer buys 6 months later (July 1, 2025)
      const entryDate = '2025-07-01';
      const newcomerC = createParticipant('Carol', 100, false, entryDate);

      const allParticipants = [founderA, founderB, newcomerC];

      const result = calculateNewcomerPurchasePrice(
        newcomerC.surface,
        allParticipants,
        TOTAL_PROJECT_COST,
        DEED_DATE,
        entryDate
      );

      // Expected: quotité = 100/300 = 1/3
      expect(result.quotite).toBeCloseTo(1/3, 5);

      // Base price = 500,000 × (1/3) ≈ 166,666.67
      expect(result.basePrice).toBeCloseTo(166_666.67, 0);

      // Years held ≈ 0.5 (6 months)
      expect(result.yearsHeld).toBeCloseTo(0.5, 1);

      // Indexation = basePrice × [(1.02)^yearsHeld - 1]
      // Use actual yearsHeld from result (accounts for 365.25 day calculation)
      const expectedIndexation = result.basePrice * (Math.pow(1.02, result.yearsHeld) - 1);
      expect(result.indexation).toBeCloseTo(expectedIndexation, 0);

      // Carrying costs = 500 × 0.5 × 12 × (1/3) = 1,000
      const expectedCarrying = 500 * result.yearsHeld * 12 * result.quotite;
      expect(result.carryingCostRecovery).toBeCloseTo(expectedCarrying, 0);

      // Total price = basePrice + indexation + carrying
      expect(result.totalPrice).toBeCloseTo(
        result.basePrice + result.indexation + result.carryingCostRecovery,
        0
      );
    });
  });

  describe('1 Year After Deed Date', () => {
    it('should calculate lotPrice with 1 year of indexation', () => {
      const founderA = createParticipant('Alice', 100, true, DEED_DATE);
      const founderB = createParticipant('Bob', 100, true, DEED_DATE);

      // Newcomer buys exactly 1 year later
      const entryDate = '2026-01-01';
      const newcomerC = createParticipant('Carol', 100, false, entryDate);

      const allParticipants = [founderA, founderB, newcomerC];

      const result = calculateNewcomerPurchasePrice(
        newcomerC.surface,
        allParticipants,
        TOTAL_PROJECT_COST,
        DEED_DATE,
        entryDate
      );

      // Years held ≈ 1 (accounting for 365.25 day year)
      expect(result.yearsHeld).toBeCloseTo(1, 1);

      // Indexation = basePrice × [(1.02)^yearsHeld - 1]
      // Use actual yearsHeld from result for precision
      const expectedIndexation = result.basePrice * (Math.pow(1.02, result.yearsHeld) - 1);
      expect(result.indexation).toBeCloseTo(expectedIndexation, 0);

      // Carrying costs = 500 × yearsHeld × 12 × quotité
      const expectedCarrying = 500 * result.yearsHeld * 12 * result.quotite;
      expect(result.carryingCostRecovery).toBeCloseTo(expectedCarrying, 0);

      // Total should be higher than base price
      expect(result.totalPrice).toBeGreaterThan(result.basePrice);
    });

    it('should show price increase from year 0 to year 1', () => {
      const founderA = createParticipant('Alice', 100, true, DEED_DATE);
      const founderB = createParticipant('Bob', 100, true, DEED_DATE);
      const newcomerC = createParticipant('Carol', 100, false);

      const allParticipants = [founderA, founderB, newcomerC];

      // Price at year 0 (same day)
      const priceYear0 = calculateNewcomerPurchasePrice(
        newcomerC.surface,
        allParticipants,
        TOTAL_PROJECT_COST,
        DEED_DATE,
        DEED_DATE
      );

      // Price at year 1
      const priceYear1 = calculateNewcomerPurchasePrice(
        newcomerC.surface,
        allParticipants,
        TOTAL_PROJECT_COST,
        DEED_DATE,
        '2026-01-01'
      );

      // Year 1 price should be higher than year 0 price
      expect(priceYear1.totalPrice).toBeGreaterThan(priceYear0.totalPrice);

      // The difference should include both indexation and carrying costs
      const difference = priceYear1.totalPrice - priceYear0.totalPrice;
      expect(difference).toBeGreaterThan(0);

      // Difference should be approximately indexation + carrying costs for 1 year
      // Indexation: basePrice × 0.02 ≈ 166,666.67 × 0.02 ≈ 3,333
      // Carrying: 500 × 12 × (1/3) ≈ 2,000
      // Total difference ≈ 5,333
      expect(difference).toBeCloseTo(priceYear1.indexation + priceYear1.carryingCostRecovery, 0);
    });

    it('should have higher lot sales price in 2027 than in 2026, all else being equal', () => {
      const founderA = createParticipant('Alice', 100, true, DEED_DATE);
      const founderB = createParticipant('Bob', 100, true, DEED_DATE);
      const newcomerC = createParticipant('Carol', 100, false);

      const allParticipants = [founderA, founderB, newcomerC];

      // Price in 2026
      const price2026 = calculateNewcomerPurchasePrice(
        newcomerC.surface,
        allParticipants,
        TOTAL_PROJECT_COST,
        DEED_DATE,
        '2026-01-01'
      );

      // Price in 2027
      const price2027 = calculateNewcomerPurchasePrice(
        newcomerC.surface,
        allParticipants,
        TOTAL_PROJECT_COST,
        DEED_DATE,
        '2027-01-01'
      );

      // 2027 price should be higher than 2026 price
      expect(price2027.totalPrice).toBeGreaterThan(price2026.totalPrice);

      // Verify the components all increase
      expect(price2027.yearsHeld).toBeGreaterThan(price2026.yearsHeld);
      expect(price2027.indexation).toBeGreaterThan(price2026.indexation);
      expect(price2027.carryingCostRecovery).toBeGreaterThan(price2026.carryingCostRecovery);

      // Base price should remain the same (same quotité)
      expect(price2027.basePrice).toBeCloseTo(price2026.basePrice, 0);
      expect(price2027.quotite).toBeCloseTo(price2026.quotite, 5);
    });
  });

  describe('5 Years After Deed Date', () => {
    it('should calculate lotPrice with compound indexation over 5 years', () => {
      const founderA = createParticipant('Alice', 100, true, DEED_DATE);
      const founderB = createParticipant('Bob', 100, true, DEED_DATE);

      // Newcomer buys 5 years later
      const entryDate = '2030-01-01';
      const newcomerC = createParticipant('Carol', 100, false, entryDate);

      const allParticipants = [founderA, founderB, newcomerC];

      const result = calculateNewcomerPurchasePrice(
        newcomerC.surface,
        allParticipants,
        TOTAL_PROJECT_COST,
        DEED_DATE,
        entryDate
      );

      // Years held ≈ 5 (accounting for 365.25 day year)
      expect(result.yearsHeld).toBeCloseTo(5, 1);

      // Compound indexation = basePrice × [(1.02)^yearsHeld - 1]
      // Use actual yearsHeld from result for precision
      const expectedIndexation = result.basePrice * (Math.pow(1.02, result.yearsHeld) - 1);
      expect(result.indexation).toBeCloseTo(expectedIndexation, 0);

      // Carrying costs = 500 × yearsHeld × 12 × quotité
      const expectedCarrying = 500 * result.yearsHeld * 12 * result.quotite;
      expect(result.carryingCostRecovery).toBeCloseTo(expectedCarrying, 0);
    });

    it('should demonstrate compound growth is non-linear over years', () => {
      const founderA = createParticipant('Alice', 100, true, DEED_DATE);
      const founderB = createParticipant('Bob', 100, true, DEED_DATE);
      const newcomerC = createParticipant('Carol', 100, false);

      const allParticipants = [founderA, founderB, newcomerC];

      // Calculate prices at different years
      const years = [0, 1, 2, 3, 4, 5];
      const prices = years.map(year => {
        const entryDate = new Date(DEED_DATE);
        entryDate.setFullYear(entryDate.getFullYear() + year);

        return calculateNewcomerPurchasePrice(
          newcomerC.surface,
          allParticipants,
          TOTAL_PROJECT_COST,
          DEED_DATE,
          entryDate.toISOString().split('T')[0]
        );
      });

      // Each year should be progressively more expensive
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i].totalPrice).toBeGreaterThan(prices[i - 1].totalPrice);
      }

      // The increases should not be linear (compound effect)
      // Year 4-5 increase should be larger than year 0-1 increase (due to compound indexation)
      const increaseYear01 = prices[1].indexation - prices[0].indexation;
      const increaseYear45 = prices[5].indexation - prices[4].indexation;

      expect(increaseYear45).toBeGreaterThan(increaseYear01);
    });
  });

  describe('Different Entry Dates Within Same Year', () => {
    it('should calculate different lotPrices for different months in the same year', () => {
      const founderA = createParticipant('Alice', 100, true, DEED_DATE);
      const founderB = createParticipant('Bob', 100, true, DEED_DATE);
      const newcomerC = createParticipant('Carol', 100, false);

      const allParticipants = [founderA, founderB, newcomerC];

      // Calculate prices at different months of year 1
      const months = ['2025-03-01', '2025-06-01', '2025-09-01', '2025-12-01'];
      const prices = months.map(entryDate => {
        return calculateNewcomerPurchasePrice(
          newcomerC.surface,
          allParticipants,
          TOTAL_PROJECT_COST,
          DEED_DATE,
          entryDate
        );
      });

      // Each successive month should have higher price
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i].totalPrice).toBeGreaterThan(prices[i - 1].totalPrice);
      }

      // Years held should increase progressively
      expect(prices[0].yearsHeld).toBeLessThan(prices[1].yearsHeld);
      expect(prices[1].yearsHeld).toBeLessThan(prices[2].yearsHeld);
      expect(prices[2].yearsHeld).toBeLessThan(prices[3].yearsHeld);
    });

    it('should handle end-of-year vs start-of-next-year correctly', () => {
      const founderA = createParticipant('Alice', 100, true, DEED_DATE);
      const founderB = createParticipant('Bob', 100, true, DEED_DATE);
      const newcomerC = createParticipant('Carol', 100, false);

      const allParticipants = [founderA, founderB, newcomerC];

      // Dec 31, 2025 vs Jan 1, 2026
      const priceDecember = calculateNewcomerPurchasePrice(
        newcomerC.surface,
        allParticipants,
        TOTAL_PROJECT_COST,
        DEED_DATE,
        '2025-12-31'
      );

      const priceJanuary = calculateNewcomerPurchasePrice(
        newcomerC.surface,
        allParticipants,
        TOTAL_PROJECT_COST,
        DEED_DATE,
        '2026-01-01'
      );

      // January should be slightly more expensive (1 day more)
      expect(priceJanuary.totalPrice).toBeGreaterThan(priceDecember.totalPrice);

      // But the difference should be minimal (just 1 day)
      const dayDifference = priceJanuary.yearsHeld - priceDecember.yearsHeld;
      expect(dayDifference).toBeCloseTo(1 / 365.25, 3);
    });
  });

  describe('Edge Cases', () => {
    it('should return 0 quotité and 0 price when newcomer surface is 0', () => {
      const founderA = createParticipant('Alice', 100, true, DEED_DATE);
      const founderB = createParticipant('Bob', 100, true, DEED_DATE);

      const result = calculateNewcomerPurchasePrice(
        0, // Zero surface
        [founderA, founderB],
        TOTAL_PROJECT_COST,
        DEED_DATE,
        '2026-01-01'
      );

      expect(result.quotite).toBe(0);
      expect(result.basePrice).toBe(0);
      expect(result.totalPrice).toBe(0);
    });

    it('should handle negative years (entry before deed date) gracefully', () => {
      const founderA = createParticipant('Alice', 100, true, DEED_DATE);
      const founderB = createParticipant('Bob', 100, true, DEED_DATE);
      const newcomerC = createParticipant('Carol', 100, false);

      const allParticipants = [founderA, founderB, newcomerC];

      // Entry date BEFORE deed date (shouldn't happen, but test behavior)
      const result = calculateNewcomerPurchasePrice(
        newcomerC.surface,
        allParticipants,
        TOTAL_PROJECT_COST,
        DEED_DATE,
        '2024-01-01' // 1 year before deed
      );

      // Years held could be negative in current implementation
      // This test documents current behavior
      expect(result.yearsHeld).toBeLessThan(0);

      // With negative years, indexation would be negative (price reduction)
      // This might be unintended behavior - documenting it
      expect(result.indexation).toBeLessThan(0);
    });

    it('should handle very large time spans (20 years)', () => {
      const founderA = createParticipant('Alice', 100, true, DEED_DATE);
      const founderB = createParticipant('Bob', 100, true, DEED_DATE);
      const newcomerC = createParticipant('Carol', 100, false);

      const allParticipants = [founderA, founderB, newcomerC];

      const result = calculateNewcomerPurchasePrice(
        newcomerC.surface,
        allParticipants,
        TOTAL_PROJECT_COST,
        DEED_DATE,
        '2045-01-01' // 20 years later
      );

      // Years held ≈ 20
      expect(result.yearsHeld).toBeCloseTo(20, 1);

      // Compound indexation over 20 years at 2%
      // (1.02)^20 ≈ 1.4859 → multiplier ≈ 0.4859
      const expectedIndexation = result.basePrice * (Math.pow(1.02, 20) - 1);
      expect(result.indexation).toBeCloseTo(expectedIndexation, 0);

      // Total price should be significantly higher than base
      expect(result.totalPrice).toBeGreaterThan(result.basePrice * 1.4);
    });
  });

  describe('Custom Indexation Rates', () => {
    it('should use custom indexation rate when provided', () => {
      const founderA = createParticipant('Alice', 100, true, DEED_DATE);
      const founderB = createParticipant('Bob', 100, true, DEED_DATE);
      const newcomerC = createParticipant('Carol', 100, false);

      const allParticipants = [founderA, founderB, newcomerC];
      const entryDate = '2028-01-01'; // 3 years later

      // With default 2% rate
      const result2Percent = calculateNewcomerPurchasePrice(
        newcomerC.surface,
        allParticipants,
        TOTAL_PROJECT_COST,
        DEED_DATE,
        entryDate
      );

      // With custom 5% rate
      const result5Percent = calculateNewcomerPurchasePrice(
        newcomerC.surface,
        allParticipants,
        TOTAL_PROJECT_COST,
        DEED_DATE,
        entryDate,
        { indexationRate: 5 }
      );

      // 5% rate should produce higher indexation
      expect(result5Percent.indexation).toBeGreaterThan(result2Percent.indexation);

      // Verify the calculation is correct
      // Use actual yearsHeld from result for precision (365.25 day year)
      const expected5PercentIndexation = result5Percent.basePrice * (Math.pow(1.05, result5Percent.yearsHeld) - 1);
      expect(result5Percent.indexation).toBeCloseTo(expected5PercentIndexation, 0);
    });

    it('should handle 0% indexation rate', () => {
      const founderA = createParticipant('Alice', 100, true, DEED_DATE);
      const founderB = createParticipant('Bob', 100, true, DEED_DATE);
      const newcomerC = createParticipant('Carol', 100, false);

      const allParticipants = [founderA, founderB, newcomerC];

      const result = calculateNewcomerPurchasePrice(
        newcomerC.surface,
        allParticipants,
        TOTAL_PROJECT_COST,
        DEED_DATE,
        '2030-01-01', // 5 years
        { indexationRate: 0 }
      );

      // Indexation should be 0 with 0% rate
      expect(result.indexation).toBe(0);

      // Total should be basePrice + carrying costs only
      expect(result.totalPrice).toBeCloseTo(
        result.basePrice + result.carryingCostRecovery,
        0
      );
    });
  });
});
