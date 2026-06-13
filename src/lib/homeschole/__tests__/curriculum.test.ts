import { describe, expect, it } from "vitest";

import {
  WORD_BANK,
  initialsAtLevel,
  levelForAge,
  selectWords,
  wordsByInitial
} from "../curriculum";

describe("levelForAge", () => {
  it("maps ages 3–6 onto rising levels", () => {
    expect(levelForAge(3)).toBe(1);
    expect(levelForAge(4)).toBe(2);
    expect(levelForAge(5)).toBe(3);
    expect(levelForAge(6)).toBe(4);
  });

  it("clamps very young ages to level 1", () => {
    expect(levelForAge(2)).toBe(1);
  });
});

describe("selectWords", () => {
  it("returns the requested count without repeats", () => {
    const words = selectWords({ level: 3, count: 4 });
    expect(words).toHaveLength(4);
    const unique = new Set(words.map((w) => w.word));
    expect(unique.size).toBe(4);
  });

  it("never returns words above the requested level", () => {
    const words = selectWords({ level: 1, count: 8 });
    expect(words.every((w) => w.level <= 1)).toBe(true);
  });

  it("honours the exclude list", () => {
    const exclude = WORD_BANK.filter((w) => w.level === 1)
      .slice(0, 3)
      .map((w) => w.word);
    const words = selectWords({ level: 1, count: 6, exclude });
    expect(words.every((w) => !exclude.includes(w.word))).toBe(true);
  });

  it("can restrict to words that have a picture", () => {
    const words = selectWords({ level: 1, count: 6, withPicture: true });
    expect(words.length).toBeGreaterThan(0);
    expect(words.every((w) => w.picture !== null)).toBe(true);
  });

  it("surfaces unmastered words ahead of mastered ones over many draws", () => {
    const level1 = WORD_BANK.filter((w) => w.level === 1).map((w) => w.word);
    const fresh = level1[0];
    // Mark every level-1 word fully mastered except one.
    const mastery: Record<string, number> = {};
    level1.forEach((w) => (mastery[w] = w === fresh ? 0 : 1));

    let freshHits = 0;
    for (let i = 0; i < 200; i += 1) {
      if (selectWords({ level: 1, count: 1, mastery }).some((w) => w.word === fresh)) {
        freshHits += 1;
      }
    }
    // The single unmastered word should be drawn well above a flat 1/N rate.
    expect(freshHits).toBeGreaterThan(200 / level1.length);
  });
});

describe("wordsByInitial / initialsAtLevel", () => {
  it("finds picture words by their initial sound", () => {
    const sWords = wordsByInitial("s", 1, true);
    expect(sWords.length).toBeGreaterThan(0);
    expect(sWords.every((w) => w.initial === "s" && w.picture !== null)).toBe(true);
  });

  it("lists distinct initials available at a level", () => {
    const initials = initialsAtLevel(1, true);
    expect(initials).toContain("c");
    expect(new Set(initials).size).toBe(initials.length);
  });
});
