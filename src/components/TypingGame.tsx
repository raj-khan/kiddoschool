"use client";

import { startTransition, useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";

import { BigKeyDisplay } from "@/components/BigKeyDisplay";
import { ControlButtons } from "@/components/ControlButtons";
import { ParentSettings } from "@/components/ParentSettings";
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
import { isVoicePlaybackAvailable, speakWithVoice, stopVoicePlayback } from "@/lib/voice";

type GameState = {
  displayText: string | null;
  speechText: string | null;
  displayDirection: "ltr" | "rtl";
  emoji: string;
  message: string;
  palette: Palette;
  burstKey: number;
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
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLanguageId, setSelectedLanguageId] = useState<LanguagePackId>(DEFAULT_LANGUAGE_ID);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(true);
  const [showPlayControls, setShowPlayControls] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const mutedRef = useRef(isMuted);
  const paletteRef = useRef(INITIAL_PALETTE);
  const selectedLanguagePack = getLanguagePackById(selectedLanguageId);

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

  const isImmersiveStage = !showVirtualKeyboard;
  const shellLayoutClasses = showVirtualKeyboard
    ? "max-w-6xl gap-3 pt-17 sm:pt-19"
    : "max-w-4xl justify-center gap-5 pt-18 sm:pt-20";

  return (
    <main
      className="relative h-[100svh] overflow-hidden px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6"
      style={{ background: gameState.palette.background }}
    >
      <ParentSettings
        isOpen={isSettingsOpen}
        onToggle={() => setIsSettingsOpen((currentValue) => !currentValue)}
        onClose={() => setIsSettingsOpen(false)}
        languagePack={selectedLanguagePack}
        onLanguageChange={handleLanguageChange}
        showVirtualKeyboard={showVirtualKeyboard}
        onToggleVirtualKeyboard={() => setShowVirtualKeyboard((currentValue) => !currentValue)}
        showPlayControls={showPlayControls}
        onTogglePlayControls={() => setShowPlayControls((currentValue) => !currentValue)}
        palette={gameState.palette}
      />

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

      <div className={`mx-auto flex h-full w-full min-h-0 flex-col ${shellLayoutClasses}`}>
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
          immersive={isImmersiveStage}
          constrained={showVirtualKeyboard}
        />

        {showVirtualKeyboard ? (
          <div className="flex flex-none flex-col gap-3">
            {showPlayControls ? (
              <ControlButtons
                isMuted={isMuted}
                isFullscreen={isFullscreen}
                canFullscreen={canFullscreen}
                onToggleMute={handleToggleMute}
                onClear={handleClear}
                onToggleFullscreen={handleToggleFullscreen}
                palette={gameState.palette}
                compact
              />
            ) : null}

            <VirtualKeyboard
              languagePack={selectedLanguagePack}
              onKeyPress={handleVirtualKeyPress}
              palette={gameState.palette}
              minimal
            />
          </div>
        ) : showPlayControls ? (
          <ControlButtons
            isMuted={isMuted}
            isFullscreen={isFullscreen}
            canFullscreen={canFullscreen}
            onToggleMute={handleToggleMute}
            onClear={handleClear}
            onToggleFullscreen={handleToggleFullscreen}
            palette={gameState.palette}
            compact
          />
        ) : null}
      </div>
    </main>
  );
}
