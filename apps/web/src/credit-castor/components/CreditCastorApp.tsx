/**
 * Credit Castor App - Supabase version
 *
 * This is the entry point for Credit Castor when used within ferme-du-temple.
 * Authentication is handled by ferme-du-temple's Supabase auth, so no PasswordGate needed.
 */

import EnDivisionCorrect from './EnDivisionCorrect';
import { UnlockProvider } from '../contexts/UnlockContext';
import { CalculatorProvider } from './calculator/CalculatorProvider';

export default function CreditCastorApp() {
  return (
    <div className="credit-castor-container">
      <UnlockProvider>
        <CalculatorProvider>
          <EnDivisionCorrect />
        </CalculatorProvider>
      </UnlockProvider>
    </div>
  );
}
