"use client";

import { useState } from "react";

import { AppCanvas, IconBadge } from "../ds";

const pick = <T,>(arr: readonly T[], n: number): T[] => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

export function ParentGate({ onPass, onCancel }: { onPass: () => void; onCancel: () => void }) {
  const [seq] = useState(() => pick([1, 2, 3, 4, 5, 6, 7, 8, 9], 3));
  const [entered, setEntered] = useState<number[]>([]);

  const tap = (n: number) => {
    if (n !== seq[entered.length]) {
      setEntered([]);
      return;
    }
    const ne = [...entered, n];
    if (ne.length === seq.length) {
      onPass();
      return;
    }
    setEntered(ne);
  };

  return (
    <AppCanvas max={460}>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", paddingBottom: 30 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <IconBadge name="lock" color="var(--sage)" tint="var(--sage-tint)" size={64} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>Just for grown-ups</h1>
        <p style={{ fontSize: 17, color: "var(--ink-soft)", marginBottom: 28 }}>Tap these numbers in order:</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 30 }}>
          {seq.map((n, i) => (
            <div
              key={i}
              style={{
                width: 54,
                height: 64,
                borderRadius: "var(--r-md)",
                display: "grid",
                placeItems: "center",
                fontSize: 28,
                fontWeight: 700,
                background: i < entered.length ? "var(--sage)" : "var(--white)",
                color: i < entered.length ? "#fff" : "var(--ink)",
                border: "1px solid var(--line)",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              {n}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, maxWidth: 300, margin: "0 auto 26px" }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => tap(n)}
              style={{ padding: "18px 0", borderRadius: "var(--r-md)", background: "var(--white)", border: "1px solid var(--line)", fontSize: 24, fontWeight: 700, boxShadow: "var(--shadow-sm)" }}
            >
              {n}
            </button>
          ))}
        </div>
        <button onClick={onCancel} style={{ color: "var(--ink-faint)", fontSize: 15, fontWeight: 600 }}>
          Back to learning
        </button>
      </div>
    </AppCanvas>
  );
}
