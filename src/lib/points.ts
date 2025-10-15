import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export async function awardPoints({ 
  memberId, 
  delta, 
  source, 
  meta 
}: { 
  memberId: string; 
  delta: number; 
  source: string; 
  meta?: any 
}) {
  const { error } = await supabase
    .from('points_ledger')
    .insert({ 
      member_id: memberId, 
      delta, 
      source, 
      meta 
    });
  
  if (error) throw error;
}

export function useFamilyPoints(familyId?: string) {
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!familyId) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const refresh = async () => {
      try {
        const { data, error } = await supabase
          .from('v_points_family_totals')
          .select('points')
          .eq('family_id', familyId)
          .maybeSingle();

        if (error) throw error;
        
        if (mounted) {
          setPoints(data?.points ?? 0);
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Error fetching family points:', error);
        if (mounted) {
          toast({
            title: "Error loading points",
            description: error.message,
            variant: "destructive",
          });
          setLoading(false);
        }
      }
    };

    refresh();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`points:family:${familyId}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'points_ledger' 
        },
        () => {
          refresh();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [familyId]);

  return { points, loading };
}

export const formatPts = (n: number) => `${(n ?? 0).toLocaleString()} pts`;

interface MemberBalance {
  member_id: string;
  points: number;
}

export async function deductPoints({ 
  memberId, 
  delta, 
  source, 
  meta 
}: { 
  memberId: string; 
  delta: number; 
  source: string; 
  meta?: any 
}) {
  const { error } = await supabase
    .from('points_ledger')
    .insert({ 
      member_id: memberId, 
      delta: -Math.abs(delta), // Ensure it's negative
      source, 
      meta 
    });
  
  if (error) throw error;
}

export async function redeemFamilyReward({
  familyId,
  rewardId,
  rewardTitle,
  rewardDescription,
  rewardCost,
  rewardCategory,
  rewardRarity
}: {
  familyId: string;
  rewardId: string;
  rewardTitle: string;
  rewardDescription?: string;
  rewardCost: number;
  rewardCategory: string;
  rewardRarity: string;
}): Promise<{ 
  success: boolean; 
  message: string; 
  deductions?: Array<{memberId: string; amount: number}>;
  redeemedRewardId?: string;
}> {
  // Fetch all family members with their balances
  const { data: members, error: membersError } = await supabase
    .from('family_members')
    .select('id')
    .eq('family_id', familyId);

  if (membersError || !members) {
    throw membersError || new Error('Could not fetch family members');
  }

  const { data: balances, error: balancesError } = await supabase
    .from('v_points_balances')
    .select('member_id, points')
    .in('member_id', members.map(m => m.id));

  if (balancesError) throw balancesError;

  // Create a map of member balances
  const memberBalances: MemberBalance[] = members.map(m => ({
    member_id: m.id,
    points: balances?.find(b => b.member_id === m.id)?.points || 0
  }));

  // Calculate total available points
  const totalPoints = memberBalances.reduce((sum, m) => sum + m.points, 0);
  
  if (totalPoints < rewardCost) {
    return {
      success: false,
      message: `Insufficient family points. Need ${rewardCost}, have ${totalPoints}`
    };
  }

  // Cascading deduction algorithm
  let remainingCost = rewardCost;
  const deductions: Array<{memberId: string; amount: number}> = [];
  const activeMembers = [...memberBalances].sort((a, b) => b.points - a.points);

  while (remainingCost > 0 && activeMembers.length > 0) {
    const costPerMember = Math.ceil(remainingCost / activeMembers.length);
    const newRemainingCost = remainingCost;
    
    for (let i = activeMembers.length - 1; i >= 0; i--) {
      const member = activeMembers[i];
      const deduction = Math.min(member.points, costPerMember);
      
      if (deduction > 0) {
        deductions.push({ memberId: member.member_id, amount: deduction });
        member.points -= deduction;
        remainingCost -= deduction;
      }
      
      if (member.points === 0) {
        activeMembers.splice(i, 1);
      }
    }
    
    // Prevent infinite loop
    if (newRemainingCost === remainingCost) break;
  }

  if (remainingCost > 0) {
    return {
      success: false,
      message: 'Unable to distribute cost across family members'
    };
  }

  // Apply deductions
  for (const deduction of deductions) {
    await deductPoints({
      memberId: deduction.memberId,
      delta: deduction.amount,
      source: 'reward_redemption',
      meta: { rewardId, rewardTitle, category: rewardCategory }
    });
  }

  // Record the redeemed reward
  const { data: redeemedReward, error: redeemError } = await supabase
    .from('redeemed_rewards')
    .insert({
      family_id: familyId,
      reward_id: rewardId,
      reward_title: rewardTitle,
      reward_description: rewardDescription,
      reward_cost: rewardCost,
      reward_category: rewardCategory,
      reward_rarity: rewardRarity,
      redeemed_by_members: deductions.map(d => d.memberId),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    })
    .select()
    .single();

  if (redeemError) throw redeemError;

  return {
    success: true,
    message: `Redeemed ${rewardTitle}`,
    deductions,
    redeemedRewardId: redeemedReward.id
  };
}

export async function redeemIndividualReward({
  familyId,
  rewardId,
  rewardTitle,
  rewardDescription,
  rewardCost,
  rewardCategory,
  rewardRarity,
  memberIds
}: {
  familyId: string;
  rewardId: string;
  rewardTitle: string;
  rewardDescription?: string;
  rewardCost: number;
  rewardCategory: string;
  rewardRarity: string;
  memberIds: string[];
}): Promise<{ success: boolean; message: string; redeemedRewardId?: string }> {
  // Fetch balances for selected members
  const { data: balances, error: balancesError } = await supabase
    .from('v_points_balances')
    .select('member_id, points')
    .in('member_id', memberIds);

  if (balancesError) throw balancesError;

  // Check if all selected members can afford it
  const insufficientMembers = memberIds.filter(id => {
    const balance = balances?.find(b => b.member_id === id)?.points || 0;
    return balance < rewardCost;
  });

  if (insufficientMembers.length > 0) {
    return {
      success: false,
      message: 'Some selected members have insufficient points'
    };
  }

  // Deduct from each member
  for (const memberId of memberIds) {
    await deductPoints({
      memberId,
      delta: rewardCost,
      source: 'reward_redemption',
      meta: { rewardId, rewardTitle, category: rewardCategory }
    });
  }

  // Record the redeemed reward
  const { data: redeemedReward, error: redeemError } = await supabase
    .from('redeemed_rewards')
    .insert({
      family_id: familyId,
      reward_id: rewardId,
      reward_title: rewardTitle,
      reward_description: rewardDescription,
      reward_cost: rewardCost,
      reward_category: rewardCategory,
      reward_rarity: rewardRarity,
      redeemed_by_members: memberIds,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    })
    .select()
    .single();

  if (redeemError) throw redeemError;

  return {
    success: true,
    message: `Redeemed ${rewardTitle} for ${memberIds.length} member(s)`,
    redeemedRewardId: redeemedReward.id
  };
}
