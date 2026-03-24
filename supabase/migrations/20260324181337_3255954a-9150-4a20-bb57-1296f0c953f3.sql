
-- Remove overly permissive INSERT and UPDATE policies on weekly_tools_cache
-- Cache writes should only happen via edge functions using service role key (which bypasses RLS)
DROP POLICY IF EXISTS "Authenticated users can update weekly tools cache" ON public.weekly_tools_cache;
DROP POLICY IF EXISTS "Authenticated users can upsert weekly tools cache" ON public.weekly_tools_cache;
