"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { Icon } from "./Icon";
import type { IconName } from "./Icon";

// ── Buttons ────────────────────────────────────────────────
type ButtonVariant = "primary" | "soft" | "tint" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  full?: boolean;
  color?: string;
  onClick?: () => void;
  style?: CSSProperties;
  ariaLabel?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  full,
  color,
  onClick,
  style,
  ariaLabel
}: ButtonProps) {
  const [press, setPress] = useState(false);
  const accent = color ?? "var(--coral)";
  const sizes = {
    sm: { padding: "10px 18px", font: 15, radius: "var(--r-pill)", gap: 8 },
    md: { padding: "15px 26px", font: 17, radius: "var(--r-pill)", gap: 10 },
    lg: { padding: "20px 34px", font: 20, radius: "var(--r-pill)", gap: 12 }
  }[size];
  const variants: Record<ButtonVariant, CSSProperties> = {
    primary: { background: accent, color: "#fff", boxShadow: press ? "var(--shadow-press)" : "var(--shadow-sm)" },
    soft: {
      background: "var(--white)",
      color: "var(--ink)",
      boxShadow: press ? "var(--shadow-press)" : "var(--shadow-sm)",
      border: "1px solid var(--line)"
    },
    tint: { background: "var(--coral-tint)", color: "var(--coral-deep)" },
    ghost: { background: "transparent", color: "var(--ink-soft)" }
  };
  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerLeave={() => setPress(false)}
      aria-label={ariaLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: sizes.gap,
        padding: sizes.padding,
        fontSize: sizes.font,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        borderRadius: sizes.radius,
        width: full ? "100%" : "auto",
        transform: press ? "scale(0.97)" : "scale(1)",
        transition: "transform .15s cubic-bezier(.2,.8,.3,1), box-shadow .2s",
        ...variants[variant],
        ...style
      }}
    >
      {icon && <Icon name={icon} size={sizes.font + 3} stroke={2.1} />}
      {children}
      {iconRight && <Icon name={iconRight} size={sizes.font + 3} stroke={2.1} />}
    </button>
  );
}

// ── Card ───────────────────────────────────────────────────
export interface CardProps {
  children?: ReactNode;
  pad?: number;
  radius?: string;
  elevate?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
}

export function Card({
  children,
  pad = 24,
  radius = "var(--r-lg)",
  elevate = "md",
  hover,
  onClick,
  style,
  className
}: CardProps) {
  const [h, setH] = useState(false);
  const shadow = { none: "none", sm: "var(--shadow-sm)", md: "var(--shadow-md)", lg: "var(--shadow-lg)" }[elevate];
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className={className}
      style={{
        background: "var(--white)",
        borderRadius: radius,
        padding: pad,
        boxShadow: hover && h ? "var(--shadow-lg)" : shadow,
        border: "1px solid var(--line-soft)",
        transform: hover && h ? "translateY(-3px)" : "none",
        transition: "transform .25s cubic-bezier(.2,.8,.3,1), box-shadow .25s",
        cursor: onClick ? "pointer" : "default",
        ...style
      }}
    >
      {children}
    </div>
  );
}

// ── Chip / Pill ────────────────────────────────────────────
export interface ChipProps {
  children?: ReactNode;
  color?: string;
  tint?: string;
  icon?: IconName;
  active?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export function Chip({ children, color = "var(--sage)", tint = "var(--sage-tint)", icon, active, onClick, style }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 16px",
        borderRadius: "var(--r-pill)",
        fontSize: 15,
        fontWeight: 600,
        background: active ? color : tint,
        color: active ? "#fff" : color,
        border: "1px solid " + (active ? color : "transparent"),
        transition: "all .2s",
        cursor: onClick ? "pointer" : "default",
        ...style
      }}
    >
      {icon && <Icon name={icon} size={17} stroke={2.2} />}
      {children}
    </button>
  );
}

// ── Section eyebrow ────────────────────────────────────────
export function Eyebrow({ children, color = "var(--ink-faint)" }: { children?: ReactNode; color?: string }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color }}>
      {children}
    </div>
  );
}

