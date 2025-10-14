import { supabase } from "@/integrations/supabase/client"

export interface StepEntry {
  id: string
  member_id: string
  date: string
  steps: number
  created_at: string
  updated_at: string
}

// Get week range (Sunday to Saturday) for a given date
export function getWeekRange(date: Date): { startOfWeek: Date; endOfWeek: Date } {
  const startOfWeek = new Date(date)
  const dayOfWeek = startOfWeek.getDay() // 0 = Sunday, 1 = Monday, etc.
  
  // Set to start of week (Sunday)
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek)
  startOfWeek.setHours(0, 0, 0, 0)
  
  // Set to end of week (Saturday)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)
  
  return { startOfWeek, endOfWeek }
}

// Format date to ISO local date string (YYYY-MM-DD)
export function formatToLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Add or update step entry for a member on a specific date
export async function upsertStepEntry(memberId: string, date: Date, steps: number) {
  const dateStr = formatToLocalDate(date)
  
  try {
    // First try to get existing entry
    const { data: existingEntry, error: selectError } = await supabase
      .from('step_entries')
      .select('*')
      .eq('member_id', memberId)
      .eq('date', dateStr)
      .maybeSingle()

    if (selectError) {
      throw selectError
    }

    if (existingEntry) {
      // Update existing entry by adding steps
      const { data, error } = await supabase
        .from('step_entries')
        .update({ steps: existingEntry.steps + steps })
        .eq('id', existingEntry.id)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      // Insert new entry
      const { data, error } = await supabase
        .from('step_entries')
        .insert({ member_id: memberId, date: dateStr, steps })
        .select()
        .single()

      if (error) throw error
      return data
    }
  } catch (error) {
    console.error('Error upserting step entry:', error)
    throw error
  }
}

// Get today's total steps for a member
export async function getTodaySteps(memberId: string): Promise<number> {
  const today = formatToLocalDate(new Date())
  
  try {
    const { data, error } = await supabase
      .from('step_entries')
      .select('steps')
      .eq('member_id', memberId)
      .eq('date', today)

    if (error) throw error
    return data?.reduce((total, entry) => total + entry.steps, 0) || 0
  } catch (error) {
    console.error('Error getting today steps:', error)
    return 0
  }
}

// Get weekly total steps for a member
export async function getWeeklySteps(memberId: string, date: Date = new Date()): Promise<number> {
  const { startOfWeek, endOfWeek } = getWeekRange(date)
  const startDateStr = formatToLocalDate(startOfWeek)
  const endDateStr = formatToLocalDate(endOfWeek)
  
  try {
    const { data, error } = await supabase
      .from('step_entries')
      .select('steps')
      .eq('member_id', memberId)
      .gte('date', startDateStr)
      .lte('date', endDateStr)

    if (error) throw error
    
    return data?.reduce((total, entry) => total + entry.steps, 0) || 0
  } catch (error) {
    console.error('Error getting weekly steps:', error)
    return 0
  }
}

// Get step entries for a member within a date range
export async function getStepEntries(
  memberId: string, 
  startDate?: Date, 
  endDate?: Date
): Promise<StepEntry[]> {
  try {
    let query = supabase
      .from('step_entries')
      .select('*')
      .eq('member_id', memberId)
      .order('date', { ascending: false })

    if (startDate) {
      query = query.gte('date', formatToLocalDate(startDate))
    }

    if (endDate) {
      query = query.lte('date', formatToLocalDate(endDate))
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting step entries:', error)
    return []
  }
}