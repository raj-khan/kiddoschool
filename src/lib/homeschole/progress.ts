// Progress — seeds, streak, activity completion, and per-word mastery.
// Local storage only.

export interface Progress {
  seeds: number;
  streak: number;
  /** Activity / game ids completed *today* (the daily path). Cleared each new day. */
  completed: Record<string, boolean>;
  /** Per-word mastery 0..1 — feeds the curriculum's adaptive selection. */
  mastery: Record<string, number>;
  /** Local date (YYYY-MM-DD) of the last activity, for streak + daily reset. "" = never. */
  lastActive: string;
}

export const PROGRESS_STORAGE_KEY = "homeschole.progress";

// A fresh child starts with an empty garden that grows as they play.
export const DEFAULT_PROGRESS: Progress = {
  seeds: 0,
  streak: 0,
  completed: {},
  mastery: {},
  lastActive: ""
};

export function sanitizeProgress(value: unknown): Progress {
  if (!value || typeof value !== "object") return { ...DEFAULT_PROGRESS };
  const record = value as Record<string, unknown>;
  return {
    seeds: typeof record.seeds === "number" ? record.seeds : DEFAULT_PROGRESS.seeds,
    streak: typeof record.streak === "number" ? record.streak : DEFAULT_PROGRESS.streak,
    completed: isPlainObject(record.completed) ? (record.completed as Record<string, boolean>) : {},
    mastery: isPlainObject(record.mastery) ? (record.mastery as Record<string, number>) : {},
    lastActive: typeof record.lastActive === "string" ? record.lastActive : ""
  };
}

function isPlainObject(value: unknown): boolean {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return { ...DEFAULT_PROGRESS };
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? sanitizeProgress(JSON.parse(raw)) : { ...DEFAULT_PROGRESS };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: Progress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

/** Move a word's mastery toward 1 (correct) or down toward 0 (missed). */
export function adjustMastery(current: number | undefined, correct: boolean): number {
  const value = current ?? 0;
  const next = correct ? value + (1 - value) * 0.4 : value * 0.6;
  return Math.min(1, Math.max(0, Number(next.toFixed(3))));
}

// ── Daily rhythm: rollover + streak ────────────────────────

/** Local calendar day as YYYY-MM-DD (stable for string comparison). */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** The calendar day before `key` (YYYY-MM-DD). */
export function previousDayKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return todayKey(date);
}

/**
 * On a new day, clear today's completed path so the journey is fresh. The
 * streak and seeds persist; only the daily plan resets.
 */
export function applyDailyReset(progress: Progress, today = todayKey()): Progress {
  if (progress.lastActive === today || progress.lastActive === "") return progress;
  return { ...progress, completed: {} };
}

/**
 * Record that the child did an activity today: advance the streak (consecutive
 * days), keep it on a same-day repeat, reset it after a missed day, and stamp
 * `lastActive`. Returns a new Progress; the daily path is reset if it's a new day.
 */
export function registerActivity(progress: Progress, today = todayKey()): Progress {
  if (progress.lastActive === today) return progress; // already counted today
  const continued = progress.lastActive === previousDayKey(today);
  const reset = progress.lastActive === "" ? { ...progress, completed: {} } : applyDailyReset(progress, today);
  return { ...reset, streak: continued ? progress.streak + 1 : 1, lastActive: today };
}
