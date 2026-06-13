"use client";

import { useEffect, useState } from "react";

import { Icon } from "./Icon";
import type { IconName } from "./Icon";
import { VoiceProvider } from "./voice-context";
import { Onboarding } from "./Onboarding";
import { DailyJourney } from "./screens/DailyJourney";
import { ProgressGarden } from "./screens/ProgressGarden";
import { GamesHub } from "./screens/GamesHub";
import { GameRouter } from "./games/GameRouter";
import { ActivityRouter } from "./activities/ActivityRouter";
import { Reward } from "./activities/Reward";
import { ParentGate } from "./screens/ParentGate";
import { ParentDashboard } from "./screens/ParentDashboard";
import { DesignSystemScreen } from "./screens/DesignSystemScreen";

import { dayPlan } from "@/lib/homeschole/activity-meta";
import type { ActivityId, GameId } from "@/lib/homeschole/activity-meta";
import { DEFAULT_PROFILE, loadProfile, saveProfile } from "@/lib/homeschole/profile";
import type { ChildProfile } from "@/lib/homeschole/profile";
import { DEFAULT_PROGRESS, adjustMastery, loadProgress, saveProgress } from "@/lib/homeschole/progress";
import type { Progress } from "@/lib/homeschole/progress";
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from "@/lib/homeschole/settings";
import type { Settings } from "@/lib/homeschole/settings";

type Screen =
  | "onboarding"
  | "home"
  | "garden"
  | "games"
  | "game"
  | "activity"
  | "reward"
  | "gate"
  | "parent"
  | "ds";

interface View {
  screen: Screen;
  activityId?: ActivityId;
  gameId?: GameId;
}

export function HomescholeApp() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<ChildProfile>(DEFAULT_PROFILE);
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [view, setView] = useState<View>({ screen: "onboarding" });

  // Hydrate from local storage on the client. This intentionally syncs React
  // state from an external system (localStorage) once on mount; rendering is
  // gated by `mounted` so there is no hydration mismatch.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const stored = loadProfile();
    setProgress(loadProgress());
    setSettings(loadSettings());
    if (stored) {
      setProfile(stored);
      setView({ screen: "home" });
    }
    setMounted(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (mounted) saveProgress(progress);
  }, [mounted, progress]);
  useEffect(() => {
    if (mounted) saveSettings(settings);
  }, [mounted, settings]);

  const plan = dayPlan(profile.age);
  const go = (screen: Screen, extra: Partial<View> = {}) => setView({ screen, ...extra });

  const completeOnboarding = (next: ChildProfile) => {
    setProfile(next);
    saveProfile(next);
    go("home");
  };

  const openActivity = (id: ActivityId) => go("activity", { activityId: id });
  const completeActivity = (id: ActivityId) => {
    setProgress((p) => ({ ...p, completed: { ...p.completed, [id]: true }, seeds: p.seeds + 1 }));
    go("reward", { activityId: id });
  };
  const remainingAfter = (id: ActivityId) => plan.filter((x) => x !== id && !progress.completed[x]);
  const nextAfterReward = (id: ActivityId) => {
    const remaining = remainingAfter(id);
    if (remaining.length) openActivity(remaining[0]);
    else go("garden");
  };

  const addSeeds = (n: number) => setProgress((p) => ({ ...p, seeds: p.seeds + n }));
  const recordMastery = (word: string, correct: boolean) =>
    setProgress((p) => ({ ...p, mastery: { ...p.mastery, [word]: adjustMastery(p.mastery[word], correct) } }));

  // Avoid hydration mismatch: render the warm background until storage is read.
  if (!mounted) {
    return <div style={{ minHeight: "100vh", background: "var(--bg)" }} />;
  }

  const isChildShell = ["home", "garden", "games"].includes(view.screen);

  return (
    <VoiceProvider enabled={settings.voice}>
      <div style={{ minHeight: "100vh", background: "var(--bg)", transition: "background .4s" }}>
        {view.screen === "onboarding" && <Onboarding onComplete={completeOnboarding} />}

        {view.screen === "home" && (
          <DailyJourney profile={profile} progress={progress} onOpen={openActivity} onPlay={() => go("games")} />
        )}
        {view.screen === "garden" && (
          <ProgressGarden profile={profile} progress={progress} metaphor={settings.progressMetaphor} />
        )}
        {view.screen === "games" && <GamesHub profile={profile} onPlay={(id) => go("game", { gameId: id })} />}
        {view.screen === "game" && view.gameId && (
          <GameRouter
            id={view.gameId}
            profile={profile}
            progress={progress}
            addSeeds={addSeeds}
            recordMastery={recordMastery}
            onBack={() => go("games")}
          />
        )}

        {view.screen === "activity" && view.activityId && (
          <ActivityRouter
            id={view.activityId}
            profile={profile}
            onBack={() => go("home")}
            onComplete={() => completeActivity(view.activityId as ActivityId)}
          />
        )}

        {view.screen === "reward" && view.activityId && (
          <Reward
            activityId={view.activityId}
            seeds={progress.seeds}
            rewardStyle={settings.rewardStyle}
            hasNext={remainingAfter(view.activityId).length > 0}
            onContinue={() => nextAfterReward(view.activityId as ActivityId)}
            onDone={() => go("garden")}
          />
        )}

        {view.screen === "gate" && <ParentGate onPass={() => go("parent")} onCancel={() => go("home")} />}
        {view.screen === "parent" && (
          <ParentDashboard
            profile={profile}
            progress={progress}
            settings={settings}
            setSettings={setSettings}
            onExit={() => go("home")}
            onDesignSystem={() => go("ds")}
          />
        )}
        {view.screen === "ds" && <DesignSystemScreen onExit={() => go("parent")} />}

        {isChildShell && <BottomNav view={view.screen} onNav={(s) => go(s)} />}
      </div>
    </VoiceProvider>
  );
}

function BottomNav({ view, onNav }: { view: Screen; onNav: (screen: Screen) => void }) {
  const items: [Screen, IconName, string][] = [
    ["home", "today", "Today"],
    ["games", "blocks", "Play"],
    ["garden", "garden", "Garden"]
  ];
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        paddingBottom: 18,
        paddingTop: 8,
        pointerEvents: "none",
        zIndex: 40
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "var(--white)",
          borderRadius: 99,
          padding: 8,
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--line-soft)",
          pointerEvents: "auto"
        }}
      >
        {items.map(([s, icon, label]) => {
          const on = view === s;
          return (
            <button
              key={s}
              onClick={() => onNav(s)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "12px 22px",
                borderRadius: 99,
                background: on ? "var(--sage-tint)" : "transparent",
                color: on ? "var(--sage-deep)" : "var(--ink-soft)",
                fontWeight: 700,
                fontSize: 16,
                transition: "all .2s"
              }}
            >
              <Icon name={icon} size={22} stroke={on ? 2.4 : 2} /> {label}
            </button>
          );
        })}
        <div style={{ width: 1, height: 26, background: "var(--line)", margin: "0 2px" }} />
        <button
          onClick={() => onNav("gate")}
          aria-label="Grown-ups"
          style={{ width: 48, height: 48, borderRadius: "50%", display: "grid", placeItems: "center", color: "var(--ink-faint)" }}
        >
          <Icon name="lock" size={20} />
        </button>
      </div>
    </div>
  );
}
