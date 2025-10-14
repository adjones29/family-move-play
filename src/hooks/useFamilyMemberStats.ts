import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface FamilyMemberStats {
  member_id: string;
  user_id: string | null;
  family_id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string;
  status: string;
  points_total: number;
  daily_steps: number;
  daily_goal: number;
  weekly_steps: number;
  weekly_goal: number;
  weekly_score: number;
}

const memberColors = ["member-1", "member-2", "member-3", "member-4"] as const;

export const useFamilyMemberStats = () => {
  const [stats, setStats] = useState<FamilyMemberStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchStats = async () => {
    if (!user) {
      setStats([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('family_member_stats')
        .select('*')
        .order('role', { ascending: false }); // Parents first

      if (error) throw error;
      
      setStats(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching family member stats:', err);
      setError(err);
      toast({
        title: "Error loading family stats",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('family_stats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'family_members'
        },
        () => {
          fetchStats();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'step_entries'
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Transform stats to match existing component interface
  const transformedMembers = stats.map((stat, index) => ({
    name: stat.display_name || 'Family Member',
    avatar: stat.avatar_url || '',
    dailySteps: stat.daily_steps,
    stepGoal: stat.daily_goal,
    weeklyScore: stat.weekly_score,
    memberColor: memberColors[index % memberColors.length],
    points: stat.points_total,
    weeklySteps: stat.weekly_steps,
    weeklyGoal: stat.weekly_goal,
    member_id: stat.member_id,
    user_id: stat.user_id,
  }));

  return { 
    stats: transformedMembers, 
    loading, 
    error, 
    refetch: fetchStats 
  };
};