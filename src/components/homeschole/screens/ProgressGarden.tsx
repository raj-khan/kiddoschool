"use client";

import { Fragment } from "react";

import { Icon } from "../Icon";
import type { IconName } from "../Icon";
import { LindenTree, Sprout } from "../illustrations";
import { AppCanvas, Card, Eyebrow, FadeIn, IconBadge } from "../ds";
import type { ChildProfile } from "@/lib/homeschole/profile";
import type { Progress } from "@/lib/homeschole/progress";
import type { ProgressMetaphor } from "@/lib/homeschole/settings";

interface ProgressGardenProps {
  profile: ChildProfile;
  progress: Progress;
  metaphor: ProgressMetaphor;
}

export function ProgressGarden({ profile, progress, metaphor }: ProgressGardenProps) {
  const totalSeeds = progress.seeds;
  const days = progress.streak;
  const activities = Object.values(progress.completed).filter(Boolean).length;

  const stats: [IconName, number, string, string, string][] = [
    ["seed", totalSeeds, "Seeds planted", "var(--sage)", "var(--sage-tint)"],
    ["sun", days, "Day streak", "var(--honey)", "var(--honey-tint)"],
    ["star", activities, "Activities", "var(--coral)", "var(--coral-tint)"]
  ];

  return (
    <AppCanvas max={720}>
      <div style={{ paddingTop: 40, paddingBottom: 140, textAlign: "center" }}>
        <FadeIn>
          <Eyebrow color="var(--sage-deep)">{profile.name}&apos;s garden</Eyebrow>
          <h1 style={{ fontSize: "clamp(28px,6vw,40px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "10px 0 6px" }}>
            Look how you&apos;ve grown
          </h1>
          <p style={{ fontSize: 17, color: "var(--ink-soft)", marginBottom: 36 }}>Every step you take plants something new.</p>
        </FadeIn>

        <FadeIn delay={0.08}>
          {metaphor === "tree" && <GardenTree seeds={totalSeeds} />}
          {metaphor === "garden" && <GardenPlots seeds={totalSeeds} />}
          {metaphor === "path" && <GardenPath days={days} />}
        </FadeIn>

        <FadeIn delay={0.16}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginTop: 40 }}>
            {stats.map(([icon, val, label, c, tn]) => (
              <Card key={label} pad={20}>
                <IconBadge name={icon} color={c} tint={tn} size={44} />
                <div style={{ fontSize: 30, fontWeight: 700, marginTop: 12, letterSpacing: "-0.02em" }}>{val}</div>
                <div style={{ fontSize: 14, color: "var(--ink-soft)", fontWeight: 600 }}>{label}</div>
              </Card>
            ))}
          </div>
        </FadeIn>
      </div>
    </AppCanvas>
  );
}

function GardenTree({ seeds }: { seeds: number }) {
  const stage = Math.min(4, Math.floor(seeds / 4));
  return (
    <Card pad={30} radius="var(--r-xl)" style={{ background: "var(--cream)", border: "1px solid var(--sand)" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ transform: `scale(${0.7 + stage * 0.12})`, transition: "transform .8s cubic-bezier(.2,.8,.3,1)" }}>
          <LindenTree size={240} />
        </div>
      </div>
      <div style={{ fontSize: 16, color: "var(--ink-soft)", marginTop: 12 }}>
        {seeds >= 16 ? "Your tree is full and strong." : `${16 - seeds} more seeds until your tree blooms.`}
      </div>
    </Card>
  );
}

function GardenPlots({ seeds }: { seeds: number }) {
  const planted = Math.min(12, seeds);
  return (
    <Card pad={28} radius="var(--r-xl)" style={{ background: "var(--cream)", border: "1px solid var(--sand)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1",
              borderRadius: "var(--r-md)",
              background: i < planted ? "var(--sage-tint)" : "var(--sand)",
              display: "grid",
              placeItems: "center",
              border: "1px solid " + (i < planted ? "var(--sage)" : "var(--sand-deep)")
            }}
          >
            {i < planted ? <Sprout size={72} stage={(i % 4) + 1} /> : <Icon name="seed" size={26} color="var(--ink-faint)" />}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 16, color: "var(--ink-soft)", marginTop: 16 }}>{planted} of 12 plots blooming.</div>
    </Card>
  );
}

function GardenPath({ days }: { days: number }) {
  return (
    <Card pad={30} radius="var(--r-xl)" style={{ background: "var(--cream)", border: "1px solid var(--sand)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const reached = i < days;
          return (
            <Fragment key={i}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  background: reached ? "var(--sage)" : "var(--sand)",
                  color: reached ? "#fff" : "var(--ink-faint)",
                  border: "2px solid " + (reached ? "var(--sage)" : "var(--sand-deep)")
                }}
              >
                {reached ? <Icon name="check" size={20} color="#fff" stroke={3} /> : <Icon name="seed" size={18} />}
              </div>
              {i < 6 && <div style={{ width: 18, height: 3, background: reached ? "var(--sage)" : "var(--sand-deep)", borderRadius: 99 }} />}
            </Fragment>
          );
        })}
      </div>
      <div style={{ fontSize: 16, color: "var(--ink-soft)", marginTop: 18 }}>{days}-day path. One gentle step each day.</div>
    </Card>
  );
}
