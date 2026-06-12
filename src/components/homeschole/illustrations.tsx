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
export const PICTURE_NAMES = ["sun", "cat", "bus", "cup", "bee", "hat"] as const;
export type PictureName = (typeof PICTURE_NAMES)[number];

export function isPictureName(value: string): value is PictureName {
  return (PICTURE_NAMES as readonly string[]).includes(value);
}

export function Pic({ name, size = 88, style }: { name: PictureName; size?: number; style?: CSSProperties }) {
  const uid = useId().replace(/:/g, "");
  const rays = [...Array(8)].map((_, i) => {
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
  const pictures: Record<PictureName, React.ReactNode> = {
    sun: (
      <g>
        {rays}
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
    bee: (
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
    ),
    hat: (
      <g>
        <ellipse cx="50" cy="64" rx="34" ry="9" fill="var(--sage)" />
        <path d="M27 64 Q50 28 73 64 Z" fill="var(--sage-deep)" />
        <path d="M30 61 Q50 71 70 61" stroke="var(--coral)" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>
    )
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden style={style}>
      {pictures[name]}
    </svg>
  );
}

// Re-export Icon for convenience where illustrations + icons are used together.
export { Icon };
