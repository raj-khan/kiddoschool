import type { ReactNode } from "react";

import { LanguageSelector } from "@/components/LanguageSelector";
import { LearningModeSelector } from "@/components/LearningModeSelector";
import type { Palette } from "@/lib/constants";
import type { LearningMode } from "@/lib/learning-content";
import type { LanguagePack, LanguagePackId } from "@/lib/language-packs";
import {
  NUMBER_RANGE_OPTIONS,
  type NumberBoardOrder,
  type NumberRangeMax
} from "@/lib/numbers";
import type { ArabicVoice } from "@/lib/parent-settings-state";

type ParentSettingsProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  learningMode: LearningMode;
  onLearningModeChange: (learningMode: LearningMode) => void;
  languagePack: LanguagePack;
  onLanguageChange: (languageId: LanguagePackId) => void;
  numberRangeMax: NumberRangeMax;
  onNumberRangeChange: (maxNumber: NumberRangeMax) => void;
  numberBoardOrder: NumberBoardOrder;
  onNumberBoardOrderChange: (order: NumberBoardOrder) => void;
  showVirtualKeyboard: boolean;
  onToggleVirtualKeyboard: () => void;
  showPlayControls: boolean;
  onTogglePlayControls: () => void;
  arabicVoice: ArabicVoice;
  onArabicVoiceChange: (voice: ArabicVoice) => void;
  palette: Palette;
};

type ToggleRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  palette: Palette;
  icon: ReactNode;
};

function ParentAvatarFather() {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#2b5d83" />
      <path
        d="M15 20c0-5.3 4-9 9-9s9 3.7 9 9v1.5c0 2.5-1 4.8-2.8 6.5l-1.4 1.3c-2.7 2.5-6.9 2.5-9.6 0l-1.4-1.3A8.84 8.84 0 0 1 15 21.5V20Z"
        fill="#ffd7b0"
      />
      <path
        d="M14 20c.4-6.7 4.6-11 10-11 5.5 0 9.7 4.3 10 11-2.2-2.7-4.6-3.9-7.1-3.9-1.4 0-3 .4-4.9 1.2-2 .8-3.9 1.3-5.7 1.5L14 20Z"
        fill="#16334d"
      />
      <path
        d="M16 37c1.9-3.6 4.8-5.4 8-5.4s6.1 1.8 8 5.4"
        stroke="#fff7ef"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ParentAvatarMother() {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#e36d8f" />
      <path
        d="M15 22c0-5.8 4-10 9-10s9 4.2 9 10v.9c0 2.7-1.1 5.2-3 7l-1.3 1.2c-2.7 2.5-6.7 2.5-9.4 0L18 29.9a9.47 9.47 0 0 1-3-7V22Z"
        fill="#ffd7b0"
      />
      <path
        d="M14 22c0-7.7 4.6-12 10-12 5.6 0 10 4.3 10 12-.9-1.1-2.6-2.5-5-4.1-1.6-1.1-2.6-2.5-3.1-4.1-.7 1.7-2.4 3.4-5 4.8-2.4 1.3-4.6 2.4-6.9 3.5Z"
        fill="#7a284f"
      />
      <path
        d="M16 37c1.9-3.6 4.8-5.4 8-5.4s6.1 1.8 8 5.4"
        stroke="#fff7ef"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="8" width="24" height="16" rx="4" />
      <path d="M9 13h.01M14 13h.01M19 13h.01M24 13h.01M9 18h.01M14 18h8M9 22h14" />
    </svg>
  );
}