// ── Progress ring ──────────────────────────────────────────
export function ProgressRing({
  value = 0,
  size = 64,
  stroke = 7,
  color = "var(--sage)",
  track = "var(--gray)",
  children
}: {
  value?: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, display: "grid", placeItems: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value)}
          style={{ transition: "stroke-dashoffset .8s cubic-bezier(.2,.8,.3,1)" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>{children}</div>
    </div>
  );
}

// ── Seed meter (calm reward currency) ──────────────────────
export function SeedMeter({ count = 0, total = 5, size = 22 }: { count?: number; total?: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <Icon
          key={i}
          name="seed"
          size={size}
          stroke={2}
          color={i < count ? "var(--sage-deep)" : "var(--gray)"}
          style={{ fill: i < count ? "var(--sage-tint)" : "transparent", transition: "all .3s" }}
        />
      ))}
    </div>
  );
}

// ── Round icon badge ───────────────────────────────────────
export function IconBadge({
  name,
  color = "var(--coral)",
  tint = "var(--coral-tint)",
  size = 54,
  iconSize
}: {
  name: IconName;
  color?: string;
  tint?: string;
  size?: number;
  iconSize?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.34,
        background: tint,
        display: "grid",
        placeItems: "center",
        flexShrink: 0
      }}
    >
      <Icon name={name} size={iconSize ?? size * 0.46} stroke={2.1} color={color} />
    </div>
  );
}

// ── Big tappable letter glyph ──────────────────────────────
export function Glyph({
  char,
  color = "var(--ink)",
  size = 80,
  weight = 600
}: {
  char: string;
  color?: string;
  size?: number;
  weight?: number;
}) {
  return (
    <span
      style={{
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1,
        color,
        letterSpacing: "-0.02em",
        fontFeatureSettings: '"ss01"'
      }}
    >
      {char}
    </span>
  );
}

// ── Audio / voice-guidance button ──────────────────────────
export function VoiceButton({
  label = "Listen",
  color = "var(--honey)",
  tint = "var(--honey-tint)",
  size = "md",
  onPlay
}: {
  label?: string;
  color?: string;
  tint?: string;
  size?: "md" | "lg";
  onPlay?: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const dims = size === "lg" ? 72 : 52;
  return (
    <button
      onClick={() => {
        setPlaying(true);
        onPlay?.();
        setTimeout(() => setPlaying(false), 1400);
      }}
      aria-label={label}
      style={{
        width: dims,
        height: dims,
        borderRadius: "50%",
        background: tint,
        display: "grid",
        placeItems: "center",
        position: "relative",
        boxShadow: "var(--shadow-sm)"
      }}
    >
      {playing && (
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid " + color,
            animation: "lin-breathe 1.2s ease-in-out infinite",
            opacity: 0.6
          }}
        />
      )}
      <Icon name="sound" size={dims * 0.42} color={color} stroke={2.2} />
    </button>
  );
}

// ── Responsive, device-agnostic app frame ──────────────────
export function AppCanvas({
  children,
  max = 980,
  bg = "var(--bg)",
  pad = true
}: {
  children?: ReactNode;
  max?: number;
  bg?: string;
  pad?: boolean;
}) {
  return (
    <div style={{ minHeight: "100vh", background: bg, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: max, padding: pad ? "0 clamp(16px, 4vw, 40px)" : 0 }}>{children}</div>
    </div>
  );
}

// ── Entrance via state-driven transition (never stuck invisible) ──
export function FadeIn({
  children,
  delay = 0,
  y = 10,
  style
}: {
  children?: ReactNode;
  delay?: number;
  y?: number;
  style?: CSSProperties;
}) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setShown(true), delay * 1000);
    return () => clearTimeout(id);
  }, [delay]);
  return (
    <div
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: "opacity .55s cubic-bezier(.2,.8,.3,1), transform .55s cubic-bezier(.2,.8,.3,1)",
        ...style
      }}
    >
      {children}
    </div>
  );
}
