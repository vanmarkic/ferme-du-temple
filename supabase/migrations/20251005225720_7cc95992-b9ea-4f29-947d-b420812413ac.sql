-- Create inscriptions table to store form submissions
CREATE TABLE public.inscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  prenom text NOT NULL,
  email text NOT NULL,
  telephone text,
  motivation text NOT NULL,
  besoins_specifiques text,
  newsletter boolean DEFAULT false,
  rencontre boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (form submissions)
CREATE POLICY "Allow public inserts" 
ON public.inscriptions 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Create index on email for faster lookups
CREATE INDEX idx_inscriptions_email ON public.inscriptions(email);

-- Create index on created_at for sorting
CREATE INDEX idx_inscriptions_created_at ON public.inscriptions(created_at DESC);