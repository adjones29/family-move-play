export type StepEntry = {
  memberId: string;
  dateISO: string;
  steps: number;
  source?: "manual" | "import" | "sync";
};

const STORAGE_KEY = "fitfam.steps";

/**
 * Get the current week range (Sunday 00:00:00 to Saturday 23:59:59.999 in local time)
 */
export function getWeekRange(date = new Date()): { start: Date; end: Date } {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Find the most recent Sunday
  const start = new Date(date);
  start.setDate(date.getDate() - dayOfWeek);
  start.setHours(0, 0, 0, 0);
  
  // Saturday of the same week
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

/**
 * Safely read step entries from localStorage
 */
export function readStepEntries(): StepEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    
    // Validate and filter malformed entries
    return parsed.filter(entry => 
      entry &&
      typeof entry.memberId === 'string' &&
      typeof entry.dateISO === 'string' &&
      typeof entry.steps === 'number' &&
      entry.steps >= 0 &&
      !isNaN(new Date(entry.dateISO).getTime())
    );
  } catch (error) {
    console.error('Error reading step entries:', error);
    return [];
  }
}

/**
 * Get today's date range (00:00:00 to 23:59:59.999 in local time)
 */
export function getTodayRange(): { start: Date; end: Date } {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

/**
 * Calculate daily steps for a specific member for today
 */
export function sumDailySteps(memberId: string): number {
  const { start, end } = getTodayRange();
  const entries = readStepEntries();
  
  return entries
    .filter(entry => {
      if (entry.memberId !== memberId) return false;
      
      try {
        const entryDate = new Date(entry.dateISO);
        return entryDate >= start && entryDate <= end;
      } catch {
        return false;
      }
    })
    .reduce((sum, entry) => sum + entry.steps, 0);
}

/**
 * Calculate weekly steps for a specific member within a date range
 */
export function sumWeeklySteps(
  memberId: string,
  weekStart?: Date,
  weekEnd?: Date
): number {
  const { start, end } = weekStart && weekEnd 
    ? { start: weekStart, end: weekEnd }
    : getWeekRange();
  
  const entries = readStepEntries();
  
  return entries
    .filter(entry => {
      if (entry.memberId !== memberId) return false;
      
      try {
        const entryDate = new Date(entry.dateISO);
        return entryDate >= start && entryDate <= end;
      } catch {
        return false;
      }
    })
    .reduce((sum, entry) => sum + entry.steps, 0);
}

/**
 * Add or update a step entry and emit a change event
 */
export function upsertStepEntry(entry: StepEntry): void {
  try {
    const entries = readStepEntries();
    entries.push(entry);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    
    // Emit custom event for listeners
    window.dispatchEvent(new CustomEvent('steps:changed', { detail: entry }));
  } catch (error) {
    console.error('Error upserting step entry:', error);
    throw error;
  }
}

/**
 * Format number with thousands separators
 */
export function formatSteps(steps: number): string {
  return steps.toLocaleString();
}
