"use client";

import { useState } from "react";

import { Icon } from "../Icon";
import { Card, Glyph, VoiceButton } from "../ds";
import { useVoice } from "../voice-context";
import { Cheer, WORD_BANK, pick } from "./shared";
import type { BankEntry } from "./shared";
import type { ActivityMeta } from "@/lib/homeschole/activity-meta";

export function Phonics({ meta, onComplete, big }: { meta: ActivityMeta; onComplete: () => void; big: boolean }) {
  const { speakLetter } = useVoice();
  const [rounds] = useState(() => pick(WORD_BANK, 3));
  const [round, setRound] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [cheer, setCheer] = useState(false);
  const target = rounds[round];
  const [options] = useState(() => rounds.map((t) => pick([t, ...pick(WORD_BANK.filter((w) => w.letter !== t.letter), 2)], 3)));

  const choose = (opt: BankEntry) => {
    if (opt.letter === target.letter) {
      setCheer(true);
      setTimeout(() => {
        setCheer(false);
        if (round + 1 >= rounds.length) onComplete();
        else setRound((r) => r + 1);
      }, 850);
    } else {
      setWrong(opt.word);
      setTimeout(() => setWrong(null), 600);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: big ? 23 : 20, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 18 }}>Which one begins with this sound?</p>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 32 }}>
        <Card
          pad={0}
          radius="var(--r-xl)"
          style={{ display: "inline-grid", placeItems: "center", width: 132, height: 132, background: target.tint, border: "1px solid " + target.color + "44" }}
        >
          <Glyph char={target.letter} color={target.color} size={84} weight={700} />
        </Card>
        <VoiceButton size="lg" color={target.color} tint={target.tint} label={`Sound of ${target.letter}`} onPlay={() => speakLetter(target.letter)} />
      </div>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        {options[round].map((opt, i) => (
          <button
            key={i}
            onClick={() => choose(opt)}
            style={{
              width: big ? 132 : 116,
              padding: big ? "22px 12px" : "18px 12px",
              borderRadius: "var(--r-lg)",
              background: "var(--white)",
              border: "2px solid " + (wrong === opt.word ? "var(--coral)" : "var(--line)"),
              boxShadow: "var(--shadow-md)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              transition: "all .2s",
              animation: wrong === opt.word ? "lin-shake .4s" : "none"
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: "var(--r-md)", background: opt.tint, display: "grid", placeItems: "center" }}>
              <Icon name={opt.icon} size={34} color={opt.color} stroke={2} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 700 }}>{opt.word}</span>
          </button>
        ))}
      </div>
      <Cheer show={cheer} text="Great ears!" />
    </div>
  );
}
