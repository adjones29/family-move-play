import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Family {
  id: string;
  name: string;
  created_by: string;
  invite_code: string | null;
  created_at: string | null;
}

export const useFamily = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFamilies = async () => {
    if (!user) {
      setFamilies([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get families where user is a member
      const { data: memberData, error: memberError } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      if (memberData && memberData.length > 0) {
        const familyIds = memberData.map(m => m.family_id);
        
        const { data: familiesData, error: familiesError } = await supabase
          .from('families')
          .select('*')
          .in('id', familyIds);

        if (familiesError) throw familiesError;

        setFamilies(familiesData || []);
        if (familiesData && familiesData.length > 0) {
          setCurrentFamily(familiesData[0]);
        }
      } else {
        setFamilies([]);
        setCurrentFamily(null);
      }
      
      setError(null);
    } catch (err: any) {
      console.error('Error fetching families:', err);
      setError(err);
      toast({
        title: "Error loading families",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createFamily = async (name: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a family",
        variant: "destructive",
      });
      return null;
    }

    try {
      const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .insert({
          name,
          created_by: user.id, // Trigger will ensure this matches auth.uid()
          invite_code: inviteCode
        })
        .select()
        .single();

      if (familyError) throw familyError;

      // Add creator as a parent member
      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: familyData.id,
          user_id: user.id,
          role: 'Parent',
          status: 'Active'
        });

      if (memberError) throw memberError;

      toast({
        title: "Family created!",
        description: `Your family "${name}" has been created successfully.`,
      });

      await fetchFamilies();
      return familyData;
    } catch (err: any) {
      console.error('Error creating family:', err);
      toast({
        title: "Error creating family",
        description: err.message,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, [user]);

  return { 
    families, 
    currentFamily, 
    loading, 
    error, 
    createFamily, 
    refetch: fetchFamilies 
  };
};
