-- Block anonymous access to profiles table
-- This ensures only authenticated users can access profile data
CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Also add explicit authenticated-only policy
CREATE POLICY "Authenticated users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);