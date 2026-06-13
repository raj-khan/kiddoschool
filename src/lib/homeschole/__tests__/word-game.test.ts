import { describe, expect, it } from "vitest";

import { blankableIndex, planChallenges } from "../word-game";
import type { WordEntry } from "../curriculum";

const entry = (word: string): WordEntry => ({ word, picture: null, pattern: "cvc", level: 1, initial: word[0] });

describe("blankableIndex", () => {
  it("blanks the first vowel", () => {
    expect(blankableIndex("cat")).toBe(1);
    expect(blankableIndex("sun")).toBe(1);
    expect(blankableIndex("bee")).toBe(1);
  });

  it("falls back to the middle when there is no vowel", () => {
    expect(blankableIndex("brr")).toBe(1);
  });
});

describe("planChallenges", () => {
  const words = ["cat", "sun", "bus", "cup"].map(entry);

  it("keeps the youngest on build rounds only", () => {
    const plan = planChallenges(words, 1);
    expect(plan.every((c) => c.mode === "build")).toBe(true);
  });

  it("opens on build and mixes in fill rounds from level 2", () => {
    const plan = planChallenges(words, 3);
    expect(plan[0].mode).toBe("build");
    expect(plan.some((c) => c.mode === "fill")).toBe(true);
  });

  it("only blanks valid letter positions", () => {
    const plan = planChallenges(words, 4);
    plan.forEach((c, i) => {
      if (c.mode === "fill") {
        expect(c.blankIndex).toBeGreaterThanOrEqual(0);
        expect(c.blankIndex).toBeLessThan(words[i].word.length);
      }
    });
  });
});
