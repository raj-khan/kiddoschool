import Link from "next/link";

import { LanguageSelector } from "@/components/LanguageSelector";
import type { Palette } from "@/lib/constants";
import type { LanguagePack, LanguagePackId } from "@/lib/language-packs";

type ParentSettingsProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  languagePack: LanguagePack;
  onLanguageChange: (languageId: LanguagePackId) => void;
  showVirtualKeyboard: boolean;
  onToggleVirtualKeyboard: () => void;
  showPlayControls: boolean;
  onTogglePlayControls: () => void;
  palette: Palette;
};

type ToggleRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  palette: Palette;
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

function ToggleRow({
  label,
  description,
  checked,
  onToggle,
  palette
}: ToggleRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 rounded-[1.4rem] border px-4 py-4 text-left transition hover:-translate-y-0.5"
      style={{
        background: palette.buttonSurface,
        borderColor: palette.buttonBorder
      }}
    >
      <div>
        <p className="font-display text-2xl tracking-[-0.04em]" style={{ color: palette.keyText }}>
          {label}
        </p>
        <p className="mt-1 text-sm font-bold leading-6" style={{ color: palette.detailText }}>
          {description}
        </p>
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
  languagePack,
  onLanguageChange,
  showVirtualKeyboard,
  onToggleVirtualKeyboard,
  showPlayControls,
  onTogglePlayControls,
  palette
}: ParentSettingsProps) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className="fixed right-4 top-4 z-30 flex items-center gap-3 rounded-full border px-3 py-2 shadow-[0_18px_60px_rgba(255,255,255,0.25)] backdrop-blur-xl transition hover:-translate-y-0.5 sm:right-6 sm:top-6"
        style={{
          background: palette.shell,
          borderColor: palette.shellBorder
        }}
        aria-expanded={isOpen}
        aria-controls="parent-settings-panel"
      >
        <div className="flex items-center -space-x-2">
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
        <div className="text-left">
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
          className="fixed inset-0 z-40 bg-slate-950/18 backdrop-blur-[2px]"
          onClick={onClose}
          aria-hidden="true"
        >
          <aside
            id="parent-settings-panel"
            className="absolute right-4 top-20 w-[min(92vw,28rem)] rounded-[2rem] border p-5 shadow-[0_30px_80px_rgba(15,35,57,0.22)] backdrop-blur-xl sm:right-6 sm:top-24"
            style={{
              background: palette.shell,
              borderColor: palette.shellBorder
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-3xl tracking-[-0.05em]" style={{ color: palette.keyText }}>
                  Parent controls
                </p>
                <p className="mt-2 text-sm font-bold leading-6" style={{ color: palette.detailText }}>
                  Keep the play screen simple for kids and leave the configuration work here.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-full border text-xl font-bold transition hover:-translate-y-0.5"
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

            <div className="mt-5 space-y-4">
              <LanguageSelector
                languagePack={languagePack}
                onChange={onLanguageChange}
                palette={palette}
                compact
              />

              <ToggleRow
                label="Virtual keyboard"
                description="Show or hide the clickable keyboard for mouse and touch play."
                checked={showVirtualKeyboard}
                onToggle={onToggleVirtualKeyboard}
                palette={palette}
              />

              <ToggleRow
                label="Play controls"
                description="Show or hide mute, clear, and fullscreen controls on the play screen."
                checked={showPlayControls}
                onToggle={onTogglePlayControls}
                palette={palette}
              />

              <div
                className="rounded-[1.6rem] border p-4"
                style={{
                  background: palette.buttonSurface,
                  borderColor: palette.buttonBorder
                }}
              >
                <p className="font-display text-2xl tracking-[-0.04em]" style={{ color: palette.keyText }}>
                  Open source support
                </p>
                <p className="mt-2 text-sm font-bold leading-6" style={{ color: palette.detailText }}>
                  Parents can help fund better voice packs, developers can contribute code, and anyone can share the
                  project with teachers, families, and social communities.
                </p>
                <Link
                  href="/contribute"
                  className="mt-4 inline-flex rounded-full border px-4 py-2 text-sm font-extrabold uppercase tracking-[0.18em] transition hover:-translate-y-0.5"
                  style={{
                    background: palette.historySurface,
                    borderColor: palette.buttonBorder,
                    color: palette.buttonText
                  }}
                >
                  Open contribute page
                </Link>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
