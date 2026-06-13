import type { PictureName } from "@/components/homeschole/illustrations";

/**
 * The content library — the architectural foundation of homeschole.
 *
 * The games are *engines*; this file is the *content* they pull from. Boredom
 * is solved here, not by adding more screens: grow this bank (CVC → blends →
 * digraphs → sight words) and the same engines stay endlessly varied. Data is
 * cheap to add. The real bottleneck is bespoke paper-cut art — words without a
 * picture carry `picture: null` and the games fall back to a letter tile.
 * Community content packs (other languages, themed sets) plug in by appending
 * to `WORD_BANK`.
 */

export type PhonicsPattern = "cvc" | "blend" | "digraph" | "sight";

/** 1–5, roughly mapping to the ages 3 → 6 progression. */
export type Level = 1 | 2 | 3 | 4 | 5;

export interface WordEntry {
  word: string;
  /** A bespoke paper-cut picture, or null to fall back to a letter tile. */
  picture: PictureName | null;
  pattern: PhonicsPattern;
  level: Level;
  /** First sound / letter, lowercase. */
  initial: string;
}

const cvc = (word: string, level: Level, picture: PictureName | null = null): WordEntry => ({
  word,
  picture,
  pattern: "cvc",
  level,
  initial: word[0]
});

const word = (w: string, pattern: PhonicsPattern, level: Level, picture: PictureName | null = null): WordEntry => ({
  word: w,
  picture,
  pattern,
  level,
  initial: w[0]
});

export const WORD_BANK: readonly WordEntry[] = [
  // ── CVC, the six with bespoke pictures (level 1) ──
  cvc("sun", 1, "sun"),
  cvc("cat", 1, "cat"),
  cvc("bus", 1, "bus"),
  cvc("cup", 1, "cup"),
  cvc("bee", 1, "bee"),
  cvc("hat", 1, "hat"),

  // ── CVC, expanding the bank (level 1) ──
  cvc("dog", 1, "dog"),
  cvc("pig", 1, "pig"),
  cvc("hen", 1),
  cvc("bed", 1, "bed"),
  cvc("box", 1, "box"),
  cvc("mat", 1),
  cvc("pen", 1),
  cvc("log", 1),

  // ── CVC (level 2 — a touch less common) ──
  cvc("fox", 2, "fox"),
  cvc("net", 2),
  cvc("jam", 2),
  cvc("web", 2, "web"),
  cvc("rug", 2),
  cvc("van", 2, "van"),
  cvc("zip", 2),
  cvc("mug", 2),
  cvc("nut", 2, "nut"),
  cvc("lip", 2),
  cvc("gum", 2),
  cvc("fan", 2),

  // ── Blends (level 3) ──
  word("frog", "blend", 3, "frog"),
  word("step", "blend", 3),
  word("clap", "blend", 3),
  word("drum", "blend", 3),
  word("flag", "blend", 3),
  word("swim", "blend", 3),
  word("plan", "blend", 3),
  word("crab", "blend", 3),

  // ── Digraphs (level 4) ──
  word("ship", "digraph", 4),
  word("chip", "digraph", 4),
  word("fish", "digraph", 4, "fish"),
  word("moth", "digraph", 4),
  word("bath", "digraph", 4),
  word("duck", "digraph", 4),
  word("rich", "digraph", 4),
  word("wish", "digraph", 4),

  // ── Sight words (level 5) ──
  word("the", "sight", 5),
  word("and", "sight", 5),
  word("you", "sight", 5),
  word("for", "sight", 5),
  word("are", "sight", 5),
  word("was", "sight", 5),
  word("they", "sight", 5),
  word("said", "sight", 5)
];

/** Map a child's age (3–6) onto a curriculum level. */
export function levelForAge(age: number): Level {
  if (age <= 3) return 1;
  if (age === 4) return 2;
  if (age === 5) return 3;
  return 4;
}

const shuffle = <T,>(arr: readonly T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export interface SelectOptions {
  /** Highest level to include (inclusive). Lower levels stay in the pool. */
  level: Level;
  count: number;
  /** Words to keep out of this draw (e.g. already shown this session). */
  exclude?: readonly string[];
  /**
   * Adaptive weighting: per-word mastery 0..1 (1 = mastered). Mastered words
   * surface less; unseen and missed words surface more. Omit for a flat draw.
   */
  mastery?: Record<string, number>;
  /** Restrict to a single phonics pattern. */
  pattern?: PhonicsPattern;
  /** Only words that have a bespoke picture (for picture-led games). */
  withPicture?: boolean;
}

/** Pick a varied set of words for a session, scaled by level and mastery. */
export function selectWords(options: SelectOptions): WordEntry[] {
  const { level, count, exclude = [], mastery, pattern, withPicture } = options;
  const excluded = new Set(exclude);

  let pool = WORD_BANK.filter((entry) => entry.level <= level && !excluded.has(entry.word));
  if (pattern) pool = pool.filter((entry) => entry.pattern === pattern);
  if (withPicture) pool = pool.filter((entry) => entry.picture !== null);

  // Fall back to the unfiltered (still level-bounded) pool if a filter emptied it.
  if (pool.length === 0) {
    pool = WORD_BANK.filter((entry) => entry.level <= level && (!withPicture || entry.picture !== null));
  }

  if (!mastery) {
    return shuffle(pool).slice(0, Math.min(count, pool.length));
  }

  // Weighted draw without replacement: weight = 1 - mastery (unseen → 1).
  const picked: WordEntry[] = [];
  const remaining = [...pool];
  const take = Math.min(count, remaining.length);
  for (let i = 0; i < take; i += 1) {
    const weights = remaining.map((entry) => 0.15 + (1 - (mastery[entry.word] ?? 0)));
    const total = weights.reduce((sum, w) => sum + w, 0);
    let roll = Math.random() * total;
    let index = 0;
    while (index < weights.length - 1 && roll > weights[index]) {
      roll -= weights[index];
      index += 1;
    }
    picked.push(remaining[index]);
    remaining.splice(index, 1);
  }
  return picked;
}

/** Words at or below `level` that begin with `letter` — for Sound Hunt. */
export function wordsByInitial(letter: string, level: Level, withPicture = false): WordEntry[] {
  return WORD_BANK.filter(
    (entry) => entry.initial === letter && entry.level <= level && (!withPicture || entry.picture !== null)
  );
}

/** Distinct initial sounds available at or below `level`. */
export function initialsAtLevel(level: Level, withPicture = false): string[] {
  const initials = new Set<string>();
  WORD_BANK.forEach((entry) => {
    if (entry.level <= level && (!withPicture || entry.picture !== null)) {
      initials.add(entry.initial);
    }
  });
  return [...initials];
}
