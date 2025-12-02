import { describe, it, expect } from 'vitest';
import { validateTwoLoanFinancing } from './twoLoanValidation';
import type { Participant } from './calculatorUtils';

describe('validateTwoLoanFinancing', () => {
  it('should return no errors for valid two-loan config', () => {
    const participant: Participant = {
      name: 'Test',
      capitalApporte: 100000,  // Signature capital
      registrationFeesRate: 12.5,
      interestRate: 4.5,
      durationYears: 20,
      useTwoLoans: true,
      loan2DelayYears: 2,
      capitalForLoan2: 50000,  // Construction capital
    };

    const errors = validateTwoLoanFinancing(participant, 100000);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should allow renovation amount override to exceed calculated value', () => {
    const participant: Participant = {
      name: 'Test',
      capitalApporte: 100000,
      registrationFeesRate: 12.5,
      interestRate: 4.5,
      durationYears: 20,
      useTwoLoans: true,
      loan2RenovationAmount: 150000, // Greater than 100k calculated - this is now allowed
    };

    const errors = validateTwoLoanFinancing(participant, 100000);
    expect(errors.renovationAmount).toBeUndefined(); // No error - user can override to any positive value
  });

  it('should not error when renovation amount override is not set (uses default)', () => {
    const participant: Participant = {
      name: 'Test',
      capitalApporte: 100000,
      registrationFeesRate: 12.5,
      interestRate: 4.5,
      durationYears: 20,
      useTwoLoans: true,
      // loan2RenovationAmount not set - will use personalRenovationCost as default
    };

    const errors = validateTwoLoanFinancing(participant, 100000);
    expect(errors.renovationAmount).toBeUndefined();
  });

  it('should error when renovation amount is negative', () => {
    const participant: Participant = {
      name: 'Test',
      capitalApporte: 100000,
      registrationFeesRate: 12.5,
      interestRate: 4.5,
      durationYears: 20,
      useTwoLoans: true,
      loan2RenovationAmount: -1000, // Negative value
    };

    const errors = validateTwoLoanFinancing(participant, 100000);
    expect(errors.renovationAmount).toBeDefined();
    expect(errors.renovationAmount).toContain('négatif');
  });

  it('should error when loan delay >= total duration', () => {
    const participant: Participant = {
      name: 'Test',
      capitalApporte: 100000,
      registrationFeesRate: 12.5,
      interestRate: 4.5,
      durationYears: 20,
      useTwoLoans: true,
      loan2DelayYears: 20, // Same as duration
    };

    const errors = validateTwoLoanFinancing(participant, 100000);
    expect(errors.loanDelay).toBeDefined();
  });

  it('should error when loan 2 duration would be less than 1 year', () => {
    const participant: Participant = {
      name: 'Test',
      capitalApporte: 100000,
      registrationFeesRate: 12.5,
      interestRate: 4.5,
      durationYears: 20,
      useTwoLoans: true,
      loan2DelayYears: 20, // Results in 0 years for loan 2
    };

    const errors = validateTwoLoanFinancing(participant, 100000);
    expect(errors.loanDelay).toBeDefined();
  });

  it('should return no errors when useTwoLoans is false', () => {
    const participant: Participant = {
      name: 'Test',
      capitalApporte: 100000,
      registrationFeesRate: 12.5,
      interestRate: 4.5,
      durationYears: 20,
      useTwoLoans: false,
      // Invalid values but shouldn't matter since two-loan mode is off
      loan2RenovationAmount: 500000,
    };

    const errors = validateTwoLoanFinancing(participant, 50000);
    expect(Object.keys(errors)).toHaveLength(0);
  });
});
