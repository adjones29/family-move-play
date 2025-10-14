import { startOfToday, endOfToday, startOfWeekSunday, endOfWeekSaturday, ymd } from './dateLocal';
export type StepEntry = { dateISO: string; steps: number };
export type MemberProgress = { todaySteps: number; weeklySteps: number; dailyGoal: number; weeklyGoal: number };
const KEY = (memberId: string)=> `fitfam:steps:${memberId}`;
const GOALS_KEY = (memberId: string)=> `fitfam:goals:${memberId}`;
const parseSafe = (v:any, d=0)=> Number.isFinite(Number(v)) ? Number(v) : d;
export const readEntries = (memberId: string): StepEntry[] => {
  try { const raw = localStorage.getItem(KEY(memberId)); return raw ? JSON.parse(raw) : []; } catch { return []; }
};
export const readGoals = (memberId: string)=> { try { const raw = localStorage.getItem(GOALS_KEY(memberId)); const g = raw ? JSON.parse(raw) : {}; return { dailyGoal: parseSafe(g.dailyGoal, 10000), weeklyGoal: parseSafe(g.weeklyGoal, 70000) }; } catch { return { dailyGoal: 10000, weeklyGoal: 70000 }; } };
const inRange = (iso:string, from: Date, to: Date)=> { const t = new Date(iso).getTime(); return t >= from.getTime() && t <= to.getTime(); };
export const calcToday = (memberId: string)=> {
  const entries = readEntries(memberId);
  const s = startOfToday(), e = endOfToday();
  return entries.filter(e1=> inRange(e1.dateISO, s, e)).reduce((a,b)=> a + parseSafe(b.steps,0), 0);
};
export const calcWeekly = (memberId: string)=> {
  const entries = readEntries(memberId);
  const s = startOfWeekSunday(), e = endOfWeekSaturday();
  return entries.filter(e1=> inRange(e1.dateISO, s, e)).reduce((a,b)=> a + parseSafe(b.steps,0), 0);
};
export const getProgress = (memberId: string): MemberProgress => {
  const { dailyGoal, weeklyGoal } = readGoals(memberId);
  const todaySteps = calcToday(memberId);
  const weeklySteps = calcWeekly(memberId);
  return { todaySteps, weeklySteps, dailyGoal, weeklyGoal };
};
export const emitStepsUpdated = ()=> window.dispatchEvent(new CustomEvent('steps:updated'));
export const onStepsUpdated = (cb: ()=>void)=> { window.addEventListener('steps:updated', cb); return ()=> window.removeEventListener('steps:updated', cb); };
export const formatInt = (n:number)=> n.toLocaleString();
