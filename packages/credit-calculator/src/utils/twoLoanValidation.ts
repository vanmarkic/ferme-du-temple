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
 *
 * Remaining validations:
 * - renovationAmount: Optional override can't exceed total renovation cost
 * - loanDelay: Loan 2 must have at least 1 year duration
 */
export function validateTwoLoanFinancing(
  participant: Participant,
  personalRenovationCost: number
): TwoLoanValidationErrors {
  const errors: TwoLoanValidationErrors = {};

  if (!participant.useTwoLoans) {
    return errors; // No validation needed
  }

  // Validate renovation amount override (if set)
  if (participant.loan2RenovationAmount !== undefined) {
    if (participant.loan2RenovationAmount > personalRenovationCost) {
      errors.renovationAmount = `Montant construction (${participant.loan2RenovationAmount.toLocaleString()} €) dépasse le coût calculé (${personalRenovationCost.toLocaleString()} €)`;
    }
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
