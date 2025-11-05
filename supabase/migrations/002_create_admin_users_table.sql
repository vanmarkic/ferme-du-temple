-- Create admin_users table for admin authentication
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read their own record
CREATE POLICY "Users can read own record" ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Only super_admins can insert new admin users
CREATE POLICY "Super admins can insert" ON public.admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Trigger to automatically update updated_at
CREATE TRIGGER set_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Update inscriptions policy to be more restrictive (only admins can read)
DROP POLICY IF EXISTS "Allow authenticated reads" ON public.inscriptions;

CREATE POLICY "Only admins can read inscriptions" ON public.inscriptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
    )
  );

-- Add comment for documentation
COMMENT ON TABLE public.admin_users IS 'Admin users who can access the inscription dashboard on Ferme du Temple website';
