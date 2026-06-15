"use client";

import { useId } from "react";
import type { CSSProperties } from "react";

import { Icon } from "./Icon";

// ── Sprout (grows with stage 0..4, used across the garden) ──
export function Sprout({ size = 120, stage = 3 }: { size?: number; stage?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-hidden>
      <ellipse cx="60" cy="104" rx="34" ry="8" fill="var(--sand)" />
      <path d="M40 86h40l-4 18a4 4 0 0 1-4 3.4H48a4 4 0 0 1-4-3.4L40 86Z" fill="var(--coral)" />
      <rect x="37" y="80" width="46" height="9" rx="4.5" fill="var(--coral-deep)" />
      {stage >= 1 && (
        <path d={`M60 86 V ${86 - stage * 12}`} stroke="var(--sage-deep)" strokeWidth="5" strokeLinecap="round" />
      )}
      {stage >= 1 && <path d="M60 70c-9 1-14-4-14-4 5-3 11-1 14 4Z" fill="var(--sage)" />}
      {stage >= 2 && <path d="M60 60c9 1 14-4 14-4-5-3-11-1-14 4Z" fill="var(--sage)" />}
      {stage >= 3 && <circle cx="60" cy={86 - stage * 12 + 2} r="11" fill="var(--sage)" />}
      {stage >= 4 && <circle cx="60" cy={86 - stage * 12 + 2} r="5" fill="var(--honey)" />}
    </svg>
  );
}

// ── Linden tree (the growth metaphor) ──
export function LindenTree({ size = 200 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" aria-hidden>
      <ellipse cx="100" cy="178" rx="62" ry="12" fill="var(--sand)" />
      <rect x="93" y="110" width="14" height="62" rx="7" fill="#9A7858" />
      <path d="M100 150c-7-8-18-8-18-8" stroke="#9A7858" strokeWidth="6" strokeLinecap="round" />
      <path d="M100 138c8-8 18-7 18-7" stroke="#9A7858" strokeWidth="6" strokeLinecap="round" />
      <circle cx="100" cy="78" r="44" fill="var(--sage)" />
      <circle cx="62" cy="98" r="26" fill="var(--sage-deep)" />
      <circle cx="138" cy="98" r="26" fill="var(--sage-deep)" />
      <circle cx="100" cy="62" r="28" fill="var(--sage)" />
      <circle cx="88" cy="70" r="4" fill="var(--honey)" />
      <circle cx="118" cy="86" r="4" fill="var(--honey)" />
      <circle cx="74" cy="92" r="3.4" fill="var(--coral)" />
    </svg>
  );
}

// ── Calm hill + sun horizon (welcome / empty states) ──
export function Scene({ size = 160 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 200 140" fill="none" aria-hidden>
      <circle cx="150" cy="52" r="26" fill="var(--honey-tint)" />
      <circle cx="150" cy="52" r="15" fill="var(--honey)" />
      <path d="M0 140c40-40 70-40 100-22 30 18 60 18 100-18v40H0Z" fill="var(--sage-tint)" />
      <path d="M0 140c50-26 80-22 110-6 28 14 60 12 90-10v16H0Z" fill="var(--sage)" />
    </svg>
  );
}

// ── Object picture illustrations (paper-cut, for the games) ──
export const PICTURE_NAMES = [
  "sun", "cat", "bus", "cup", "bee", "hat",
  "dog", "pig", "fox", "fish", "frog", "bed", "box", "nut", "web", "van"
] as const;
export type PictureName = (typeof PICTURE_NAMES)[number];

export function isPictureName(value: string): value is PictureName {
  return (PICTURE_NAMES as readonly string[]).includes(value);
}

const PIC_RAYS = [...Array(8)].map((_, i) => {
  const a = (i * Math.PI) / 4;
  return (
    <line
      key={i}
      x1={50 + Math.cos(a) * 25}
      y1={50 + Math.sin(a) * 25}
      x2={50 + Math.cos(a) * 36}
      y2={50 + Math.sin(a) * 36}
      stroke="var(--honey-deep)"
      strokeWidth="6"
      strokeLinecap="round"
    />
  );
});

// The bee needs a per-instance clip-path id, so it renders on its own.
function BeeBody({ uid }: { uid: string }) {
  return (
    <g>
      <ellipse cx="42" cy="38" rx="13" ry="8" fill="var(--sage-tint)" stroke="var(--sage)" strokeWidth="2" transform="rotate(-18 42 38)" />
      <ellipse cx="60" cy="38" rx="13" ry="8" fill="var(--sage-tint)" stroke="var(--sage)" strokeWidth="2" transform="rotate(18 60 38)" />
      <clipPath id={`bee${uid}`}>
        <ellipse cx="52" cy="58" rx="22" ry="15" />
      </clipPath>
      <ellipse cx="52" cy="58" rx="22" ry="15" fill="var(--honey)" />
      <g clipPath={`url(#bee${uid})`}>
        <rect x="46" y="42" width="6" height="32" rx="3" fill="var(--ink)" />
        <rect x="58" y="42" width="6" height="32" rx="3" fill="var(--ink)" />
      </g>
      <circle cx="28" cy="56" r="9" fill="var(--ink)" />
      <path d="M24 49 l-4 -7 M30 48 l1 -8" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="42" r="2.2" fill="var(--ink)" />
      <circle cx="31" cy="40" r="2.2" fill="var(--ink)" />
    </g>
  );
}

