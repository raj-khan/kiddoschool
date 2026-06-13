"use client";

import { useState } from "react";

import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import { LindenTree, Scene, Sprout } from "./illustrations";
import { Button, Card, Eyebrow, FadeIn, IconBadge } from "./ds";
import type { ChildProfile, FocusArea } from "@/lib/homeschole/profile";

interface FocusOption {
  id: FocusArea;
  label: string;
  icon: IconName;
  color: string;
  tint: string;
}

const FOCUS_OPTIONS: FocusOption[] = [
  { id: "reading", label: "Reading", icon: "book", color: "var(--coral)", tint: "var(--coral-tint)" },
  { id: "writing", label: "Writing & tracing", icon: "trace", color: "var(--sage)", tint: "var(--sage-tint)" },
  { id: "phonics", label: "Phonics & sounds", icon: "phonics", color: "var(--honey)", tint: "var(--honey-tint)" },
  { id: "words", label: "Word association", icon: "connect", color: "var(--sage)", tint: "var(--sage-tint)" },
  { id: "memory", label: "Memory & focus", icon: "memory", color: "var(--coral)", tint: "var(--coral-tint)" }
];

const STEPS = ["welcome", "child", "focus", "promise", "ready"] as const;

export function Onboarding({ onComplete }: { onComplete: (profile: ChildProfile) => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState(4);
  const [focus, setFocus] = useState<FocusArea[]>(["reading", "phonics"]);

  const cur = STEPS[step];
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const finish = () => onComplete({ name: name.trim() || "Little one", age, focus });
  const toggleFocus = (id: FocusArea) =>
    setFocus((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 560, padding: "0 clamp(16px, 4vw, 40px)" }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", paddingTop: 48, paddingBottom: 40 }}>
          {/* progress dots */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 40 }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  height: 6,
                  width: i === step ? 28 : 6,
                  borderRadius: 99,
                  background: i <= step ? "var(--sage)" : "var(--gray)",
                  transition: "all .4s cubic-bezier(.2,.8,.3,1)"
                }}
              />
            ))}
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {cur === "welcome" && (
              <FadeIn style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                  <LindenTree size={220} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--sage-deep)", marginBottom: 14 }}>
                  homeschole
                </div>
                <h1 style={{ fontSize: "clamp(34px,7vw,48px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 18 }}>
                  Where little minds
                  <br />
                  take root.
                </h1>
                <p style={{ fontSize: 19, color: "var(--ink-soft)", lineHeight: 1.55, maxWidth: 420, margin: "0 auto 36px" }}>
                  A calm, daily learning journey for ages three to six — designed with care, paced for young minds.
                </p>
                <Button size="lg" iconRight="next" color="var(--sage)" onClick={next}>
                  Begin
                </Button>
              </FadeIn>
            )}

            {cur === "child" && (
              <FadeIn>
                <Eyebrow>Step one</Eyebrow>
                <h1 style={{ fontSize: "clamp(28px,6vw,38px)", fontWeight: 700, letterSpacing: "-0.025em", margin: "10px 0 8px" }}>Who&apos;s learning?</h1>
                <p style={{ fontSize: 17, color: "var(--ink-soft)", marginBottom: 30, lineHeight: 1.5 }}>We&apos;ll gently shape each day around them.</p>

                <label style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-soft)", letterSpacing: "0.02em" }}>First name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya"
                  autoFocus
                  style={{
                    width: "100%",
                    marginTop: 10,
                    marginBottom: 30,
                    padding: "18px 22px",
                    fontSize: 20,
                    fontFamily: "var(--font)",
                    fontWeight: 600,
                    background: "var(--white)",
                    border: "1px solid var(--line)",
                    borderRadius: "var(--r-md)",
                    color: "var(--ink)",
                    boxShadow: "var(--shadow-sm)",
                    outline: "none"
                  }}
                />

                <label style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-soft)", letterSpacing: "0.02em" }}>How old?</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 12, marginBottom: 36 }}>
                  {[3, 4, 5, 6].map((a) => (
                    <button
                      key={a}
                      onClick={() => setAge(a)}
                      style={{
                        padding: "22px 0",
                        borderRadius: "var(--r-md)",
                        background: age === a ? "var(--sage)" : "var(--white)",
                        color: age === a ? "#fff" : "var(--ink)",
                        border: "1px solid " + (age === a ? "var(--sage)" : "var(--line)"),
                        boxShadow: age === a ? "var(--shadow-md)" : "var(--shadow-sm)",
                        fontSize: 30,
                        fontWeight: 700,
                        transition: "all .2s",
                        transform: age === a ? "translateY(-2px)" : "none"
                      }}
                    >
                      {a}
                    </button>
                  ))}
                </div>
                <Button size="lg" full iconRight="next" color="var(--sage)" onClick={next}>
                  Continue
                </Button>
              </FadeIn>
            )}

            {cur === "focus" && (
              <FadeIn>
                <Eyebrow>Step two</Eyebrow>
                <h1 style={{ fontSize: "clamp(28px,6vw,38px)", fontWeight: 700, letterSpacing: "-0.025em", margin: "10px 0 8px" }}>Where shall we start?</h1>
                <p style={{ fontSize: 17, color: "var(--ink-soft)", marginBottom: 28, lineHeight: 1.5 }}>
                  Pick a few. homeschole adapts as {name.trim() || "your child"} grows — nothing is locked in.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 34 }}>
                  {FOCUS_OPTIONS.map((o) => {
                    const on = focus.includes(o.id);
                    return (
                      <Card
                        key={o.id}
                        pad={16}
                        onClick={() => toggleFocus(o.id)}
                        elevate={on ? "md" : "sm"}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          border: "1.5px solid " + (on ? o.color : "var(--line-soft)"),
                          background: on ? o.tint : "var(--white)"
                        }}
                      >
                        <IconBadge name={o.icon} color={o.color} tint={on ? "var(--white)" : o.tint} size={50} />
                        <span style={{ fontSize: 18, fontWeight: 600, flex: 1 }}>{o.label}</span>
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            background: on ? o.color : "transparent",
                            border: "2px solid " + (on ? o.color : "var(--gray)"),
                            display: "grid",
                            placeItems: "center"
                          }}
                        >
                          {on && <Icon name="check" size={15} color="#fff" stroke={3} />}
                        </div>
                      </Card>
                    );
                  })}
                </div>
                <Button size="lg" full iconRight="next" color="var(--sage)" onClick={next}>
                  Continue
                </Button>
              </FadeIn>
            )}

            {cur === "promise" && (
              <FadeIn style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                  <Scene size={200} />
                </div>
                <Eyebrow color="var(--coral-deep)">Our promise to you</Eyebrow>
                <h1 style={{ fontSize: "clamp(26px,5.5vw,34px)", fontWeight: 700, letterSpacing: "-0.025em", margin: "12px 0 26px", lineHeight: 1.15 }}>
                  Healthy engagement,
                  <br />
                  by design.
                </h1>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, textAlign: "left", marginBottom: 34 }}>
                  {(
                    [
                      ["No ads, ever", "homeschole is a quiet space — no marketing, no outside links.", "heart", "var(--coral)", "var(--coral-tint)"],
                      ["Calm by default", "No flashing rewards or endless loops. We celebrate gently and stop.", "leaf", "var(--sage)", "var(--sage-tint)"],
                      ["You stay in control", "A daily rhythm with natural stopping points and a clear parent view.", "parent", "var(--honey)", "var(--honey-tint)"]
                    ] as [string, string, IconName, string, string][]
                  ).map(([title, body, icon, c, tn]) => (
                    <div key={title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <IconBadge name={icon} color={c} tint={tn} size={48} />
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
                        <div style={{ fontSize: 15.5, color: "var(--ink-soft)", lineHeight: 1.5, marginTop: 2 }}>{body}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button size="lg" full iconRight="next" color="var(--sage)" onClick={next}>
                  I&apos;m with you
                </Button>
              </FadeIn>
            )}

            {cur === "ready" && (
              <FadeIn style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 18, animation: "lin-grow .6s cubic-bezier(.2,.8,.3,1) both" }}>
                  <Sprout size={150} stage={4} />
                </div>
                <h1 style={{ fontSize: "clamp(30px,6vw,42px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16 }}>
                  {name.trim() || "Your child"} is all set.
                </h1>
                <p style={{ fontSize: 18, color: "var(--ink-soft)", lineHeight: 1.55, maxWidth: 400, margin: "0 auto 36px" }}>
                  Today&apos;s journey is ready — a few small, gentle steps. Hand the device over whenever you&apos;re ready.
                </p>
                <Button size="lg" iconRight="next" color="var(--coral)" onClick={finish}>
                  Start learning
                </Button>
              </FadeIn>
            )}
          </div>

          {step > 0 && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
              <button
                onClick={() => setStep((s) => s - 1)}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink-faint)", fontSize: 15, fontWeight: 600 }}
              >
                <Icon name="back" size={18} /> Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
