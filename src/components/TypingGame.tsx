"use client";

import { startTransition, useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";

import { BigKeyDisplay } from "@/components/BigKeyDisplay";
import { ColorPaletteBar } from "@/components/ColorPaletteBar";
import { ControlButtons } from "@/components/ControlButtons";
import { NumberBoard } from "@/components/NumberBoard";
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
  ENGLISH_COMPUTER_PRACTICE_PACK,
  getLanguagePackById,
  type LanguageKey,
  type LanguagePack,
  type LanguagePackId
} from "@/lib/language-packs";
import {
  getNumberAssetKey,
  getNumberBoardValues,
  getNumberSpeechText,
  type NumberBoardOrder,
  type NumberRangeMax
} from "@/lib/numbers";
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
  const [numberRangeMax, setNumberRangeMax] = useState<NumberRangeMax>(20);
  const [numberBoardOrder, setNumberBoardOrder] = useState<NumberBoardOrder>("ascending");
  const [numberBoardRandomSeed, setNumberBoardRandomSeed] = useState(1);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(true);
  const [showPlayControls, setShowPlayControls] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const mutedRef = useRef(isMuted);
  const paletteRef = useRef(INITIAL_PALETTE);
  const selectedLanguagePack = getLanguagePackById(selectedLanguageId);
  const activeLanguagePack =
    learningMode === "computer" ? ENGLISH_COMPUTER_PRACTICE_PACK : selectedLanguagePack;
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

  function handleNumberRangeChange(maxNumber: NumberRangeMax) {
    setNumberRangeMax(maxNumber);

    if (numberBoardOrder === "random") {
      setNumberBoardRandomSeed((currentValue) => currentValue + 1);
    }
  }

  function handleNumberBoardOrderChange(nextOrder: NumberBoardOrder) {
    if (nextOrder === numberBoardOrder) {
      return;
    }

    setNumberBoardOrder(nextOrder);

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

  function handleColorSelect(colorId: Parameters<typeof getColorOptionById>[0]) {
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
    : showComputerKeyboard
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
      ? colorLearningContent.hint
      : showNumberBoard
        ? `The number board is set to 1 through ${numberRangeMax}, and symbols stay in Computer mode.`
        : activeLanguagePack.hint;
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
        numberRangeMax={numberRangeMax}
        onNumberRangeChange={handleNumberRangeChange}
        numberBoardOrder={numberBoardOrder}
        onNumberBoardOrderChange={handleNumberBoardOrderChange}
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
                  activeEnglishLetter={activeEnglishLetter}
                  floatingEchoText={null}
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
        ) : showComputerKeyboard ? (
          <>
            {controls}

            <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
              <div className="flex-none lg:min-h-0 lg:w-[36%] xl:w-[34%]">
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
                  activeEnglishLetter={null}
                  floatingEchoText={floatingEchoText}
                />
              </div>

              <div className="min-h-0 flex-1">
                <VirtualKeyboard
                  languagePack={activeLanguagePack}
                  onKeyPress={handleVirtualKeyPress}
                  palette={gameState.palette}
                  minimal
                  dense
                  activeKeyValue={gameState.activeItemId}
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
              activeEnglishLetter={activeEnglishLetter}
              floatingEchoText={floatingEchoText}
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
                    dense={false}
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
