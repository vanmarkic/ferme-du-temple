import { useState } from 'react';
import type { Decision, Mission, Member, Meeting, AgendaItem, MemberRole } from '../../types/odj-pv';
import { IMPACT_LABELS } from '../../types/odj-pv';
import { sendMissionEmails } from '../../lib/odj-pv/email';
import { generatePVFinalDocx } from '../../lib/odj-pv/docx-generator';
import { Button } from '../ui/button';

interface FinalizerProps {
  meeting: Meeting;
  agendaItems: AgendaItem[];
  decisions: Decision[];
  missions: Mission[];
  members: Member[];
  roles: MemberRole[];
  onFinalize: () => Promise<void>;
}

export function Finalizer({
  meeting,
  agendaItems,
  decisions,
  missions,
  members,
  roles,
  onFinalize
}: FinalizerProps) {
  const [selectedMissions, setSelectedMissions] = useState<Set<string>>(
    new Set(missions.filter(m => {
      const member = members.find(mem => mem.id === m.member_id);
      return member?.email;
    }).map(m => m.id))
  );
  const [isSending, setIsSending] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [emailResults, setEmailResults] = useState<{ sent: string[], failed: string[] } | null>(null);

  // Group decisions by impact level
  const groupedDecisions = {
    long_term: decisions.filter(d => d.impact_level === 'long_term'),
    medium_term: decisions.filter(d => d.impact_level === 'medium_term'),
    daily: decisions.filter(d => d.impact_level === 'daily')
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await generatePVFinalDocx(
        meeting,
        agendaItems,
        roles,
        members,
        decisions,
        missions
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PV-${meeting.date}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export DOCX:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSendEmails = async () => {
    setIsSending(true);
    try {
      const missionsToSend = missions.filter(m => selectedMissions.has(m.id));
      const results = await sendMissionEmails(missionsToSend, members, meeting);
      setEmailResults(results);
    } catch (error) {
      console.error('Failed to send emails:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFinalize = async () => {
    setIsFinalizing(true);
    try {
      await onFinalize();
    } finally {
      setIsFinalizing(false);
    }
  };

  const getMemberForMission = (mission: Mission) => {
    return members.find(m => m.id === mission.member_id);
  };

  const getAgendaItemTitle = (itemId: string | null) => {
    if (!itemId) return '';
    const item = agendaItems.find(i => i.id === itemId);
    return item ? `(sujet: ${item.title})` : '';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Decisions Summary */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-xl font-bold mb-4">RÉSUMÉ DES DÉCISIONS</h3>

        {(['long_term', 'medium_term', 'daily'] as const).map(level => (
          <div key={level} className="mb-6">
            <h4 className="font-semibold flex items-center gap-2 mb-2">
              {level === 'long_term' && <span className="text-red-600">🔴</span>}
              {level === 'medium_term' && <span className="text-orange-600">🟠</span>}
              {level === 'daily' && <span className="text-yellow-600">🟡</span>}
              {IMPACT_LABELS[level]}
            </h4>
            {groupedDecisions[level].length === 0 ? (
              <p className="text-gray-500 text-sm ml-8">Aucune décision</p>
            ) : (
              <ul className="ml-8 space-y-2">
                {groupedDecisions[level].map(d => (
                  <li key={d.id} className="text-gray-700">
                    • {d.content}{' '}
                    <span className="text-gray-500 text-sm">{getAgendaItemTitle(d.agenda_item_id)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Missions Table */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-xl font-bold mb-4">MISSIONS À ENVOYER</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-50">
                <th className="w-12 p-3 text-left"></th>
                <th className="p-3 text-left font-semibold">Personne</th>
                <th className="p-3 text-left font-semibold">Mission</th>
                <th className="p-3 text-left font-semibold">Email</th>
              </tr>
            </thead>
            <tbody>
              {missions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Aucune mission
                  </td>
                </tr>
              ) : (
                missions.map(m => {
                  const member = getMemberForMission(m);
                  const hasEmail = !!member?.email;
                  return (
                    <tr key={m.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedMissions.has(m.id)}
                          disabled={!hasEmail}
                          onChange={(e) => {
                            const next = new Set(selectedMissions);
                            if (e.target.checked) next.add(m.id);
                            else next.delete(m.id);
                            setSelectedMissions(next);
                          }}
                          className="w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
                        />
                      </td>
                      <td className="p-3">{member?.name || '?'}</td>
                      <td className="p-3">{m.description}</td>
                      <td className="p-3">
                        {hasEmail ? (
                          <span className="text-green-600 font-medium">✓ prêt</span>
                        ) : (
                          <span className="text-red-600 font-medium">✗ pas mail</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Preview */}
      <div className="border rounded-lg p-6 bg-gray-50 shadow-sm">
        <h3 className="text-xl font-bold mb-4">Aperçu email</h3>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <span className="font-semibold">Objet:</span> Mission - Réunion BEAVER {formatDate(meeting.date)}
          </div>
          <hr className="my-4 border-gray-300" />
          <div className="space-y-3 text-gray-700">
            <p>Bonjour [Prénom],</p>
            <p>Suite à la réunion du {formatDate(meeting.date)}, tu as été chargé·e de :</p>
            <div className="bg-gray-100 border-l-4 border-blue-600 p-4 my-4">
              <p className="font-semibold">[Description de la mission]</p>
            </div>
            <p className="mt-4">
              Cordialement,<br/>
              <span className="font-semibold">L'équipe BEAVER</span>
            </p>
          </div>
        </div>
      </div>

      {/* Email Results */}
      {emailResults && (
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h4 className="font-bold text-lg mb-2">Résultat envoi emails</h4>
          <p className="text-green-600 font-medium">
            {emailResults.sent.length} envoyé(s)
          </p>
          {emailResults.failed.length > 0 && (
            <p className="text-red-600 font-medium">
              {emailResults.failed.length} échec(s)
            </p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end pt-4">
        <Button
          onClick={handleExport}
          disabled={isExporting}
          variant="outline"
          size="lg"
        >
          {isExporting ? 'Export...' : 'Exporter DOCX final'}
        </Button>
        <Button
          onClick={handleSendEmails}
          disabled={isSending || selectedMissions.size === 0}
          variant="default"
          size="lg"
        >
          {isSending ? 'Envoi...' : `Envoyer les emails (${selectedMissions.size})`}
        </Button>
        <Button
          onClick={handleFinalize}
          disabled={isFinalizing}
          variant="nature"
          size="lg"
        >
          {isFinalizing ? 'Clôture...' : '✓ Clôturer'}
        </Button>
      </div>
    </div>
  );
}
