import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Challenge {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'special'
  participants: number
  progress: number
  total_goal: number
  days_left: number
  reward: string
  difficulty: 'easy' | 'medium' | 'hard'
  category?: string
  status: 'active' | 'completed' | 'paused'
  created_at: string
  updated_at: string
}

export interface MiniGame {
  id: string
  title: string
  description: string
  duration: string
  participants: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
  category?: string
  icon_name?: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Reward {
  id: string
  title: string
  description: string
  cost: number
  category: 'family' | 'individual' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  time_limit?: string
  participants_required?: number
  icon_name?: string
  available: boolean
  created_at: string
  updated_at: string
}

// API functions
export const challengesApi = {
  async getActive(): Promise<Challenge[]> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async updateProgress(id: string, progress: number): Promise<void> {
    const { error } = await supabase
      .from('challenges')
      .update({ 
        progress,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) throw error
  }
}

export const miniGamesApi = {
  async getActive(): Promise<MiniGame[]> {
    const { data, error } = await supabase
      .from('mini_games')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}

export const rewardsApi = {
  async getAvailable(): Promise<Reward[]> {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('available', true)
      .order('cost', { ascending: true })
    
    if (error) throw error
    return data || []
  }
}