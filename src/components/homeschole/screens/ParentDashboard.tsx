"use client";

import { Icon } from "../Icon";
import type { IconName } from "../Icon";
import { AppCanvas, Button, Card, Chip, IconBadge } from "../ds";
import { dayPlan } from "@/lib/homeschole/activity-meta";
import type { ChildProfile } from "@/lib/homeschole/profile";
import type { Progress } from "@/lib/homeschole/progress";
import type { ProgressMetaphor, RewardStyle, Settings } from "@/lib/homeschole/settings";

interface ParentDashboardProps {
  profile: ChildProfile;
  progress: Progress;
  settings: Settings;
  setSettings: (updater: (prev: Settings) => Settings) => void;
  onExit: () => void;
  onDesignSystem: () => void;
}

const SKILLS: { label: string; value: number; color: string }[] = [
  { label: "Reading", value: 0.72, color: "var(--coral)" },
  { label: "Writing", value: 0.48, color: "var(--sage)" },
  { label: "Phonics", value: 0.61, color: "var(--honey)" },
  { label: "Focus", value: 0.83, color: "var(--sage)" }
];

const WORKSHEETS: { title: string; skill: string; color: string; tint: string; icon: IconName }[] = [
  { title: "Trace the curves: S, C, U", skill: "Writing", color: "var(--sage)", tint: "var(--sage-tint)", icon: "trace" },
  { title: "Beginning sounds picture cards", skill: "Phonics", color: "var(--honey)", tint: "var(--honey-tint)", icon: "phonics" },
  { title: "Upper & lower case match-up", skill: "Reading", color: "var(--coral)", tint: "var(--coral-tint)", icon: "match" }
];

export function ParentDashboard({ profile, progress, settings, setSettings, onExit, onDesignSystem }: ParentDashboardProps) {
  const steps = dayPlan(profile.age).length;

  return (
    <AppCanvas max={840}>
      <div style={{ paddingTop: 30, paddingBottom: 80 }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--coral-tint)", display: "grid", placeItems: "center", fontSize: 24, fontWeight: 700, color: "var(--coral-deep)" }}>
              {profile.name[0]}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Parent view</div>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
                {profile.name}, age {profile.age}
              </h1>
            </div>
          </div>
          <Button variant="soft" size="sm" icon="today" onClick={onExit}>
            Back to homeschole
          </Button>
        </div>

        {/* gentle insight banner */}
        <Card pad={24} radius="var(--r-xl)" style={{ background: "var(--cream)", border: "1px solid var(--sand)", marginBottom: 24, display: "flex", gap: 18, alignItems: "flex-start" }}>
          <IconBadge name="sparkle" color="var(--sage-deep)" tint="var(--white)" size={50} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--sage-deep)", marginBottom: 4 }}>This week&apos;s gentle note</div>
            <p style={{ fontSize: 17.5, lineHeight: 1.5, color: "var(--ink)" }}>
              {profile.name} is matching upper- and lower-case letters with real confidence. Tracing curved letters is just emerging — short, daily practice will help it settle. No rush.
            </p>
          </div>
        </Card>

        {/* week stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, marginBottom: 28 }}>
          <StatBig value="38" unit="min" label="This week, gently paced" icon="clock" color="var(--coral)" tint="var(--coral-tint)" />
          <StatBig value={String(progress.streak)} unit="days" label="Steady rhythm" icon="sun" color="var(--honey)" tint="var(--honey-tint)" />
          <StatBig value={String(progress.seeds)} unit="seeds" label="Planted so far" icon="seed" color="var(--sage)" tint="var(--sage-tint)" />
        </div>

        {/* skills + healthy engagement */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20, marginBottom: 28, alignItems: "start" }} className="lin-resp-grid">
          <Card pad={26}>
            <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 20, letterSpacing: "-0.01em" }}>Skill growth</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {SKILLS.map((s) => (
                <div key={s.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontSize: 15.5, fontWeight: 600 }}>{s.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink-faint)" }}>{Math.round(s.value * 100)}%</span>
                  </div>
                  <div style={{ height: 12, borderRadius: 99, background: "var(--cream)", overflow: "hidden" }}>
                    <div style={{ width: `${s.value * 100}%`, height: "100%", background: s.color, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card pad={26}>
            <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.01em" }}>Healthy engagement</div>
            <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 20, lineHeight: 1.45 }}>
              You set the rhythm. homeschole never nudges for “just one more.”
            </p>
            <SettingRow label="Daily journey length" value={`${steps} steps`} />
            <SettingRow
              label="Voice guidance"
              toggle
              value={settings.voice}
              onToggle={() => setSettings((s) => ({ ...s, voice: !s.voice }))}
            />
            <SettingSegment
              label="Progress shape"
              value={settings.progressMetaphor}
              options={["garden", "tree", "path"]}
              onChange={(v) => setSettings((s) => ({ ...s, progressMetaphor: v as ProgressMetaphor }))}
            />
            <SettingSegment
              label="Reward style"
              value={settings.rewardStyle}
              options={["calm", "seed", "sticker"]}
              onChange={(v) => setSettings((s) => ({ ...s, rewardStyle: v as RewardStyle }))}
              last
            />
          </Card>
        </div>

        {/* printable worksheets — offline mode */}
        <Card pad={26} style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.01em" }}>Printable worksheets</div>
              <div style={{ fontSize: 14.5, color: "var(--ink-soft)", marginTop: 2 }}>Take the day off-screen. Matched to {profile.name}&apos;s journey.</div>
            </div>
            <Chip color="var(--sage-deep)" tint="var(--sage-tint)" icon="printer">
              Offline mode
            </Chip>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {WORKSHEETS.map((w) => (
              <div key={w.title} style={{ display: "flex", alignItems: "center", gap: 16, padding: 14, borderRadius: "var(--r-md)", background: "var(--cream)", border: "1px solid var(--line-soft)" }}>
                <IconBadge name={w.icon} color={w.color} tint={w.tint} size={46} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{w.title}</div>
                  <div style={{ fontSize: 13.5, color: "var(--ink-soft)", fontWeight: 600 }}>{w.skill}</div>
                </div>
                <Button variant="soft" size="sm" icon="printer">
                  Print
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* open ecosystem */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }} className="lin-resp-grid">
          <Card pad={24} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <IconBadge name="globe" color="var(--honey-deep)" tint="var(--honey-tint)" size={48} />
            <div>
              <div style={{ fontSize: 16.5, fontWeight: 700 }}>Language &amp; localization</div>
              <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.45, marginTop: 3 }}>
                English-first, with community translations. Currently learning in <b>English (US)</b>.
              </p>
            </div>
          </Card>
          <Card pad={24} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <IconBadge name="heart" color="var(--coral-deep)" tint="var(--coral-tint)" size={48} />
            <div>
              <div style={{ fontSize: 16.5, fontWeight: 700 }}>Community lessons</div>
              <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.45, marginTop: 3 }}>
                Open, teacher-made activities — reviewed for calm, age-fit design.
              </p>
            </div>
          </Card>
        </div>

        {/* design system link */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="ghost" size="sm" icon="sparkle" onClick={onDesignSystem}>
            View the design system
          </Button>
        </div>
      </div>
    </AppCanvas>
  );
}

