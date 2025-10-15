import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCurrentFamily = () => {
  const [familyId, setFamilyId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFamilyId = async () => {
      if (!user) {
        setFamilyId(undefined);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('my_family_members')
          .select('family_id')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        setFamilyId(data?.family_id);
      } catch (error) {
        console.error('Error fetching family ID:', error);
        setFamilyId(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyId();
  }, [user]);

  return { familyId, loading };
};
