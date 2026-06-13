"use client";

import { ActivityShell } from "./shared";
import { Trace } from "./Trace";
import { Match } from "./Match";
import { Phonics } from "./Phonics";
import { Connect } from "./Connect";
import { Memory } from "./Memory";
import { ACTIVITY_META } from "@/lib/homeschole/activity-meta";
import type { ActivityId } from "@/lib/homeschole/activity-meta";
import type { ChildProfile } from "@/lib/homeschole/profile";

interface ActivityRouterProps {
  id: ActivityId;
  profile: ChildProfile;
  onBack: () => void;
  onComplete: () => void;
}

export function ActivityRouter({ id, profile, onBack, onComplete }: ActivityRouterProps) {
  const meta = ACTIVITY_META[id];
  const big = profile.age <= 3;

  const body = () => {
    switch (id) {
      case "match":
        return <Match meta={meta} onComplete={onComplete} big={big} />;
      case "phonics":
        return <Phonics meta={meta} onComplete={onComplete} big={big} />;
      case "connect":
        return <Connect meta={meta} onComplete={onComplete} big={big} />;
      case "memory":
        return <Memory onComplete={onComplete} big={big} />;
      case "trace":
      case "read":
      default:
        return <Trace meta={meta} onComplete={onComplete} big={big} />;
    }
  };

  return (
    <ActivityShell meta={meta} step={0} total={1} onBack={onBack}>
      {body()}
    </ActivityShell>
  );
}
