-- Enable realtime for step_entries with full row data
ALTER TABLE public.step_entries REPLICA IDENTITY FULL;

-- Add step_entries to supabase_realtime publication if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'step_entries'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.step_entries';
  END IF;
END
$$;