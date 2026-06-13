"use client";

import { useState } from "react";

import { Glyph, Card } from "../ds";
import { Cheer, pick } from "./shared";
import type { ActivityMeta } from "@/lib/homeschole/activity-meta";

const ALPHA = ["A", "B", "D", "E", "G", "H", "M", "R", "T"];

export function Match({ meta, onComplete, big }: { meta: ActivityMeta; onComplete: () => void; big: boolean }) {
  const [rounds] = useState(() => pick(ALPHA, 3));
  const [round, setRound] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [cheer, setCheer] = useState(false);
  const target = rounds[round];
  const [options] = useState(() => rounds.map((t) => pick([t, ...pick(ALPHA.filter((x) => x !== t), 2)], 3)));

  const choose = (opt: string) => {
    if (opt === target) {
      setCheer(true);
      setTimeout(() => {
        setCheer(false);
        if (round + 1 >= rounds.length) onComplete();
        else setRound((r) => r + 1);
      }, 850);
    } else {
      setWrong(opt);
      setTimeout(() => setWrong(null), 600);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: big ? 23 : 20, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 24 }}>Find the matching little letter</p>
      <Card
        pad={0}
        radius="var(--r-xl)"
        style={{
          display: "inline-grid",
          placeItems: "center",
          width: big ? 200 : 176,
          height: big ? 200 : 176,
          background: meta.tint,
          border: "1px solid " + meta.color + "44",
          marginBottom: 34
        }}
      >
        <Glyph char={target} color={meta.deep} size={big ? 120 : 104} weight={700} />
      </Card>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        {options[round].map((opt, i) => (
          <button
            key={i}
            onClick={() => choose(opt)}
            style={{
              width: big ? 110 : 96,
              height: big ? 110 : 96,
              borderRadius: "var(--r-lg)",
              background: "var(--white)",
              border: "2px solid " + (wrong === opt ? "var(--coral)" : "var(--line)"),
              boxShadow: "var(--shadow-md)",
              display: "grid",
              placeItems: "center",
              transition: "all .2s",
              animation: wrong === opt ? "lin-shake .4s" : "none"
            }}
          >
            <Glyph char={opt.toLowerCase()} size={big ? 60 : 52} weight={600} />
          </button>
        ))}
      </div>
      <Cheer show={cheer} text="That's it!" />
    </div>
  );
}
