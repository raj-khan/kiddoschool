"use client";

import { startTransition, useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";

import { BigKeyDisplay } from "@/components/BigKeyDisplay";
import { ColorPaletteBar } from "@/components/ColorPaletteBar";
import { ControlButtons } from "@/components/ControlButtons";
import { ModeTabsRail, type ModeTabId } from "@/components/ModeTabsRail";
import { NumberBoard } from "@/components/NumberBoard";
import { NuhaLogo } from "@/components/NuhaLogo";
import { ParentSettings } from "@/components/ParentSettings";
import { RecentChipsRail, type RecentChipEntry } from "@/components/RecentChipsRail";
import { SiteNav } from "@/components/SiteNav";
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
  type ColorOptionId,
  type LearningMode
} from "@/lib/learning-content";
import {
  getKidAgeLabel,
  getKidPlayStyleLabel,
  getProfileAwareHint,
  loadKidProfile,
  subscribeToKidProfile
} from "@/lib/kid-profile";
import {
  ARABIC_FEMALE_VOICE,
  ARABIC_MALE_VOICE,
  COLORS_VOICE,
  ENGLISH_COMPUTER_PRACTICE_PACK,
  getLanguagePackById,
  type LanguageKey,
  type LanguagePack,
  type LanguagePackId,
  type VoiceConfig
} from "@/lib/language-packs";
import {
  getNumberAssetKey,
  getNumberBoardValues,
  getNumberSpeechText,
  type NumberRangeMax
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
  recent: RecentChipEntry[];
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
  previewColor: null,
  recent: []
};

const INTERACTIVE_TAGS = new Set(["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"]);
const RECENT_CHIP_LIMIT = 12;

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

function subscribeToResize(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("resize", callback);

  return () => {
    window.removeEventListener("resize", callback);
  };
}

