-- ODJ-PV (Ordre du Jour - Procès Verbal) Database Schema
-- Supabase/Postgres migration
-- Version: 005_odj_pv_tables
-- Date: 2025-12-04

-- ============================================
-- Members Table
-- ============================================
-- BEAVER members (active participants)

CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Meetings Table
-- ============================================
-- Meeting events with status tracking

CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  what_to_bring TEXT,
  status TEXT DEFAULT 'draft', -- draft | odj_ready | in_progress | finalized
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Member Roles Table
-- ============================================
-- Historical role assignments (for max gap rule)

CREATE TABLE IF NOT EXISTS member_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Agenda Items Table
-- ============================================
-- Items on the meeting agenda

CREATE TABLE IF NOT EXISTS agenda_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  title TEXT NOT NULL,
  responsible TEXT,
  duration_minutes INTEGER DEFAULT 5,
  methodology TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Meeting Versions Table
-- ============================================
-- Automatic snapshots for recovery

CREATE TABLE IF NOT EXISTS meeting_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  snapshot_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Decisions Table
-- ============================================
-- Decisions made during meetings

CREATE TABLE IF NOT EXISTS decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  agenda_item_id UUID REFERENCES agenda_items(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  impact_level TEXT NOT NULL, -- long_term | medium_term | daily
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Missions Table
-- ============================================
-- Assigned missions/tasks

CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  agenda_item_id UUID REFERENCES agenda_items(id) ON DELETE SET NULL,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_member_roles_member ON member_roles(member_id);
CREATE INDEX IF NOT EXISTS idx_member_roles_meeting ON member_roles(meeting_id);
CREATE INDEX IF NOT EXISTS idx_agenda_items_meeting ON agenda_items(meeting_id);
CREATE INDEX IF NOT EXISTS idx_agenda_items_position ON agenda_items(meeting_id, position);
CREATE INDEX IF NOT EXISTS idx_meeting_versions_meeting ON meeting_versions(meeting_id);
CREATE INDEX IF NOT EXISTS idx_decisions_meeting ON decisions(meeting_id);
CREATE INDEX IF NOT EXISTS idx_decisions_agenda_item ON decisions(agenda_item_id);
CREATE INDEX IF NOT EXISTS idx_missions_meeting ON missions(meeting_id);
CREATE INDEX IF NOT EXISTS idx_missions_member ON missions(member_id);
CREATE INDEX IF NOT EXISTS idx_missions_agenda_item ON missions(agenda_item_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- Members policies
CREATE POLICY "Authenticated users can read members"
  ON members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert members"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update members"
  ON members FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete members"
  ON members FOR DELETE
  TO authenticated
  USING (true);

-- Meetings policies
CREATE POLICY "Authenticated users can read meetings"
  ON meetings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert meetings"
  ON meetings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update meetings"
  ON meetings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete meetings"
  ON meetings FOR DELETE
  TO authenticated
  USING (true);

-- Member roles policies
CREATE POLICY "Authenticated users can read member_roles"
  ON member_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert member_roles"
  ON member_roles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update member_roles"
  ON member_roles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete member_roles"
  ON member_roles FOR DELETE
  TO authenticated
  USING (true);

-- Agenda items policies
CREATE POLICY "Authenticated users can read agenda_items"
  ON agenda_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert agenda_items"
  ON agenda_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update agenda_items"
  ON agenda_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete agenda_items"
  ON agenda_items FOR DELETE
  TO authenticated
  USING (true);

-- Meeting versions policies
CREATE POLICY "Authenticated users can read meeting_versions"
  ON meeting_versions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert meeting_versions"
  ON meeting_versions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete meeting_versions"
  ON meeting_versions FOR DELETE
  TO authenticated
  USING (true);

-- Decisions policies
CREATE POLICY "Authenticated users can read decisions"
  ON decisions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert decisions"
  ON decisions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update decisions"
  ON decisions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete decisions"
  ON decisions FOR DELETE
  TO authenticated
  USING (true);

-- Missions policies
CREATE POLICY "Authenticated users can read missions"
  ON missions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert missions"
  ON missions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update missions"
  ON missions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete missions"
  ON missions FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Auto-update timestamp trigger
-- ============================================

-- Reuse the existing update_updated_at function from previous migrations
-- Create trigger for meetings table
CREATE TRIGGER meetings_updated_at
  BEFORE UPDATE ON meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
