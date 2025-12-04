import { useState, useEffect, useMemo } from 'react';
import type { Decision, Meeting } from '../../types/odj-pv';
import { IMPACT_LABELS } from '../../types/odj-pv';
import { getAllDecisions, getMeetings } from '../../lib/odj-pv';

export function DecisionsList() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [impactFilter, setImpactFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch all decisions and meetings
    async function load() {
      const [d, m] = await Promise.all([
        getAllDecisions({}),
        getMeetings()
      ]);
      setDecisions(d);
      setMeetings(m);
      setLoading(false);
    }
    load();
  }, []);

  // Get meeting date for a decision
  const getMeetingDate = (meetingId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    return meeting?.date || '';
  };

  // Available years from data
  const years = useMemo(() => {
    const yearSet = new Set(meetings.map(m => new Date(m.date).getFullYear()));
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [meetings]);

  // Filtered decisions
  const filteredDecisions = useMemo(() => {
    return decisions.filter(d => {
      if (impactFilter !== 'all' && d.impact_level !== impactFilter) return false;

      const meetingDate = getMeetingDate(d.meeting_id);
      if (yearFilter !== 'all' && !meetingDate.startsWith(yearFilter)) return false;

      if (searchQuery && !d.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      return true;
    });
  }, [decisions, impactFilter, yearFilter, searchQuery]);

  // Group by impact level
  const grouped = {
    long_term: filteredDecisions.filter(d => d.impact_level === 'long_term'),
    medium_term: filteredDecisions.filter(d => d.impact_level === 'medium_term'),
    daily: filteredDecisions.filter(d => d.impact_level === 'daily')
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Historique des Décisions</h2>
        <a href="/admin/odj-pv" className="text-blue-600 hover:underline">← Retour aux réunions</a>
      </div>

      {/* Filters */}
      <div className="flex gap-4 p-4 bg-gray-100 rounded">
        <select value={impactFilter} onChange={e => setImpactFilter(e.target.value)}>
          <option value="all">Tous les niveaux</option>
          <option value="long_term">🔴 Long terme</option>
          <option value="medium_term">🟠 Moyen terme</option>
          <option value="daily">🟡 Quotidien</option>
        </select>

        <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
          <option value="all">Toutes les années</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="space-y-6">
          {(['long_term', 'medium_term', 'daily'] as const).map(level => (
            <div key={level}>
              <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                {level === 'long_term' && '🔴'}
                {level === 'medium_term' && '🟠'}
                {level === 'daily' && '🟡'}
                {IMPACT_LABELS[level]} ({grouped[level].length})
              </h3>

              {grouped[level].length === 0 ? (
                <p className="text-gray-500 ml-6">Aucune décision</p>
              ) : (
                <div className="border rounded overflow-hidden">
                  {grouped[level].map(d => {
                    const date = getMeetingDate(d.meeting_id);
                    return (
                      <div key={d.id} className="flex items-center border-b last:border-b-0 p-3 hover:bg-gray-50">
                        <span className="w-28 text-gray-600">{date}</span>
                        <span className="flex-1">{d.content}</span>
                        <a
                          href={`/admin/odj-pv/${d.meeting_id}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Voir PV
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
