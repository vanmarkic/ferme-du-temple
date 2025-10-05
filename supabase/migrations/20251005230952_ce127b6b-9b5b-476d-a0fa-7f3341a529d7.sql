-- Fix critical data exposure: Block all reads on inscriptions table
-- This prevents anyone from querying sensitive registration data
CREATE POLICY "Block all reads on inscriptions" 
ON inscriptions 
FOR SELECT 
USING (false);