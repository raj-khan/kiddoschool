import { describe, expect, it } from "vitest";

import {
  DEFAULT_PROGRESS,
  applyDailyReset,
  previousDayKey,
  registerActivity,
  todayKey
} from "../progress";
import type { Progress } from "../progress";

const base = (overrides: Partial<Progress>): Progress => ({ ...DEFAULT_PROGRESS, ...overrides });

describe("date keys", () => {
  it("formats today as YYYY-MM-DD", () => {
    expect(todayKey(new Date(2026, 5, 13))).toBe("2026-06-13");
  });

  it("steps back a day across month boundaries", () => {
    expect(previousDayKey("2026-06-01")).toBe("2026-05-31");
    expect(previousDayKey("2026-01-01")).toBe("2025-12-31");
  });
});

describe("applyDailyReset", () => {
  it("clears the daily path on a new day", () => {
    const p = base({ completed: { trace: true }, lastActive: "2026-06-12" });
    expect(applyDailyReset(p, "2026-06-13").completed).toEqual({});
  });

  it("keeps today's progress untouched", () => {
    const p = base({ completed: { trace: true }, lastActive: "2026-06-13" });
    expect(applyDailyReset(p, "2026-06-13").completed).toEqual({ trace: true });
  });
});

describe("registerActivity", () => {
  it("starts the streak at 1 for a first-ever activity", () => {
    const p = registerActivity(base({ streak: 0, lastActive: "" }), "2026-06-13");
    expect(p.streak).toBe(1);
    expect(p.lastActive).toBe("2026-06-13");
  });

  it("advances the streak on a consecutive day", () => {
    const p = registerActivity(base({ streak: 3, lastActive: "2026-06-12" }), "2026-06-13");
    expect(p.streak).toBe(4);
  });

  it("resets the streak after a missed day", () => {
    const p = registerActivity(base({ streak: 9, lastActive: "2026-06-10" }), "2026-06-13");
    expect(p.streak).toBe(1);
  });

  it("does not double-count a second activity the same day", () => {
    const p = registerActivity(base({ streak: 4, lastActive: "2026-06-13" }), "2026-06-13");
    expect(p.streak).toBe(4);
  });
});