function ComputerBasicsIcon() {
  return (
    <svg viewBox="0 0 72 48" className="h-14 w-20" fill="none" aria-hidden="true">
      <rect x="8" y="5" width="34" height="24" rx="5" fill="#dff2ff" stroke="#52b6ff" strokeWidth="3" />
      <path d="M20 36h14M27 29v7" stroke="#17324d" strokeWidth="3" strokeLinecap="round" />
      <rect x="7" y="37" width="40" height="7" rx="3.5" fill="#fff4d8" stroke="#f4b678" strokeWidth="2.5" />
      <path d="M14 40.5h.01M20 40.5h.01M26 40.5h.01M32 40.5h.01M38 40.5h.01" stroke="#17324d" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="51" y="26" width="13" height="18" rx="6.5" fill="#ffe1e9" stroke="#ff8fab" strokeWidth="2.5" />
      <path d="M57.5 29v5" stroke="#7a284f" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="25" cy="17" r="4" fill="#70d96f" />
      <path d="M21.5 23.5c2.2-2.4 4.7-2.4 7 0" stroke="#17324d" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function PlayControlsIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="#ffe7c9" />
      <path d="M13 10.5v11l9-5.5-9-5.5Z" fill="#17324d" />
      <path d="M8.5 24.5h15" stroke="#f4b678" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function StraightOrderIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden="true">
      <path d="M8 20h21" stroke="#52b6ff" strokeWidth="4" strokeLinecap="round" />
      <path d="m24 12 8 8-8 8" stroke="#17324d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="20" r="3" fill="#70d96f" />
    </svg>
  );
}

function ReverseOrderIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden="true">
      <path d="M32 20H11" stroke="#ff8fab" strokeWidth="4" strokeLinecap="round" />
      <path d="m16 12-8 8 8 8" stroke="#17324d" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="20" r="3" fill="#f4b678" />
    </svg>
  );
}

function RandomOrderIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden="true">
      <path d="M8 12h5c6 0 8 16 14 16h5" stroke="#70d96f" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M8 28h5c3.5 0 5.5-5.5 8-10" stroke="#52b6ff" strokeWidth="3.6" strokeLinecap="round" />
      <path d="m28 8 5 4-5 4M28 24l5 4-5 4" stroke="#17324d" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NUMBER_ORDER_OPTIONS: readonly {
  id: NumberBoardOrder;
  label: string;
  icon: ReactNode;
}[] = [
  { id: "ascending", label: "Straight order", icon: <StraightOrderIcon /> },
  { id: "descending", label: "Reverse order", icon: <ReverseOrderIcon /> },
  { id: "random", label: "Random order", icon: <RandomOrderIcon /> }
];

function PrincessIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#ffe1e9" />
      <path d="M13 16l5 4 6-8 6 8 5-4v10H13V16Z" fill="#f7c948" />
      <path d="M15 24c0-5.4 4-9.2 9-9.2s9 3.8 9 9.2v1.2c0 2.6-1 5-2.9 6.8l-1.3 1.2c-2.7 2.5-6.9 2.5-9.6 0L17.9 32A9.13 9.13 0 0 1 15 25.2V24Z" fill="#ffd7b0" />
      <path d="M14 25c.3-7.5 4.4-11.7 10-11.7S33.7 17.5 34 25c-3.9-1.5-6.6-3.7-8-6.5-1.3 2.5-5.2 5.2-12 6.5Z" fill="#7a284f" />
      <path d="M17 39c1.8-3.5 4.5-5.2 7-5.2s5.2 1.7 7 5.2" stroke="#e36d8f" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

function PrinceIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#dff2ff" />
      <path d="M13 16l5 4 6-8 6 8 5-4v10H13V16Z" fill="#f7c948" />
      <path d="M15 23c0-5.5 4-9.4 9-9.4s9 3.9 9 9.4v1.3c0 2.6-1 5-2.9 6.8l-1.3 1.2c-2.7 2.5-6.9 2.5-9.6 0l-1.3-1.2A9.13 9.13 0 0 1 15 24.3V23Z" fill="#ffd7b0" />
      <path d="M14 23.5c.4-6.8 4.6-11 10-11s9.6 4.2 10 11c-2.4-2.5-5.1-3.6-8-3.2-1.9.2-4.8 1.4-8.9 3.3l-3.1-.1Z" fill="#16334d" />
      <path d="M17 39c1.8-3.5 4.5-5.2 7-5.2s5.2 1.7 7 5.2" stroke="#2b5d83" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onToggle,
  palette,
  icon
}: ToggleRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 rounded-[1.4rem] border px-3 py-3 text-left transition hover:-translate-y-0.5 sm:gap-4 sm:px-4 sm:py-4"
      style={{
        background: palette.buttonSurface,
        borderColor: palette.buttonBorder
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-[1rem] border"
          style={{
            background: checked ? palette.activeKeySurface : palette.historySurface,
            borderColor: checked ? palette.activeKeyBorder : palette.buttonBorder,
            color: checked ? palette.activeKeyText : palette.buttonText
          }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="font-display text-xl tracking-[-0.04em] sm:text-2xl" style={{ color: palette.keyText }}>
            {label}
          </p>
          <p className="mt-1 text-xs font-bold leading-5 sm:text-sm sm:leading-6" style={{ color: palette.detailText }}>
            {description}
          </p>
        </div>
      </div>
      <span
        className={`relative inline-flex h-8 w-14 items-center rounded-full border transition ${checked ? "justify-end" : "justify-start"} p-1`}
        style={{
          background: checked ? palette.keyText : palette.historySurface,
          borderColor: palette.buttonBorder
        }}
        aria-hidden="true"
      >
        <span className="h-6 w-6 rounded-full bg-white shadow-[0_6px_18px_rgba(0,0,0,0.18)]" />
      </span>
    </button>
  );
}

export function ParentSettings({
  isOpen,
  onToggle,
  onClose,
  learningMode,
  onLearningModeChange,
  languagePack,
  onLanguageChange,
  numberRangeMax,
  onNumberRangeChange,
  numberBoardOrder,
  onNumberBoardOrderChange,
  showVirtualKeyboard,
  onToggleVirtualKeyboard,
  showPlayControls,
  onTogglePlayControls,
  arabicVoice,
  onArabicVoiceChange,
  palette
}: ParentSettingsProps) {
  const computerModeIcons = (
    <div className="grid grid-cols-2 gap-2">
      <div
        className="grid min-h-20 place-items-center rounded-[1.4rem] border px-4 py-4"
        style={{
          background: palette.buttonSurface,
          borderColor: palette.buttonBorder
        }}
        aria-label="Computer basics"
      >
        <ComputerBasicsIcon />
      </div>
      <div
        className="grid min-h-20 place-items-center rounded-[1.4rem] border px-4 py-4"
        style={{
          background: palette.buttonSurface,
          borderColor: palette.buttonBorder
        }}
        aria-label="Practice keyboard"
      >
        <KeyboardIcon />
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className="fixed right-3 top-3 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border shadow-[0_10px_30px_rgba(15,35,57,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 sm:right-6 sm:top-6 sm:h-auto sm:w-auto sm:gap-3 sm:rounded-full sm:px-3 sm:py-2"
        style={{
          background: palette.shell,
          borderColor: palette.shellBorder
        }}
        aria-label="Open parent settings"
        aria-expanded={isOpen}
        aria-controls="parent-settings-panel"
      >
        <span
          className="grid h-7 w-7 place-items-center rounded-full sm:hidden"
          style={{ background: `${palette.primary}1a`, color: palette.primaryDeep }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.08a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06A2 2 0 1 1 4.16 16.94l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.08a1.7 1.7 0 0 0 1.55-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06A2 2 0 1 1 7.06 4.16l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.08a1.7 1.7 0 0 0 1 1.51 1.7 1.7 0 0 0 1.87-.34l.06-.06A2 2 0 1 1 19.84 7.06l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.08a1.7 1.7 0 0 0-1.51 1z" />
          </svg>
        </span>
        <div className="hidden items-center -space-x-2 sm:flex">
          <span
            className="grid h-11 w-11 place-items-center rounded-full border"
            style={{ background: palette.badgeSurface, borderColor: palette.buttonBorder }}
          >
            <ParentAvatarFather />
          </span>
          <span
            className="grid h-11 w-11 place-items-center rounded-full border"
            style={{ background: palette.badgeSurface, borderColor: palette.buttonBorder }}
          >
            <ParentAvatarMother />
          </span>
        </div>
        <div className="hidden text-left sm:block">
          <p className="font-display text-xl tracking-[-0.04em]" style={{ color: palette.keyText }}>
            Parent settings
          </p>
          <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: palette.detailText }}>
            Open controls
          </p>
        </div>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-950/22 backdrop-blur-[3px]"
          onClick={onClose}
          aria-hidden="true"
        >
          <aside
            id="parent-settings-panel"
            className="absolute inset-x-3 bottom-3 top-20 flex flex-col overflow-hidden rounded-[2rem] border shadow-[0_30px_80px_rgba(15,35,57,0.22)] backdrop-blur-xl sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-24 sm:max-h-[calc(100svh-7.5rem)] sm:w-[min(92vw,28rem)]"
            style={{
              background: palette.shell,
              borderColor: palette.shellBorder
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="shrink-0 border-b px-5 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-5"
              style={{ borderColor: palette.shellBorder, background: palette.shell }}
            >
              <div
                className="mx-auto mb-3 h-1.5 w-16 rounded-full sm:hidden"
                style={{ background: palette.buttonBorder }}
                aria-hidden="true"
              />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-3xl tracking-[-0.05em]" style={{ color: palette.keyText }}>
                    Parent controls
                  </p>
                  <p className="mt-2 hidden text-sm font-bold leading-6 sm:block" style={{ color: palette.detailText }}>
                    Keep the play screen simple for kids and leave the configuration work here.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border text-xl font-bold transition hover:-translate-y-0.5"
                  style={{
                    background: palette.buttonSurface,
                    borderColor: palette.buttonBorder,
                    color: palette.buttonText
                  }}
                  aria-label="Close parent settings"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-4 sm:px-5 sm:pb-5">
              <div className="space-y-4">
              <LearningModeSelector
                learningMode={learningMode}
                onChange={onLearningModeChange}
                palette={palette}
              />

              {learningMode === "computer" ? (
                computerModeIcons
              ) : (
                <LanguageSelector
                  languagePack={languagePack}
                  onChange={onLanguageChange}
                  palette={palette}
                  compact
                />
              )}

              {learningMode === "letters" && languagePack.id === "arabic" ? (
                <div
                  className="rounded-[1.6rem] border p-4"
                  style={{
                    background: palette.buttonSurface,
                    borderColor: palette.buttonBorder
                  }}
                >
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: palette.detailText }}>
                    Arabic voice
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {(["female", "male"] as const).map((option) => {
                      const isActive = arabicVoice === option;
                      const isPrincess = option === "female";
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => onArabicVoiceChange(option)}
                          className={`flex items-center gap-3 rounded-[1.2rem] border px-3 py-3 text-left transition ${isActive ? "scale-[1.01]" : "hover:-translate-y-0.5"}`}
                          style={{
                            background: isActive ? palette.activeKeySurface : palette.shell,
                            borderColor: isActive ? palette.activeKeyBorder : palette.buttonBorder,
                            color: isActive ? palette.activeKeyText : palette.buttonText,
                            boxShadow: isActive ? `0 14px 26px ${palette.activeKeyGlow}` : undefined
                          }}
                          aria-pressed={isActive}
                        >
                          {isPrincess ? <PrincessIcon /> : <PrinceIcon />}
                          <span>
                            <span className="block font-display text-xl tracking-[-0.03em]">
                              {isPrincess ? "Princess" : "Prince"}
                            </span>
                            <span className="mt-0.5 block text-[11px] font-bold uppercase tracking-[0.12em] opacity-70">
                              29 letters
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {learningMode === "letters" && languagePack.id === "numbers" ? (
                <div
                  className="rounded-[1.4rem] border px-4 py-4"
                  style={{
                    background: palette.buttonSurface,
                    borderColor: palette.buttonBorder
                  }}
                >
                  <p className="font-display text-2xl tracking-[-0.04em]" style={{ color: palette.keyText }}>
                    Number range
                  </p>
                  <p className="mt-1 hidden text-sm font-bold leading-6 sm:block" style={{ color: palette.detailText }}>
                    Pick how far the counting board should go. Number mode stays numbers-only.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {NUMBER_RANGE_OPTIONS.map((option) => {
                      const isActive = option === numberRangeMax;
                      const availabilityClasses =
                        option <= 10
                          ? ""
                          : option <= 20
                            ? "hidden min-[430px]:grid"
                            : option <= 50
                              ? "hidden sm:grid"
                              : "hidden lg:grid";

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => onNumberRangeChange(option)}
                          className={`${availabilityClasses} min-h-16 place-items-center rounded-[1.2rem] border px-3 py-3 text-center transition ${
                            isActive ? "scale-[1.01]" : "hover:-translate-y-0.5"
                          }`}
                          style={{
                            background: isActive ? palette.activeKeySurface : palette.shell,
                            borderColor: isActive ? palette.activeKeyBorder : palette.buttonBorder,
                            color: isActive ? palette.activeKeyText : palette.buttonText,
                            boxShadow: isActive ? `0 14px 26px ${palette.activeKeyGlow}` : undefined
                          }}
                          aria-pressed={isActive}
                          aria-label={`Use numbers 1 to ${option}`}
                        >
                          <span className="font-display text-3xl leading-none tracking-[-0.05em]">
                            {option}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2" aria-label="Number order">
                    {NUMBER_ORDER_OPTIONS.map((option) => {
                      const isActive = option.id === numberBoardOrder;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => onNumberBoardOrderChange(option.id)}
                          className={`grid min-h-16 place-items-center rounded-[1.2rem] border px-3 py-3 transition ${
                            isActive ? "scale-[1.01]" : "hover:-translate-y-0.5"
                          }`}
                          style={{
                            background: isActive ? palette.activeKeySurface : palette.shell,
                            borderColor: isActive ? palette.activeKeyBorder : palette.buttonBorder,
                            color: isActive ? palette.activeKeyText : palette.buttonText,
                            boxShadow: isActive ? `0 14px 26px ${palette.activeKeyGlow}` : undefined
                          }}
                          aria-pressed={isActive}
                          aria-label={option.label}
                        >
                          {option.icon}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : learningMode === "letters" ? (
                <div className="hidden lg:block">
                  <ToggleRow
                    label="Virtual keyboard"
                    description="Show or hide the clickable keyboard for mouse and touch play."
                    checked={showVirtualKeyboard}
                    onToggle={onToggleVirtualKeyboard}
                    palette={palette}
                    icon={<KeyboardIcon />}
                  />
                </div>
              ) : learningMode === "computer" ? null : (
                <div
                  className="rounded-[1.4rem] border px-4 py-4"
                  style={{
                    background: palette.buttonSurface,
                    borderColor: palette.buttonBorder
                  }}
                >
                  <p className="font-display text-2xl tracking-[-0.04em]" style={{ color: palette.keyText }}>
                    Color strip
                  </p>
                  <p className="mt-1 hidden text-sm font-bold leading-6 sm:block" style={{ color: palette.detailText }}>
                    Color mode keeps the tap-ready color bar visible so kids can always choose a color.
                  </p>
                </div>
              )}

              <ToggleRow
                label="Play controls"
                description="Show or hide mute, clear, and fullscreen controls on the play screen."
                checked={showPlayControls}
                onToggle={onTogglePlayControls}
                palette={palette}
                icon={<PlayControlsIcon />}
              />
            </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
