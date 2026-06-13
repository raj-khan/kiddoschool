import type { IconName } from "@/components/homeschole/Icon";

export type ActivityId = "trace" | "match" | "phonics" | "connect" | "memory" | "read";
export type GameId = "word" | "sound" | "memory";

export interface ActivityMeta {
  title: string;
  verb: string;
  skill: string;
  icon: IconName;
  color: string;
  tint: string;
  deep: string;
}

export const ACTIVITY_META: Record<ActivityId, ActivityMeta> = {
  trace: { title: "Trace the letter", verb: "Tracing", skill: "Writing", icon: "trace", color: "var(--sage)", tint: "var(--sage-tint)", deep: "var(--sage-deep)" },
  match: { title: "Letter match", verb: "Matching", skill: "Reading", icon: "match", color: "var(--coral)", tint: "var(--coral-tint)", deep: "var(--coral-deep)" },
  phonics: { title: "Letter sounds", verb: "Phonics", skill: "Phonics", icon: "phonics", color: "var(--honey)", tint: "var(--honey-tint)", deep: "var(--honey-deep)" },
  connect: { title: "Find the pairs", verb: "Connecting", skill: "Words", icon: "connect", color: "var(--sage)", tint: "var(--sage-tint)", deep: "var(--sage-deep)" },
  memory: { title: "Memory garden", verb: "Remembering", skill: "Focus", icon: "memory", color: "var(--coral)", tint: "var(--coral-tint)", deep: "var(--coral-deep)" },
  read: { title: "Read together", verb: "Reading", skill: "Reading", icon: "book", color: "var(--honey)", tint: "var(--honey-tint)", deep: "var(--honey-deep)" }
};

export interface GameMeta {
  id: GameId;
  title: string;
  skill: string;
  icon: IconName;
  color: string;
  tint: string;
  deep: string;
  tag: string;
  desc: string;
}

export const GAME_META: Record<GameId, GameMeta> = {
  word: {
    id: "word",
    title: "Word Workshop",
    skill: "Reading · Building",
    icon: "blocks",
    color: "var(--sage)",
    tint: "var(--sage-tint)",
    deep: "var(--sage-deep)",
    tag: "Reading",
    desc: "Build little words with the movable alphabet. A picture blooms when you spell it right."
  },
  sound: {
    id: "sound",
    title: "Sound Hunt",
    skill: "Phonics",
    icon: "sound",
    color: "var(--honey-deep)",
    tint: "var(--honey-tint)",
    deep: "var(--honey-deep)",
    tag: "Phonics",
    desc: "Listen for a sound, then gather everything that begins with it."
  },
  memory: {
    id: "memory",
    title: "Memory Garden",
    skill: "Focus & memory",
    icon: "memory",
    color: "var(--coral)",
    tint: "var(--coral-tint)",
    deep: "var(--coral-deep)",
    tag: "Focus",
    desc: "Turn the seed cards and find each matching pair of letters."
  }
};

/** Build a day plan scaled by age: 3 → fewer, simpler; 5–6 → more, structured. */
export function dayPlan(age: number): ActivityId[] {
  if (age <= 3) return ["trace", "match"];
  if (age === 4) return ["phonics", "trace", "match"];
  return ["phonics", "trace", "connect", "memory"];
}
