"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";

import { speak as speakText, speakLetter as speakLetterText } from "@/lib/homeschole/voice";

interface VoiceContextValue {
  enabled: boolean;
  speak: (text: string) => void;
  speakLetter: (letter: string) => void;
}

const VoiceContext = createContext<VoiceContextValue>({
  enabled: true,
  speak: () => {},
  speakLetter: () => {}
});

export function VoiceProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const speak = useCallback((text: string) => speakText(text, enabled), [enabled]);
  const speakLetter = useCallback((letter: string) => speakLetterText(letter, enabled), [enabled]);
  const value = useMemo(() => ({ enabled, speak, speakLetter }), [enabled, speak, speakLetter]);
  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
}

export function useVoice(): VoiceContextValue {
  return useContext(VoiceContext);
}
