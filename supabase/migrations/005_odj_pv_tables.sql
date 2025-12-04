-- ODJ-PV (Ordre du Jour - Procès Verbal) Database Schema
-- Supabase/Postgres migration
-- Version: 005_odj_pv_tables
-- Date: 2025-12-04
-- IDEMPOTENT: Can be run multiple times safely

-- ============================================
-- Handle admin_users → members migration
-- ============================================
-- Check if admin_users exists and members doesn't, then rename
-- Otherwise ensure members table exists with correct structure

DO $$
BEGIN
  -- If admin_users exists and members doesn't, rename it
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_users')
     AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'members') THEN
    ALTER TABLE public.admin_users RENAME TO members;
    RAISE NOTICE 'Renamed admin_users to members';
  END IF;

  -- If members still doesn't exist (fresh install), create it
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'members') THEN
    CREATE TABLE public.members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    RAISE NOTICE 'Created new members table';
  END IF;

  -- Add columns if they don't exist (for renamed table)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'members' AND column_name = 'name') THEN
    ALTER TABLE public.members ADD COLUMN name TEXT;
    UPDATE public.members SET name = split_part(email, '@', 1) WHERE name IS NULL;
    ALTER TABLE public.members ALTER COLUMN name SET NOT NULL;
    RAISE NOTICE 'Added name column to members';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'members' AND column_name = 'active') THEN
    ALTER TABLE public.members ADD COLUMN active BOOLEAN DEFAULT true;
    RAISE NOTICE 'Added active column to members';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'members' AND column_name = 'role') THEN
    ALTER TABLE public.members ADD COLUMN role TEXT DEFAULT 'admin';
    RAISE NOTICE 'Added role column to members';
  END IF;

  -- If both tables exist, copy data from admin_users to members (for cases where migration ran partially)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_users')
     AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'members') THEN
    -- Copy users that don't exist in members yet
    INSERT INTO public.members (id, email, name, role, active, created_at, updated_at)
    SELECT
      au.id,
      au.email,
      COALESCE(au.name, split_part(au.email, '@', 1)),
      COALESCE(au.role, 'admin'),
      COALESCE(au.active, true),
      au.created_at,
      COALESCE(au.updated_at, au.created_at)
    FROM public.admin_users au
    WHERE NOT EXISTS (SELECT 1 FROM public.members m WHERE m.id = au.id)
    ON CONFLICT (email) DO NOTHING;
    RAISE NOTICE 'Copied users from admin_users to members';
  END IF;
END $$;

