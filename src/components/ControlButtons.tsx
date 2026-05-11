import type { ReactNode } from "react";

import type { Palette } from "@/lib/constants";

type ControlButtonsProps = {
  isMuted: boolean;
  isFullscreen: boolean;
  canFullscreen: boolean;
  onToggleMute: () => void;
  onClear: () => void;
  onToggleFullscreen: () => void;
  palette: Palette;
  compact?: boolean;
};

type ActionButtonProps = {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  palette: Palette;
  disabled?: boolean;
  compact?: boolean;
};

function ActionButton({
  label,
  icon,
  onClick,
  palette,
  disabled = false,
  compact = false
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${compact ? "min-h-11 rounded-full px-3 py-2 text-xs tracking-[0.14em]" : "min-h-14 rounded-[1.4rem] px-4 py-3 text-sm tracking-[0.18em]"} inline-flex items-center justify-center gap-2 border font-extrabold uppercase shadow-[0_4px_0_rgba(45,48,71,0.14),0_8px_18px_rgba(45,48,71,0.06)] transition duration-150 hover:-translate-y-px active:translate-y-0.5 active:shadow-[0_1px_0_rgba(45,48,71,0.14)] disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none`}
      style={{
        background: palette.buttonSurface,
        borderColor: palette.buttonBorder,
        color: palette.buttonText
      }}
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-white/55" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

function VoiceIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      {muted ? <path d="m18 10 3 3m0-3-3 3" /> : <path d="M17 9.5c1.3 1.3 1.3 3.7 0 5M20 7c2.6 2.8 2.6 7.2 0 10" />}
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 6h14M9 6V4h6v2M8 10v8M12 10v8M16 10v8M7 6l1 14h8l1-14" />
    </svg>
  );
}

function FullscreenIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {active ? (
        <>
          <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
          <path d="M9 9 5 5M15 9l4-4M9 15l-4 4M15 15l4 4" />
        </>
      ) : (
        <>
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          <path d="M9 4 4 9M15 4l5 5M9 20l-5-5M15 20l5-5" />
        </>
      )}
    </svg>
  );
}

export function ControlButtons({
  isMuted,
  isFullscreen,
  canFullscreen,
  onToggleMute,
  onClear,
  onToggleFullscreen,
  palette,
  compact = false
}: ControlButtonsProps) {
  if (compact) {
    return (
      <section
        className="rounded-full border p-2 shadow-[0_18px_50px_rgba(255,255,255,0.2)] backdrop-blur-xl"
        style={{
          background: palette.shell,
          borderColor: palette.shellBorder
        }}
      >
        <div className="flex flex-wrap justify-center gap-2">
          <ActionButton
            label={isMuted ? "Unmute" : "Mute"}
            icon={<VoiceIcon muted={isMuted} />}
            onClick={onToggleMute}
            palette={palette}
            compact
          />
          <ActionButton label="Clear" icon={<ClearIcon />} onClick={onClear} palette={palette} compact />
          <ActionButton
            label={isFullscreen ? "Exit" : "Full"}
            icon={<FullscreenIcon active={isFullscreen} />}
            onClick={onToggleFullscreen}
            palette={palette}
            disabled={!canFullscreen}
            compact
          />
        </div>
      </section>
    );
  }

  return (
    <section
      className="rounded-[2rem] border p-4 shadow-[0_22px_60px_rgba(255,255,255,0.18)] backdrop-blur-xl"
      style={{
        background: palette.shell,
        borderColor: palette.shellBorder
      }}
    >
      <div className="mb-4">
        <p
          className="font-display text-2xl tracking-[-0.04em]"
          style={{ color: palette.keyText }}
        >
          Play controls
        </p>
        <p className="mt-1 text-sm font-bold leading-6" style={{ color: palette.detailText }}>
          Keep the session simple, loud, and easy to reset.
        </p>
      </div>

      <div className="grid gap-3">
        <ActionButton
          label={isMuted ? "Unmute voice" : "Mute voice"}
          icon={<VoiceIcon muted={isMuted} />}
          onClick={onToggleMute}
          palette={palette}
        />
        <ActionButton label="Clear screen" icon={<ClearIcon />} onClick={onClear} palette={palette} />
        <ActionButton
          label={isFullscreen ? "Exit fullscreen" : "Go fullscreen"}
          icon={<FullscreenIcon active={isFullscreen} />}
          onClick={onToggleFullscreen}
          palette={palette}
          disabled={!canFullscreen}
        />
      </div>
    </section>
  );
}
