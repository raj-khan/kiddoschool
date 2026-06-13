"use client";

import { useState } from "react";

import { Memory } from "../activities/Memory";
import { GameComplete } from "./GameComplete";

export function MemoryGame({ big, addSeeds, onAgain, onBack }: { big: boolean; addSeeds: (n: number) => void; onAgain: () => void; onBack: () => void }) {
  const [done, setDone] = useState(false);
  if (done) return <GameComplete line="You found every pair!" onAgain={onAgain} onBack={onBack} />;
  return (
    <Memory
      big={big}
      onComplete={() => {
        addSeeds(2);
        setDone(true);
      }}
    />
  );
}
