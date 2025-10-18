import { supabase } from '@/integrations/supabase/client';

export async function fetchChallengesByDifficulty(difficulty: 'easy' | 'medium' | 'hard') {
  const { data, error } = await supabase
    .from('v_challenges_media')
    .select('*')
    .eq('is_active', true)
    .eq('difficulty', difficulty)
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) {
    console.error('Error fetching challenges:', error);
    return [];
  }
  
  return data || [];
}

export async function fetchGamesByCategory(category: 'exercise' | 'fun' | 'adventure') {
  const { data, error } = await supabase
    .from('v_games_media')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) {
    console.error('Error fetching games:', error);
    return [];
  }
  
  return data || [];
}

export async function fetchRewardsByType(type: 'family' | 'individual' | 'special') {
  const { data, error } = await supabase
    .from('v_rewards_media')
    .select('*')
    .eq('is_active', true)
    .eq('type', type)
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) {
    console.error('Error fetching rewards:', error);
    return [];
  }
  
  return data || [];
}
