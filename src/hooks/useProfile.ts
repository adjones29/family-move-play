import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string | null;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      setProfile(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err);
      toast({
        title: "Error loading profile",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      await fetchProfile();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast({
        title: "Error updating profile",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
};
