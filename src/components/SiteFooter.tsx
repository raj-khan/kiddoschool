"use client";

import { useState, useCallback } from "react";

const AFFIRMATIONS = [
  "Every key press is a tiny step forward.",
  "You're raising a curious learner.",
  "Learning happens one letter at a time.",
  "Their curiosity is their superpower.",
  "Every moment of play is a moment of learning.",
  "Small steps lead to big adventures.",
  "You showed up today. That matters.",
  "Their smile says more than words.",
  "Together, you're building something beautiful.",
  "The best classroom is right here.",
  "Patience and play — a perfect pair.",
  "Watch them grow, one letter at a time.",
  "You make learning feel like magic.",
  "Today's curiosity is tomorrow's confidence.",
  "Keep going. They're watching and learning from you.",
];

type SiteFooterProps = {
  overlay?: boolean;
};

export function SiteFooter({ overlay = false }: SiteFooterProps) {
  const [affirmation, setAffirmation] = useState<string | null>(null);

  const handleClick = useCallback(() => {
    const pool = AFFIRMATIONS.filter((a) => a !== affirmation);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setAffirmation(pick);
  }, [affirmation]);

  return (
    <footer className={overlay ? "fixed bottom-4 left-4 z-20 block" : ""}>
      <button
        type="button"
        onClick={handleClick}
        className={
          overlay
            ? "group cursor-pointer rounded-[1.5rem] border border-rose-200/60 px-4 py-3 shadow-[0_8px_24px_rgba(255,150,180,0.18)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(255,150,180,0.28)] active:translate-y-0"
            : "group w-full cursor-pointer rounded-[2rem] border border-rose-200/60 p-5 backdrop-blur-xl transition duration-200 hover:shadow-[0_8px_24px_rgba(255,150,180,0.18)]"
        }
        style={{
          background: "linear-gradient(135deg, rgba(255,236,240,0.92) 0%, rgba(255,220,230,0.88) 50%, rgba(255,240,220,0.92) 100%)",
        }}
        aria-label="A little note for the parent"
      >
        {affirmation ? (
          <p
            key={affirmation}
            className="max-w-[18rem] font-display text-base font-semibold leading-snug tracking-[-0.01em] text-rose-700 animate-[fadeSlideUp_0.35s_ease_both]"
          >
            {affirmation}
          </p>
        ) : (
          <p className="font-display text-base font-semibold tracking-[-0.01em] text-rose-600">
            ♡ Built with family
          </p>
        )}
      </button>
    </footer>
  );
}
