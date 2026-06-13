// Child profile — stored in local storage only (per the house rules).

export type FocusArea = "reading" | "writing" | "phonics" | "words" | "memory";

export interface ChildProfile {
  name: string;
  /** 3–6. */
  age: number;
  focus: FocusArea[];
}

export const CHILD_PROFILE_STORAGE_KEY = "homeschole.child-profile";
export const CHILD_PROFILE_EVENT = "homeschole:child-profile-change";
export const CHILD_PROFILE_SCHEMA_VERSION = 1;

export const DEFAULT_PROFILE: ChildProfile = {
  name: "Maya",
  age: 4,
  focus: ["reading", "phonics"]
};

const FOCUS_VALUES: readonly FocusArea[] = ["reading", "writing", "phonics", "words", "memory"];

function isFocusArea(value: unknown): value is FocusArea {
  return typeof value === "string" && (FOCUS_VALUES as readonly string[]).includes(value);
}

export function sanitizeProfile(value: unknown): ChildProfile | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name : null;
  const age = typeof record.age === "number" ? record.age : null;
  if (name === null || age === null) return null;
  const focus = Array.isArray(record.focus) ? record.focus.filter(isFocusArea) : [];
  return { name, age: Math.min(6, Math.max(3, Math.round(age))), focus };
}

export function loadProfile(): ChildProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CHILD_PROFILE_STORAGE_KEY);
    return raw ? sanitizeProfile(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: ChildProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHILD_PROFILE_STORAGE_KEY, JSON.stringify({ version: CHILD_PROFILE_SCHEMA_VERSION, ...profile }));
  window.dispatchEvent(new Event(CHILD_PROFILE_EVENT));
}
