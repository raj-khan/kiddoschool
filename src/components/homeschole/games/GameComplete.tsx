"use client";

import { Sprout } from "../illustrations";
import { Button } from "../ds";

export function GameComplete({ line, onAgain, onBack }: { line: string; onAgain: () => void; onBack: () => void }) {
  return (
    <div style={{ textAlign: "center", animation: "lin-fade .4s ease both" }}>
      <div style={{ display: "flex", justifyContent: "center", animation: "lin-grow .6s cubic-bezier(.2,.8,.3,1) both" }}>
        <Sprout size={150} stage={4} />
      </div>
      <h1 style={{ fontSize: "clamp(26px,6vw,36px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "20px 0 10px" }}>{line}</h1>
      <p style={{ fontSize: 17, color: "var(--ink-soft)", marginBottom: 30 }}>A seed for your garden. Lovely playing.</p>
      <div style={{ display: "flex", gap: 12, flexDirection: "column", maxWidth: 300, margin: "0 auto" }}>
        <Button size="lg" full color="var(--sage)" icon="refresh" onClick={onAgain}>
          Play again
        </Button>
        <Button size="lg" full variant="ghost" onClick={onBack}>
          Back to the Playroom
        </Button>
      </div>
    </div>
  );
}

const VOWELS = "aeiou";
export const isVowel = (c: string) => VOWELS.includes(c);

/** A calm accent for a word tile, cycling the three accents deterministically. */
export function accentFor(word: string): { color: string; tint: string } {
  const accents = [
    { color: "var(--coral)", tint: "var(--coral-tint)" },
    { color: "var(--sage)", tint: "var(--sage-tint)" },
    { color: "var(--honey)", tint: "var(--honey-tint)" }
  ];
  return accents[word.charCodeAt(0) % accents.length];
}
