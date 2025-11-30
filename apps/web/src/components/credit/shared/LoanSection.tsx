import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  formatCurrency,
  type PhaseCosts,
  type Participant,
  type ParticipantCalculation,
  type TwoLoanValidationErrors,
} from '@repo/credit-calculator/utils';
import { TwoLoanFinancingSection } from './TwoLoanFinancingSection';

interface LoanSectionProps {
  phaseCosts: PhaseCosts;
  participant: Participant;
  participantCalc: ParticipantCalculation;
  participantIndex: number;
  validationErrors: TwoLoanValidationErrors;
  onUpdateNotaryRate: (rate: number) => void;
  onUpdateInterestRate: (rate: number) => void;
  onUpdateDuration: (years: number) => void;
  onUpdateParticipant: (updated: Participant) => void;
  defaultExpanded?: boolean;
}

export function LoanSection({
  phaseCosts,
  participant,
  participantCalc: p,
  participantIndex: idx,
  validationErrors,
  onUpdateNotaryRate,
  onUpdateInterestRate,
  onUpdateDuration,
  onUpdateParticipant,
  defaultExpanded = false,
}: LoanSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const capitalApporte = participant.capitalApporte ?? 0;
  const useTwoLoans = participant.useTwoLoans ?? false;
  const remainingToFinance = phaseCosts.grandTotal - capitalApporte;

  // Calculate combined monthly payment for summary
  const monthlyPayment = useTwoLoans
    ? (p.loan1MonthlyPayment ?? 0) + (p.loan2MonthlyPayment ?? 0)
    : p.monthlyPayment;

  const loanCount = useTwoLoans ? 2 : 1;

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200">
      {/* Collapsed header with summary */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>💰</span>
          <span className="font-medium text-gray-700">Prêt</span>
          <span className="text-sm text-gray-500">
            ({p.interestRate}% · {p.durationYears}ans · {loanCount} {loanCount > 1 ? 'prêts' : 'prêt'})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-blue-700">{formatCurrency(monthlyPayment)}/mois</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-200 space-y-4">
          {/* Capital and remaining */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor={`capital-apporte-${idx}`} className="text-sm text-gray-600">Capital apporté:</label>
              <input
                id={`capital-apporte-${idx}`}
                name={`capital-apporte-${idx}`}
                type="number"
                value={capitalApporte}
                onChange={(e) =>
                  onUpdateParticipant({
                    ...participant,
                    capitalApporte: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-32 px-2 py-1 border border-gray-300 rounded text-right font-medium"
                step="1000"
              />
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Reste à financer: </span>
              <span className="font-bold text-red-700">
                {formatCurrency(Math.max(0, remainingToFinance))}
              </span>
            </div>
          </div>

          {/* Loan parameters grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Registration fees */}
            <div>
              <span className="block text-xs text-gray-600 mb-1">
                Frais d'enregistrement
              </span>
              <div className="flex items-center gap-2 mb-1">
                <label
                  htmlFor={`notaryRate-3-${idx}`}
                  className="flex items-center gap-1.5 cursor-pointer px-3 py-2 border rounded-lg transition-colors hover:bg-gray-100"
                  style={{
                    borderColor: p.registrationFeesRate === 3 ? '#9ca3af' : '#e5e7eb',
                    backgroundColor: p.registrationFeesRate === 3 ? '#f3f4f6' : 'white',
                  }}
                >
                  <input
                    id={`notaryRate-3-${idx}`}
                    type="radio"
                    name={`notaryRate-${idx}`}
                    value="3"
                    checked={p.registrationFeesRate === 3}
                    onChange={(e) => onUpdateNotaryRate(parseFloat(e.target.value))}
                    className="w-4 h-4"
                  />
                  <span className="font-medium text-gray-700 text-sm">3%</span>
                </label>
                <label
                  htmlFor={`notaryRate-12-${idx}`}
                  className="flex items-center gap-1.5 cursor-pointer px-3 py-2 border rounded-lg transition-colors hover:bg-gray-100"
                  style={{
                    borderColor: p.registrationFeesRate === 12.5 ? '#9ca3af' : '#e5e7eb',
                    backgroundColor: p.registrationFeesRate === 12.5 ? '#f3f4f6' : 'white',
                  }}
                >
                  <input
                    id={`notaryRate-12-${idx}`}
                    type="radio"
                    name={`notaryRate-${idx}`}
                    value="12.5"
                    checked={p.registrationFeesRate === 12.5}
                    onChange={(e) => onUpdateNotaryRate(parseFloat(e.target.value))}
                    className="w-4 h-4"
                  />
                  <span className="font-medium text-gray-700 text-sm">12.5%</span>
                </label>
              </div>
              <div className="text-sm text-gray-600">= {formatCurrency(p.droitEnregistrements)}</div>
            </div>

            {/* Interest rate */}
            <div>
              <label htmlFor={`interest-rate-${idx}`} className="block text-xs text-gray-600 mb-1">Taux d'intérêt (%)</label>
              <input
                id={`interest-rate-${idx}`}
                name={`interest-rate-${idx}`}
                type="number"
                step="0.1"
                value={p.interestRate}
                onChange={(e) => onUpdateInterestRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 font-medium border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none bg-white"
              />
            </div>

            {/* Duration */}
            <div>
              <label htmlFor={`duration-years-${idx}`} className="block text-xs text-gray-600 mb-1">Durée (années)</label>
              <input
                id={`duration-years-${idx}`}
                name={`duration-years-${idx}`}
                type="number"
                value={p.durationYears}
                onChange={(e) => onUpdateDuration(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 font-medium border border-gray-300 rounded-lg focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Two-Loan configuration */}
          <TwoLoanFinancingSection
            participant={participant}
            participantCalc={p}
            personalRenovationCost={p.personalRenovationCost || 0}
            validationErrors={validationErrors}
            onUpdateParticipant={onUpdateParticipant}
          />

          {/* Single loan display (only when not using two loans) */}
          {!useTwoLoans && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Montant à emprunter</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(p.loanNeeded)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Mensualité</p>
                  <p className="text-xl font-bold text-red-700">
                    {formatCurrency(p.monthlyPayment)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {participant.durationYears} ans @ {participant.interestRate}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
