import { useState, useEffect, useCallback } from 'react';
import type {
  Meeting,
  AgendaItem,
  Member,
  MemberRole,
  Decision,
  Mission,
  MeetingVersion,
  RoleType,
  ImpactLevel,
} from '../../types/odj-pv';
import {
  getMeeting,
  updateMeeting,
  getAgendaItems,
  getMembers,
  getMemberRoles,
  getRoleHistory,
  getDecisions,
  getMissions,
  getVersions,
  createAgendaItem,
  updateAgendaItem,
  createMemberRole,
  createDecision,
  createMission,
  getVersion,
} from '../../lib/odj-pv';
import { AgendaEditor } from './AgendaEditor';
import { RoleSuggester } from './RoleSuggester';
import { NoteTaker } from './NoteTaker';
import { generateODJDocx, generatePVDraftDocx } from '../../lib/odj-pv/docx-generator';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner';

interface MeetingEditorProps {
  meetingId: string;
}

export function MeetingEditor({ meetingId }: MeetingEditorProps) {
  // State for all meeting data
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentRoles, setCurrentRoles] = useState<Record<RoleType, string[]>>({
    president: [],
    secretaire: [],
    parole: [],
    temps: [],
    serpent: [],
    plage: [],
  });
  const [roleHistory, setRoleHistory] = useState<MemberRole[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [versions, setVersions] = useState<MeetingVersion[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showFinalizer, setShowFinalizer] = useState(false);

  // Load all data
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [m, items, mems, roles, history, decs, miss, vers] = await Promise.all([
          getMeeting(meetingId),
          getAgendaItems(meetingId),
          getMembers(),
          getMemberRoles(meetingId),
          getRoleHistory(10),
          getDecisions(meetingId),
          getMissions(meetingId),
          getVersions(meetingId),
        ]);

        setMeeting(m);
        setAgendaItems(items);
        setMembers(mems);

        // Convert roles array to Record<RoleType, string[]>
        const rolesMap: Record<RoleType, string[]> = {
          president: [],
          secretaire: [],
          parole: [],
          temps: [],
          serpent: [],
          plage: [],
        };

        roles.forEach((role) => {
          if (!rolesMap[role.role]) {
            rolesMap[role.role] = [];
          }
          rolesMap[role.role].push(role.member_id);
        });

        setCurrentRoles(rolesMap);
        setRoleHistory(history);
        setDecisions(decs);
        setMissions(miss);
        setVersions(vers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load meeting data');
        toast.error('Failed to load meeting data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [meetingId]);

  // Meeting info handlers
  const handleMeetingInfoChange = useCallback(
    async (updates: Partial<Omit<Meeting, 'id' | 'created_at' | 'updated_at'>>) => {
      if (!meeting) return;

      try {
        const updated = await updateMeeting(meetingId, updates);
        setMeeting(updated);
        toast.success('Meeting info updated');
      } catch (err) {
        toast.error('Failed to update meeting info');
      }
    },
    [meetingId, meeting]
  );

  // Mode switching handlers
  const handleStartPV = async () => {
    try {
      setSaving(true);

      // Save roles before transitioning
      await saveRoles();

      const updated = await updateMeeting(meetingId, { status: 'in_progress' });
      setMeeting(updated);
      toast.success('Meeting started - PV mode activated');
    } catch (err) {
      toast.error('Failed to start PV mode');
    } finally {
      setSaving(false);
    }
  };

  const handleBackToODJ = async () => {
    try {
      setSaving(true);
      const updated = await updateMeeting(meetingId, { status: 'odj_ready' });
      setMeeting(updated);
      setShowFinalizer(false);
      toast.success('Returned to ODJ mode');
    } catch (err) {
      toast.error('Failed to return to ODJ mode');
    } finally {
      setSaving(false);
    }
  };

  const handleFinalize = async () => {
    try {
      setSaving(true);
      const updated = await updateMeeting(meetingId, { status: 'finalized' });
      setMeeting(updated);
      setShowFinalizer(false);
      toast.success('Meeting finalized');
    } catch (err) {
      toast.error('Failed to finalize meeting');
    } finally {
      setSaving(false);
    }
  };

  // Agenda items handlers
  const handleSaveAgenda = async () => {
    try {
      setSaving(true);

      // Separate new items (with temp- IDs) from existing items
      const newItems = agendaItems.filter((item) => item.id.startsWith('temp-'));
      const existingItems = agendaItems.filter((item) => !item.id.startsWith('temp-'));

      // Create new items
      for (const item of newItems) {
        const { id, created_at, ...itemData } = item;
        await createAgendaItem(itemData);
      }

      // Update existing items
      for (const item of existingItems) {
        const { id, created_at, ...updates } = item;
        await updateAgendaItem(id, updates);
      }

      // Reload items to get proper IDs
      const updatedItems = await getAgendaItems(meetingId);
      setAgendaItems(updatedItems);

      toast.success('Agenda saved');
    } catch (err) {
      toast.error('Failed to save agenda');
    } finally {
      setSaving(false);
    }
  };

  // Role handlers
  const saveRoles = async () => {
    try {
      // Note: This is a simplified approach that recreates all roles
      // In production, you might want to diff and only update changed roles

      // Create all roles
      const rolesToCreate: Array<{ role: RoleType; member_id: string }> = [];

      Object.entries(currentRoles).forEach(([role, memberIds]) => {
        memberIds.forEach((memberId) => {
          if (memberId) {
            rolesToCreate.push({
              role: role as RoleType,
              member_id: memberId,
            });
          }
        });
      });

      // Create new roles
      for (const roleData of rolesToCreate) {
        await createMemberRole({
          meeting_id: meetingId,
          ...roleData,
        });
      }

      // Reload role history
      const history = await getRoleHistory(10);
      setRoleHistory(history);
    } catch (err) {
      throw new Error('Failed to save roles');
    }
  };

  const handleRolesChange = (roles: Record<RoleType, string[]>) => {
    setCurrentRoles(roles);
  };

  // Note-taking handlers
  const handleItemNotesChange = async (itemId: string, notes: string) => {
    try {
      await updateAgendaItem(itemId, { notes });
      setAgendaItems((items) =>
        items.map((item) => (item.id === itemId ? { ...item, notes } : item))
      );
    } catch (err) {
      toast.error('Failed to save notes');
    }
  };

  const handleAddDecision = async (itemId: string) => {
    const content = prompt('Enter decision content:');
    if (!content) return;

    const impactLevel = prompt(
      'Enter impact level (long_term/medium_term/daily):'
    ) as ImpactLevel;
    if (!['long_term', 'medium_term', 'daily'].includes(impactLevel)) {
      toast.error('Invalid impact level');
      return;
    }

    try {
      const decision = await createDecision({
        meeting_id: meetingId,
        agenda_item_id: itemId,
        content,
        impact_level: impactLevel,
      });
      setDecisions((prev) => [...prev, decision]);
      toast.success('Decision added');
    } catch (err) {
      toast.error('Failed to add decision');
    }
  };

  const handleAddMission = async (itemId: string) => {
    const description = prompt('Enter mission description:');
    if (!description) return;

    const memberName = prompt('Assign to member (name):');
    const member = members.find((m) => m.name === memberName);

    try {
      const mission = await createMission({
        meeting_id: meetingId,
        agenda_item_id: itemId,
        member_id: member?.id || null,
        description,
        email_sent: false,
        email_sent_at: null,
      });
      setMissions((prev) => [...prev, mission]);
      toast.success('Mission added');
    } catch (err) {
      toast.error('Failed to add mission');
    }
  };

  const handleLoadVersion = async (versionId: string) => {
    try {
      const version = await getVersion(versionId);
      const snapshot = version.snapshot_json;

      // Restore state from snapshot
      setAgendaItems(snapshot.agendaItems);
      setDecisions(snapshot.decisions);
      setMissions(snapshot.missions);

      toast.success('Version restored');
    } catch (err) {
      toast.error('Failed to load version');
    }
  };

  // Export handlers
  const handleExportODJ = async () => {
    try {
      if (!meeting) return;

      const roles = await getMemberRoles(meetingId);
      const blob = await generateODJDocx(meeting, agendaItems, roles, members);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ODJ_${meeting.date}_${meeting.title.replace(/\s/g, '_')}.docx`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('ODJ exported');
    } catch (err) {
      toast.error('Failed to export ODJ');
    }
  };

  const handleExportPV = async () => {
    try {
      if (!meeting) return;

      const roles = await getMemberRoles(meetingId);
      const blob = await generatePVDraftDocx(
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
      a.download = `PV_${meeting.date}_${meeting.title.replace(/\s/g, '_')}.docx`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('PV exported');
    } catch (err) {
      toast.error('Failed to export PV');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading meeting...</div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">
          {error || 'Meeting not found'}
        </div>
      </div>
    );
  }

  const isODJMode = meeting.status === 'draft' || meeting.status === 'odj_ready';
  const isPVMode = meeting.status === 'in_progress';
  const isFinalized = meeting.status === 'finalized';

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-rich-black">
          {isODJMode && "Ordre du Jour"}
          {isPVMode && "Procès-Verbal"}
          {isFinalized && "PV Finalisé"}
          {' - '}
          {meeting.title}
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={isODJMode ? handleExportODJ : handleExportPV}
            variant="outline"
            size="sm"
          >
            Export DOCX
          </Button>
          <Button
            onClick={() => (window.location.href = '/admin/odj-pv')}
            variant="ghost"
            size="sm"
          >
            Back to List
          </Button>
        </div>
      </div>

      {/* Meeting Info Form */}
      {!isFinalized && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 border-2 border-gray-200 rounded-lg bg-white">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={meeting.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleMeetingInfoChange({ title: e.target.value })
              }
              disabled={isFinalized}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={meeting.date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMeetingInfoChange({ date: e.target.value })}
              disabled={isFinalized}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_time">Start Time</Label>
            <Input
              id="start_time"
              type="time"
              value={meeting.start_time || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleMeetingInfoChange({ start_time: e.target.value || null })
              }
              disabled={isFinalized}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_time">End Time</Label>
            <Input
              id="end_time"
              type="time"
              value={meeting.end_time || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleMeetingInfoChange({ end_time: e.target.value || null })
              }
              disabled={isFinalized}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={meeting.location || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleMeetingInfoChange({ location: e.target.value || null })
              }
              disabled={isFinalized}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="what_to_bring">What to Bring</Label>
            <Input
              id="what_to_bring"
              value={meeting.what_to_bring || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleMeetingInfoChange({ what_to_bring: e.target.value || null })
              }
              disabled={isFinalized}
            />
          </div>
        </div>
      )}

      {/* ODJ Mode */}
      {isODJMode && (
        <div className="space-y-6">
          <RoleSuggester
            meetingId={meetingId}
            members={members}
            roleHistory={roleHistory}
            currentRoles={currentRoles}
            onRolesChange={handleRolesChange}
          />

          <AgendaEditor
            meetingId={meetingId}
            items={agendaItems}
            onItemsChange={setAgendaItems}
            onSave={handleSaveAgenda}
          />

          <div className="flex justify-end">
            <Button
              onClick={handleStartPV}
              disabled={saving}
              variant="default"
              size="lg"
              className="bg-magenta hover:bg-magenta/90"
            >
              {saving ? 'Starting...' : 'Start PV Mode →'}
            </Button>
          </div>
        </div>
      )}

      {/* PV Mode */}
      {isPVMode && !showFinalizer && (
        <div className="space-y-6">
          <NoteTaker
            meetingId={meetingId}
            agendaItems={agendaItems}
            decisions={decisions}
            missions={missions}
            versions={versions}
            onItemNotesChange={handleItemNotesChange}
            onAddDecision={handleAddDecision}
            onAddMission={handleAddMission}
            onLoadVersion={handleLoadVersion}
          />

          <div className="flex justify-between">
            <Button onClick={handleBackToODJ} variant="outline">
              ← Back to ODJ
            </Button>
            <Button
              onClick={() => setShowFinalizer(true)}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              Finalize PV →
            </Button>
          </div>
        </div>
      )}

      {/* Finalizer - Placeholder */}
      {isPVMode && showFinalizer && (
        <div className="space-y-6 p-6 border-2 border-green-500 rounded-lg bg-green-50">
          <h2 className="text-2xl font-bold text-green-900">
            Finalize Meeting
          </h2>
          <p className="text-gray-700">
            Review all decisions and missions before finalizing. Once finalized,
            the meeting cannot be edited.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Decisions ({decisions.length})</h3>
              {decisions.map((d) => (
                <div key={d.id} className="p-2 bg-white rounded mb-2">
                  {d.content}
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Missions ({missions.length})</h3>
              {missions.map((m) => (
                <div key={m.id} className="p-2 bg-white rounded mb-2">
                  {m.description}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={() => setShowFinalizer(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleFinalize}
              disabled={saving}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? 'Finalizing...' : 'Confirm Finalization'}
            </Button>
          </div>
        </div>
      )}

      {/* Finalized - Read Only */}
      {isFinalized && (
        <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-4xl">✅</span>
            <div>
              <h2 className="text-xl font-bold text-green-900">
                This meeting has been finalized
              </h2>
              <p className="text-green-700">
                No further changes can be made. Export the document to share with
                participants.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Final Decisions</h3>
              {decisions.map((d) => (
                <div key={d.id} className="p-3 bg-white rounded mb-2 border">
                  <div className="font-medium text-red-700">DECISION</div>
                  <div>{d.content}</div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Final Missions</h3>
              {missions.map((m) => (
                <div key={m.id} className="p-3 bg-white rounded mb-2 border">
                  <div className="font-medium text-yellow-700">MISSION</div>
                  <div>{m.description}</div>
                  {m.member_id && (
                    <div className="text-sm text-gray-600 mt-1">
                      Assigned to: {members.find((mem) => mem.id === m.member_id)?.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
