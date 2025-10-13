import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string;
  status: string;
  joined_at: string | null;
}

export const useFamilyMembers = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMembers = async () => {
    if (!user) {
      setMembers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('my_family_members')
        .select('*')
        .order('joined_at', { ascending: false });

      if (error) throw error;
      
      setMembers(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching family members:', err);
      setError(err);
      toast({
        title: "Error loading family members",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('family_members_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'family_members'
        },
        () => {
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { members, loading, error, refetch: fetchMembers };
};
