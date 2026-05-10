import type { Palette } from "@/lib/constants";

type BigKeyDisplayProps = {
  displayText: string | null;
  speechText: string | null;
  displayDirection: "ltr" | "rtl";
  emoji: string;
  message: string;
  palette: Palette;
  burstKey: number;
  voiceStatus: string;
  languageLabel: string;
  languageNativeLabel: string;
  idlePrompt: string;
  idleHint: string;
};

export function BigKeyDisplay({
  displayText,
  speechText,
  displayDirection,
  emoji,
  message,
  palette,
  burstKey,
  voiceStatus,
  languageLabel,
  languageNativeLabel,
  idlePrompt,
  idleHint
}: BigKeyDisplayProps) {
  const isIdle = displayText === null;

  return (
    <section
      className="play-surface stage-entrance flex min-h-[32rem] self-start flex-col justify-between rounded-[2.5rem] border px-5 py-5 shadow-[0_26px_80px_rgba(255,255,255,0.18)] backdrop-blur-xl sm:px-8 sm:py-7 lg:px-10 lg:py-8"
      style={{
        background: palette.shell,
        borderColor: palette.shellBorder
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <p
            className="font-display text-lg uppercase tracking-[0.32em] sm:text-xl"
            style={{ color: palette.badgeText }}
          >
            Nuha Keyboard
          </p>
          <p className="text-sm font-bold leading-6 sm:text-base" style={{ color: palette.detailText }}>
            {languageNativeLabel}
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-extrabold uppercase tracking-[0.22em] sm:text-sm">
            <span
              className="rounded-full px-3 py-2"
              style={{
                background: palette.badgeSurface,
                color: palette.badgeText
              }}
            >
              Browser play
            </span>
            <span
              className="rounded-full px-3 py-2"
              style={{
                background: palette.badgeSurface,
                color: palette.badgeText
              }}
            >
              {languageLabel}
            </span>
            <span
              className="rounded-full px-3 py-2"
              style={{
                background: palette.badgeSurface,
                color: palette.badgeText
              }}
            >
              {voiceStatus}
            </span>
          </div>
        </div>
        <p
          className="max-w-xs text-sm font-bold leading-6 sm:text-base"
          style={{ color: palette.detailText }}
        >
          Every press should feel like a tiny celebration.
        </p>
      </div>

      <div className="grid flex-1 place-items-center py-8 sm:py-12">
        <div
          key={burstKey}
          className={`mx-auto flex w-full max-w-4xl flex-col items-center text-center ${isIdle ? "soft-rise" : "key-burst"}`}
        >
          <div
            className="mb-5 grid h-24 w-24 place-items-center rounded-[2rem] text-5xl shadow-[0_22px_45px_rgba(255,255,255,0.28)] sm:h-28 sm:w-28 sm:text-6xl"
            style={{
              background: palette.badgeSurface,
              color: palette.badgeText
            }}
            aria-hidden="true"
          >
            {emoji}
          </div>

          <div
            className="font-display text-[clamp(4rem,15vw,11rem)] leading-[0.82] tracking-[-0.08em] sm:text-[clamp(5rem,15vw,12rem)]"
            style={{
              color: palette.keyText,
              textShadow: `0 18px 55px ${palette.keyShadow}`
            }}
            dir={displayDirection}
          >
            {displayText ?? idlePrompt}
          </div>

          <p
            className="mt-4 max-w-2xl font-display text-3xl leading-tight sm:text-4xl"
            style={{ color: palette.messageText }}
          >
            {displayText ? message : "Ready to play"}
          </p>

          <p
            className="mt-4 max-w-xl text-sm font-extrabold uppercase tracking-[0.26em] sm:text-base"
            style={{ color: palette.detailText }}
            aria-live="polite"
          >
            {speechText ? `Says ${speechText}` : idleHint}
          </p>
        </div>
      </div>
    </section>
  );
}
