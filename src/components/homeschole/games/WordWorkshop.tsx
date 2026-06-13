"use client";

import { useState } from "react";

import { Icon } from "../Icon";
import { Pic } from "../illustrations";
import { Glyph, VoiceButton } from "../ds";
import { useVoice } from "../voice-context";
import { Cheer } from "../activities/shared";
import { GameComplete, accentFor, isVowel } from "./GameComplete";
import { selectWords } from "@/lib/homeschole/curriculum";
import type { Level, WordEntry } from "@/lib/homeschole/curriculum";
import { planChallenges } from "@/lib/homeschole/word-game";

const POOL = "bcdfghklmnprstv".split("");
const VOWELS = "aeiou".split("");
const pick = <T,>(arr: readonly T[], n: number): T[] => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

interface WordWorkshopProps {
  level: Level;
  big: boolean;
  mastery: Record<string, number>;
  addSeeds: (n: number) => void;
  recordMastery: (word: string, correct: boolean) => void;
  onAgain: () => void;
  onBack: () => void;
}

export function WordWorkshop({ level, big, mastery, addSeeds, recordMastery, onAgain, onBack }: WordWorkshopProps) {
  const nDistract = level <= 1 ? 0 : level === 2 ? 1 : 2;
  // Pull a varied set from the content library — adaptive on mastery so the
  // same words rarely repeat and missed ones return more often.
  const [words] = useState(() => selectWords({ level, count: 4, mastery }));
  // Vary the challenge per round: build the whole word, or fill a missing letter.
  const [challenges] = useState(() => planChallenges(words, level));
  const [ri, setRi] = useState(0);
  const [done, setDone] = useState(false);

  const solve = () => {
    recordMastery(words[ri].word, true);
    addSeeds(1);
    if (ri + 1 >= words.length) setDone(true);
    else setRi((r) => r + 1);
  };

  if (words.length === 0) return <GameComplete line="More words soon!" onAgain={onAgain} onBack={onBack} />;
  if (done) return <GameComplete line={`You finished ${words.length} words!`} onAgain={onAgain} onBack={onBack} />;

  const challenge = challenges[ri];
  if (challenge.mode === "fill") {
    return (
      <FillRound key={ri} target={words[ri]} round={ri} total={words.length} blankIndex={challenge.blankIndex} big={big} onSolved={solve} />
    );
  }
  return <WorkshopRound key={ri} target={words[ri]} round={ri} total={words.length} nDistract={nDistract} big={big} onSolved={solve} />;
}

// Shared bits between the two round types.
function RoundDots({ round, total }: { round: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 7, justifyContent: "center", marginBottom: 18 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: i === round ? 22 : 9, height: 9, borderRadius: 99, background: i <= round ? "var(--sage)" : "var(--gray)", transition: "all .3s" }} />
      ))}
    </div>
  );
}

