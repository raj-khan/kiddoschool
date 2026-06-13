"use client";

import { useState } from "react";

import { Icon } from "../Icon";
import { Pic } from "../illustrations";
import type { PictureName } from "../illustrations";
import { Glyph, VoiceButton } from "../ds";
import { useVoice } from "../voice-context";
import { GameComplete } from "./GameComplete";
import { GAME_META } from "@/lib/homeschole/activity-meta";
import { WORD_BANK, initialsAtLevel, wordsByInitial } from "@/lib/homeschole/curriculum";
import type { Level, WordEntry } from "@/lib/homeschole/curriculum";

const pick = <T,>(arr: readonly T[], n: number): T[] => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

interface SoundHuntProps {
  level: Level;
  big: boolean;
  addSeeds: (n: number) => void;
  onAgain: () => void;
  onBack: () => void;
}

export function SoundHunt({ level, big, addSeeds, onAgain, onBack }: SoundHuntProps) {
  // Only initials that have at least one bespoke picture make for a clear hunt.
  const [rounds] = useState(() => {
    const usable = initialsAtLevel(level, true).filter((letter) => wordsByInitial(letter, level, true).length > 0);
    return pick(usable, Math.min(3, usable.length));
  });
  const [ri, setRi] = useState(0);
  const [done, setDone] = useState(false);

  const solve = () => {
    addSeeds(1);
    if (ri + 1 >= rounds.length) setDone(true);
    else setRi((r) => r + 1);
  };

  if (rounds.length === 0) return <GameComplete line="More sounds soon!" onAgain={onAgain} onBack={onBack} />;
  if (done) return <GameComplete line="You found every sound!" onAgain={onAgain} onBack={onBack} />;
  return <HuntRound key={ri} letter={rounds[ri]} level={level} round={ri} total={rounds.length} big={big} onSolved={solve} />;
}

function HuntRound({
  letter,
  level,
  round,
  total,
  big,
  onSolved
}: {
  letter: string;
  level: Level;
  round: number;
  total: number;
  big: boolean;
  onSolved: () => void;
}) {
  const { speakLetter } = useVoice();
  const matches = wordsByInitial(letter, level, true);
  const [grid] = useState<WordEntry[]>(() => {
    const others = WORD_BANK.filter((c) => c.picture !== null && c.initial !== letter && c.level <= level);
    const fillers = pick(others, Math.min(4, 6 - matches.length));
    return [...matches, ...fillers].sort(() => Math.random() - 0.5);
  });
  const need = matches.length;
  const [found, setFound] = useState<string[]>([]);
  const [bad, setBad] = useState<string | null>(null);
  const meta = GAME_META.sound;

  const tap = (item: WordEntry) => {
    if (found.includes(item.word)) return;
    if (item.initial === letter) {
      const nf = [...found, item.word];
      setFound(nf);
      if (nf.length >= need) setTimeout(onSolved, 800);
    } else {
      setBad(item.word);
      setTimeout(() => setBad(null), 550);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", gap: 7, justifyContent: "center", marginBottom: 20 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: i === round ? 22 : 9, height: 9, borderRadius: 99, background: i <= round ? meta.color : "var(--gray)", transition: "all .3s" }} />
        ))}
      </div>

      <p style={{ fontSize: big ? 22 : 19, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 16 }}>Find everything that begins with</p>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 30 }}>
        <div style={{ width: 110, height: 110, borderRadius: "var(--r-xl)", background: meta.tint, border: "1px solid " + meta.color + "44", display: "grid", placeItems: "center" }}>
          <Glyph char={letter.toUpperCase() + letter} size={54} color={meta.deep} weight={700} />
        </div>
        <VoiceButton size="lg" label={"Sound of " + letter} color={meta.color} tint={meta.tint} onPlay={() => speakLetter(letter)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: big ? 14 : 12, maxWidth: 440, margin: "0 auto" }}>
        {grid.map((item) => {
          const got = found.includes(item.word);
          return (
            <button
              key={item.word}
              onClick={() => tap(item)}
              disabled={got}
              style={{
                padding: big ? "18px 8px" : "15px 8px",
                borderRadius: "var(--r-lg)",
                background: got ? "var(--sage-tint)" : "var(--white)",
                border: "2px solid " + (got ? "var(--sage)" : bad === item.word ? "var(--coral)" : "var(--line)"),
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                position: "relative",
                animation: bad === item.word ? "lin-shake .4s" : "none",
                transition: "all .2s"
              }}
            >
              <Pic name={item.picture as PictureName} size={big ? 64 : 56} />
              <span style={{ fontSize: 15, fontWeight: 700 }}>{item.word}</span>
              {got && (
                <div style={{ position: "absolute", top: 8, right: 8, width: 26, height: 26, borderRadius: "50%", background: "var(--sage)", display: "grid", placeItems: "center" }}>
                  <Icon name="check" size={15} color="#fff" stroke={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
      <p style={{ fontSize: 14.5, color: "var(--ink-faint)", marginTop: 22 }}>
        {found.length} of {need} found
      </p>
    </div>
  );
}
