"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";

import { Icon } from "../Icon";
import { Glyph } from "../ds";
import { Cheer, WORD_BANK, pick } from "./shared";
import type { BankEntry } from "./shared";
import type { ActivityMeta } from "@/lib/homeschole/activity-meta";

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
}

export function Connect({ onComplete, big }: { meta: ActivityMeta; onComplete: () => void; big: boolean }) {
  const [items] = useState(() => pick(WORD_BANK, 3));
  const [right] = useState(() => [...items].sort(() => Math.random() - 0.5));
  const [sel, setSel] = useState<string | null>(null);
  const [pairs, setPairs] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [cheer, setCheer] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const leftR = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightR = useRef<Record<string, HTMLButtonElement | null>>({});

  const drawLine = (letter: string) => {
    const a = leftR.current[letter];
    const b = rightR.current[letter];
    const c = wrap.current;
    if (!a || !b || !c) return;
    const cr = c.getBoundingClientRect();
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    setLines((L) => [
      ...L,
      {
        x1: ar.right - cr.left,
        y1: ar.top + ar.height / 2 - cr.top,
        x2: br.left - cr.left,
        y2: br.top + br.height / 2 - cr.top,
        color: WORD_BANK.find((w) => w.letter === letter)!.color
      }
    ]);
  };

  const tapRight = (item: BankEntry) => {
    if (!sel) return;
    if (sel === item.letter) {
      setPairs((p) => [...p, sel]);
      drawLine(sel);
      const done = pairs.length + 1 >= items.length;
      setSel(null);
      if (done) {
        setCheer(true);
        setTimeout(() => {
          setCheer(false);
          onComplete();
        }, 1000);
      }
    } else {
      setWrong(item.letter);
      setTimeout(() => setWrong(null), 500);
    }
  };

  const cell = (active: boolean, color: string, done: boolean): CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: big ? "18px 20px" : "15px 18px",
    borderRadius: "var(--r-lg)",
    background: done ? "var(--sage-tint)" : "var(--white)",
    boxShadow: "var(--shadow-sm)",
    border: "2.5px solid " + (done ? "var(--sage)" : active ? color : "var(--line)"),
    transition: "all .2s",
    width: "100%"
  });

  return (
    <div>
      <p style={{ fontSize: big ? 23 : 20, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 24, textAlign: "center" }}>Connect each letter to its picture</p>
      <div ref={wrap} style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: big ? 60 : 44 }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
          {lines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth="4" strokeLinecap="round" style={{ animation: "lin-fade .3s" }} />
          ))}
        </svg>
        {/* left: letters */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {items.map((it) => {
            const done = pairs.includes(it.letter);
            return (
              <button
                key={it.letter}
                ref={(el) => {
                  leftR.current[it.letter] = el;
                }}
                disabled={done}
                onClick={() => setSel(it.letter)}
                style={cell(sel === it.letter, it.color, done)}
              >
                <Glyph char={it.letter} color={done ? "var(--sage-deep)" : it.color} size={big ? 46 : 40} weight={700} />
                <span style={{ fontSize: 17, fontWeight: 600, color: "var(--ink-soft)" }}>{it.word.toLowerCase()}</span>
                {done && <Icon name="check" size={20} color="var(--sage-deep)" stroke={3} style={{ marginLeft: "auto" }} />}
              </button>
            );
          })}
        </div>
        {/* right: pictures */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {right.map((it) => {
            const done = pairs.includes(it.letter);
            return (
              <button
                key={it.letter}
                ref={(el) => {
                  rightR.current[it.letter] = el;
                }}
                disabled={done}
                onClick={() => tapRight(it)}
                style={{
                  ...cell(false, it.color, done),
                  justifyContent: "center",
                  animation: wrong === it.letter ? "lin-shake .4s" : "none",
                  borderColor: wrong === it.letter ? "var(--coral)" : done ? "var(--sage)" : "var(--line)"
                }}
              >
                <div style={{ width: big ? 56 : 48, height: big ? 56 : 48, borderRadius: "var(--r-md)", background: it.tint, display: "grid", placeItems: "center" }}>
                  <Icon name={it.icon} size={big ? 30 : 26} color={it.color} stroke={2} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <Cheer show={cheer} text="All connected!" />
    </div>
  );
}