function WordPrompt({ entry, color, tint, solved }: { entry: WordEntry; color: string; tint: string; solved: boolean }) {
  return (
    <div
      style={{
        width: 138,
        height: 138,
        borderRadius: "var(--r-xl)",
        background: tint,
        border: "1px solid " + color + "44",
        display: "grid",
        placeItems: "center",
        position: "relative",
        transform: solved ? "scale(1.05)" : "scale(1)",
        transition: "transform .5s cubic-bezier(.2,.8,.3,1)"
      }}
    >
      {entry.picture ? <Pic name={entry.picture} size={96} /> : <Icon name="sound" size={56} color={color} stroke={1.8} />}
      {solved && (
        <div style={{ position: "absolute", top: -10, right: -10, animation: "lin-grow .4s ease both" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--sage)", display: "grid", placeItems: "center", boxShadow: "var(--shadow-md)" }}>
            <Icon name="check" size={22} color="#fff" stroke={3} />
          </div>
        </div>
      )}
    </div>
  );
}

interface Tile {
  id: string;
  ch: string;
}

function WorkshopRound({
  target,
  round,
  total,
  nDistract,
  big,
  onSolved
}: {
  target: WordEntry;
  round: number;
  total: number;
  nDistract: number;
  big: boolean;
  onSolved: () => void;
}) {
  const { speak } = useVoice();
  const letters = target.word.split("");
  const accent = accentFor(target.word);
  const [tray] = useState<Tile[]>(() => {
    const base = letters.map((ch, i) => ({ id: "t" + i, ch }));
    const distract = pick(
      POOL.filter((c) => !letters.includes(c)),
      nDistract
    ).map((ch, i) => ({ id: "d" + i, ch }));
    return [...base, ...distract].sort(() => Math.random() - 0.5);
  });
  const byId: Record<string, Tile> = {};
  tray.forEach((tile) => (byId[tile.id] = tile));
  const [placed, setPlaced] = useState<(string | null)[]>(() => letters.map(() => null));
  const [solved, setSolved] = useState(false);
  const [bad, setBad] = useState(false);

  const TS = big ? 70 : 60;

  const check = (np: (string | null)[]) => {
    if (np.some((x) => x == null)) return;
    const asm = np.map((id) => byId[id!].ch).join("");
    if (asm === target.word) {
      setSolved(true);
      setTimeout(onSolved, 1050);
    } else {
      setBad(true);
      setTimeout(() => {
        setBad(false);
        setPlaced(np.map((id, idx) => (id && byId[id].ch === letters[idx] ? id : null)));
      }, 700);
    }
  };
  const place = (tile: Tile) => {
    if (solved || placed.includes(tile.id)) return;
    const i = placed.indexOf(null);
    if (i < 0) return;
    const np = [...placed];
    np[i] = tile.id;
    setPlaced(np);
    check(np);
  };
  const removeAt = (i: number) => {
    if (solved || placed[i] == null) return;
    const np = [...placed];
    np[i] = null;
    setPlaced(np);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <RoundDots round={round} total={total} />

      {/* picture / prompt */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <WordPrompt entry={target} color={accent.color} tint={accent.tint} solved={solved} />
        <VoiceButton label={"Hear the word " + target.word} color={accent.color} tint={accent.tint} onPlay={() => speak(target.word)} />
      </div>

      <p style={{ fontSize: big ? 22 : 19, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 18 }}>Spell the word</p>

      {/* slots */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 30, animation: bad ? "lin-shake .4s" : "none" }}>
        {placed.map((id, i) => (
          <button
            key={i}
            onClick={() => removeAt(i)}
            aria-label={id ? "Remove letter" : "Empty space"}
            style={{
              width: TS,
              height: TS + 6,
              borderRadius: 16,
              background: id ? "var(--white)" : "var(--cream)",
              border: "2px " + (id ? "solid " + (solved ? "var(--sage)" : "var(--sand-deep)") : "dashed var(--sand-deep)"),
              boxShadow: id ? "var(--shadow-sm)" : "none",
              display: "grid",
              placeItems: "center",
              transition: "all .2s"
            }}
          >
            {id ? (
              <Glyph char={byId[id].ch} size={big ? 40 : 34} color={isVowel(byId[id].ch) ? "var(--coral-deep)" : "var(--ink)"} weight={700} />
            ) : (
              <div style={{ width: 18, height: 4, borderRadius: 99, background: "var(--sand-deep)" }} />
            )}
          </button>
        ))}
      </div>

      {/* tray */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", maxWidth: 420, margin: "0 auto" }}>
        {tray.map((tile) => {
          const used = placed.includes(tile.id);
          return (
            <button
              key={tile.id}
              onClick={() => place(tile)}
              disabled={used}
              aria-label={"Letter " + tile.ch}
              style={{
                width: TS,
                height: TS + 6,
                borderRadius: 16,
                background: used ? "var(--cream)" : "var(--sand)",
                border: "1px solid " + (used ? "var(--line-soft)" : "var(--sand-deep)"),
                boxShadow: used ? "none" : "var(--shadow-sm)",
                display: "grid",
                placeItems: "center",
                cursor: used ? "default" : "pointer",
                transform: used ? "scale(0.94)" : "scale(1)",
                transition: "all .2s",
                opacity: used ? 0.45 : 1
              }}
            >
              {!used && <Glyph char={tile.ch} size={big ? 40 : 34} color={isVowel(tile.ch) ? "var(--coral-deep)" : "var(--ink)"} weight={700} />}
            </button>
          );
        })}
      </div>
      <p style={{ fontSize: 14.5, color: "var(--ink-faint)", marginTop: 22 }}>
        {solved ? "Perfect — that spells “" + target.word + "”." : "Tap a letter to place it · tap a space to take it back"}
      </p>
      <Cheer show={solved} text="You spelled it!" />
    </div>
  );
}

// ── Fill-the-missing-letter round (same word, a fresh challenge) ──
function FillRound({
  target,
  round,
  total,
  blankIndex,
  big,
  onSolved
}: {
  target: WordEntry;
  round: number;
  total: number;
  blankIndex: number;
  big: boolean;
  onSolved: () => void;
}) {
  const { speak } = useVoice();
  const letters = target.word.split("");
  const answer = letters[blankIndex];
  const accent = accentFor(target.word);
  const [choices] = useState<string[]>(() => {
    const sameClass = (isVowel(answer) ? VOWELS : POOL).filter((c) => c !== answer);
    return [answer, ...pick(sameClass, 2)].sort(() => Math.random() - 0.5);
  });
  const [filled, setFilled] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [bad, setBad] = useState<string | null>(null);

  const TS = big ? 70 : 60;

  const choose = (c: string) => {
    if (solved) return;
    if (c === answer) {
      setFilled(c);
      setSolved(true);
      setTimeout(onSolved, 1050);
    } else {
      setBad(c);
      setTimeout(() => setBad(null), 600);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <RoundDots round={round} total={total} />

      {/* picture / prompt */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <WordPrompt entry={target} color={accent.color} tint={accent.tint} solved={solved} />
        <VoiceButton label={"Hear the word " + target.word} color={accent.color} tint={accent.tint} onPlay={() => speak(target.word)} />
      </div>

      <p style={{ fontSize: big ? 22 : 19, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 18 }}>Add the missing letter</p>

      {/* the word, with one blank */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 30, animation: bad ? "lin-shake .4s" : "none" }}>
        {letters.map((ch, i) => {
          const isBlank = i === blankIndex;
          const show = isBlank ? filled : ch;
          return (
            <div
              key={i}
              style={{
                width: TS,
                height: TS + 6,
                borderRadius: 16,
                background: isBlank && !show ? "var(--cream)" : "var(--white)",
                border: "2px " + (isBlank && !show ? "dashed var(--coral)" : "solid " + (solved ? "var(--sage)" : "var(--sand-deep)")),
                boxShadow: isBlank && !show ? "none" : "var(--shadow-sm)",
                display: "grid",
                placeItems: "center",
                transition: "all .2s"
              }}
            >
              {show ? (
                <Glyph char={show} size={big ? 40 : 34} color={isVowel(show) ? "var(--coral-deep)" : "var(--ink)"} weight={700} />
              ) : (
                <div style={{ width: 18, height: 4, borderRadius: 99, background: "var(--coral)" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* letter choices */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", maxWidth: 420, margin: "0 auto" }}>
        {choices.map((c) => (
          <button
            key={c}
            onClick={() => choose(c)}
            disabled={solved}
            aria-label={"Letter " + c}
            style={{
              width: TS,
              height: TS + 6,
              borderRadius: 16,
              background: "var(--sand)",
              border: "2px solid " + (bad === c ? "var(--coral)" : "var(--sand-deep)"),
              boxShadow: "var(--shadow-sm)",
              display: "grid",
              placeItems: "center",
              cursor: solved ? "default" : "pointer",
              animation: bad === c ? "lin-shake .4s" : "none",
              transition: "all .2s"
            }}
          >
            <Glyph char={c} size={big ? 40 : 34} color={isVowel(c) ? "var(--coral-deep)" : "var(--ink)"} weight={700} />
          </button>
        ))}
      </div>
      <p style={{ fontSize: 14.5, color: "var(--ink-faint)", marginTop: 22 }}>
        {solved ? "Perfect — that spells “" + target.word + "”." : "Which letter is missing?"}
      </p>
      <Cheer show={solved} text="You found it!" />
    </div>
  );
}
