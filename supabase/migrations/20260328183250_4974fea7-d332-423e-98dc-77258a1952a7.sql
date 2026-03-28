CREATE OR REPLACE FUNCTION public.prevent_self_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.approved = true AND OLD.approved = false THEN
    IF auth.uid() = NEW.discovered_by THEN
      RAISE EXCEPTION 'Users cannot approve their own tools';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_self_approval_trigger
  BEFORE UPDATE ON public.discovered_tools
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_self_approval();