import type { LearningMode } from "./learning-content";
import type { LanguagePackId } from "./language-packs";
import type { NumberBoardOrder, NumberRangeMax } from "./numbers";

export type ArabicVoice = "female" | "male";

export type ParentSettingsState = {
  isMuted: boolean;
  learningMode: LearningMode;
  selectedLanguageId: LanguagePackId;
  numberRangeMax: NumberRangeMax;
  numberBoardOrder: NumberBoardOrder;
  showVirtualKeyboard: boolean;
  showPlayControls: boolean;
  arabicVoice: ArabicVoice;
};

export const PARENT_SETTINGS_STORAGE_KEY = "nuha-keyboard.parent-settings";
export const PARENT_SETTINGS_EVENT = "nuha-keyboard:parent-settings-change";

export const DEFAULT_PARENT_SETTINGS_STATE: ParentSettingsState = {
  isMuted: false,
  learningMode: "letters",
  selectedLanguageId: "english",
  numberRangeMax: 20,
  numberBoardOrder: "ascending",
  showVirtualKeyboard: true,
  showPlayControls: false,
  arabicVoice: "female"
};

function isLearningMode(value: unknown): value is LearningMode {
  return value === "letters" || value === "computer" || value === "colors";
}

function isLanguagePackId(value: unknown): value is LanguagePackId {
  return value === "english" || value === "numbers" || value === "arabic" || value === "bengali";
}

function isNumberRangeMax(value: unknown): value is NumberRangeMax {
  return value === 10 || value === 20 || value === 50 || value === 100;
}

function isNumberBoardOrder(value: unknown): value is NumberBoardOrder {
  return value === "ascending" || value === "descending" || value === "random";
}

export function sanitizeParentSettingsState(value: unknown): ParentSettingsState | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const settings = value as Record<string, unknown>;

  if (
    typeof settings.isMuted !== "boolean" ||
    !isLearningMode(settings.learningMode) ||
    !isLanguagePackId(settings.selectedLanguageId) ||
    !isNumberRangeMax(settings.numberRangeMax) ||
    !isNumberBoardOrder(settings.numberBoardOrder) ||
    typeof settings.showVirtualKeyboard !== "boolean" ||
    typeof settings.showPlayControls !== "boolean"
  ) {
    return null;
  }

  return {
    isMuted: settings.isMuted,
    learningMode: settings.learningMode,
    selectedLanguageId: settings.selectedLanguageId,
    numberRangeMax: settings.numberRangeMax,
    numberBoardOrder: settings.numberBoardOrder,
    showVirtualKeyboard: settings.showVirtualKeyboard,
    showPlayControls: settings.showPlayControls,
    arabicVoice: settings.arabicVoice === "male" ? "male" : "female"
  };
}

let _cachedSettingsRaw: string | undefined;
let _cachedSettingsSnapshot: ParentSettingsState = DEFAULT_PARENT_SETTINGS_STATE;

export function loadParentSettingsState(): ParentSettingsState {
  if (typeof window === "undefined") {
    return DEFAULT_PARENT_SETTINGS_STATE;
  }

  try {
    const raw = window.localStorage.getItem(PARENT_SETTINGS_STORAGE_KEY) ?? "null";
    if (raw === _cachedSettingsRaw) {
      return _cachedSettingsSnapshot;
    }
    _cachedSettingsRaw = raw;
    _cachedSettingsSnapshot = sanitizeParentSettingsState(JSON.parse(raw)) ?? DEFAULT_PARENT_SETTINGS_STATE;
    return _cachedSettingsSnapshot;
  } catch {
    return DEFAULT_PARENT_SETTINGS_STATE;
  }
}

export function saveParentSettingsState(settings: ParentSettingsState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PARENT_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event(PARENT_SETTINGS_EVENT));
}

export function subscribeToParentSettingsState(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === PARENT_SETTINGS_STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener(PARENT_SETTINGS_EVENT, callback);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(PARENT_SETTINGS_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}
