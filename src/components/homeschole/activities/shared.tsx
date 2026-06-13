"use client";

import type { ReactNode } from "react";

import { Icon } from "../Icon";
import type { IconName } from "../Icon";
import { AppCanvas } from "../ds";

// Both ActivityMeta and GameMeta satisfy this shell-header shape.
interface ShellMeta {
  skill: string;
  title: string;
  color: string;
  deep: string;
}

// Small icon-word bank for the letter activities (uses the line-icon set — no emoji).
export interface BankEntry {
  letter: string;
  word: string;
  icon: IconName;
  color: string;
  tint: string;
}

export const WORD_BANK: BankEntry[] = [
  { letter: "S", word: "Sun", icon: "sun", color: "var(--honey)", tint: "var(--honey-tint)" },
  { letter: "L", word: "Leaf", icon: "leaf", color: "var(--sage)", tint: "var(--sage-tint)" },
  { letter: "F", word: "Flower", icon: "flower", color: "var(--coral)", tint: "var(--coral-tint)" },
  { letter: "B", word: "Book", icon: "book", color: "var(--honey)", tint: "var(--honey-tint)" },
  { letter: "H", word: "Heart", icon: "heart", color: "var(--coral)", tint: "var(--coral-tint)" },
  { letter: "T", word: "Tree", icon: "garden", color: "var(--sage)", tint: "var(--sage-tint)" }
];

export function pick<T>(arr: readonly T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

// ── Activity shell: calm header, progress dots, one focused task ──
export function ActivityShell({
  meta,
  step,
  total,
  onBack,
  children
}: {
  meta: ShellMeta;
  step: number;
  total: number;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <AppCanvas max={680}>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", paddingTop: 26, paddingBottom: 32 }}>
        <header style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <button
            onClick={onBack}
            aria-label="Back"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "var(--white)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--line-soft)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0
            }}
          >
            <Icon name="back" size={24} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: meta.deep }}>{meta.skill}</div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em" }}>{meta.title}</div>
          </div>
          {total > 1 && (
            <div style={{ display: "flex", gap: 7 }}>
              {Array.from({ length: total }).map((_, i) => (
                <div
                  key={i}
                  style={{ width: i === step ? 22 : 9, height: 9, borderRadius: 99, background: i <= step ? meta.color : "var(--gray)", transition: "all .4s" }}
                />
              ))}
            </div>
          )}
        </header>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>{children}</div>
      </div>
    </AppCanvas>
  );
}

// ── Encouragement chip on correct answers ──
export function Cheer({ show, text = "Lovely" }: { show: boolean; text?: string }) {
  if (!show) return null;
  return (
    <div style={{ position: "fixed", left: "50%", top: "18%", transform: "translateX(-50%)", zIndex: 50, animation: "lin-fade-up .4s ease both" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "var(--sage)",
          color: "#fff",
          padding: "12px 22px",
          borderRadius: "var(--r-pill)",
          boxShadow: "var(--shadow-lg)",
          fontWeight: 700,
          fontSize: 17
        }}
      >
        <Icon name="check" size={20} color="#fff" stroke={3} /> {text}
      </div>
    </div>
  );
}
