/**
 * Supabase database queries for ODJ-PV feature
 */

import { supabase } from '../auth';
import type {
  Meeting,
  AgendaItem,
  Member,
  MemberRole,
  Decision,
  Mission,
  MeetingVersion,
  MeetingSnapshot,
  ImpactLevel,
  RoleType,
} from '../../types/odj-pv';

// ============================================================================
// MEETINGS
// ============================================================================

export async function getMeetings() {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Meeting[];
}

export async function getMeeting(id: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Meeting;
}

export async function createMeeting(
  meeting: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>
) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('meetings')
    .insert(meeting)
    .select()
    .single();

  if (error) throw error;
  return data as Meeting;
}

export async function updateMeeting(
  id: string,
  updates: Partial<Omit<Meeting, 'id' | 'created_at' | 'updated_at'>>
) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('meetings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Meeting;
}

// ============================================================================
// AGENDA ITEMS
// ============================================================================

export async function getAgendaItems(meetingId: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('agenda_items')
    .select('*')
    .eq('meeting_id', meetingId)
    .order('position', { ascending: true });

  if (error) throw error;
  return data as AgendaItem[];
}

export async function createAgendaItem(
  item: Omit<AgendaItem, 'id' | 'created_at'>
) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('agenda_items')
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data as AgendaItem;
}

export async function updateAgendaItem(
  id: string,
  updates: Partial<Omit<AgendaItem, 'id' | 'created_at'>>
) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('agenda_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as AgendaItem;
}

export async function deleteAgendaItem(id: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { error } = await supabase
    .from('agenda_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function reorderAgendaItems(
  items: Array<{ id: string; position: number }>
) {
  if (!supabase) throw new Error('Supabase not initialized');

  const promises = items.map(({ id, position }) =>
    supabase
      .from('agenda_items')
      .update({ position })
      .eq('id', id)
  );

  const results = await Promise.all(promises);
  const errors = results.filter((r) => r.error);

  if (errors.length > 0) {
    throw errors[0].error;
  }
}

// ============================================================================
// MEMBERS
// ============================================================================

export async function getMembers() {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data as Member[];
}

export async function getMember(id: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Member;
}

export async function createMember(
  member: Omit<Member, 'id' | 'created_at'>
) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('members')
    .insert(member)
    .select()
    .single();

  if (error) throw error;
  return data as Member;
}

export async function updateMember(
  id: string,
  updates: Partial<Omit<Member, 'id' | 'created_at'>>
) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('members')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Member;
}

// ============================================================================
// MEMBER ROLES
// ============================================================================

export async function getMemberRoles(meetingId: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('member_roles')
    .select('*')
    .eq('meeting_id', meetingId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as MemberRole[];
}

export async function getRoleHistory(limit: number = 10) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('member_roles')
    .select(`
      *,
      meetings!inner(date)
    `)
    .order('meetings(date)', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as MemberRole[];
}

export async function createMemberRole(
  role: Omit<MemberRole, 'id' | 'created_at'>
) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('member_roles')
    .insert(role)
    .select()
    .single();

  if (error) throw error;
  return data as MemberRole;
}

// ============================================================================
// DECISIONS
// ============================================================================

export async function getDecisions(meetingId: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('decisions')
    .select('*')
    .eq('meeting_id', meetingId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Decision[];
}

export interface DecisionFilters {
  impact_level?: ImpactLevel;
  agenda_item_id?: string;
  limit?: number;
}

export async function getAllDecisions(filters?: DecisionFilters) {
  if (!supabase) throw new Error('Supabase not initialized');

  let query = supabase
    .from('decisions')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.impact_level) {
    query = query.eq('impact_level', filters.impact_level);
  }

  if (filters?.agenda_item_id) {
    query = query.eq('agenda_item_id', filters.agenda_item_id);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Decision[];
}

export async function createDecision(
  decision: Omit<Decision, 'id' | 'created_at'>
) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('decisions')
    .insert(decision)
    .select()
    .single();

  if (error) throw error;
  return data as Decision;
}

export async function deleteDecision(id: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { error } = await supabase
    .from('decisions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================================================
// MISSIONS
// ============================================================================

export async function getMissions(meetingId: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('meeting_id', meetingId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as Mission[];
}

export async function createMission(
  mission: Omit<Mission, 'id' | 'created_at'>
) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('missions')
    .insert(mission)
    .select()
    .single();

  if (error) throw error;
  return data as Mission;
}

export async function updateMission(
  id: string,
  updates: Partial<Omit<Mission, 'id' | 'created_at'>>
) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('missions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Mission;
}

export async function deleteMission(id: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { error } = await supabase
    .from('missions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============================================================================
// VERSIONS
// ============================================================================

export async function getVersions(meetingId: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('meeting_versions')
    .select('*')
    .eq('meeting_id', meetingId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as MeetingVersion[];
}

export async function createVersion(
  version: Omit<MeetingVersion, 'id' | 'created_at'>
) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('meeting_versions')
    .insert(version)
    .select()
    .single();

  if (error) throw error;
  return data as MeetingVersion;
}

export async function getVersion(id: string) {
  if (!supabase) throw new Error('Supabase not initialized');

  const { data, error } = await supabase
    .from('meeting_versions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as MeetingVersion;
}
