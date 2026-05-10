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
  onClick: () => void;
  palette: Palette;
  disabled?: boolean;
  compact?: boolean;
};

function ActionButton({
  label,
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
      className={`${compact ? "min-h-11 rounded-full px-4 py-2 text-xs tracking-[0.18em]" : "min-h-14 rounded-[1.4rem] px-4 py-3 text-sm tracking-[0.22em]"} border font-extrabold uppercase transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55`}
      style={{
        background: palette.buttonSurface,
        borderColor: palette.buttonBorder,
        color: palette.buttonText
      }}
    >
      {label}
    </button>
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
            onClick={onToggleMute}
            palette={palette}
            compact
          />
          <ActionButton label="Clear" onClick={onClear} palette={palette} compact />
          <ActionButton
            label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
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
          onClick={onToggleMute}
          palette={palette}
        />
        <ActionButton label="Clear screen" onClick={onClear} palette={palette} />
        <ActionButton
          label={isFullscreen ? "Exit fullscreen" : "Go fullscreen"}
          onClick={onToggleFullscreen}
          palette={palette}
          disabled={!canFullscreen}
        />
      </div>
    </section>
  );
}
