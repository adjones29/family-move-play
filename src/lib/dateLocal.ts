export const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
const pad = (n:number)=> String(n).padStart(2,'0');
export const toLocal = (d: Date)=> new Date(d.toLocaleString('en-US', { timeZone: tz }));
export const ymd = (d: Date)=> { const ld = toLocal(d); const y = ld.getFullYear(); const m = pad(ld.getMonth()+1); const day = pad(ld.getDate()); return `${y}-${m}-${day}`; };
export const startOfToday = ()=> { const ld = toLocal(new Date()); return new Date(`${ymd(ld)}T00:00:00`); };
export const endOfToday = ()=> { const ld = toLocal(new Date()); return new Date(`${ymd(ld)}T23:59:59.999`); };
export const startOfWeekSunday = ()=>{ const now = toLocal(new Date()); const dow = now.getDay(); const start = new Date(now); start.setDate(now.getDate() - dow); start.setHours(0,0,0,0); return start; };
export const endOfWeekSaturday = ()=>{ const s = startOfWeekSunday(); const end = new Date(s); end.setDate(s.getDate()+6); end.setHours(23,59,59,999); return end; };
