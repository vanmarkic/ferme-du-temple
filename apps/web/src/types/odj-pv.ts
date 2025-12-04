// Meeting statuses
export type MeetingStatus = 'draft' | 'odj_ready' | 'in_progress' | 'finalized';

// Decision impact levels
export type ImpactLevel = 'long_term' | 'medium_term' | 'daily';

// Role types for rotation
export type RoleType = 'president' | 'secretaire' | 'parole' | 'temps' | 'serpent' | 'plage';

// Member
export interface Member {
  id: string;
  name: string;
  email: string | null;
  active: boolean;
  created_at: string;
}

// Meeting
export interface Meeting {
  id: string;
  title: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  what_to_bring: string | null;
  status: MeetingStatus;
  created_at: string;
  updated_at: string;
}

// MemberRole (for role history)
export interface MemberRole {
  id: string;
  member_id: string;
  meeting_id: string;
  role: RoleType;
  created_at: string;
}

// AgendaItem
export interface AgendaItem {
  id: string;
  meeting_id: string;
  position: number;
  title: string;
  responsible: string | null;
  duration_minutes: number;
  methodology: string | null;
  notes: string | null;
  created_at: string;
}

// MeetingVersion (for autosave snapshots)
export interface MeetingVersion {
  id: string;
  meeting_id: string;
  snapshot_json: MeetingSnapshot;
  created_at: string;
}

// Snapshot structure for versioning
export interface MeetingSnapshot {
  meeting: Meeting;
  agendaItems: AgendaItem[];
  roles: MemberRole[];
  decisions: Decision[];
  missions: Mission[];
}

// Decision
export interface Decision {
  id: string;
  meeting_id: string;
  agenda_item_id: string | null;
  content: string;
  impact_level: ImpactLevel;
  created_at: string;
}

// Mission
export interface Mission {
  id: string;
  meeting_id: string;
  agenda_item_id: string | null;
  member_id: string | null;
  description: string;
  email_sent: boolean;
  email_sent_at: string | null;
  created_at: string;
}

// Role labels in French
export const ROLE_LABELS: Record<RoleType, string> = {
  president: 'Président.e(s)',
  secretaire: 'Secrétaire',
  parole: 'Gestionnaire de la parole',
  temps: 'Maître.sse du temps',
  serpent: 'Serpent',
  plage: 'Plage'
};

// Impact level labels in French
export const IMPACT_LABELS: Record<ImpactLevel, string> = {
  long_term: 'Long terme',
  medium_term: 'Moyen terme',
  daily: 'Quotidien'
};

// Role suggestion result
export interface RoleSuggestion {
  role: RoleType;
  member_id: string;
  gap: number; // Number of meetings since last occurrence, Infinity if never
  warning: boolean; // True if gap is 0 or 1
}
