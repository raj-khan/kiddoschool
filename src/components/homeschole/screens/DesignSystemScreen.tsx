"use client";

import type { ReactNode } from "react";

import { Icon } from "../Icon";
import type { IconName } from "../Icon";
import { LindenTree, Scene, Sprout } from "../illustrations";
import {
  AppCanvas,
  Button,
  Card,
  Chip,
  Eyebrow,
  Glyph,
  IconBadge,
  ProgressRing,
  SeedMeter,
  VoiceButton
} from "../ds";

function Swatch({ name, varName, hex }: { name: string; varName: string; hex: string }) {
  return (
    <div>
      <div style={{ height: 78, borderRadius: "var(--r-md)", background: `var(${varName})`, border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }} />
      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>{name}</div>
      <div style={{ fontSize: 12.5, color: "var(--ink-faint)", fontFamily: "monospace" }}>{hex}</div>
    </div>
  );
}

function DSBlock({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>{title}</h2>
      {desc && <p style={{ fontSize: 16, color: "var(--ink-soft)", marginTop: 6, marginBottom: 22, maxWidth: 560, lineHeight: 1.5 }}>{desc}</p>}
      {children}
    </div>
  );
}

const TYPE_ROWS: [string, string, number, string][] = [
  ["Display", "clamp(34px,6vw,48px)", 700, "Where little minds take root."],
  ["Title", "30px", 700, "Today's journey"],
  ["Heading", "22px", 700, "Trace the letter"],
  ["Body", "17px", 500, "Pick a few. homeschole adapts as your child grows."],
  ["Label", "13px", 700, "PHONICS · STEP TWO"]
];

const ICON_GALLERY: IconName[] = [
  "today", "garden", "trace", "match", "phonics", "connect", "memory", "book",
  "sound", "seed", "star", "sparkle", "heart", "sun", "leaf", "flower", "printer", "globe", "clock", "parent"
];

