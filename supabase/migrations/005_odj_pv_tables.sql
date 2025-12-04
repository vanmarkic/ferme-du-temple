-- ODJ-PV (Ordre du Jour - Procès Verbal) Database Schema
-- Supabase/Postgres migration
-- Version: 005_odj_pv_tables
-- Date: 2025-12-04

-- ============================================
-- Rename admin_users to members and add fields
-- ============================================
-- Rename the table
ALTER TABLE IF EXISTS public.admin_users RENAME TO members;

-- Drop existing policies from admin_users
DROP POLICY IF EXISTS "Users can read own record" ON public.members;
DROP POLICY IF EXISTS "Super admins can insert" ON public.members;

-- Drop existing triggers
DROP TRIGGER IF EXISTS set_admin_users_updated_at ON public.members;

-- Drop existing index (will be recreated if needed)
DROP INDEX IF EXISTS public.idx_admin_users_email;

-- Add new columns for BEAVER member management
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Update name from email if not set (extract name before @)
UPDATE public.members SET name = split_part(email, '@', 1) WHERE name IS NULL;

-- Make name NOT NULL after populating
ALTER TABLE public.members ALTER COLUMN name SET NOT NULL;

-- Keep role column for auth (admin vs super_admin)
-- No changes needed - role column is preserved from admin_users

-- ============================================
-- Meetings Table
-- ============================================
-- Meeting events with status tracking

CREATE TABLE IF NOT EXISTS public.meetings (
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

CREATE TABLE IF NOT EXISTS public.member_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Agenda Items Table
-- ============================================
-- Items on the meeting agenda

CREATE TABLE IF NOT EXISTS public.agenda_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS public.meeting_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  snapshot_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Decisions Table
-- ============================================
-- Decisions made during meetings

CREATE TABLE IF NOT EXISTS public.decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  agenda_item_id UUID REFERENCES public.agenda_items(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  impact_level TEXT NOT NULL, -- long_term | medium_term | daily
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Missions Table
-- ============================================
-- Assigned missions/tasks

CREATE TABLE IF NOT EXISTS public.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  agenda_item_id UUID REFERENCES public.agenda_items(id) ON DELETE SET NULL,
  member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_member_roles_member ON public.member_roles(member_id);
CREATE INDEX IF NOT EXISTS idx_member_roles_meeting ON public.member_roles(meeting_id);
CREATE INDEX IF NOT EXISTS idx_agenda_items_meeting ON public.agenda_items(meeting_id);
CREATE INDEX IF NOT EXISTS idx_agenda_items_position ON public.agenda_items(meeting_id, position);
CREATE INDEX IF NOT EXISTS idx_meeting_versions_meeting ON public.meeting_versions(meeting_id);
CREATE INDEX IF NOT EXISTS idx_decisions_meeting ON public.decisions(meeting_id);
CREATE INDEX IF NOT EXISTS idx_decisions_agenda_item ON public.decisions(agenda_item_id);
CREATE INDEX IF NOT EXISTS idx_missions_meeting ON public.missions(meeting_id);
CREATE INDEX IF NOT EXISTS idx_missions_member ON public.missions(member_id);
CREATE INDEX IF NOT EXISTS idx_missions_agenda_item ON public.missions(agenda_item_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Members table RLS is already enabled (inherited from admin_users)
-- Enable RLS for new tables
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- Members policies (replacing old admin_users policies)
CREATE POLICY "Authenticated users can read members"
  ON public.members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert members"
  ON public.members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update members"
  ON public.members FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete members"
  ON public.members FOR DELETE
  TO authenticated
  USING (true);

-- Meetings policies
CREATE POLICY "Authenticated users can read meetings"
  ON public.meetings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert meetings"
  ON public.meetings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update meetings"
  ON public.meetings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete meetings"
  ON public.meetings FOR DELETE
  TO authenticated
  USING (true);

-- Member roles policies
CREATE POLICY "Authenticated users can read member_roles"
  ON public.member_roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert member_roles"
  ON public.member_roles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update member_roles"
  ON public.member_roles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete member_roles"
  ON public.member_roles FOR DELETE
  TO authenticated
  USING (true);

-- Agenda items policies
CREATE POLICY "Authenticated users can read agenda_items"
  ON public.agenda_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert agenda_items"
  ON public.agenda_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update agenda_items"
  ON public.agenda_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete agenda_items"
  ON public.agenda_items FOR DELETE
  TO authenticated
  USING (true);

-- Meeting versions policies
CREATE POLICY "Authenticated users can read meeting_versions"
  ON public.meeting_versions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert meeting_versions"
  ON public.meeting_versions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete meeting_versions"
  ON public.meeting_versions FOR DELETE
  TO authenticated
  USING (true);

-- Decisions policies
CREATE POLICY "Authenticated users can read decisions"
  ON public.decisions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert decisions"
  ON public.decisions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update decisions"
  ON public.decisions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete decisions"
  ON public.decisions FOR DELETE
  TO authenticated
  USING (true);

-- Missions policies
CREATE POLICY "Authenticated users can read missions"
  ON public.missions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert missions"
  ON public.missions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update missions"
  ON public.missions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete missions"
  ON public.missions FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Auto-update timestamp trigger
-- ============================================

-- Reuse the existing update_updated_at function from previous migrations
-- Create trigger for meetings table
CREATE TRIGGER meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Note: members table already has its trigger (inherited from admin_users)
-- but we need to recreate it with the new table name
DROP TRIGGER IF EXISTS set_members_updated_at ON public.members;
CREATE TRIGGER set_members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
