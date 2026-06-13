"use client";

import { useState } from "react";

import { ActivityShell } from "../activities/shared";
import { WordWorkshop } from "./WordWorkshop";
import { SoundHunt } from "./SoundHunt";
import { MemoryGame } from "./MemoryGame";
import { GAME_META } from "@/lib/homeschole/activity-meta";
import type { GameId } from "@/lib/homeschole/activity-meta";
import { levelForAge } from "@/lib/homeschole/curriculum";
import type { ChildProfile } from "@/lib/homeschole/profile";
import type { Progress } from "@/lib/homeschole/progress";

interface GameRouterProps {
  id: GameId;
  profile: ChildProfile;
  progress: Progress;
  addSeeds: (n: number) => void;
  recordMastery: (word: string, correct: boolean) => void;
  onBack: () => void;
}

export function GameRouter({ id, profile, progress, addSeeds, recordMastery, onBack }: GameRouterProps) {
  const meta = GAME_META[id];
  const big = profile.age <= 3;
  const level = levelForAge(profile.age);
  // A new key restarts the game engine cleanly on "Play again".
  const [session, setSession] = useState(0);
  const again = () => setSession((s) => s + 1);

  const body = () => {
    switch (id) {
      case "sound":
        return <SoundHunt key={session} level={level} big={big} addSeeds={addSeeds} onAgain={again} onBack={onBack} />;
      case "memory":
        return <MemoryGame key={session} big={big} addSeeds={addSeeds} onAgain={again} onBack={onBack} />;
      case "word":
      default:
        return (
          <WordWorkshop
            key={session}
            level={level}
            big={big}
            mastery={progress.mastery}
            addSeeds={addSeeds}
            recordMastery={recordMastery}
            onAgain={again}
            onBack={onBack}
          />
        );
    }
  };

  return (
    <ActivityShell meta={meta} step={0} total={1} onBack={onBack}>
      {body()}
    </ActivityShell>
  );
}
