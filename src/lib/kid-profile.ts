import type { LearningMode } from "./learning-content";
import type { NumberRangeMax } from "./numbers";

export type KidAgeGroup = "2-4" | "5-7" | "8+";
export type KidPlayStyle = "adventure" | "storybook";

export type KidProfile = {
  ageGroup: KidAgeGroup;
  playStyle: KidPlayStyle;
};

export const KID_PROFILE_STORAGE_KEY = "nuha-keyboard.kid-profile";
export const KID_PROFILE_EVENT = "nuha-keyboard:kid-profile-change";

export const DEFAULT_KID_PROFILE: KidProfile = {
  ageGroup: "5-7",
  playStyle: "adventure"
};

export const KID_AGE_OPTIONS = [
  {
    id: "2-4",
    label: "2 to 4 years",
    description: "Bigger, simpler practice with gentle prompts."
  },
  {
    id: "5-7",
    label: "5 to 7 years",
    description: "A balanced setup for early learners."
  },
  {
    id: "8+",
    label: "8 and up",
    description: "A little more challenge and independence."
  }
] as const satisfies readonly {
  id: KidAgeGroup;
  label: string;
  description: string;
}[];

export const KID_PLAY_STYLE_OPTIONS = [
  {
    id: "adventure",
    label: "Adventure",
    description: "Explorer energy with playful action scenes."
  },
  {
    id: "storybook",
    label: "Storybook",
    description: "Dreamy, gentle scenes with soft magical details."
  }
] as const satisfies readonly {
  id: KidPlayStyle;
  label: string;
  description: string;
}[];

export function isKidAgeGroup(value: unknown): value is KidAgeGroup {
  return value === "2-4" || value === "5-7" || value === "8+";
}

export function isKidPlayStyle(value: unknown): value is KidPlayStyle {
  return value === "adventure" || value === "storybook";
}

export function sanitizeKidProfile(value: unknown): KidProfile | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const profile = value as Record<string, unknown>;

  if (!isKidAgeGroup(profile.ageGroup) || !isKidPlayStyle(profile.playStyle)) {
    return null;
  }

  return {
    ageGroup: profile.ageGroup,
    playStyle: profile.playStyle
  };
}

let _cachedProfileRaw: string | undefined;
let _cachedProfileSnapshot: KidProfile | null = null;

export function loadKidProfile(): KidProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(KID_PROFILE_STORAGE_KEY) ?? "null";
    if (raw === _cachedProfileRaw) {
      return _cachedProfileSnapshot;
    }
    _cachedProfileRaw = raw;
    _cachedProfileSnapshot = sanitizeKidProfile(JSON.parse(raw));
    return _cachedProfileSnapshot;
  } catch {
    return null;
  }
}

export function saveKidProfile(profile: KidProfile): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(KID_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(KID_PROFILE_EVENT));
}

export function subscribeToKidProfile(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === KID_PROFILE_STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener(KID_PROFILE_EVENT, callback);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(KID_PROFILE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function getKidAgeLabel(ageGroup: KidAgeGroup): string {
  return KID_AGE_OPTIONS.find((option) => option.id === ageGroup)?.label ?? ageGroup;
}

export function getKidPlayStyleLabel(playStyle: KidPlayStyle): string {
  return KID_PLAY_STYLE_OPTIONS.find((option) => option.id === playStyle)?.label ?? playStyle;
}

export function getRecommendedNumberRange(ageGroup: KidAgeGroup): NumberRangeMax {
  if (ageGroup === "2-4") {
    return 10;
  }

  if (ageGroup === "5-7") {
    return 20;
  }

  return 50;
}

export function getProfileAwareHint(
  learningMode: LearningMode,
  baseHint: string,
  profile: KidProfile | null,
  isNumbersBoard: boolean
): string {
  if (!profile) {
    return baseHint;
  }

  if (learningMode === "colors") {
    if (profile.ageGroup === "2-4") {
      return "Tap one big color button and say the color together.";
    }

    if (profile.ageGroup === "5-7") {
      return "Match the scene to the color name, then say it out loud together.";
    }

    return "Try naming the color before the app says it, then pick the next one.";
  }

  if (learningMode === "computer") {
    if (profile.ageGroup === "2-4") {
      return "Start with big easy keys and listen to each sound together.";
    }

    if (profile.ageGroup === "5-7") {
      return "Match the real key and the screen key, then listen for the word.";
    }

    return "Use computer mode for simple keyboard practice and key-name memory.";
  }

  if (isNumbersBoard) {
    if (profile.ageGroup === "2-4") {
      return "Keep the range short and tap each number slowly together.";
    }

    if (profile.ageGroup === "5-7") {
      return "Mix straight, reverse, and random order so the child learns the number, not just the pattern.";
    }

    return "Raise the range or use random order when the child is ready for a little more challenge.";
  }

  if (profile.ageGroup === "2-4") {
    return "Start with one letter at a time and repeat the sound together.";
  }

  if (profile.ageGroup === "5-7") {
    return "Try saying the letter before the app does, then move to the next one.";
  }

  return "Use letter mode for sound recognition first, then switch to computer mode for early typing practice.";
}
