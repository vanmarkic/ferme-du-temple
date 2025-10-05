-- Phase 1: Fix Critical Data Insertion Vulnerability
-- This migration removes the dangerous public insert policy on the inscriptions table
-- and forces all submissions to go through the rate-limited edge function

-- Step 1: Drop the dangerous public insert policy
DROP POLICY IF EXISTS "Allow public inserts" ON public.inscriptions;

-- Step 2: Create a restrictive policy that blocks all client-side inserts
-- Only the edge function using SUPABASE_SERVICE_ROLE_KEY can insert data
CREATE POLICY "Block all client inserts on inscriptions"
ON public.inscriptions
FOR INSERT
TO public
WITH CHECK (false);

-- Step 3: Add comments to document the security model
COMMENT ON TABLE public.inscriptions IS 'User inscription data. All access is restricted by RLS. Insertions must go through the submit-inscription edge function which enforces rate limiting and validation.';
COMMENT ON POLICY "Block all client inserts on inscriptions" ON public.inscriptions IS 'Blocks all direct client-side inserts. Data must be submitted through the submit-inscription edge function which uses the service role key and enforces rate limiting.';
COMMENT ON POLICY "Block all reads on inscriptions" ON public.inscriptions IS 'Prevents clients from reading inscription data. Only server-side operations with service role key can access this data.';
COMMENT ON POLICY "Block all updates on inscriptions" ON public.inscriptions IS 'Prevents clients from modifying inscription data. Data is immutable after creation.';
COMMENT ON POLICY "Block all deletes on inscriptions" ON public.inscriptions IS 'Prevents clients from deleting inscription data. Only server-side operations can manage data lifecycle.';

-- Similarly, document the inscription_attempts table security model
COMMENT ON TABLE public.inscription_attempts IS 'Tracks inscription submission attempts for rate limiting. Only accessible by edge functions using service role key.';
COMMENT ON POLICY "Block all client inserts on inscription_attempts" ON public.inscription_attempts IS 'Rate limiting data is managed exclusively by the submit-inscription edge function.';
COMMENT ON POLICY "Block all client reads on inscription_attempts" ON public.inscription_attempts IS 'Rate limiting data is internal to the edge function logic.';
COMMENT ON POLICY "Block all client updates on inscription_attempts" ON public.inscription_attempts IS 'Rate limiting records are immutable.';
COMMENT ON POLICY "Block all client deletes on inscription_attempts" ON public.inscription_attempts IS 'Old attempts are cleaned up by the cleanup_old_inscription_attempts() function.';