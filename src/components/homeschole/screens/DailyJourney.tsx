"use client";

import { Icon } from "../Icon";
import { Sprout } from "../illustrations";
import { AppCanvas, Card, Chip, Eyebrow, FadeIn, IconBadge } from "../ds";
import { ACTIVITY_META, dayPlan } from "@/lib/homeschole/activity-meta";
import type { ActivityId } from "@/lib/homeschole/activity-meta";
import type { ChildProfile } from "@/lib/homeschole/profile";
import type { Progress } from "@/lib/homeschole/progress";

interface DailyJourneyProps {
  profile: ChildProfile;
  progress: Progress;
  onOpen: (id: ActivityId) => void;
  onPlay?: () => void;
}

export function DailyJourney({ profile, progress, onOpen, onPlay }: DailyJourneyProps) {
  const age = profile.age;
  const plan = dayPlan(age);
  const big = age <= 3;
  const doneCount = plan.filter((id) => progress.completed[id]).length;
  const currentIdx = plan.findIndex((id) => !progress.completed[id]);
  const greeting = "Good morning";

  return (
    <AppCanvas max={720}>
      <div style={{ paddingTop: 40, paddingBottom: 140 }}>
        {/* header */}
        <FadeIn style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-faint)", marginBottom: 4 }}>{greeting},</div>
            <h1 style={{ fontSize: big ? "clamp(36px,8vw,52px)" : "clamp(30px,7vw,44px)", fontWeight: 700, letterSpacing: "-0.03em" }}>
              {profile.name}
            </h1>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--white)",
              padding: "10px 16px",
              borderRadius: "var(--r-pill)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--line-soft)"
            }}
          >
            <Icon name="seed" size={20} color="var(--sage-deep)" style={{ fill: "var(--sage-tint)" }} />
            <span style={{ fontWeight: 700, fontSize: 17 }}>{progress.seeds}</span>
          </div>
        </FadeIn>

        {/* today's intention card */}
        <FadeIn delay={0.06}>
          <Card
            pad={big ? 28 : 24}
            radius="var(--r-xl)"
            style={{
              background: "var(--cream)",
              border: "1px solid var(--sand)",
              marginBottom: 30,
              display: "flex",
              alignItems: "center",
              gap: 22,
              overflow: "hidden",
              position: "relative"
            }}
          >
            <div style={{ flex: 1 }}>
              <Eyebrow color="var(--sage-deep)">Today&apos;s journey</Eyebrow>
              <div style={{ fontSize: big ? 26 : 23, fontWeight: 700, letterSpacing: "-0.02em", margin: "8px 0 6px", lineHeight: 1.15 }}>
                {doneCount === plan.length
                  ? "All done — beautifully."
                  : doneCount === 0
                    ? `${plan.length} gentle steps await.`
                    : `${plan.length - doneCount} small ${plan.length - doneCount === 1 ? "step" : "steps"} to go.`}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
                <div style={{ flex: 1, height: 10, borderRadius: 99, background: "var(--sand-deep)", overflow: "hidden", maxWidth: 220 }}>
                  <div
                    style={{
                      width: `${(doneCount / plan.length) * 100}%`,
                      height: "100%",
                      background: "var(--sage)",
                      borderRadius: 99,
                      transition: "width .6s cubic-bezier(.2,.8,.3,1)"
                    }}
                  />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-soft)" }}>
                  {doneCount}/{plan.length}
                </span>
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Sprout size={big ? 132 : 116} stage={Math.min(4, doneCount + 1)} />
            </div>
          </Card>
        </FadeIn>

        {/* the path */}
        <div style={{ position: "relative" }}>
          {plan.map((id, i) => {
            const m = ACTIVITY_META[id];
            const isDone = progress.completed[id];
            const isCurrent = i === currentIdx;
            const isLocked = currentIdx !== -1 && i > currentIdx;
            const last = i === plan.length - 1;
            return (
              <FadeIn key={id} delay={0.12 + i * 0.07}>
                <div style={{ display: "flex", gap: 18, alignItems: "stretch" }}>
                  {/* rail */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 44 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        background: isDone ? "var(--sage)" : isCurrent ? "var(--white)" : "var(--cream)",
                        border: isCurrent ? "2.5px solid " + m.color : "2px solid " + (isDone ? "var(--sage)" : "var(--gray)"),
                        boxShadow: isCurrent ? "var(--shadow-sm)" : "none",
                        color: isDone ? "#fff" : m.color,
                        fontWeight: 700,
                        fontSize: 16
                      }}
                    >
                      {isDone ? <Icon name="check" size={20} color="#fff" stroke={3} /> : i + 1}
                    </div>
                    {!last && (
                      <div
                        style={{
                          flex: 1,
                          width: 3,
                          minHeight: big ? 26 : 20,
                          background: isDone ? "var(--sage)" : "var(--gray)",
                          borderRadius: 99,
                          margin: "6px 0"
                        }}
                      />
                    )}
                  </div>
                  {/* card */}
                  <Card
                    pad={0}
                    hover={!isLocked}
                    onClick={isLocked ? undefined : () => onOpen(id)}
                    style={{
                      flex: 1,
                      marginBottom: big ? 18 : 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      padding: big ? "22px 22px" : "18px 20px",
                      opacity: isLocked ? 0.55 : 1,
                      background: isCurrent ? m.tint : "var(--white)",
                      border: "1px solid " + (isCurrent ? m.color + "55" : "var(--line-soft)")
                    }}
                  >
                    <IconBadge name={m.icon} color={m.color} tint={isCurrent ? "var(--white)" : m.tint} size={big ? 64 : 56} />
                    <div style={{ flex: 1 }}>
                      {!big && (
                        <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: m.deep, marginBottom: 3 }}>
                          {m.skill}
                        </div>
                      )}
                      <div style={{ fontSize: big ? 23 : 20, fontWeight: 700, letterSpacing: "-0.02em" }}>{m.title}</div>
                    </div>
                    {isLocked ? (
                      <Icon name="lock" size={22} color="var(--ink-faint)" />
                    ) : isDone ? (
                      <Chip color="var(--sage)" tint="var(--sage-tint)" icon="refresh" style={{ pointerEvents: "none" }}>
                        Again
                      </Chip>
                    ) : (
                      <div
                        style={{
                          width: big ? 56 : 48,
                          height: big ? 56 : 48,
                          borderRadius: "50%",
                          background: m.color,
                          display: "grid",
                          placeItems: "center",
                          boxShadow: "var(--shadow-sm)"
                        }}
                      >
                        <Icon name="next" size={big ? 26 : 22} color="#fff" stroke={2.4} />
                      </div>
                    )}
                  </Card>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* free play — a calm doorway to the Playroom */}
        {onPlay && (
          <FadeIn delay={0.14 + plan.length * 0.07}>
            <Card
              pad={big ? 20 : 18}
              hover
              onClick={onPlay}
              style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 18, background: "var(--white)", border: "1px dashed var(--sand-deep)" }}
            >
              <IconBadge name="blocks" color="var(--honey-deep)" tint="var(--honey-tint)" size={big ? 60 : 52} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--honey-deep)", marginBottom: 3 }}>
                  Free play
                </div>
                <div style={{ fontSize: big ? 22 : 19, fontWeight: 700, letterSpacing: "-0.02em" }}>Visit the Playroom</div>
              </div>
              <Icon name="next" size={22} color="var(--ink-faint)" />
            </Card>
          </FadeIn>
        )}

        {/* gentle close-of-day note */}
        {doneCount === plan.length && (
          <FadeIn delay={0.2}>
            <div style={{ textAlign: "center", marginTop: 16, padding: 24, color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.5 }}>
              That&apos;s everything for today.
              <br />
              Come back tomorrow for a fresh path. 🌿
            </div>
          </FadeIn>
        )}
      </div>
    </AppCanvas>
  );
}
