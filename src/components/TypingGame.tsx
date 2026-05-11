"use client";

import { startTransition, useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";

import { BigKeyDisplay } from "@/components/BigKeyDisplay";
import { ColorPaletteBar } from "@/components/ColorPaletteBar";
import { ControlButtons } from "@/components/ControlButtons";
import { NumberBoard } from "@/components/NumberBoard";
import { ParentSettings } from "@/components/ParentSettings";
import { SiteNav } from "@/components/SiteNav";
import { StartRail, type StartRailItem } from "@/components/StartRail";
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
  getResolvedColorOptions,
  getLearningModeLabel,
  type ColorOptionId,
  type LearningMode
} from "@/lib/learning-content";
import {
  getKidAgeLabel,
  getKidPlayStyleLabel,
  getProfileAwareHint,
  loadKidProfile,
  subscribeToKidProfile,
  type KidProfile
} from "@/lib/kid-profile";
import {
  ARABIC_FEMALE_VOICE,
  ARABIC_MALE_VOICE,
  COLORS_VOICE,
  ENGLISH_COMPUTER_PRACTICE_PACK,
  findLanguageKeyByValue,
  getLanguagePackById,
  type LanguageKey,
  type LanguagePack,
  type LanguagePackId,
  type VoiceConfig
} from "@/lib/language-packs";
import {
  getNumberAssetKey,
  getNumberBoardValues,
  getNumberSpeechText
} from "@/lib/numbers";
import {
  loadParentSettingsState,
  saveParentSettingsState,
  subscribeToParentSettingsState
} from "@/lib/parent-settings-state";
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
  const [numberBoardRandomSeed, setNumberBoardRandomSeed] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayIndexRef = useRef(0);
  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const parentSettings = useSyncExternalStore(
    subscribeToParentSettingsState,
    loadParentSettingsState,
    loadParentSettingsState
  );
  const {
    isMuted,
    learningMode,
    selectedLanguageId,
    numberRangeMax,
    numberBoardOrder,
    showVirtualKeyboard,
    showPlayControls,
    arabicVoice
  } = parentSettings;
  const mutedRef = useRef(isMuted);
  const paletteRef = useRef(INITIAL_PALETTE);
  const kidProfile = useSyncExternalStore(subscribeToKidProfile, loadKidProfile, () => null);
  const selectedLanguagePack = getLanguagePackById(selectedLanguageId);
  const arabicPackVoice = arabicVoice === "male" ? ARABIC_MALE_VOICE : ARABIC_FEMALE_VOICE;
  const activeLanguagePack =
    learningMode === "computer"
      ? ENGLISH_COMPUTER_PRACTICE_PACK
      : selectedLanguagePack.id === "arabic"
        ? { ...selectedLanguagePack, voice: arabicPackVoice }
        : selectedLanguagePack;
  const colorLearningContent = getColorLearningContent(selectedLanguageId);

  const canSpeak = useSyncExternalStore(
    subscribeToNoop,
    () => isVoicePlaybackAvailable(activeLanguagePack.voice),
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

  function updateParentSettings(
    nextSettings:
      | typeof parentSettings
      | ((currentSettings: typeof parentSettings) => typeof parentSettings)
  ) {
    saveParentSettingsState(
      typeof nextSettings === "function" ? nextSettings(parentSettings) : nextSettings
    );
  }

  function getPackSpeechLang(languagePack: LanguagePack): string {
    return languagePack.voice.type === "speech-synthesis"
      ? languagePack.voice.lang
      : languagePack.voice.fallback?.lang ?? "en-US";
  }

  function getActiveLanguagePack(
    nextLearningMode: LearningMode,
    languageId: LanguagePackId
  ): LanguagePack {
    return nextLearningMode === "computer"
      ? ENGLISH_COMPUTER_PRACTICE_PACK
      : getLanguagePackById(languageId);
  }

  function getIdleDisplayDirection(
    nextLearningMode: LearningMode,
    languageId: LanguagePackId
  ): "ltr" | "rtl" {
    if (nextLearningMode === "colors") {
      return getColorLearningContent(languageId).direction;
    }

    return getActiveLanguagePack(nextLearningMode, languageId).direction;
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
    skipBurst?: boolean;
    voice?: VoiceConfig;
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
        voice: item.voice ?? activeLanguagePack.voice,
        speechLang: item.speechLang
      });
    }

    startTransition(() => {
      setGameState((currentState) => ({
        displayText: item.displayText,
        speechText: item.speechText,
        displayDirection: item.textDirection,
        emoji: item.skipBurst ? currentState.emoji : getRandomItem(EMOJIS),
        message: item.skipBurst ? currentState.message : getRandomItem(MESSAGES),
        palette: nextPalette,
        burstKey: item.skipBurst ? currentState.burstKey : currentState.burstKey + 1,
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
    if (learningMode === "colors") {
      return;
    }

    if (shouldIgnoreShortcut(event)) {
      return;
    }

    const resolvedKey = resolveLanguageInput(activeLanguagePack, event.key);

    if (!resolvedKey) {
      return;
    }

    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setIsAutoPlaying(false);
    stopVoicePlayback();
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

  const showNumberBoard = learningMode === "letters" && selectedLanguageId === "numbers";
  const numberBoardValues = showNumberBoard
    ? getNumberBoardValues(numberRangeMax, numberBoardOrder, numberBoardRandomSeed)
    : [];
  const startRailItems: readonly StartRailItem[] =
    learningMode === "colors"
      ? getResolvedColorOptions(selectedLanguageId)
          .slice(0, 4)
          .map((color) => ({
            id: color.id,
            label: color.label,
            ariaLabel: `Try ${color.label}`,
            direction: color.textDirection,
            swatch: color.swatch
          }))
      : showNumberBoard
        ? [1, 2, 3, 4]
            .filter((value) => value <= numberRangeMax)
            .map((value) => ({
              id: String(value),
              label: String(value),
              ariaLabel: `Try number ${value}`
            }))
        : activeLanguagePack.rows
            .flat()
            .filter((languageKey) => !languageKey.size || languageKey.size === "regular")
            .slice(0, 4)
            .map((languageKey) => ({
              id: languageKey.value,
              label: languageKey.label ?? languageKey.displayText ?? languageKey.value,
              ariaLabel: `Try ${languageKey.name ?? languageKey.label ?? languageKey.value}`,
              direction: languageKey.textDirection ?? activeLanguagePack.direction
            }));

  const playAutoPlayItem = useEffectEvent((): boolean => {
    const items = showNumberBoard
      ? numberBoardValues
      : activeLanguagePack.rows.flat().filter((k) => !k.size || k.size === "regular");

    const index = autoPlayIndexRef.current;

    if (index >= items.length) {
      setIsAutoPlaying(false);
      return false;
    }

    const item = items[index];
    autoPlayIndexRef.current = index + 1;

    if (showNumberBoard) {
      const n = item as number;
      const displayText = String(n);
      startTransition(() => {
        setGameState((s) => ({
          ...s,
          displayText,
          speechText: getNumberSpeechText(n),
          displayDirection: "ltr",
          activeItemId: displayText,
          previewColor: null
        }));
      });
      if (!mutedRef.current) {
        void speakWithVoice({
          text: getNumberSpeechText(n),
          assetKey: getNumberAssetKey(n),
          voice: selectedLanguagePack.voice,
          speechLang: getPackSpeechLang(selectedLanguagePack)
        });
      }
      return true;
    }

    const resolved = resolveVirtualLanguageKey(activeLanguagePack, item as LanguageKey);
    startTransition(() => {
      setGameState((s) => ({
        ...s,
        displayText: resolved.displayText,
        speechText: resolved.speechText,
        displayDirection: resolved.textDirection,
        activeItemId: resolved.value,
        previewColor: null
      }));
    });
    if (!mutedRef.current) {
      void speakWithVoice({
        text: resolved.speechText,
        assetKey: resolved.assetKey,
        voice: activeLanguagePack.voice,
        speechLang: resolved.speechLang
      });
    }
    return true;
  });

  useEffect(() => {
    if (!isAutoPlaying) return;

    autoPlayIndexRef.current = 0;
    let cancelled = false;

    function tick() {
      if (cancelled) return;
      const hasMore = playAutoPlayItem();
      if (hasMore && !cancelled) {
        autoPlayTimerRef.current = setTimeout(tick, 2500);
      }
    }

    tick();

    return () => {
      cancelled = true;
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      stopVoicePlayback();
    };
  }, [isAutoPlaying]);

  function handleToggleMute() {
    updateParentSettings((currentSettings) => {
      const nextValue = !currentSettings.isMuted;

      if (nextValue && canSpeak) {
        stopVoicePlayback();
      }

      return {
        ...currentSettings,
        isMuted: nextValue
      };
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

    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setIsAutoPlaying(false);
    stopVoicePlayback();
    updateParentSettings((currentSettings) => ({
      ...currentSettings,
      selectedLanguageId: languageId
    }));
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

    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setIsAutoPlaying(false);
    stopVoicePlayback();
    updateParentSettings((currentSettings) => ({
      ...currentSettings,
      learningMode: nextLearningMode
    }));
    setGameState((currentState) => ({
      ...INITIAL_STATE,
      displayDirection: getIdleDisplayDirection(nextLearningMode, selectedLanguageId),
      palette: currentState.palette,
      burstKey: currentState.burstKey + 1
    }));
  }

  function handleNumberRangeChange(maxNumber: typeof numberRangeMax) {
    updateParentSettings((currentSettings) => ({
      ...currentSettings,
      numberRangeMax: maxNumber
    }));

    if (numberBoardOrder === "random") {
      setNumberBoardRandomSeed((currentValue) => currentValue + 1);
    }
  }

  function handleNumberBoardOrderChange(nextOrder: typeof numberBoardOrder) {
    if (nextOrder === numberBoardOrder) {
      return;
    }

    updateParentSettings((currentSettings) => ({
      ...currentSettings,
      numberBoardOrder: nextOrder
    }));

    if (nextOrder === "random") {
      setNumberBoardRandomSeed((currentValue) => currentValue + 1);
    }
  }

  function handleVirtualKeyPress(languageKey: LanguageKey) {
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setIsAutoPlaying(false);
    stopVoicePlayback();
    void activateResolvedKey(resolveVirtualLanguageKey(activeLanguagePack, languageKey));
  }

  function handleNumberSelect(value: number) {
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setIsAutoPlaying(false);
    const displayText = String(value);

    void activateDisplayItem({
      displayText,
      speechText: getNumberSpeechText(value),
      speechLang: getPackSpeechLang(selectedLanguagePack),
      textDirection: "ltr",
      assetKey: getNumberAssetKey(value),
      activeItemId: displayText
    });
  }

  function handleColorSelect(colorId: ColorOptionId) {
    const resolvedColor = getColorOptionById(colorId, selectedLanguageId);

    void activateDisplayItem({
      displayText: resolvedColor.label,
      speechText: resolvedColor.speechText,
      speechLang: getPackSpeechLang(selectedLanguagePack),
      textDirection: resolvedColor.textDirection,
      assetKey: resolvedColor.assetKey,
      activeItemId: resolvedColor.id,
      previewColor: resolvedColor.swatch,
      rotatePalette: false,
      voice: COLORS_VOICE
    });
  }

  function handleStartRailSelect(item: StartRailItem) {
    if (learningMode === "colors") {
      handleColorSelect(item.id as ColorOptionId);
      return;
    }

    if (showNumberBoard) {
      handleNumberSelect(Number(item.id));
      return;
    }

    const languageKey = findLanguageKeyByValue(activeLanguagePack, item.id);

    if (languageKey) {
      handleVirtualKeyPress(languageKey);
    }
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

  const showLettersKeyboard =
    learningMode === "letters" && selectedLanguageId !== "numbers" && showVirtualKeyboard;
  const showComputerKeyboard = learningMode === "computer";
  const showColorPalette = learningMode === "colors";
  const showInputPanel =
    showLettersKeyboard || showComputerKeyboard || showColorPalette || showNumberBoard;
  const isImmersiveStage = !showInputPanel;
  const shellLayoutClasses = showNumberBoard
    ? "max-w-7xl gap-3 pt-17 sm:pt-19"
    : showInputPanel
      ? "max-w-6xl gap-3 pt-17 sm:pt-19"
      : "max-w-4xl justify-center gap-5 pt-18 sm:pt-20";
  const modeLabel = getLearningModeLabel(learningMode, selectedLanguageId);
  const idlePrompt =
    learningMode === "colors"
      ? colorLearningContent.prompt
      : showNumberBoard
        ? `Tap any number up to ${numberRangeMax}.`
        : activeLanguagePack.prompt;
  const idleHint =
    learningMode === "colors"
      ? getProfileAwareHint("colors", colorLearningContent.hint, kidProfile, false)
      : getProfileAwareHint(
          learningMode,
          showNumberBoard
            ? `The number board is set to 1 through ${numberRangeMax}, and symbols stay in Computer mode.`
            : activeLanguagePack.hint,
          kidProfile,
          showNumberBoard
        );
  const activeEnglishLetter =
    learningMode === "letters" &&
    selectedLanguageId === "english" &&
    gameState.activeItemId &&
    /^[a-z]$/i.test(gameState.activeItemId)
      ? gameState.activeItemId
      : null;
  const floatingEchoText =
    learningMode !== "colors" && gameState.displayText && gameState.displayText.length <= 6
      ? gameState.displayText
      : null;
  const numberBoardOrderLabel =
    numberBoardOrder === "ascending"
      ? "Straight"
      : numberBoardOrder === "descending"
        ? "Reverse"
        : "Random";
  const controls = showPlayControls ? (
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
  ) : null;
  const kidAgeLabel = kidProfile ? getKidAgeLabel(kidProfile.ageGroup) : null;
  const kidPlayStyleLabel = kidProfile ? getKidPlayStyleLabel(kidProfile.playStyle) : null;
  const activeColorId =
    learningMode === "colors" && gameState.activeItemId
      ? (gameState.activeItemId as ColorOptionId)
      : null;

  return (
    <main
      className="relative min-h-[100svh] overflow-x-hidden overflow-y-auto px-4 py-4 sm:h-[100svh] sm:overflow-hidden sm:px-5 sm:py-5 lg:px-6 lg:py-6"
      style={{ background: gameState.palette.background }}
    >
      <SiteNav
        currentPath="/"
        overlay
        languagePackId={selectedLanguageId}
        onLanguageChange={handleLanguageChange}
      />

      <ParentSettings
        isOpen={isSettingsOpen}
        onToggle={() => setIsSettingsOpen((currentValue) => !currentValue)}
        onClose={() => setIsSettingsOpen(false)}
        learningMode={learningMode}
        onLearningModeChange={handleLearningModeChange}
        languagePack={selectedLanguagePack}
        onLanguageChange={handleLanguageChange}
        numberRangeMax={numberRangeMax}
        onNumberRangeChange={handleNumberRangeChange}
        numberBoardOrder={numberBoardOrder}
        onNumberBoardOrderChange={handleNumberBoardOrderChange}
        showVirtualKeyboard={showVirtualKeyboard}
        onToggleVirtualKeyboard={() =>
          updateParentSettings((currentSettings) => ({
            ...currentSettings,
            showVirtualKeyboard: !currentSettings.showVirtualKeyboard
          }))
        }
        showPlayControls={showPlayControls}
        onTogglePlayControls={() =>
          updateParentSettings((currentSettings) => ({
            ...currentSettings,
            showPlayControls: !currentSettings.showPlayControls
          }))
        }
        arabicVoice={arabicVoice}
        onArabicVoiceChange={(voice) =>
          updateParentSettings((currentSettings) => ({
            ...currentSettings,
            arabicVoice: voice
          }))
        }
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

      <div className={`mx-auto flex min-h-[calc(100svh-2rem)] w-full flex-col sm:h-full sm:min-h-0 ${shellLayoutClasses}`}>
        {showNumberBoard ? (
          <>
            {controls}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => { if (isAutoPlaying) { if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current); stopVoicePlayback(); setIsAutoPlaying(false); } else { setIsAutoPlaying(true); } }}
                className="flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-extrabold uppercase tracking-[0.16em] shadow-[0_4px_0_rgba(45,48,71,0.14),0_8px_18px_rgba(45,48,71,0.06)] transition duration-150 hover:-translate-y-px active:translate-y-0.5 active:shadow-[0_1px_0_rgba(45,48,71,0.14)]"
                style={{
                  background: isAutoPlaying ? gameState.palette.activeKeySurface : gameState.palette.buttonSurface,
                  borderColor: isAutoPlaying ? gameState.palette.activeKeyBorder : gameState.palette.buttonBorder,
                  color: isAutoPlaying ? gameState.palette.activeKeyText : gameState.palette.buttonText,
                  boxShadow: isAutoPlaying ? `0 4px 0 ${gameState.palette.activeKeyBorder}, 0 14px 26px ${gameState.palette.activeKeyGlow}` : undefined
                }}
                aria-pressed={isAutoPlaying}
              >
                <span className="text-base leading-none">{isAutoPlaying ? "■" : "▶"}</span>
                {isAutoPlaying ? "Stop" : "Play all"}
              </button>
            </div>

            <StartRail
              items={startRailItems}
              activeItemId={gameState.activeItemId}
              title="Start here"
              onSelect={handleStartRailSelect}
              palette={gameState.palette}
            />

            <div className="flex min-h-0 flex-1 flex-col gap-3 sm:flex-row">
              <div className="min-h-0 flex-[0.92]">
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
                  languageLabel={activeLanguagePack.label}
                  languageNativeLabel={activeLanguagePack.nativeLabel}
                  idlePrompt={idlePrompt}
                  idleHint={idleHint}
                  immersive={false}
                  constrained
                  previewColor={gameState.previewColor}
                  activeColorId={activeColorId}
                  activeEnglishLetter={activeEnglishLetter}
                  floatingEchoText={floatingEchoText}
                  kidProfile={kidProfile}
                  kidAgeLabel={kidAgeLabel}
                  kidPlayStyleLabel={kidPlayStyleLabel}
                />
              </div>

              <div className="min-h-0 flex-[1.38]">
                <NumberBoard
                  values={numberBoardValues}
                  maxNumber={numberRangeMax}
                  onNumberSelect={handleNumberSelect}
                  palette={gameState.palette}
                  activeNumberValue={gameState.activeItemId}
                  orderLabel={numberBoardOrderLabel}
                />
              </div>
            </div>
          </>
        ) : (
          <>
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
              languageLabel={activeLanguagePack.label}
              languageNativeLabel={activeLanguagePack.nativeLabel}
              idlePrompt={idlePrompt}
              idleHint={idleHint}
              immersive={isImmersiveStage}
              constrained={showInputPanel}
              previewColor={gameState.previewColor}
              activeColorId={activeColorId}
              activeEnglishLetter={activeEnglishLetter}
              floatingEchoText={floatingEchoText}
              kidProfile={kidProfile}
              kidAgeLabel={kidAgeLabel}
              kidPlayStyleLabel={kidPlayStyleLabel}
            />

            <StartRail
              items={startRailItems}
              activeItemId={gameState.activeItemId}
              title="Start here"
              onSelect={handleStartRailSelect}
              palette={gameState.palette}
            />

            {showInputPanel ? (
              <div className="flex flex-none flex-col gap-3">
                {showLettersKeyboard ? (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => { if (isAutoPlaying) { if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current); stopVoicePlayback(); setIsAutoPlaying(false); } else { setIsAutoPlaying(true); } }}
                      className="flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-extrabold uppercase tracking-[0.16em] shadow-[0_4px_0_rgba(45,48,71,0.14),0_8px_18px_rgba(45,48,71,0.06)] transition duration-150 hover:-translate-y-px active:translate-y-0.5 active:shadow-[0_1px_0_rgba(45,48,71,0.14)]"
                      style={{
                        background: isAutoPlaying ? gameState.palette.activeKeySurface : gameState.palette.buttonSurface,
                        borderColor: isAutoPlaying ? gameState.palette.activeKeyBorder : gameState.palette.buttonBorder,
                        color: isAutoPlaying ? gameState.palette.activeKeyText : gameState.palette.buttonText,
                        boxShadow: isAutoPlaying ? `0 4px 0 ${gameState.palette.activeKeyBorder}, 0 14px 26px ${gameState.palette.activeKeyGlow}` : undefined
                      }}
                      aria-pressed={isAutoPlaying}
                    >
                      <span className="text-base leading-none">{isAutoPlaying ? "■" : "▶"}</span>
                      {isAutoPlaying ? "Stop" : "Play all"}
                    </button>
                  </div>
                ) : null}

                {controls}

                {showLettersKeyboard || showComputerKeyboard ? (
                  <VirtualKeyboard
                    languagePack={activeLanguagePack}
                    onKeyPress={handleVirtualKeyPress}
                    palette={gameState.palette}
                    minimal
                    dense={showComputerKeyboard}
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
            ) : (
              controls
            )}
          </>
        )}
      </div>
    </main>
  );
}
