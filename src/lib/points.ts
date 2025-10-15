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
