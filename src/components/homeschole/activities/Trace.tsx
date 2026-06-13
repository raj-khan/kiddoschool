"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { Card, VoiceButton } from "../ds";
import { useVoice } from "../voice-context";
import { Cheer, WORD_BANK } from "./shared";
import type { ActivityMeta } from "@/lib/homeschole/activity-meta";

const TRACE_LETTERS: Record<string, [number, number][]> = {
  S: [[215, 85], [170, 62], [125, 70], [110, 108], [142, 138], [192, 166], [208, 208], [172, 252], [118, 258], [82, 232]],
  C: [[222, 98], [182, 70], [132, 72], [96, 108], [86, 168], [98, 226], [138, 260], [188, 258], [222, 236]],
  U: [[80, 72], [80, 196], [108, 248], [158, 262], [208, 250], [234, 196], [234, 72]],
  M: [[62, 288], [62, 84], [150, 214], [238, 84], [238, 288]],
  L: [[92, 72], [92, 256], [226, 256]]
};

export function Trace({ meta, onComplete, big }: { meta: ActivityMeta; onComplete: () => void; big: boolean }) {
  const { speakLetter } = useVoice();
  const letters = Object.keys(TRACE_LETTERS);
  const [letter] = useState(() => letters[Math.floor(Math.random() * letters.length)]);
  const pts = TRACE_LETTERS[letter];
  const [reached, setReached] = useState(0);
  const [done, setDone] = useState(false);
  const [boardSize, setBoardSize] = useState(320);
  const svgRef = useRef<SVGSVGElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const update = () => setBoardSize(Math.min(360, window.innerWidth - 60));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const toLocal = (e: ReactPointerEvent<SVGSVGElement>): [number, number] => {
    const r = svgRef.current!.getBoundingClientRect();
    const cx = e.clientX - r.left;
    const cy = e.clientY - r.top;
    return [cx * (320 / r.width), cy * (340 / r.height)];
  };

  const handleMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drawing.current || done) return;
    const [x, y] = toLocal(e);
    const target = pts[reached];
    if (!target) return;
    const d = Math.hypot(x - target[0], y - target[1]);
    if (d < 46) {
      const nx = reached + 1;
      setReached(nx);
      if (nx >= pts.length) {
        setDone(true);
        drawing.current = false;
        setTimeout(onComplete, 800);
      }
    }
  };

  const linePath = pts
    .slice(0, Math.max(1, reached))
    .map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`))
    .join(" ");
  const guidePath = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const sounds = WORD_BANK.find((w) => w.letter === letter)?.word.toLowerCase() ?? letter;

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: big ? 23 : 20, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 8 }}>Trace the letter</p>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, display: "flex", gap: 12, justifyContent: "center", alignItems: "center" }}>
        <VoiceButton color={meta.color} tint={meta.tint} label={`Sound of ${letter}`} onPlay={() => speakLetter(letter)} />{" "}
        <span>
          “{letter}” — sounds like {sounds}
        </span>
      </h2>
      <Card pad={0} radius="var(--r-xl)" style={{ display: "inline-block", background: "var(--cream)", border: "1px solid var(--sand)", touchAction: "none", overflow: "hidden" }}>
        <svg
          ref={svgRef}
          width={boardSize}
          height={Math.round(boardSize * 1.06)}
          viewBox="0 0 320 340"
          onPointerDown={(e) => {
            drawing.current = true;
            handleMove(e);
          }}
          onPointerMove={handleMove}
          onPointerUp={() => (drawing.current = false)}
          onPointerLeave={() => (drawing.current = false)}
          style={{ display: "block", cursor: "pointer" }}
        >
          <text x="160" y="244" textAnchor="middle" fontSize="300" fontWeight="700" fill={meta.tint} fontFamily="var(--font)">
            {letter}
          </text>
          <path d={guidePath} fill="none" stroke={meta.color} strokeOpacity="0.35" strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" />
          <path d={linePath} fill="none" stroke={meta.color} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p[0]}
              cy={p[1]}
              r={i === reached && !done ? 15 : 9}
              fill={i < reached ? meta.color : i === reached ? "#fff" : "var(--sand-deep)"}
              stroke={i === reached ? meta.color : "transparent"}
              strokeWidth="4"
              style={{ animation: i === reached && !done ? "lin-breathe 1.3s ease-in-out infinite" : "none" }}
            />
          ))}
          {reached === 0 && <circle cx={pts[0][0]} cy={pts[0][1]} r="26" fill="none" stroke={meta.color} strokeWidth="2.5" opacity="0.5" />}
        </svg>
      </Card>
      <p style={{ fontSize: 16, color: "var(--ink-faint)", marginTop: 18 }}>
        {done ? "Beautiful tracing." : reached === 0 ? "Start at the glowing dot" : "Keep going — follow the dots"}
      </p>
      <Cheer show={done} text="Beautiful!" />
    </div>
  );
}
