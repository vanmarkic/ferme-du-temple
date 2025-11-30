-- Create inscriptions table for form submissions
CREATE TABLE IF NOT EXISTS public.inscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  motivation TEXT NOT NULL,
  besoins_specifiques TEXT,
  infos_prioritaires TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_inscriptions_email ON public.inscriptions(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_inscriptions_created_at ON public.inscriptions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.inscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public inserts only (form submissions)
CREATE POLICY "Allow public inserts" ON public.inscriptions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users to read all records (for admin dashboard later)
CREATE POLICY "Allow authenticated reads" ON public.inscriptions
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.inscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add comment for documentation
COMMENT ON TABLE public.inscriptions IS 'Form submissions from the inscription form on Ferme du Temple website';
