-- Create discovered_tools table for AI-discovered tools
CREATE TABLE public.discovered_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  url TEXT NOT NULL,
  github_url TEXT,
  logo_url TEXT,
  screenshot_url TEXT,
  use_cases TEXT[] DEFAULT '{}',
  tech_stack_fit TEXT[] DEFAULT '{}',
  learning_curve TEXT CHECK (learning_curve IN ('low', 'medium', 'high')),
  community_activity TEXT CHECK (community_activity IN ('low', 'moderate', 'active', 'very-active')),
  ai_generated BOOLEAN DEFAULT true,
  approved BOOLEAN DEFAULT false,
  discovered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.discovered_tools ENABLE ROW LEVEL SECURITY;

-- Policy: All users can read approved tools
CREATE POLICY "Anyone can view approved tools"
  ON public.discovered_tools
  FOR SELECT
  USING (approved = true);

-- Policy: Authenticated users can insert discovered tools
CREATE POLICY "Authenticated users can insert discovered tools"
  ON public.discovered_tools
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = discovered_by);

-- Policy: Users can update their own discovered tools
CREATE POLICY "Users can update own discovered tools"
  ON public.discovered_tools
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = discovered_by);

-- Policy: Users can view their own unapproved tools
CREATE POLICY "Users can view own unapproved tools"
  ON public.discovered_tools
  FOR SELECT
  TO authenticated
  USING (auth.uid() = discovered_by);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_discovered_tools_updated_at
  BEFORE UPDATE ON public.discovered_tools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();