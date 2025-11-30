import { useState } from 'react';
import type { Participant, ParticipantCalculation } from '@repo/credit-calculator/utils';

interface TwoLoanFinancingSectionProps {
  participant: Participant;
  participantCalc?: ParticipantCalculation;
  personalRenovationCost: number;
  validationErrors: {
    loanDelay?: string;
    renovationAmount?: string;
  };
  onUpdateParticipant: (updated: Participant) => void;
}

/**
 * Two-loan financing configuration section (v3 - phase-based split)
 *
 * Simplified UI with:
 * - Two capital inputs: "À la signature" (capitalApporte) and "Pendant travaux" (capitalForLoan2)
 * - Optional construction cost override (hidden by default)
 * - Per-phase loan amounts displayed
 */
export function TwoLoanFinancingSection({
  participant,
  participantCalc,
  personalRenovationCost,
  validationErrors,
  onUpdateParticipant
}: TwoLoanFinancingSectionProps) {
  const [showAdvanced, setShowAdvanced] = useState(
    participant.loan2RenovationAmount !== undefined && participant.loan2RenovationAmount !== personalRenovationCost
  );

  const capitalForLoan2 = participant.capitalForLoan2 || 0;
  const totalCapital = participant.capitalApporte + capitalForLoan2;
  const loan2DelayYears = participant.loan2DelayYears ?? 2;
  const loan2DurationYears = (participant.durationYears || 0) - loan2DelayYears;

  // Calculated values from participantCalc (if available)
  const loan1Amount = participantCalc?.loan1Amount;
  const loan2Amount = participantCalc?.loan2Amount;
  const loan1MonthlyPayment = participantCalc?.loan1MonthlyPayment;
  const loan2MonthlyPayment = participantCalc?.loan2MonthlyPayment;

  // Construction costs (defaults to personalRenovationCost, can be overridden)
  const constructionCosts = participant.loan2RenovationAmount ?? personalRenovationCost;

  return (
    <div className="border-t pt-4 mt-4">
      {/* Toggle */}
      <label className="flex items-center gap-2 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={participant.useTwoLoans || false}
          onChange={(e) => {
            onUpdateParticipant({ ...participant, useTwoLoans: e.target.checked });
          }}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <span className="font-semibold text-sm">Financement en deux prêts</span>
      </label>

      {participant.useTwoLoans && (
        <div className="ml-6 mt-3 space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">

          {/* Section 1: Capital Inputs - Two columns */}
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Mon capital
            </label>

            <div className="grid grid-cols-2 gap-4 mb-3">
              {/* Capital at signature */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">À la signature</label>
                <input
                  type="number"
                  value={participant.capitalApporte}
                  onChange={(e) => {
                    onUpdateParticipant({ ...participant, capitalApporte: parseFloat(e.target.value) || 0 });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                  min="0"
                  step="1000"
                />
              </div>

              {/* Capital during construction */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Pendant travaux</label>
                <input
                  type="number"
                  value={capitalForLoan2}
                  onChange={(e) => {
                    onUpdateParticipant({ ...participant, capitalForLoan2: parseFloat(e.target.value) || 0 });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            {/* Total capital display */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="text-sm font-bold text-gray-900">
                {totalCapital.toLocaleString('fr-FR')} €
              </span>
            </div>
          </div>

          {/* Section 2: Loan timing */}
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                Prêt 2 commence après
              </label>
              {loan2DurationYears > 0 && (
                <span className="text-xs text-gray-500">
                  Durée prêt 2: <span className="font-semibold text-blue-700">{loan2DurationYears} ans</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                value={loan2DelayYears}
                onChange={(e) => {
                  onUpdateParticipant({ ...participant, loan2DelayYears: parseFloat(e.target.value) || 2 });
                }}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                min="1"
                step="0.5"
              />
              <span className="text-sm text-gray-600">ans</span>
            </div>

            {validationErrors.loanDelay && (
              <div className="text-red-600 text-xs mt-2 p-2 bg-red-50 rounded border border-red-200">
                {validationErrors.loanDelay}
              </div>
            )}
          </div>

          {/* Section 3: Advanced - Construction cost override (collapsed by default) */}
          <div className="bg-white rounded-lg border border-blue-100">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-gray-50 rounded-lg"
            >
              <span className="text-xs text-gray-500">Montant construction (optionnel)</span>
              <span className="text-xs text-gray-400">{showAdvanced ? '▼' : '▶'}</span>
            </button>

            {showAdvanced && (
              <div className="px-4 pb-4">
                <p className="text-xs text-gray-500 mb-2">
                  Calculé: {personalRenovationCost.toLocaleString('fr-FR')} €
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Ajuster:</span>
                  <input
                    type="number"
                    value={participant.loan2RenovationAmount ?? ''}
                    placeholder={personalRenovationCost.toLocaleString('fr-FR')}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined;
                      onUpdateParticipant({ ...participant, loan2RenovationAmount: value });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white text-sm"
                    min="0"
                    step="1000"
                  />
                  <span className="text-sm text-gray-500">€</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Laisser vide = valeur calculée
                </p>
                {validationErrors.renovationAmount && (
                  <div className="text-red-600 text-xs mt-2 p-2 bg-red-50 rounded border border-red-200">
                    {validationErrors.renovationAmount}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 4: Results Summary - Per-phase display */}
          {(loan1Amount !== undefined || loan2Amount !== undefined) && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="grid grid-cols-3 gap-3 text-center">
                {/* Signature phase */}
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Signature</p>
                  <p className="text-xs text-gray-600 mb-0.5">À emprunter</p>
                  <p className="text-lg font-bold text-gray-900">
                    {loan1Amount !== undefined ? `${loan1Amount.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €` : '—'}
                  </p>
                  {loan1MonthlyPayment !== undefined && loan1Amount !== undefined && loan1Amount > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {loan1MonthlyPayment.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €/mois
                    </p>
                  )}
                  {loan1Amount === 0 && (
                    <p className="text-xs text-green-600 mt-1">Couvert</p>
                  )}
                </div>

                {/* Construction phase */}
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Construction</p>
                  <p className="text-xs text-gray-600 mb-0.5">À emprunter</p>
                  <p className="text-lg font-bold text-gray-900">
                    {loan2Amount !== undefined ? `${loan2Amount.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €` : '—'}
                  </p>
                  {loan2MonthlyPayment !== undefined && loan2Amount !== undefined && loan2Amount > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {loan2MonthlyPayment.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €/mois
                    </p>
                  )}
                  {loan2Amount === 0 && constructionCosts > 0 && (
                    <p className="text-xs text-green-600 mt-1">Couvert</p>
                  )}
                </div>

                {/* Total */}
                <div className="bg-white/50 rounded-lg p-2">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Total</p>
                  <p className="text-xs text-gray-600 mb-0.5">À emprunter</p>
                  <p className="text-lg font-bold text-blue-700">
                    {loan1Amount !== undefined && loan2Amount !== undefined
                      ? `${(loan1Amount + loan2Amount).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`
                      : '—'}
                  </p>
                  {loan1MonthlyPayment !== undefined && loan2MonthlyPayment !== undefined && (
                    <p className="text-xs text-gray-500 mt-1">
                      ~{(loan1MonthlyPayment + loan2MonthlyPayment).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €/mois (max)
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
