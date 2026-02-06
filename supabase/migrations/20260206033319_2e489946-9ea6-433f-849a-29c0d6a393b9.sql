-- Allow authenticated users to insert/update the weekly tools cache
CREATE POLICY "Authenticated users can upsert weekly tools cache"
  ON public.weekly_tools_cache FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update weekly tools cache"
  ON public.weekly_tools_cache FOR UPDATE
  TO authenticated
  USING (true);