import type { Participant } from './calculatorUtils';

export interface TwoLoanValidationErrors {
  renovationAmount?: string;
  loanDelay?: string;
}

/**
 * Validate two-loan financing parameters (v3 - simplified)
 *
 * Removed validations:
 * - capitalAllocation: No longer needed (capitalForLoan1 merged into capitalApporte)
 * - renovationAmount max limit: Users can override to any positive value
 *
 * Remaining validations:
 * - renovationAmount: Must be non-negative if set
 * - loanDelay: Loan 2 must have at least 1 year duration
 *
 * @param personalRenovationCost - Kept for backward compatibility, not currently used
 */
export function validateTwoLoanFinancing(
  participant: Participant,
  personalRenovationCost: number // eslint-disable-line @typescript-eslint/no-unused-vars
): TwoLoanValidationErrors {
  const errors: TwoLoanValidationErrors = {};

  if (!participant.useTwoLoans) {
    return errors; // No validation needed
  }

  // Validate renovation amount override (if set)
  if (participant.loan2RenovationAmount !== undefined) {
    // Allow any positive value - user may want to override higher than calculated
    if (participant.loan2RenovationAmount < 0) {
      errors.renovationAmount = `Montant construction ne peut pas être négatif`;
    }
  }

  // Validate loan delay
  const loan2DelayYears = participant.loan2DelayYears ?? 2;
  if (loan2DelayYears >= participant.durationYears) {
    errors.loanDelay = `Délai prêt 2 (${loan2DelayYears} ans) doit être inférieur à la durée totale (${participant.durationYears} ans)`;
  }

  const loan2DurationYears = participant.durationYears - loan2DelayYears;
  if (loan2DurationYears < 1) {
    errors.loanDelay = `Durée prêt 2 résultante (${loan2DurationYears} ans) doit être au moins 1 an`;
  }

  return errors;
}
