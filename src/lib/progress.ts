import { startOfToday, endOfToday, startOfWeekSunday, endOfWeekSaturday, ymd } from './dateLocal';
import { supabase } from '@/integrations/supabase/client';

export type MemberProgress = { todaySteps: number; weeklySteps: number; dailyGoal: number; weeklyGoal: number };

const GOALS_KEY = (memberId: string)=> `fitfam:goals:${memberId}`;
const parseSafe = (v:any, d=0)=> Number.isFinite(Number(v)) ? Number(v) : d;

export const readGoals = (memberId: string)=> { 
  try { 
    const raw = localStorage.getItem(GOALS_KEY(memberId)); 
    const g = raw ? JSON.parse(raw) : {}; 
    return { dailyGoal: parseSafe(g.dailyGoal, 10000), weeklyGoal: parseSafe(g.weeklyGoal, 70000) }; 
  } catch { 
    return { dailyGoal: 10000, weeklyGoal: 70000 }; 
  } 
};

export const calcToday = async (memberId: string): Promise<number> => {
  const today = ymd(new Date());
  
  try {
    const { data, error } = await supabase
      .from('step_entries')
      .select('steps')
      .eq('member_id', memberId)
      .eq('date', today);

    if (error) throw error;
    return data?.reduce((total, entry) => total + entry.steps, 0) || 0;
  } catch (error) {
    console.error('Error getting today steps:', error);
    return 0;
  }
};

export const calcWeekly = async (memberId: string): Promise<number> => {
  const startDate = ymd(startOfWeekSunday());
  const endDate = ymd(endOfWeekSaturday());
  
  try {
    const { data, error } = await supabase
      .from('step_entries')
      .select('steps')
      .eq('member_id', memberId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) throw error;
    return data?.reduce((total, entry) => total + entry.steps, 0) || 0;
  } catch (error) {
    console.error('Error getting weekly steps:', error);
    return 0;
  }
};

export const getProgress = async (memberId: string): Promise<MemberProgress> => {
  const { dailyGoal, weeklyGoal } = readGoals(memberId);
  const todaySteps = await calcToday(memberId);
  const weeklySteps = await calcWeekly(memberId);
  return { todaySteps, weeklySteps, dailyGoal, weeklyGoal };
};

export const emitStepsUpdated = ()=> window.dispatchEvent(new CustomEvent('steps:updated'));
export const onStepsUpdated = (cb: ()=>void)=> { window.addEventListener('steps:updated', cb); return ()=> window.removeEventListener('steps:updated', cb); };
export const formatInt = (n:number)=> n.toLocaleString();
