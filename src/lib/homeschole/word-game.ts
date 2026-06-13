import type { Level, WordEntry } from "./curriculum";

// Variety within one engine. The Word Workshop tiles can serve more than one
// challenge: building the whole word, or filling a single missing letter. Same
// art, same words, fresh task — so play stays varied without new screens.

export type Challenge = { mode: "build" } | { mode: "fill"; blankIndex: number };

const VOWELS = "aeiou";

/** The letter index to blank out: the first vowel, else the middle letter. */
export function blankableIndex(word: string): number {
  const vowel = [...word].findIndex((c) => VOWELS.includes(c));
  return vowel >= 0 ? vowel : Math.floor(word.length / 2);
}

/**
 * Plan one challenge per word in a session. The youngest (level 1) always
 * "build" — the simplest task. From level 2 up, every other round becomes a
 * "fill the missing letter" round, and the first round is always a gentle
 * "build" so a session never opens on the harder variant.
 */
export function planChallenges(words: readonly WordEntry[], level: Level): Challenge[] {
  return words.map((entry, i) => {
    if (level <= 1) return { mode: "build" };
    if (i % 2 === 1) return { mode: "fill", blankIndex: blankableIndex(entry.word) };
    return { mode: "build" };
  });
}
