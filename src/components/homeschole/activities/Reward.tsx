"use client";

import { useState } from "react";

import { Icon } from "../Icon";
import { Sprout } from "../illustrations";
import { AppCanvas, Button } from "../ds";
import { ACTIVITY_META } from "@/lib/homeschole/activity-meta";
import type { ActivityId } from "@/lib/homeschole/activity-meta";
import type { RewardStyle } from "@/lib/homeschole/settings";

const LINES = [
  "You planted a new seed.",
  "One gentle step, well done.",
  "Your garden is growing.",
  "Lovely focus today."
];

interface RewardProps {
  activityId: ActivityId;
  seeds: number;
  rewardStyle: RewardStyle;
  hasNext: boolean;
  onContinue: () => void;
  onDone: () => void;
}

export function Reward({ activityId, seeds, rewardStyle, hasNext, onContinue, onDone }: RewardProps) {
  const meta = ACTIVITY_META[activityId];
  const [line] = useState(() => LINES[Math.floor(Math.random() * LINES.length)]);

  return (
    <AppCanvas max={520}>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          paddingBottom: 30
        }}
      >
        {rewardStyle === "sticker" &&
          Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              style={{
                position: "fixed",
                top: -20,
                left: `${12 + i * 12}%`,
                width: 12,
                height: 12,
                borderRadius: "60% 0",
                background: i % 2 ? "var(--coral)" : "var(--sage)",
                opacity: 0.7,
                animation: `lin-fall ${4 + i * 0.5}s linear ${i * 0.3}s infinite`
              }}
            />
          ))}
        <div style={{ animation: "lin-grow .7s cubic-bezier(.2,.8,.3,1) both" }}>
          {rewardStyle === "sticker" ? (
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: meta.tint,
                display: "grid",
                placeItems: "center",
                boxShadow: "var(--shadow-lg)"
              }}
            >
              <Icon name="leaf" size={78} color={meta.color} stroke={1.8} style={{ fill: meta.tint }} />
            </div>
          ) : (
            <Sprout size={160} stage={4} />
          )}
        </div>
        <h1 style={{ fontSize: "clamp(28px,6vw,38px)", fontWeight: 700, letterSpacing: "-0.03em", margin: "26px 0 10px" }}>{line}</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "var(--sage-tint)",
            color: "var(--sage-deep)",
            padding: "10px 20px",
            borderRadius: "var(--r-pill)",
            fontWeight: 700,
            fontSize: 17,
            marginBottom: 34
          }}
        >
          <Icon name="seed" size={20} color="var(--sage-deep)" style={{ fill: "#fff" }} /> +1 seed · {seeds} total
        </div>
        <div style={{ display: "flex", gap: 12, flexDirection: "column", width: "100%", maxWidth: 320 }}>
          {hasNext ? (
            <>
              <Button size="lg" full color="var(--coral)" iconRight="next" onClick={onContinue}>
                Next step
              </Button>
              <Button size="lg" full variant="ghost" onClick={onDone}>
                Take a break
              </Button>
            </>
          ) : (
            <Button size="lg" full color="var(--sage)" iconRight="garden" onClick={onDone}>
              See my garden
            </Button>
          )}
        </div>
      </div>
    </AppCanvas>
  );
}
