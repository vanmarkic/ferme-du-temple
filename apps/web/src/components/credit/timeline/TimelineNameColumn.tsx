import type { Participant } from '@repo/credit-calculator/utils';
import type {
  TimelineTransaction,
  FraisGenerauxYearlyEvent,
  NewcomerFraisGenerauxReimbursementEvent,
} from '@repo/credit-calculator/types';
import CoproInventoryCard from './CoproInventoryCard';
import FraisGenerauxEventCard from './FraisGenerauxEventCard';
import ParticipantFinancingCard from './ParticipantFinancingCard';

type FraisGenerauxEvent = FraisGenerauxYearlyEvent | NewcomerFraisGenerauxReimbursementEvent;

interface CoproSnapshot {
  date: Date;
  availableLots: number;
  totalSurface: number;
  soldThisDate: string[];
  reserveIncrease: number;
  colorZone: number;
}

interface TimelineSnapshot {
  date: Date;
  participantName: string;
  participantIndex: number;
  totalCost: number;
  loanNeeded: number;
  monthlyPayment: number;
  isT0: boolean;
  colorZone: number;
  transaction?: TimelineTransaction;
  showFinancingDetails: boolean;
  useTwoLoans?: boolean;
  loan1MonthlyPayment?: number;
  loan2MonthlyPayment?: number;
}

interface TimelineNameColumnProps {
  participants: Participant[];
  onUpdateParticipant: (index: number, updated: Participant) => void;
  allDates: Date[];
  coproSnapshots: CoproSnapshot[];
  fraisGenerauxEvents: FraisGenerauxEvent[];
  snapshots: Map<string, TimelineSnapshot[]>;
  onOpenParticipantDetails: (index: number) => void;
  onOpenCoproDetails: (snapshot: CoproSnapshot) => void;
  onOpenFraisGenerauxDetails: (event: FraisGenerauxEvent) => void;
  coproReservesShare: number;
}

export default function TimelineNameColumn({
  participants,
  onUpdateParticipant,
  allDates,
  coproSnapshots,
  fraisGenerauxEvents,
  snapshots,
  onOpenParticipantDetails,
  onOpenCoproDetails,
  onOpenFraisGenerauxDetails,
  coproReservesShare
}: TimelineNameColumnProps) {
  return (
    <>
      {/* Copropriété row */}
      <div className="flex min-h-40 border-b border-gray-200 swimlane-row bg-purple-50">
        <div className="flex-shrink-0 w-48 pr-4 flex items-center">
          <div className="font-semibold text-purple-800">La Copropriété</div>
        </div>
        <div className="flex-1 py-2 flex items-center">
          {allDates.map((date, dateIdx) => {
            const dateStr = date.toISOString().split('T')[0];
            const snapshot = coproSnapshots.find(s => s.date.toISOString().split('T')[0] === dateStr);

            return (
              <div key={dateIdx} className="w-56 flex-shrink-0 px-2">
                {snapshot && (
                  <CoproInventoryCard
                    date={snapshot.date}
                    availableLots={snapshot.availableLots}
                    totalSurface={snapshot.totalSurface}
                    soldThisDate={snapshot.soldThisDate}
                    reserveIncrease={snapshot.reserveIncrease}
                    colorZone={snapshot.colorZone}
                    isT0={dateIdx === 0}
                    coproReservesShare={coproReservesShare}
                    onClick={() => onOpenCoproDetails(snapshot)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Frais Généraux row */}
      <div className="flex min-h-48 border-b border-gray-200 swimlane-row bg-purple-25">
        <div className="flex-shrink-0 w-48 pr-4 flex items-center">
          <div className="font-semibold text-purple-700">Frais Généraux</div>
        </div>
        <div className="flex-1 py-2 flex items-center">
          {allDates.map((date, dateIdx) => {
            const dateStr = date.toISOString().split('T')[0];
            const event = fraisGenerauxEvents.find(
              e => e.date.toISOString().split('T')[0] === dateStr
            );

            return (
              <div key={dateIdx} className="w-56 flex-shrink-0 px-2">
                {event && (
                  <FraisGenerauxEventCard
                    event={event}
                    colorZone={dateIdx}
                    isT0={dateIdx === 0}
                    onClick={() => onOpenFraisGenerauxDetails(event)}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Participant rows */}
      {participants.map((p, idx) => {
        const participantSnapshots = snapshots.get(p.name) || [];

        return (
          <div
            key={idx}
            data-testid={p.isFounder ? `participant-founder-${p.name}` : `participant-non-founder-${p.name}`}
            className={`flex min-h-40 border-b border-gray-200 swimlane-row ${
              p.enabled === false ? 'opacity-50' : ''
            }`}
          >
            <div className="flex-shrink-0 w-48 pr-4 flex items-center">
              <div className="flex items-center gap-2">
                <input
                  id={`participant-enabled-${idx}`}
                  name={`participant-enabled-${idx}`}
                  type="checkbox"
                  checked={p.enabled !== false}
                  onChange={(e) => {
                    onUpdateParticipant(idx, {
                      ...p,
                      enabled: e.target.checked
                    });
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  title={p.enabled === false ? "Activer ce participant" : "Désactiver ce participant"}
                  aria-label={`${p.enabled === false ? "Activer" : "Désactiver"} ${p.name}`}
                />
                <label htmlFor={`participant-enabled-${idx}`} className={`font-semibold cursor-pointer ${p.enabled === false ? 'text-gray-500' : 'text-gray-800'}`}>
                  {p.name}
                </label>
              </div>
            </div>
            <div className="flex-1 py-2 flex items-center">
              {allDates.map((date, dateIdx) => {
                const dateStr = date.toISOString().split('T')[0];
                const snapshot = participantSnapshots.find(s => s.date.toISOString().split('T')[0] === dateStr);

                return (
                  <div key={dateIdx} className="w-56 flex-shrink-0 px-2">
                    {snapshot && (
                      <ParticipantFinancingCard
                        date={snapshot.date}
                        totalCost={snapshot.totalCost}
                        loanNeeded={snapshot.loanNeeded}
                        monthlyPayment={snapshot.monthlyPayment}
                        isT0={snapshot.isT0}
                        isFounder={p.isFounder === true}
                        participantName={p.name}
                        colorZone={snapshot.colorZone}
                        transaction={snapshot.transaction}
                        onClick={() => onOpenParticipantDetails(snapshot.participantIndex)}
                        showFinancingDetails={snapshot.showFinancingDetails}
                        useTwoLoans={snapshot.useTwoLoans}
                        loan1MonthlyPayment={snapshot.loan1MonthlyPayment}
                        loan2MonthlyPayment={snapshot.loan2MonthlyPayment}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
