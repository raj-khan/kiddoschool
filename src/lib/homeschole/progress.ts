// Progress — seeds, streak, activity completion, and per-word mastery.
// Local storage only.

export interface Progress {
  seeds: number;
  streak: number;
  /** Activity / game ids the child has completed (e.g. "trace", "phonics"). */
  completed: Record<string, boolean>;
  /** Per-word mastery 0..1 — feeds the curriculum's adaptive selection. */
  mastery: Record<string, number>;
}

export const PROGRESS_STORAGE_KEY = "homeschole.progress";

export const DEFAULT_PROGRESS: Progress = {
  seeds: 7,
  streak: 4,
  completed: {},
  mastery: {}
};

export function sanitizeProgress(value: unknown): Progress {
  if (!value || typeof value !== "object") return { ...DEFAULT_PROGRESS };
  const record = value as Record<string, unknown>;
  return {
    seeds: typeof record.seeds === "number" ? record.seeds : DEFAULT_PROGRESS.seeds,
    streak: typeof record.streak === "number" ? record.streak : DEFAULT_PROGRESS.streak,
    completed: isStringRecord(record.completed) ? (record.completed as Record<string, boolean>) : {},
    mastery: isNumberRecord(record.mastery) ? (record.mastery as Record<string, number>) : {}
  };
}

function isStringRecord(value: unknown): boolean {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNumberRecord(value: unknown): boolean {
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