function StatBig({ value, unit, label, icon, color, tint }: { value: string; unit: string; label: string; icon: IconName; color: string; tint: string }) {
  return (
    <Card pad={22}>
      <IconBadge name={icon} color={color} tint={tint} size={44} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 14 }}>
        <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em" }}>{value}</span>
        <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink-soft)" }}>{unit}</span>
      </div>
      <div style={{ fontSize: 14.5, color: "var(--ink-soft)", fontWeight: 600 }}>{label}</div>
    </Card>
  );
}

function SettingRow({
  label,
  value,
  toggle,
  onToggle,
  last
}: {
  label: string;
  value: string | boolean;
  toggle?: boolean;
  onToggle?: () => void;
  last?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: last ? "none" : "1px solid var(--line-soft)" }}>
      <span style={{ fontSize: 15.5, fontWeight: 600 }}>{label}</span>
      {toggle ? (
        <button
          onClick={onToggle}
          aria-label={label}
          style={{ width: 50, height: 30, borderRadius: 99, background: value ? "var(--sage)" : "var(--gray)", position: "relative", transition: "background .25s" }}
        >
          <span
            style={{
              position: "absolute",
              top: 3,
              left: value ? 23 : 3,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "var(--shadow-sm)",
              transition: "left .25s cubic-bezier(.2,.8,.3,1)"
            }}
          />
        </button>
      ) : (
        <span style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink-faint)" }}>{String(value)}</span>
      )}
    </div>
  );
}

function SettingSegment({
  label,
  value,
  options,
  onChange,
  last
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  last?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "13px 0", borderBottom: last ? "none" : "1px solid var(--line-soft)" }}>
      <span style={{ fontSize: 15.5, fontWeight: 600 }}>{label}</span>
      <div style={{ display: "flex", gap: 4, background: "var(--cream)", padding: 4, borderRadius: 99 }}>
        {options.map((opt) => {
          const on = opt === value;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                padding: "6px 12px",
                borderRadius: 99,
                fontSize: 13.5,
                fontWeight: 700,
                textTransform: "capitalize",
                background: on ? "var(--sage)" : "transparent",
                color: on ? "#fff" : "var(--ink-soft)",
                transition: "all .2s"
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