export function DesignSystemScreen({ onExit }: { onExit: () => void }) {
  return (
    <AppCanvas max={920}>
      <div style={{ paddingTop: 36, paddingBottom: 90 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <Eyebrow color="var(--sage-deep)">homeschole design system</Eyebrow>
          <Button variant="soft" size="sm" icon="back" onClick={onExit}>
            Back
          </Button>
        </div>
        <h1 style={{ fontSize: "clamp(32px,6vw,46px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 10 }}>Apple meets Montessori</h1>
        <p style={{ fontSize: 18, color: "var(--ink-soft)", maxWidth: 600, lineHeight: 1.55, marginBottom: 48 }}>
          A calm, intentional system: warm neutrals, three quiet accents, generous type, soft shadows, and gentle motion. Built to feel trusted by parents and delightful for children.
        </p>

        {/* COLOR */}
        <DSBlock
          title="Color"
          desc="Warm neutrals do the work; three accents carry meaning — coral for warmth & action, sage for growth & success, honey for sound & delight. No rainbows, no neon, no gradients."
        >
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>Neutrals</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 14, marginBottom: 28 }}>
            <Swatch name="Warm white" varName="--bg" hex="#FDFBF7" />
            <Swatch name="Soft cream" varName="--cream" hex="#F7F2E9" />
            <Swatch name="Light sand" varName="--sand" hex="#EFE7D8" />
            <Swatch name="Gentle gray" varName="--gray" hex="#E6E1D6" />
            <Swatch name="Ink" varName="--ink" hex="#3D372F" />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)", marginBottom: 12 }}>Accents</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 14 }}>
            <Swatch name="Coral" varName="--coral" hex="#E08A77" />
            <Swatch name="Coral tint" varName="--coral-tint" hex="#F7E6DF" />
            <Swatch name="Sage" varName="--sage" hex="#9DAE8B" />
            <Swatch name="Sage tint" varName="--sage-tint" hex="#E9EEE1" />
            <Swatch name="Honey" varName="--honey" hex="#E6B450" />
            <Swatch name="Honey tint" varName="--honey-tint" hex="#F8EDD2" />
          </div>
        </DSBlock>

        {/* TYPE */}
        <DSBlock title="Typography" desc="DM Sans — rounded, modern, exceptionally readable. A confident scale: big where it matters, never childish.">
          <Card pad={30} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {TYPE_ROWS.map(([k, size, w, txt]) => (
              <div key={k} style={{ display: "flex", alignItems: "baseline", gap: 20, padding: "12px 0", borderBottom: "1px solid var(--line-soft)" }}>
                <span style={{ width: 80, flexShrink: 0, fontSize: 13, fontWeight: 700, color: "var(--ink-faint)" }}>{k}</span>
                <span
                  style={{
                    fontSize: size,
                    fontWeight: w,
                    letterSpacing: k === "Label" ? "0.1em" : "-0.02em",
                    textTransform: k === "Label" ? "uppercase" : "none",
                    lineHeight: 1.15
                  }}
                >
                  {txt}
                </span>
              </div>
            ))}
          </Card>
        </DSBlock>

        {/* SPACING + RADIUS + SHADOW */}
        <DSBlock title="Spacing, radius & elevation" desc="A 4px spacing base, generous-but-elegant corners, and soft warm shadows — never harsh.">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }} className="lin-resp-grid">
            <Card pad={22}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Spacing · 4px base</div>
              {[4, 8, 16, 24, 32].map((s) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ height: 12, width: s, background: "var(--sage)", borderRadius: 3 }} />
                  <span style={{ fontSize: 12.5, color: "var(--ink-faint)", fontFamily: "monospace" }}>{s}px</span>
                </div>
              ))}
            </Card>
            <Card pad={22}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Radius</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {([["sm", 12], ["md", 18], ["lg", 26], ["xl", 36]] as [string, number][]).map(([k, r]) => (
                  <div key={k} style={{ textAlign: "center" }}>
                    <div style={{ width: 50, height: 50, background: "var(--coral-tint)", border: "1.5px solid var(--coral)", borderRadius: r }} />
                    <div style={{ fontSize: 11.5, color: "var(--ink-faint)", marginTop: 5 }}>{k}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card pad={22}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Elevation</div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {["--shadow-sm", "--shadow-md", "--shadow-lg"].map((s) => (
                  <div key={s} style={{ width: 54, height: 54, borderRadius: "var(--r-md)", background: "var(--white)", boxShadow: `var(${s})` }} />
                ))}
              </div>
            </Card>
          </div>
        </DSBlock>

        {/* COMPONENTS */}
        <DSBlock title="Components" desc="Tactile, rounded, confident. Large touch targets that still read as premium.">
          <Card pad={30}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 24, alignItems: "center" }}>
              <Button color="var(--coral)">Primary</Button>
              <Button variant="soft" icon="sound">
                Soft
              </Button>
              <Button variant="tint" color="var(--sage)">
                Tint
              </Button>
              <Button variant="ghost">Ghost</Button>
              <VoiceButton />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24, alignItems: "center" }}>
              <Chip icon="book" color="var(--coral)" tint="var(--coral-tint)">
                Reading
              </Chip>
              <Chip icon="trace" color="var(--sage)" tint="var(--sage-tint)" active>
                Writing
              </Chip>
              <Chip icon="phonics" color="var(--honey-deep)" tint="var(--honey-tint)">
                Phonics
              </Chip>
              <IconBadge name="match" />
              <IconBadge name="memory" color="var(--sage)" tint="var(--sage-tint)" />
              <IconBadge name="phonics" color="var(--honey-deep)" tint="var(--honey-tint)" />
            </div>
            <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
              <ProgressRing value={0.66} size={68}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>66%</span>
              </ProgressRing>
              <SeedMeter count={3} total={5} />
              <Glyph char="Aa" size={56} />
            </div>
          </Card>
        </DSBlock>

        {/* ICONS */}
        <DSBlock title="Iconography" desc="One quiet line-icon family — 2px rounded strokes — plus warm paper-cut illustrations built only from accent shapes.">
          <Card pad={28}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(72px,1fr))", gap: 18 }}>
              {ICON_GALLERY.map((n) => (
                <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 50, height: 50, borderRadius: "var(--r-md)", background: "var(--cream)", display: "grid", placeItems: "center" }}>
                    <Icon name={n} size={26} stroke={2} />
                  </div>
                  <span style={{ fontSize: 11, color: "var(--ink-faint)" }}>{n}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 26, marginTop: 28, flexWrap: "wrap", alignItems: "flex-end" }}>
              <Sprout size={100} stage={2} />
              <Sprout size={100} stage={4} />
              <LindenTree size={130} />
              <Scene size={150} />
            </div>
          </Card>
        </DSBlock>

        {/* REWARD SYSTEM */}
        <DSBlock title="Reward system" desc="Calm by design. Children plant seeds that grow a garden over time — slow, cumulative, satisfying. No flashing, no pressure, no dopamine loops.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
            {(
              [
                ["Seed", "A single seed per finished step.", "seed", "var(--sage)", "var(--sage-tint)"],
                ["Garden", "Seeds accumulate into a growing garden.", "garden", "var(--sage-deep)", "var(--sage-tint)"],
                ["Gentle praise", "Quiet, specific encouragement — then it stops.", "heart", "var(--coral)", "var(--coral-tint)"]
              ] as [string, string, IconName, string, string][]
            ).map(([t, d, ic, c, tn]) => (
              <Card key={t} pad={22}>
                <IconBadge name={ic} color={c} tint={tn} size={46} />
                <div style={{ fontSize: 17, fontWeight: 700, marginTop: 12 }}>{t}</div>
                <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.45, marginTop: 4 }}>{d}</p>
              </Card>
            ))}
          </div>
        </DSBlock>
      </div>
    </AppCanvas>
  );
}
