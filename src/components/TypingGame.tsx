"use client";

import { startTransition, useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";

import { BigKeyDisplay } from "@/components/BigKeyDisplay";
import { ColorPaletteBar } from "@/components/ColorPaletteBar";
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
  getColorLearningContent,
  getColorOptionById,
  getLearningModeLabel,
  type LearningMode
} from "@/lib/learning-content";
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
  activeItemId: string | null;
  previewColor: string | null;
};

const INITIAL_PALETTE = PALETTES[0];

const INITIAL_STATE: GameState = {
  displayText: null,
  speechText: null,
  displayDirection: "ltr",
  emoji: IDLE_EMOJI,
  message: "",
  palette: INITIAL_PALETTE,
  burstKey: 0,
  activeItemId: null,
  previewColor: null
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
  const [learningMode, setLearningMode] = useState<LearningMode>("letters");
  const [selectedLanguageId, setSelectedLanguageId] = useState<LanguagePackId>(DEFAULT_LANGUAGE_ID);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(true);
  const [showPlayControls, setShowPlayControls] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const mutedRef = useRef(isMuted);
  const paletteRef = useRef(INITIAL_PALETTE);
  const selectedLanguagePack = getLanguagePackById(selectedLanguageId);
  const colorLearningContent = getColorLearningContent(selectedLanguageId);

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

  function getPackSpeechLang(languageId: LanguagePackId): string {
    const languagePack = getLanguagePackById(languageId);

    return languagePack.voice.type === "speech-synthesis"
      ? languagePack.voice.lang
      : languagePack.voice.fallback?.lang ?? "en-US";
  }

  function getIdleDisplayDirection(
    nextLearningMode: LearningMode,
    languageId: LanguagePackId
  ): "ltr" | "rtl" {
    if (nextLearningMode === "colors") {
      return getColorLearningContent(languageId).direction;
    }

    return getLanguagePackById(languageId).direction;
  }

  async function activateDisplayItem(item: {
    displayText: string;
    speechText: string;
    speechLang: string;
    textDirection: "ltr" | "rtl";
    assetKey: string;
    activeItemId: string;
    previewColor?: string | null;
    rotatePalette?: boolean;
  }) {
    const shouldRotatePalette = item.rotatePalette ?? true;
    const nextPalette = shouldRotatePalette
      ? getRandomDifferentItem(PALETTES, paletteRef.current)
      : paletteRef.current;

    if (shouldRotatePalette) {
      paletteRef.current = nextPalette;
    }

    if (!mutedRef.current && canSpeak) {
      await speakWithVoice({
        text: item.speechText,
        assetKey: item.assetKey,
        voice: selectedLanguagePack.voice,
        speechLang: item.speechLang
      });
    }

    startTransition(() => {
      setGameState((currentState) => ({
        displayText: item.displayText,
        speechText: item.speechText,
        displayDirection: item.textDirection,
        emoji: getRandomItem(EMOJIS),
        message: getRandomItem(MESSAGES),
        palette: nextPalette,
        burstKey: currentState.burstKey + 1,
        activeItemId: item.activeItemId,
        previewColor: item.previewColor ?? null
      }));
    });
  }

  async function activateResolvedKey(resolvedKey: ResolvedLanguageKey) {
    await activateDisplayItem({
      displayText: resolvedKey.displayText,
      speechText: resolvedKey.speechText,
      speechLang: resolvedKey.speechLang,
      textDirection: resolvedKey.textDirection,
      assetKey: resolvedKey.assetKey,
      activeItemId: resolvedKey.value
    });
  }

  const handleKeydown = useEffectEvent((event: KeyboardEvent) => {
    if (learningMode !== "letters") {
      return;
    }

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
      displayDirection: getIdleDisplayDirection(learningMode, selectedLanguageId),
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
      displayDirection: getIdleDisplayDirection(learningMode, languageId),
      palette: currentState.palette,
      burstKey: currentState.burstKey + 1
    }));
  }

  function handleLearningModeChange(nextLearningMode: LearningMode) {
    if (nextLearningMode === learningMode) {
      return;
    }

    stopVoicePlayback();
    setLearningMode(nextLearningMode);
    setGameState((currentState) => ({
      ...INITIAL_STATE,
      displayDirection: getIdleDisplayDirection(nextLearningMode, selectedLanguageId),
      palette: currentState.palette,
      burstKey: currentState.burstKey + 1
    }));
  }

  function handleVirtualKeyPress(languageKey: LanguageKey) {
    void activateResolvedKey(resolveVirtualLanguageKey(selectedLanguagePack, languageKey));
  }

  function handleColorSelect(colorId: Parameters<typeof getColorOptionById>[0]) {
    const resolvedColor = getColorOptionById(colorId, selectedLanguageId);

    void activateDisplayItem({
      displayText: resolvedColor.label,
      speechText: resolvedColor.speechText,
      speechLang: getPackSpeechLang(selectedLanguageId),
      textDirection: resolvedColor.textDirection,
      assetKey: resolvedColor.assetKey,
      activeItemId: resolvedColor.id,
      previewColor: resolvedColor.swatch,
      rotatePalette: false
    });
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

  const showLettersKeyboard = learningMode === "letters" && showVirtualKeyboard;
  const showColorPalette = learningMode === "colors";
  const showInputPanel = showLettersKeyboard || showColorPalette;
  const isImmersiveStage = !showInputPanel;
  const shellLayoutClasses = showInputPanel
    ? "max-w-6xl gap-3 pt-17 sm:pt-19"
    : "max-w-4xl justify-center gap-5 pt-18 sm:pt-20";
  const modeLabel = getLearningModeLabel(learningMode, selectedLanguageId);
  const idlePrompt = learningMode === "colors" ? colorLearningContent.prompt : selectedLanguagePack.prompt;
  const idleHint = learningMode === "colors" ? colorLearningContent.hint : selectedLanguagePack.hint;

  return (
    <main
      className="relative h-[100svh] overflow-hidden px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6"
      style={{ background: gameState.palette.background }}
    >
      <ParentSettings
        isOpen={isSettingsOpen}
        onToggle={() => setIsSettingsOpen((currentValue) => !currentValue)}
        onClose={() => setIsSettingsOpen(false)}
        learningMode={learningMode}
        onLearningModeChange={handleLearningModeChange}
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
          modeLabel={modeLabel}
          languageLabel={selectedLanguagePack.label}
          languageNativeLabel={selectedLanguagePack.nativeLabel}
          idlePrompt={idlePrompt}
          idleHint={idleHint}
          immersive={isImmersiveStage}
          constrained={showInputPanel}
          previewColor={gameState.previewColor}
        />

        {showInputPanel ? (
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

            {showLettersKeyboard ? (
              <VirtualKeyboard
                languagePack={selectedLanguagePack}
                onKeyPress={handleVirtualKeyPress}
                palette={gameState.palette}
                minimal
                activeKeyValue={gameState.activeItemId}
              />
            ) : null}

            {showColorPalette ? (
              <ColorPaletteBar
                languagePackId={selectedLanguageId}
                onColorSelect={handleColorSelect}
                palette={gameState.palette}
                activeColorId={gameState.activeItemId}
              />
            ) : null}
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
