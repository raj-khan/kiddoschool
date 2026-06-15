// Parent-facing settings. The design's Tweaks panel is review-only chrome and
// is not shipped; these three axes are surfaced in the parent dashboard, the
// rest are baked to the design defaults (minimal surface, coral accent, bottom nav).

export type ProgressMetaphor = "garden" | "tree" | "path";
export type RewardStyle = "calm" | "seed" | "sticker";

export interface Settings {
  voice: boolean;
  progressMetaphor: ProgressMetaphor;
  rewardStyle: RewardStyle;
}

export const SETTINGS_STORAGE_KEY = "homeschole.settings";
export const SETTINGS_SCHEMA_VERSION = 1;

export const DEFAULT_SETTINGS: Settings = {
  voice: true,
  progressMetaphor: "garden",
  rewardStyle: "calm"
};

const METAPHORS: readonly ProgressMetaphor[] = ["garden", "tree", "path"];
const REWARDS: readonly RewardStyle[] = ["calm", "seed", "sticker"];

export function sanitizeSettings(value: unknown): Settings {
  if (!value || typeof value !== "object") return { ...DEFAULT_SETTINGS };
  const record = value as Record<string, unknown>;
  return {
    voice: typeof record.voice === "boolean" ? record.voice : DEFAULT_SETTINGS.voice,
    progressMetaphor: METAPHORS.includes(record.progressMetaphor as ProgressMetaphor)
      ? (record.progressMetaphor as ProgressMetaphor)
      : DEFAULT_SETTINGS.progressMetaphor,
    rewardStyle: REWARDS.includes(record.rewardStyle as RewardStyle)
      ? (record.rewardStyle as RewardStyle)
      : DEFAULT_SETTINGS.rewardStyle
  };
}

export function loadSettings(): Settings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? sanitizeSettings(JSON.parse(raw)) : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ version: SETTINGS_SCHEMA_VERSION, ...settings }));
}
