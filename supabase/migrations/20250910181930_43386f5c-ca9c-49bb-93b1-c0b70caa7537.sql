-- Create step_entries table for tracking daily steps by family member
CREATE TABLE public.step_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id TEXT NOT NULL,
  date DATE NOT NULL,
  steps INTEGER NOT NULL DEFAULT 0 CHECK (steps >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index to prevent duplicate entries for same member/date
CREATE UNIQUE INDEX idx_step_entries_member_date ON public.step_entries (member_id, date);

-- Create index for efficient queries by member_id
CREATE INDEX idx_step_entries_member_id ON public.step_entries (member_id);

-- Create index for efficient date range queries
CREATE INDEX idx_step_entries_date ON public.step_entries (date);

-- Enable Row Level Security
ALTER TABLE public.step_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for step_entries
-- Users can view all step entries (family app, so everyone can see family data)
CREATE POLICY "Allow read access to step entries" 
ON public.step_entries 
FOR SELECT 
USING (true);

-- Users can insert step entries (when authenticated)
CREATE POLICY "Allow insert access to step entries" 
ON public.step_entries 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update step entries (when authenticated)
CREATE POLICY "Allow update access to step entries" 
ON public.step_entries 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_step_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_step_entries_updated_at
  BEFORE UPDATE ON public.step_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_step_entries_updated_at();