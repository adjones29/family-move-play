-- Create redeemed_rewards table
CREATE TABLE public.redeemed_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  reward_id TEXT NOT NULL,
  reward_title TEXT NOT NULL,
  reward_description TEXT,
  reward_cost INTEGER NOT NULL,
  reward_category TEXT NOT NULL,
  reward_rarity TEXT NOT NULL DEFAULT 'common',
  redeemed_by_members UUID[] NOT NULL,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  meta JSONB
);

-- Enable RLS
ALTER TABLE public.redeemed_rewards ENABLE ROW LEVEL SECURITY;

-- Allow family members to view their family's redeemed rewards
CREATE POLICY "redeemed_rewards_member_select"
ON public.redeemed_rewards
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM family_members fm
    WHERE fm.family_id = redeemed_rewards.family_id
    AND fm.user_id = auth.uid()
  )
);

-- Allow family members to insert redemptions
CREATE POLICY "redeemed_rewards_member_insert"
ON public.redeemed_rewards
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM family_members fm
    WHERE fm.family_id = redeemed_rewards.family_id
    AND fm.user_id = auth.uid()
  )
);

-- Allow family members to update status (mark as used/expired)
CREATE POLICY "redeemed_rewards_member_update"
ON public.redeemed_rewards
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM family_members fm
    WHERE fm.family_id = redeemed_rewards.family_id
    AND fm.user_id = auth.uid()
  )
);