function getResponsiveNumberMax(selectedMax: NumberRangeMax): NumberRangeMax {
  if (typeof window === "undefined") {
    return selectedMax;
  }

  if (window.innerWidth >= 1024) {
    return selectedMax;
  }

  if (window.innerWidth >= 640) {
    return Math.min(selectedMax, 50) as NumberRangeMax;
  }

  if (window.innerWidth >= 430) {
    return Math.min(selectedMax, 20) as NumberRangeMax;
  }

  return Math.min(selectedMax, 10) as NumberRangeMax;
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

type AutoPlayButtonProps = {
  isAutoPlaying: boolean;
  onToggle: () => void;
  palette: Palette;
  stacked?: boolean;
};

function AutoPlayButton({
  isAutoPlaying,
  onToggle,
  palette,
  stacked = false
}: AutoPlayButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center justify-center gap-2 rounded-full font-body text-sm uppercase tracking-[0.14em] transition duration-150 hover:-translate-y-px active:translate-y-0.5 ${
        stacked ? "w-full px-4 py-2.5" : "px-4 py-2"
      }`}
      style={{
        background: isAutoPlaying ? palette.primary : "#fff",
        color: isAutoPlaying ? "#fff" : palette.ink,
        fontWeight: 800,
        boxShadow: isAutoPlaying
          ? `0 3px 0 ${palette.primaryDeep}`
          : `0 0 0 1px ${palette.cardLine} inset, 0 3px 0 ${palette.cardShadow}55`
      }}
      aria-pressed={isAutoPlaying}
    >
      <span aria-hidden="true">{isAutoPlaying ? "■" : "▶"}</span>
      <span>{isAutoPlaying ? "Stop" : "Play all"}</span>
    </button>
  );
}

export function TypingGame() {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [numberBoardRandomSeed, setNumberBoardRandomSeed] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoPlayIndexRef = useRef(0);
  const autoPlayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chipColorIndexRef = useRef(0);
  const recentIdRef = useRef(0);

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
  const visibleNumberRangeMax = useSyncExternalStore(
    subscribeToResize,
    () => getResponsiveNumberMax(numberRangeMax),
    () => numberRangeMax
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

  function nextChipColor(palette: Palette): string {
    const chips = palette.chips;
    const color = chips[chipColorIndexRef.current % chips.length];
    chipColorIndexRef.current += 1;
    return color;
  }

  function pushRecentChip(entry: Omit<RecentChipEntry, "id" | "color">, palette: Palette) {
    recentIdRef.current += 1;
    const chip: RecentChipEntry = {
      id: recentIdRef.current,
      color: nextChipColor(palette),
      ...entry
    };
    setGameState((current) => ({
      ...current,
      recent: [chip, ...current.recent].slice(0, RECENT_CHIP_LIMIT)
    }));
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
    chipKind?: "letter" | "number" | "symbol" | "color";
    chipLabel?: string;
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
        ...currentState,
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

    if (!item.skipBurst) {
      pushRecentChip(
        {
          display: item.displayText.length <= 3 ? item.displayText : item.displayText.slice(0, 2),
          label: item.chipLabel ?? item.speechText,
          direction: item.textDirection,
          isSymbol: item.chipKind === "symbol" || item.chipKind === "color"
        },
        nextPalette
      );
    }
  }

  async function activateResolvedKey(resolvedKey: ResolvedLanguageKey) {
    await activateDisplayItem({
      displayText: resolvedKey.displayText,
      speechText: resolvedKey.speechText,
      speechLang: resolvedKey.speechLang,
      textDirection: resolvedKey.textDirection,
      assetKey: resolvedKey.assetKey,
      activeItemId: resolvedKey.value,
      chipKind: /^[A-Za-z]$/.test(resolvedKey.displayText)
        ? "letter"
        : /^[0-9]$/.test(resolvedKey.displayText)
          ? "number"
          : "symbol",
      chipLabel: resolvedKey.speechText
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
    ? getNumberBoardValues(visibleNumberRangeMax, numberBoardOrder, numberBoardRandomSeed)
    : [];

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
      void activateDisplayItem({
        displayText,
        speechText: getNumberSpeechText(n),
        speechLang: getPackSpeechLang(selectedLanguagePack),
        textDirection: "ltr",
        assetKey: getNumberAssetKey(n),
        activeItemId: displayText,
        voice: selectedLanguagePack.voice,
        chipKind: "number"
      });
      return true;
    }

    const resolved = resolveVirtualLanguageKey(activeLanguagePack, item as LanguageKey);
    void activateResolvedKey(resolved);
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
      burstKey: currentState.burstKey + 1,
      recent: []
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
      burstKey: currentState.burstKey + 1,
      recent: []
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
      burstKey: currentState.burstKey + 1,
      recent: []
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
      activeItemId: displayText,
      chipKind: "number"
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
      voice: COLORS_VOICE,
      chipKind: "color",
      chipLabel: resolvedColor.label
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

  function handleToggleAutoPlay() {
    if (isAutoPlaying) {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      stopVoicePlayback();
      setIsAutoPlaying(false);
      return;
    }

    setIsAutoPlaying(true);
  }

  function handleModeTabSelect(tab: ModeTabId) {
    if (tab === "free") {
      if (selectedLanguageId !== "english") {
        handleLanguageChange("english");
      } else if (learningMode !== "letters") {
        handleLearningModeChange("letters");
      }
      return;
    }
    if (tab === "letters") {
      if (learningMode !== "letters") {
        handleLearningModeChange("letters");
      }
      if (selectedLanguageId === "numbers") {
        handleLanguageChange("english");
      }
      return;
    }
    if (tab === "numbers") {
      if (learningMode !== "letters") {
        handleLearningModeChange("letters");
      }
      if (selectedLanguageId !== "numbers") {
        handleLanguageChange("numbers");
      }
      return;
    }
    if (tab === "computer") {
      if (learningMode !== "computer") {
        handleLearningModeChange("computer");
      }
      return;
    }
    if (tab === "colors") {
      if (learningMode !== "colors") {
        handleLearningModeChange("colors");
      }
      return;
    }
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
  const showAuxiliaryPanel =
    showLettersKeyboard || showComputerKeyboard || showColorPalette || showNumberBoard;
  const modeLabel = getLearningModeLabel(learningMode, selectedLanguageId);
  const idlePrompt =
    learningMode === "colors"
      ? colorLearningContent.prompt
      : showNumberBoard
        ? `Tap any number up to ${visibleNumberRangeMax}.`
        : activeLanguagePack.prompt;
  const idleHint =
    learningMode === "colors"
      ? getProfileAwareHint("colors", colorLearningContent.hint, kidProfile, false)
      : getProfileAwareHint(
          learningMode,
          showNumberBoard
            ? `The number board is showing 1 through ${visibleNumberRangeMax}.`
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
  const floatingEchoText = null;
  const kidAgeLabel = kidProfile ? getKidAgeLabel(kidProfile.ageGroup) : null;
  const kidPlayStyleLabel = kidProfile ? getKidPlayStyleLabel(kidProfile.playStyle) : null;
  const activeColorId =
    learningMode === "colors" && gameState.activeItemId
      ? (gameState.activeItemId as ColorOptionId)
      : null;
  const palette = gameState.palette;
  const showAutoPlay = showLettersKeyboard || showNumberBoard;
  void showPlayControls;

  return (
    <main
      className="relative h-[100svh] overflow-hidden px-2 pb-2 pt-2 sm:px-4 sm:pb-3 sm:pt-3 lg:px-6"
      style={{ background: palette.background }}
    >
      <SiteNav currentPath="/" overlay />

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
        palette={palette}
      />

      {/* Decorative floating orbs */}
      <div
        className="floating-orb pointer-events-none -left-12 -top-8 h-40 w-40 sm:h-56 sm:w-56"
        style={{ background: palette.orbOne }}
        aria-hidden="true"
      />
      <div
        className="floating-orb floating-orb--slow floating-orb--delay pointer-events-none right-[6%] top-[14%] h-28 w-28 sm:h-44 sm:w-44"
        style={{ background: palette.orbTwo }}
        aria-hidden="true"
      />
      <div
        className="floating-orb floating-orb--late pointer-events-none -bottom-12 -right-10 h-48 w-48 sm:h-64 sm:w-64"
        style={{ background: palette.orbThree }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col gap-2 pt-14 sm:gap-3 sm:pt-16">
        {/* Header (logo + quick controls) */}
        <header className="flex flex-none flex-wrap items-center justify-between gap-2">
          <div className="hidden sm:block">
            <NuhaLogo palette={palette} size="md" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline-flex">
              {showAutoPlay ? (
                <AutoPlayButton
                  isAutoPlaying={isAutoPlaying}
                  onToggle={handleToggleAutoPlay}
                  palette={palette}
                />
              ) : null}
            </span>
            <ControlButtons
              isMuted={isMuted}
              isFullscreen={isFullscreen}
              canFullscreen={canFullscreen}
              onToggleMute={handleToggleMute}
              onClear={handleClear}
              onToggleFullscreen={handleToggleFullscreen}
              palette={palette}
              compact
            />
          </div>
        </header>

        {/* Play area — key card + (optional) aux panel share remaining height */}
        <div className="flex min-h-0 flex-1 flex-col gap-2 sm:gap-3">
          <div className={`min-h-0 ${showAuxiliaryPanel ? "flex-[3_1_0%]" : "flex-1"}`}>
            <BigKeyDisplay
              displayText={gameState.displayText}
              speechText={gameState.speechText}
              displayDirection={gameState.displayDirection}
              emoji={gameState.emoji}
              message={gameState.message}
              palette={palette}
              burstKey={gameState.burstKey}
              voiceStatus={voiceStatus}
              modeLabel={modeLabel}
              languageLabel={activeLanguagePack.label}
              languageNativeLabel={activeLanguagePack.nativeLabel}
              idlePrompt={idlePrompt}
              idleHint={idleHint}
              immersive={false}
              constrained={showAuxiliaryPanel}
              previewColor={gameState.previewColor}
              activeColorId={activeColorId}
              activeEnglishLetter={activeEnglishLetter}
              floatingEchoText={floatingEchoText}
              kidProfile={kidProfile}
              kidAgeLabel={kidAgeLabel}
              kidPlayStyleLabel={kidPlayStyleLabel}
            />
          </div>

          {showAuxiliaryPanel ? (
            <div className="flex min-h-0 flex-[4_1_0%] flex-col gap-2 sm:gap-3">
              {showAutoPlay ? (
                <div className="flex justify-center sm:hidden">
                  <AutoPlayButton
                    isAutoPlaying={isAutoPlaying}
                    onToggle={handleToggleAutoPlay}
                    palette={palette}
                  />
                </div>
              ) : null}
              <div className="min-h-0 flex-1">
                {showLettersKeyboard || showComputerKeyboard ? (
                  <VirtualKeyboard
                    languagePack={activeLanguagePack}
                    onKeyPress={handleVirtualKeyPress}
                    palette={palette}
                    minimal
                    dense={showComputerKeyboard}
                    activeKeyValue={gameState.activeItemId}
                  />
                ) : null}

                {showNumberBoard ? (
                  <NumberBoard
                    values={numberBoardValues}
                    visibleMaxNumber={visibleNumberRangeMax}
                    onNumberSelect={handleNumberSelect}
                    palette={palette}
                    activeNumberValue={gameState.activeItemId}
                    orderLabel={
                      numberBoardOrder === "ascending"
                        ? "Straight"
                        : numberBoardOrder === "descending"
                          ? "Reverse"
                          : "Random"
                    }
                  />
                ) : null}

                {showColorPalette ? (
                  <ColorPaletteBar
                    languagePackId={selectedLanguageId}
                    onColorSelect={handleColorSelect}
                    palette={palette}
                    activeColorId={gameState.activeItemId}
                  />
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {/* Compact bottom rail: recent chips + mode tabs (single row, responsive) */}
        <div className="flex flex-none flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="min-w-0 sm:flex-1">
            <RecentChipsRail chips={gameState.recent} palette={palette} compact />
          </div>
          <div className="min-w-0 sm:w-[22rem] md:w-[26rem]">
            <ModeTabsRail
              palette={palette}
              learningMode={learningMode}
              selectedLanguageId={selectedLanguageId}
              onSelectTab={handleModeTabSelect}
              compact
            />
          </div>
        </div>
      </div>
    </main>
  );
}
