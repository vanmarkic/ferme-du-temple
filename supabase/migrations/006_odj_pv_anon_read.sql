-- ODJ-PV: Allow anon role full access to tables
-- Authentication is enforced at the application level (Astro middleware)
-- This allows client-side components to read/write data after authentication

-- ============================================
-- MEETINGS
-- ============================================
DROP POLICY IF EXISTS "Anon users can read meetings" ON public.meetings;
CREATE POLICY "Anon users can read meetings"
  ON public.meetings FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Anon users can insert meetings" ON public.meetings;
CREATE POLICY "Anon users can insert meetings"
  ON public.meetings FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Anon users can update meetings" ON public.meetings;
CREATE POLICY "Anon users can update meetings"
  ON public.meetings FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon users can delete meetings" ON public.meetings;
CREATE POLICY "Anon users can delete meetings"
  ON public.meetings FOR DELETE TO anon USING (true);

-- ============================================
-- MEMBERS
-- ============================================
DROP POLICY IF EXISTS "Anon users can read members" ON public.members;
CREATE POLICY "Anon users can read members"
  ON public.members FOR SELECT TO anon USING (true);

-- ============================================
-- AGENDA ITEMS
-- ============================================
DROP POLICY IF EXISTS "Anon users can read agenda_items" ON public.agenda_items;
CREATE POLICY "Anon users can read agenda_items"
  ON public.agenda_items FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Anon users can insert agenda_items" ON public.agenda_items;
CREATE POLICY "Anon users can insert agenda_items"
  ON public.agenda_items FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Anon users can update agenda_items" ON public.agenda_items;
CREATE POLICY "Anon users can update agenda_items"
  ON public.agenda_items FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon users can delete agenda_items" ON public.agenda_items;
CREATE POLICY "Anon users can delete agenda_items"
  ON public.agenda_items FOR DELETE TO anon USING (true);

-- ============================================
-- MEMBER ROLES
-- ============================================
DROP POLICY IF EXISTS "Anon users can read member_roles" ON public.member_roles;
CREATE POLICY "Anon users can read member_roles"
  ON public.member_roles FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Anon users can insert member_roles" ON public.member_roles;
CREATE POLICY "Anon users can insert member_roles"
  ON public.member_roles FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Anon users can update member_roles" ON public.member_roles;
CREATE POLICY "Anon users can update member_roles"
  ON public.member_roles FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon users can delete member_roles" ON public.member_roles;
CREATE POLICY "Anon users can delete member_roles"
  ON public.member_roles FOR DELETE TO anon USING (true);

-- ============================================
-- DECISIONS
-- ============================================
DROP POLICY IF EXISTS "Anon users can read decisions" ON public.decisions;
CREATE POLICY "Anon users can read decisions"
  ON public.decisions FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Anon users can insert decisions" ON public.decisions;
CREATE POLICY "Anon users can insert decisions"
  ON public.decisions FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Anon users can update decisions" ON public.decisions;
CREATE POLICY "Anon users can update decisions"
  ON public.decisions FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon users can delete decisions" ON public.decisions;
CREATE POLICY "Anon users can delete decisions"
  ON public.decisions FOR DELETE TO anon USING (true);

-- ============================================
-- MISSIONS
-- ============================================
DROP POLICY IF EXISTS "Anon users can read missions" ON public.missions;
CREATE POLICY "Anon users can read missions"
  ON public.missions FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Anon users can insert missions" ON public.missions;
CREATE POLICY "Anon users can insert missions"
  ON public.missions FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Anon users can update missions" ON public.missions;
CREATE POLICY "Anon users can update missions"
  ON public.missions FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Anon users can delete missions" ON public.missions;
CREATE POLICY "Anon users can delete missions"
  ON public.missions FOR DELETE TO anon USING (true);

-- ============================================
-- MEETING VERSIONS
-- ============================================
DROP POLICY IF EXISTS "Anon users can read meeting_versions" ON public.meeting_versions;
CREATE POLICY "Anon users can read meeting_versions"
  ON public.meeting_versions FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Anon users can insert meeting_versions" ON public.meeting_versions;
CREATE POLICY "Anon users can insert meeting_versions"
  ON public.meeting_versions FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Anon users can delete meeting_versions" ON public.meeting_versions;
CREATE POLICY "Anon users can delete meeting_versions"
  ON public.meeting_versions FOR DELETE TO anon USING (true);
