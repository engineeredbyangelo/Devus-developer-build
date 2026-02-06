-- Create table for caching weekly tool discoveries
CREATE TABLE public.weekly_tools_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start_date DATE UNIQUE NOT NULL,
  tools_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.weekly_tools_cache ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the cached tools (public data)
CREATE POLICY "Anyone can read weekly tools cache"
  ON public.weekly_tools_cache FOR SELECT
  USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_weekly_tools_cache_updated_at
  BEFORE UPDATE ON public.weekly_tools_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();