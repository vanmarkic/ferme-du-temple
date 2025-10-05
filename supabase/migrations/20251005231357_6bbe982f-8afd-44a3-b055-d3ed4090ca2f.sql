-- Block all updates on inscriptions table
CREATE POLICY "Block all updates on inscriptions" 
ON public.inscriptions 
FOR UPDATE 
USING (false);

-- Block all deletes on inscriptions table
CREATE POLICY "Block all deletes on inscriptions"
ON public.inscriptions
FOR DELETE
USING (false);