// Static picture geometry, built once at module load (no per-render allocation).
const STATIC_PICTURES: Record<Exclude<PictureName, "bee">, React.ReactNode> = {
    sun: (
      <g>
        {PIC_RAYS}
        <circle cx="50" cy="50" r="20" fill="var(--honey)" />
      </g>
    ),
    cat: (
      <g>
        <path d="M30 40 L33 20 L49 35 Z" fill="var(--sand-deep)" />
        <path d="M70 40 L67 20 L51 35 Z" fill="var(--sand-deep)" />
        <path d="M35 35 L36 26 L44 34 Z" fill="var(--coral-tint)" />
        <path d="M65 35 L64 26 L56 34 Z" fill="var(--coral-tint)" />
        <circle cx="50" cy="56" r="24" fill="var(--sand-deep)" />
        <ellipse cx="42" cy="54" rx="2.6" ry="4" fill="var(--ink)" />
        <ellipse cx="58" cy="54" rx="2.6" ry="4" fill="var(--ink)" />
        <path d="M50 60 l3.5 4 h-7 Z" fill="var(--coral)" />
        <path d="M50 64 q-4 4 -9 2 M50 64 q4 4 9 2" stroke="var(--ink)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M30 54 h-10 M30 59 h-11 M70 54 h10 M70 59 h11" stroke="var(--ink-faint)" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    ),
    bus: (
      <g>
        <rect x="12" y="30" width="76" height="42" rx="13" fill="var(--honey)" />
        <rect x="20" y="38" width="17" height="13" rx="3.5" fill="var(--bg)" />
        <rect x="43" y="38" width="17" height="13" rx="3.5" fill="var(--bg)" />
        <rect x="66" y="38" width="14" height="13" rx="3.5" fill="var(--bg)" />
        <rect x="12" y="58" width="76" height="6" fill="var(--honey-deep)" />
        <circle cx="32" cy="74" r="8" fill="var(--ink)" />
        <circle cx="68" cy="74" r="8" fill="var(--ink)" />
        <circle cx="32" cy="74" r="3" fill="var(--sand)" />
        <circle cx="68" cy="74" r="3" fill="var(--sand)" />
      </g>
    ),
    cup: (
      <g>
        <ellipse cx="48" cy="78" rx="28" ry="5" fill="var(--sand-deep)" />
        <path d="M44 30 q3 -6 0 -11 M54 30 q3 -6 0 -11" stroke="var(--ink-faint)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M68 50 a11 11 0 0 1 0 18" stroke="var(--coral)" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M33 44 h34 l-3 27 a4 4 0 0 1 -4 3.5 H40 a4 4 0 0 1 -4 -3.5 Z" fill="var(--coral)" />
        <rect x="31" y="40" width="38" height="8" rx="4" fill="var(--coral-deep)" />
      </g>
    ),
    hat: (
      <g>
        <ellipse cx="50" cy="64" rx="34" ry="9" fill="var(--sage)" />
        <path d="M27 64 Q50 28 73 64 Z" fill="var(--sage-deep)" />
        <path d="M30 61 Q50 71 70 61" stroke="var(--coral)" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
    ),
    dog: (
      <g>
        <path d="M28 34 q-7 13 3 23 l9 -7 Z" fill="var(--sand-deep)" />
        <path d="M72 34 q7 13 -3 23 l-9 -7 Z" fill="var(--sand-deep)" />
        <circle cx="50" cy="52" r="23" fill="var(--honey)" />
        <circle cx="43" cy="49" r="3" fill="var(--ink)" />
        <circle cx="57" cy="49" r="3" fill="var(--ink)" />
        <ellipse cx="50" cy="62" rx="9" ry="7" fill="var(--honey-tint)" />
        <circle cx="50" cy="59" r="3.4" fill="var(--ink)" />
        <path d="M50 62 v4" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
      </g>
    ),
    pig: (
      <g>
        <path d="M36 32 l6 9 l-10 1 Z" fill="var(--coral)" />
        <path d="M64 32 l-6 9 l10 1 Z" fill="var(--coral)" />
        <circle cx="50" cy="54" r="23" fill="var(--coral-tint)" stroke="var(--coral)" strokeWidth="2" />
        <ellipse cx="50" cy="60" rx="12" ry="9" fill="var(--coral)" />
        <circle cx="46" cy="60" r="2" fill="var(--ink)" />
        <circle cx="54" cy="60" r="2" fill="var(--ink)" />
        <circle cx="42" cy="48" r="2.4" fill="var(--ink)" />
        <circle cx="58" cy="48" r="2.4" fill="var(--ink)" />
      </g>
    ),
    fox: (
      <g>
        <path d="M30 30 L36 50 L44 40 Z" fill="var(--coral)" />
        <path d="M70 30 L64 50 L56 40 Z" fill="var(--coral)" />
        <path d="M30 44 Q50 36 70 44 L50 72 Z" fill="var(--coral)" />
        <path d="M40 58 Q50 54 60 58 L50 70 Z" fill="var(--white)" />
        <circle cx="43" cy="50" r="2.6" fill="var(--ink)" />
        <circle cx="57" cy="50" r="2.6" fill="var(--ink)" />
        <circle cx="50" cy="64" r="2.6" fill="var(--ink)" />
      </g>
    ),
    fish: (
      <g>
        <path d="M68 50 L86 38 L84 62 Z" fill="var(--sage-deep)" />
        <ellipse cx="46" cy="50" rx="28" ry="18" fill="var(--sage)" />
        <path d="M52 50 q9 -7 18 0 q-9 7 -18 0 Z" fill="var(--sage-deep)" />
        <circle cx="34" cy="46" r="3" fill="var(--ink)" />
      </g>
    ),
    frog: (
      <g>
        <ellipse cx="50" cy="58" rx="26" ry="20" fill="var(--sage)" />
        <circle cx="38" cy="38" r="10" fill="var(--sage)" />
        <circle cx="62" cy="38" r="10" fill="var(--sage)" />
        <circle cx="38" cy="37" r="4.5" fill="var(--white)" />
        <circle cx="62" cy="37" r="4.5" fill="var(--white)" />
        <circle cx="38" cy="38" r="2.4" fill="var(--ink)" />
        <circle cx="62" cy="38" r="2.4" fill="var(--ink)" />
        <path d="M38 60 q12 9 24 0" stroke="var(--sage-deep)" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    ),
    bed: (
      <g>
        <rect x="18" y="44" width="64" height="26" rx="4" fill="var(--sand-deep)" />
        <rect x="14" y="54" width="72" height="18" rx="4" fill="var(--coral)" />
        <rect x="22" y="40" width="22" height="16" rx="5" fill="var(--white)" stroke="var(--sand-deep)" strokeWidth="1.5" />
        <rect x="15" y="38" width="5" height="34" rx="2.5" fill="var(--sand-deep)" />
        <rect x="80" y="48" width="5" height="24" rx="2.5" fill="var(--sand-deep)" />
      </g>
    ),
    box: (
      <g>
        <path d="M24 40 L50 32 L76 40 L50 48 Z" fill="var(--honey)" />
        <path d="M24 40 L24 66 L50 74 L50 48 Z" fill="var(--honey-deep)" />
        <path d="M76 40 L76 66 L50 74 L50 48 Z" fill="var(--honey)" />
        <path d="M37 36 L63 44" stroke="var(--sand-deep)" strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
    nut: (
      <g>
        <rect x="48" y="28" width="4" height="9" rx="2" fill="var(--sand-deep)" />
        <path d="M34 44 Q50 30 66 44 Q50 51 34 44 Z" fill="var(--honey-deep)" />
        <path d="M36 46 Q50 80 64 46 Z" fill="var(--honey)" />
      </g>
    ),
    web: (
      <g stroke="var(--ink-faint)" strokeWidth="2" fill="none" strokeLinecap="round">
        <line x1="50" y1="50" x2="50" y2="16" />
        <line x1="50" y1="50" x2="74" y2="26" />
        <line x1="50" y1="50" x2="84" y2="50" />
        <line x1="50" y1="50" x2="74" y2="74" />
        <line x1="50" y1="50" x2="50" y2="84" />
        <line x1="50" y1="50" x2="26" y2="74" />
        <line x1="50" y1="50" x2="16" y2="50" />
        <line x1="50" y1="50" x2="26" y2="26" />
        <circle cx="50" cy="50" r="12" />
        <circle cx="50" cy="50" r="22" />
        <circle cx="50" cy="50" r="32" />
      </g>
    ),
    van: (
      <g>
        <rect x="12" y="36" width="64" height="30" rx="8" fill="var(--sage)" />
        <rect x="18" y="42" width="24" height="12" rx="3" fill="var(--bg)" />
        <rect x="46" y="42" width="24" height="12" rx="3" fill="var(--bg)" />
        <rect x="12" y="58" width="64" height="5" fill="var(--sage-deep)" />
        <circle cx="28" cy="68" r="7" fill="var(--ink)" />
        <circle cx="60" cy="68" r="7" fill="var(--ink)" />
        <circle cx="28" cy="68" r="2.6" fill="var(--sand)" />
        <circle cx="60" cy="68" r="2.6" fill="var(--sand)" />
      </g>
    )
};

export function Pic({ name, size = 88, style }: { name: PictureName; size?: number; style?: CSSProperties }) {
  const uid = useId().replaceAll(":", "");
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden style={style}>
      {name === "bee" ? <BeeBody uid={uid} /> : STATIC_PICTURES[name]}
    </svg>
  );
}

// Re-export Icon for convenience where illustrations + icons are used together.
export { Icon };
