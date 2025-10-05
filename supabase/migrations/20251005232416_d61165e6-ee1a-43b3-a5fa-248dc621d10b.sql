-- Create table to track inscription submission attempts for rate limiting
CREATE TABLE public.inscription_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  email TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inscription_attempts ENABLE ROW LEVEL SECURITY;

-- Block all client access (only edge functions can access)
CREATE POLICY "Block all client reads on inscription_attempts"
ON public.inscription_attempts
FOR SELECT
USING (false);

CREATE POLICY "Block all client inserts on inscription_attempts"
ON public.inscription_attempts
FOR INSERT
WITH CHECK (false);

CREATE POLICY "Block all client updates on inscription_attempts"
ON public.inscription_attempts
FOR UPDATE
USING (false);

CREATE POLICY "Block all client deletes on inscription_attempts"
ON public.inscription_attempts
FOR DELETE
USING (false);

-- Create index for faster lookups
CREATE INDEX idx_inscription_attempts_ip_time ON public.inscription_attempts(ip_address, attempted_at DESC);
CREATE INDEX idx_inscription_attempts_email_time ON public.inscription_attempts(email, attempted_at DESC);

-- Create function to clean up old attempts (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_inscription_attempts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.inscription_attempts 
  WHERE attempted_at < now() - interval '24 hours';
END;
$$;