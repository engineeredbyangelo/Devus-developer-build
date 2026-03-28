-- Fix: Prevent users from self-approving their own discovered tools
-- Drop the existing overly-permissive UPDATE policy
DROP POLICY IF EXISTS "Users can update own discovered tools" ON public.discovered_tools;

-- Recreate with a WITH CHECK that prevents changing 'approved' to true
CREATE POLICY "Users can update own discovered tools"
  ON public.discovered_tools
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = discovered_by)
  WITH CHECK (auth.uid() = discovered_by AND approved = false);