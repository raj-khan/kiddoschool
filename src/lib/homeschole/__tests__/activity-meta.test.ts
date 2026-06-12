import { describe, expect, it } from "vitest";

import { ACTIVITY_META, dayPlan } from "../activity-meta";

describe("dayPlan", () => {
  it("gives the youngest a short, simple plan", () => {
    expect(dayPlan(3)).toEqual(["trace", "match"]);
  });

  it("adds structure as the child grows", () => {
    expect(dayPlan(4).length).toBe(3);
    expect(dayPlan(5).length).toBe(4);
    expect(dayPlan(6).length).toBe(4);
  });

  it("only references known activities", () => {
    for (const age of [3, 4, 5, 6]) {
      for (const id of dayPlan(age)) {
        expect(ACTIVITY_META[id]).toBeDefined();
      }
    }
  });
});
