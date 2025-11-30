import { PaymentPhaseCard } from './PaymentPhaseCard';
import { formatCurrency, type PhaseCosts } from '@repo/credit-calculator/utils';

interface TwoLoanBreakdown {
  loan1Amount: number;
  loan1MonthlyPayment: number;
  loan2Amount: number;
  loan2MonthlyPayment: number;
  signatureCosts: number;
  constructionCosts: number;
}

interface PaymentTimelineProps {
  phaseCosts: PhaseCosts;
  capitalApporte: number;
  monthlyPayment: number;
  /** For two-loan mode: show per-phase loan amounts */
  twoLoanBreakdown?: TwoLoanBreakdown;
  /** Total amount expected to be recovered from future participant entries */
  expectedPaybackTotal?: number;
}

export function PaymentTimeline({
  phaseCosts,
  capitalApporte,
  monthlyPayment,
  twoLoanBreakdown,
  expectedPaybackTotal,
}: PaymentTimelineProps) {
  const { signature, construction, emmenagement, grandTotal } = phaseCosts;
  const toFinance = Math.max(0, grandTotal - capitalApporte);

  // Two-loan mode calculations
  const isTwoLoanMode = twoLoanBreakdown !== undefined;
  const totalLoanAmount = isTwoLoanMode
    ? twoLoanBreakdown.loan1Amount + twoLoanBreakdown.loan2Amount
    : toFinance;
  const maxMonthlyPayment = isTwoLoanMode
    ? twoLoanBreakdown.loan1MonthlyPayment + twoLoanBreakdown.loan2MonthlyPayment
    : monthlyPayment;

  return (
    <div className="mb-6">
      {/* Header with optional payback card */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1" />
        <h3 className="text-xs text-gray-500 uppercase tracking-wide font-semibold text-center">
          MON PARCOURS DE PAIEMENT
        </h3>
        <div className="flex-1 flex justify-end">
          {expectedPaybackTotal !== undefined && expectedPaybackTotal > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5 text-right">
              <p className="text-[10px] text-purple-600 uppercase tracking-wide font-medium">Total récupéré</p>
              <p className="text-sm font-bold text-purple-700">{formatCurrency(expectedPaybackTotal)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline connector line - 3 dots only (phases, not total) */}
      <div className="relative mb-4">
        <div className="absolute top-3 left-[16%] right-[16%] h-0.5 bg-gray-300" />
        <div className="flex justify-around px-8">
          <div
            data-testid="timeline-dot"
            className="w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow z-10"
          />
          <div
            data-testid="timeline-dot"
            className="w-6 h-6 rounded-full bg-orange-500 border-4 border-white shadow z-10"
          />
          <div
            data-testid="timeline-dot"
            className="w-6 h-6 rounded-full bg-green-500 border-4 border-white shadow z-10"
          />
        </div>
      </div>

      {/* Phase cards grid - 3 columns for phases */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <PaymentPhaseCard
          label="SIGNATURE"
          subtitle="Je deviens propriétaire"
          icon="🔑"
          total={signature.total}
          variant="fixed"
          items={[
            { label: "Part d'achat", amount: signature.purchaseShare },
            { label: 'Enregistrement', amount: signature.registrationFees },
            { label: 'Notaire', amount: signature.notaryFees },
            { label: 'Commun', amount: signature.commun },
          ]}
        />

        <PaymentPhaseCard
          label="CONSTRUCTION"
          subtitle="Mon logement prend forme"
          icon="🏗️"
          total={construction.total}
          variant="progressive"
          items={[
            { label: 'CASCO', amount: construction.casco },
            { label: 'Travaux communs', amount: construction.travauxCommuns },
          ]}
        />

        <PaymentPhaseCard
          label="EMMÉNAGEMENT"
          subtitle="J'emménage chez moi"
          icon="🏠"
          total={emmenagement.total}
          variant="flexible"
          items={[
            { label: 'Parachèvements', amount: emmenagement.parachevements },
          ]}
        />
      </div>

      {/* Summary bar - different layout for two-loan mode */}
      {isTwoLoanMode ? (
        /* Two-loan mode: show per-phase loan amounts */
        <div className="bg-gray-100 rounded-lg border border-gray-300 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                SIGNATURE
              </p>
              <p className="text-xs text-gray-500 mb-0.5">À emprunter</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(twoLoanBreakdown.loan1Amount)}
              </p>
              {twoLoanBreakdown.loan1Amount > 0 && (
                <p className="text-xs text-gray-500">
                  {Math.round(twoLoanBreakdown.loan1MonthlyPayment)} €/mois
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                CONSTRUCTION
              </p>
              <p className="text-xs text-gray-500 mb-0.5">À emprunter</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(twoLoanBreakdown.loan2Amount)}
              </p>
              {twoLoanBreakdown.loan2Amount > 0 && (
                <p className="text-xs text-gray-500">
                  {Math.round(twoLoanBreakdown.loan2MonthlyPayment)} €/mois
                </p>
              )}
            </div>
            <div className="bg-white/50 rounded-lg p-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                TOTAL
              </p>
              <p className="text-xs text-gray-500 mb-0.5">À emprunter</p>
              <p className="text-xl font-bold text-blue-700">
                {formatCurrency(totalLoanAmount)}
              </p>
              <p className="text-xs text-gray-500">
                ~{Math.round(maxMonthlyPayment)} €/mois (max)
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Single-loan mode: original layout */
        <div className="bg-gray-100 rounded-lg border border-gray-300 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                TOTAL
              </p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(grandTotal)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                À FINANCER
              </p>
              <p className="text-xl font-bold text-red-700">
                {formatCurrency(toFinance)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                MENSUALITÉ
              </p>
              <p className="text-xl font-bold text-blue-700">
                ~{monthlyPayment} €/mois
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
