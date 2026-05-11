"use client";

import { startTransition, useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";

import { BigKeyDisplay } from "@/components/BigKeyDisplay";
import { ColorPaletteBar } from "@/components/ColorPaletteBar";
import { ControlButtons } from "@/components/ControlButtons";
import { KidProfileSheet } from "@/components/KidProfileSheet";
import { NumberBoard } from "@/components/NumberBoard";
import { ParentSettings } from "@/components/ParentSettings";
import { SiteFooter } from "@/components/SiteFooter";
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
  getRecommendedNumberRange,
  loadKidProfile,
  saveKidProfile,
  subscribeToKidProfile,
  type KidProfile
} from "@/lib/kid-profile";
import {
  ARABIC_FEMALE_VOICE,
  ARABIC_MALE_VOICE,
  ENGLISH_COMPUTER_PRACTICE_PACK,
  getLanguagePackById,
  type LanguageKey,
  type LanguagePack,
  type LanguagePackId
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
  const [isKidProfileEditorOpen, setIsKidProfileEditorOpen] = useState(false);
  const [numberBoardRandomSeed, setNumberBoardRandomSeed] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
        voice: activeLanguagePack.voice,
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

  function handleSaveKidProfile(profile: KidProfile) {
    const recommendedNumberRange = getRecommendedNumberRange(profile.ageGroup);

    saveKidProfile(profile);
    updateParentSettings((currentSettings) => ({
      ...currentSettings,
      numberRangeMax: recommendedNumberRange
    }));
    setIsKidProfileEditorOpen(false);
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
    void activateResolvedKey(resolveVirtualLanguageKey(activeLanguagePack, languageKey));
  }

  function handleNumberSelect(value: number) {
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

  const showNumberBoard = learningMode === "letters" && selectedLanguageId === "numbers";
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
    learningMode === "computer" && gameState.displayText
      ? gameState.displayText.length <= 10
        ? gameState.displayText
        : null
      : null;
  const numberBoardValues = showNumberBoard
    ? getNumberBoardValues(numberRangeMax, numberBoardOrder, numberBoardRandomSeed)
    : [];
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
  const isKidProfileSheetOpen = kidProfile === null || isKidProfileEditorOpen;
  const activeColorId =
    learningMode === "colors" && gameState.activeItemId
      ? (gameState.activeItemId as ColorOptionId)
      : null;

  return (
    <main
      className="relative h-[100svh] overflow-hidden px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6"
      style={{ background: gameState.palette.background }}
    >
      <SiteNav currentPath="/" overlay />
      <SiteFooter overlay />

      <KidProfileSheet
        key={kidProfile ? `${kidProfile.ageGroup}-${kidProfile.playStyle}` : "new"}
        isOpen={isKidProfileSheetOpen}
        initialProfile={kidProfile}
        palette={gameState.palette}
        canClose={kidProfile !== null}
        onSave={handleSaveKidProfile}
        onClose={() => setIsKidProfileEditorOpen(false)}
      />

      <ParentSettings
        isOpen={isSettingsOpen}
        onToggle={() => setIsSettingsOpen((currentValue) => !currentValue)}
        onClose={() => setIsSettingsOpen(false)}
        kidProfile={kidProfile}
        onOpenKidProfile={() => setIsKidProfileEditorOpen(true)}
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

      <div className={`mx-auto flex h-full w-full min-h-0 flex-col ${shellLayoutClasses}`}>
        {showNumberBoard ? (
          <>
            {controls}

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
                  floatingEchoText={null}
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

            {showInputPanel ? (
              <div className="flex flex-none flex-col gap-3">
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
