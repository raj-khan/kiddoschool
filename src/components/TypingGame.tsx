"use client";

import { startTransition, useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";

import { BigKeyDisplay } from "@/components/BigKeyDisplay";
import { ControlButtons } from "@/components/ControlButtons";
import { LanguageSelector } from "@/components/LanguageSelector";
import { RecentKeys } from "@/components/RecentKeys";
import { VirtualKeyboard } from "@/components/VirtualKeyboard";
import {
  EMOJIS,
  IDLE_EMOJI,
  MESSAGES,
  PALETTES,
  type Palette
} from "@/lib/constants";
import {
  DEFAULT_LANGUAGE_ID,
  getLanguagePackById,
  type LanguageKey,
  type LanguagePackId
} from "@/lib/language-packs";
import { getRandomDifferentItem, getRandomItem } from "@/lib/random";
import { resolveLanguageInput, resolveVirtualLanguageKey, type ResolvedLanguageKey } from "@/lib/resolveLanguageKey";
import { canUseSpeechSynthesis, isVoicePlaybackAvailable, speakWithVoice, stopVoicePlayback } from "@/lib/voice";

type GameState = {
  displayText: string | null;
  speechText: string | null;
  displayDirection: "ltr" | "rtl";
  emoji: string;
  message: string;
  palette: Palette;
  burstKey: number;
};

type RecentKeyEntry = {
  label: string;
  direction: "ltr" | "rtl";
};

const INITIAL_PALETTE = PALETTES[0];

const INITIAL_STATE: GameState = {
  displayText: null,
  speechText: null,
  displayDirection: "ltr",
  emoji: IDLE_EMOJI,
  message: "",
  palette: INITIAL_PALETTE,
  burstKey: 0
};

const INTERACTIVE_TAGS = new Set(["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"]);

function subscribeToFullscreen(callback: () => void) {
  if (typeof document === "undefined") {
    return () => {};
  }

  document.addEventListener("fullscreenchange", callback);

  return () => {
    document.removeEventListener("fullscreenchange", callback);
  };
}

function subscribeToNoop() {
  return () => {};
}

function shouldIgnoreShortcut(event: KeyboardEvent): boolean {
  if (INTERACTIVE_TAGS.has((event.target as HTMLElement | null)?.tagName ?? "")) {
    return true;
  }

  const isModifierOnly = ["Control", "Meta", "Alt", "Shift"].includes(event.key);

  if (isModifierOnly) {
    return false;
  }

  return event.ctrlKey || event.metaKey || event.altKey;
}

export function TypingGame() {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [recentKeys, setRecentKeys] = useState<RecentKeyEntry[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLanguageId, setSelectedLanguageId] = useState<LanguagePackId>(DEFAULT_LANGUAGE_ID);

  const mutedRef = useRef(isMuted);
  const paletteRef = useRef(INITIAL_PALETTE);
  const selectedLanguagePack = getLanguagePackById(selectedLanguageId);

  const hasSpeechSynthesis = useSyncExternalStore(
    subscribeToNoop,
    () => canUseSpeechSynthesis(),
    () => false
  );

  const canSpeak = useSyncExternalStore(
    subscribeToNoop,
    () => isVoicePlaybackAvailable(selectedLanguagePack.voice),
    () => false
  );

  const canFullscreen = useSyncExternalStore(
    subscribeToFullscreen,
    () => typeof document !== "undefined" && Boolean(document.fullscreenEnabled),
    () => false
  );

  const isFullscreen = useSyncExternalStore(
    subscribeToFullscreen,
    () => typeof document !== "undefined" && Boolean(document.fullscreenElement),
    () => false
  );

  useEffect(() => {
    mutedRef.current = isMuted;
  }, [isMuted]);

  async function activateResolvedKey(resolvedKey: ResolvedLanguageKey) {
    const nextPalette = getRandomDifferentItem(PALETTES, paletteRef.current);

    paletteRef.current = nextPalette;

    if (!mutedRef.current && canSpeak) {
      await speakWithVoice({
        text: resolvedKey.speechText,
        assetKey: resolvedKey.assetKey,
        voice: selectedLanguagePack.voice,
        speechLang: resolvedKey.speechLang
      });
    }

    startTransition(() => {
      setGameState((currentState) => ({
        displayText: resolvedKey.displayText,
        speechText: resolvedKey.speechText,
        displayDirection: resolvedKey.textDirection,
        emoji: getRandomItem(EMOJIS),
        message: getRandomItem(MESSAGES),
        palette: nextPalette,
        burstKey: currentState.burstKey + 1
      }));

      setRecentKeys((currentKeys) => [
        {
          label: resolvedKey.displayText,
          direction: resolvedKey.textDirection
        },
        ...currentKeys
      ].slice(0, 10));
    });
  }

  const handleKeydown = useEffectEvent((event: KeyboardEvent) => {
    if (shouldIgnoreShortcut(event)) {
      return;
    }

    const resolvedKey = resolveLanguageInput(selectedLanguagePack, event.key);

    if (!resolvedKey) {
      return;
    }

    void activateResolvedKey(resolvedKey);
  });

  useEffect(() => {
    function onKeydown(event: KeyboardEvent) {
      handleKeydown(event);
    }

    window.addEventListener("keydown", onKeydown);

    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, []);

  function handleToggleMute() {
    setIsMuted((currentValue) => {
      const nextValue = !currentValue;

      if (nextValue && canSpeak) {
        stopVoicePlayback();
      }

      return nextValue;
    });
  }

  function handleClear() {
    if (canSpeak) {
      stopVoicePlayback();
    }

    setGameState((currentState) => ({
      ...INITIAL_STATE,
      displayDirection: selectedLanguagePack.direction,
      palette: currentState.palette,
      burstKey: currentState.burstKey + 1
    }));
    setRecentKeys([]);
  }

  function handleLanguageChange(languageId: LanguagePackId) {
    if (languageId === selectedLanguageId) {
      return;
    }

    stopVoicePlayback();
    setSelectedLanguageId(languageId);
    setGameState((currentState) => ({
      ...INITIAL_STATE,
      displayDirection: getLanguagePackById(languageId).direction,
      palette: currentState.palette,
      burstKey: currentState.burstKey + 1
    }));
    setRecentKeys([]);
  }

  function handleVirtualKeyPress(languageKey: LanguageKey) {
    void activateResolvedKey(resolveVirtualLanguageKey(selectedLanguagePack, languageKey));
  }

  async function handleToggleFullscreen() {
    if (!document.fullscreenEnabled) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await document.documentElement.requestFullscreen();
  }

  const voiceStatus = canSpeak
    ? isMuted
      ? "Voice muted"
      : "Voice ready"
    : "Voice unavailable";

  return (
    <main
      className="relative min-h-[100svh] overflow-hidden px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6"
      style={{ background: gameState.palette.background }}
    >
      <div
        className="floating-orb left-[-4rem] top-[-2rem] h-48 w-48 sm:h-60 sm:w-60"
        style={{ background: gameState.palette.orbOne }}
        aria-hidden="true"
      />
      <div
        className="floating-orb floating-orb--slow floating-orb--delay right-[8%] top-[16%] h-36 w-36 sm:h-52 sm:w-52"
        style={{ background: gameState.palette.orbTwo }}
        aria-hidden="true"
      />
      <div
        className="floating-orb floating-orb--late bottom-[-2rem] right-[-3rem] h-52 w-52 sm:h-72 sm:w-72"
        style={{ background: gameState.palette.orbThree }}
        aria-hidden="true"
      />

      <div className="mx-auto grid min-h-[calc(100svh-2rem)] max-w-7xl items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_28rem]">
        <BigKeyDisplay
          displayText={gameState.displayText}
          speechText={gameState.speechText}
          displayDirection={gameState.displayDirection}
          emoji={gameState.emoji}
          message={gameState.message}
          palette={gameState.palette}
          burstKey={gameState.burstKey}
          voiceStatus={voiceStatus}
          languageLabel={selectedLanguagePack.label}
          languageNativeLabel={selectedLanguagePack.nativeLabel}
          idlePrompt={selectedLanguagePack.prompt}
          idleHint={selectedLanguagePack.hint}
        />

        <aside className="flex flex-col gap-5">
          <LanguageSelector
            languagePack={selectedLanguagePack}
            onChange={handleLanguageChange}
            palette={gameState.palette}
          />
          <VirtualKeyboard
            languagePack={selectedLanguagePack}
            onKeyPress={handleVirtualKeyPress}
            palette={gameState.palette}
          />
          <ControlButtons
            isMuted={isMuted}
            isFullscreen={isFullscreen}
            canFullscreen={canFullscreen}
            onToggleMute={handleToggleMute}
            onClear={handleClear}
            onToggleFullscreen={handleToggleFullscreen}
            palette={gameState.palette}
          />
          <RecentKeys keys={recentKeys} palette={gameState.palette} />
          <section
            className="rounded-[2rem] border p-4 shadow-[0_22px_60px_rgba(255,255,255,0.18)] backdrop-blur-xl"
            style={{
              background: gameState.palette.shell,
              borderColor: gameState.palette.shellBorder
            }}
          >
            <p
              className="font-display text-2xl tracking-[-0.04em]"
              style={{ color: gameState.palette.keyText }}
            >
              Open source plan
            </p>
            <p className="mt-2 text-sm font-bold leading-6" style={{ color: gameState.palette.detailText }}>
              English, Numbers, Arabic, and Bengali are the starter packs.
            </p>
            <p className="mt-4 text-sm font-bold leading-6" style={{ color: gameState.palette.detailText }}>
              Later, each language can move from browser speech to real kid voice assets through the shared voice layer.
            </p>
            <p className="mt-4 text-sm font-bold leading-6" style={{ color: gameState.palette.detailText }}>
              Contributors can add new layouts in <code>src/lib/language-packs.ts</code> and follow the root
              contribution guide.
            </p>
            {!hasSpeechSynthesis ? (
              <p className="mt-4 text-sm font-bold leading-6" style={{ color: gameState.palette.detailText }}>
                This browser does not expose speech synthesis, so future audio-file voices will be the best fallback.
              </p>
            ) : null}
          </section>
        </aside>
      </div>
    </main>
  );
}
