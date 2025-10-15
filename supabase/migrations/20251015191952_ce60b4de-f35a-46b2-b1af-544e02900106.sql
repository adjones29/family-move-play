-- Create points_ledger table to track all point transactions
CREATE TABLE IF NOT EXISTS public.points_ledger (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id uuid NOT NULL REFERENCES public.family_members(id) ON DELETE CASCADE,
  delta integer NOT NULL,
  source text NOT NULL,
  meta jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.points_ledger ENABLE ROW LEVEL SECURITY;

-- RLS policies for points_ledger
CREATE POLICY "points_ledger_member_select"
  ON public.points_ledger
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      WHERE fm.id = points_ledger.member_id
      AND is_family_member(auth.uid(), fm.family_id)
    )
  );

CREATE POLICY "points_ledger_authenticated_insert"
  ON public.points_ledger
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.family_members fm
      WHERE fm.id = points_ledger.member_id
      AND is_family_member(auth.uid(), fm.family_id)
    )
  );

-- Create view for member point balances
CREATE OR REPLACE VIEW public.v_points_balances AS
  SELECT 
    pl.member_id, 
    COALESCE(SUM(pl.delta), 0) as points
  FROM public.points_ledger pl
  GROUP BY pl.member_id;

-- Create view for family point totals
CREATE OR REPLACE VIEW public.v_points_family_totals AS
  SELECT 
    fm.family_id, 
    COALESCE(SUM(vpb.points), 0) as points
  FROM public.family_members fm
  LEFT JOIN public.v_points_balances vpb ON vpb.member_id = fm.id
  GROUP BY fm.family_id;

-- Enable realtime for points_ledger
ALTER TABLE public.points_ledger REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.points_ledger;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_points_ledger_member_id ON public.points_ledger(member_id);
CREATE INDEX IF NOT EXISTS idx_points_ledger_created_at ON public.points_ledger(created_at DESC);