-- Drop old policies and triggers (safe if they don't exist)
DROP POLICY IF EXISTS "Users can read own record" ON public.members;
DROP POLICY IF EXISTS "Super admins can insert" ON public.members;
DROP TRIGGER IF EXISTS set_admin_users_updated_at ON public.members;
DROP INDEX IF EXISTS public.idx_admin_users_email;

-- ============================================
-- Meetings Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  what_to_bring TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Member Roles Table (meeting role history)
-- ============================================
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
-- Meeting Versions Table (autosave snapshots)
-- ============================================
CREATE TABLE IF NOT EXISTS public.meeting_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  snapshot_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Decisions Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  agenda_item_id UUID REFERENCES public.agenda_items(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  impact_level TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Missions Table
-- ============================================
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
-- Indexes (IF NOT EXISTS is supported)
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
-- Enable RLS on all tables
-- ============================================
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies (DROP + CREATE for idempotence)
-- ============================================

-- Members policies
DROP POLICY IF EXISTS "Authenticated users can read members" ON public.members;
CREATE POLICY "Authenticated users can read members"
  ON public.members FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert members" ON public.members;
CREATE POLICY "Authenticated users can insert members"
  ON public.members FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update members" ON public.members;
CREATE POLICY "Authenticated users can update members"
  ON public.members FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete members" ON public.members;
CREATE POLICY "Authenticated users can delete members"
  ON public.members FOR DELETE TO authenticated USING (true);

-- Meetings policies
DROP POLICY IF EXISTS "Authenticated users can read meetings" ON public.meetings;
CREATE POLICY "Authenticated users can read meetings"
  ON public.meetings FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert meetings" ON public.meetings;
CREATE POLICY "Authenticated users can insert meetings"
  ON public.meetings FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update meetings" ON public.meetings;
CREATE POLICY "Authenticated users can update meetings"
  ON public.meetings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete meetings" ON public.meetings;
CREATE POLICY "Authenticated users can delete meetings"
  ON public.meetings FOR DELETE TO authenticated USING (true);

-- Member roles policies
DROP POLICY IF EXISTS "Authenticated users can read member_roles" ON public.member_roles;
CREATE POLICY "Authenticated users can read member_roles"
  ON public.member_roles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert member_roles" ON public.member_roles;
CREATE POLICY "Authenticated users can insert member_roles"
  ON public.member_roles FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update member_roles" ON public.member_roles;
CREATE POLICY "Authenticated users can update member_roles"
  ON public.member_roles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete member_roles" ON public.member_roles;
CREATE POLICY "Authenticated users can delete member_roles"
  ON public.member_roles FOR DELETE TO authenticated USING (true);

-- Agenda items policies
DROP POLICY IF EXISTS "Authenticated users can read agenda_items" ON public.agenda_items;
CREATE POLICY "Authenticated users can read agenda_items"
  ON public.agenda_items FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert agenda_items" ON public.agenda_items;
CREATE POLICY "Authenticated users can insert agenda_items"
  ON public.agenda_items FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update agenda_items" ON public.agenda_items;
CREATE POLICY "Authenticated users can update agenda_items"
  ON public.agenda_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete agenda_items" ON public.agenda_items;
CREATE POLICY "Authenticated users can delete agenda_items"
  ON public.agenda_items FOR DELETE TO authenticated USING (true);

-- Meeting versions policies
DROP POLICY IF EXISTS "Authenticated users can read meeting_versions" ON public.meeting_versions;
CREATE POLICY "Authenticated users can read meeting_versions"
  ON public.meeting_versions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert meeting_versions" ON public.meeting_versions;
CREATE POLICY "Authenticated users can insert meeting_versions"
  ON public.meeting_versions FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete meeting_versions" ON public.meeting_versions;
CREATE POLICY "Authenticated users can delete meeting_versions"
  ON public.meeting_versions FOR DELETE TO authenticated USING (true);

-- Decisions policies
DROP POLICY IF EXISTS "Authenticated users can read decisions" ON public.decisions;
CREATE POLICY "Authenticated users can read decisions"
  ON public.decisions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert decisions" ON public.decisions;
CREATE POLICY "Authenticated users can insert decisions"
  ON public.decisions FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update decisions" ON public.decisions;
CREATE POLICY "Authenticated users can update decisions"
  ON public.decisions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete decisions" ON public.decisions;
CREATE POLICY "Authenticated users can delete decisions"
  ON public.decisions FOR DELETE TO authenticated USING (true);

-- Missions policies
DROP POLICY IF EXISTS "Authenticated users can read missions" ON public.missions;
CREATE POLICY "Authenticated users can read missions"
  ON public.missions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert missions" ON public.missions;
CREATE POLICY "Authenticated users can insert missions"
  ON public.missions FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update missions" ON public.missions;
CREATE POLICY "Authenticated users can update missions"
  ON public.missions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete missions" ON public.missions;
CREATE POLICY "Authenticated users can delete missions"
  ON public.missions FOR DELETE TO authenticated USING (true);

-- ============================================
-- Triggers (DROP + CREATE for idempotence)
-- ============================================

-- Create update_updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Meetings trigger
DROP TRIGGER IF EXISTS meetings_updated_at ON public.meetings;
CREATE TRIGGER meetings_updated_at
  BEFORE UPDATE ON public.meetings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Members trigger
DROP TRIGGER IF EXISTS members_updated_at ON public.members;
CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
