import { DecisionsList } from './DecisionsList';

export function DecisionsListWrapper() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-magenta/5 to-butter-yellow/5 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <DecisionsList />
      </div>
    </div>
  );
}
