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
  modeLabel: string;
  languageLabel: string;
  languageNativeLabel: string;
  idlePrompt: string;
  idleHint: string;
  immersive?: boolean;
  constrained?: boolean;
  previewColor?: string | null;
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
  modeLabel,
  languageLabel,
  languageNativeLabel,
  idlePrompt,
  idleHint,
  immersive = false,
  constrained = false,
  previewColor = null
}: BigKeyDisplayProps) {
  const isIdle = displayText === null;
  const displayTextClasses = displayText
    ? immersive
      ? "text-[clamp(6rem,24vw,16rem)]"
      : constrained
        ? "text-[clamp(3.6rem,12vw,8.5rem)] sm:text-[clamp(4rem,12vw,9rem)]"
      : "text-[clamp(4rem,15vw,11rem)] sm:text-[clamp(5rem,15vw,12rem)]"
    : immersive
      ? "text-[clamp(2.8rem,7vw,5.6rem)]"
      : constrained
        ? "text-[clamp(2rem,5.8vw,3.6rem)]"
      : "text-[clamp(2.5rem,7vw,4.8rem)]";
  const stageHeightClasses = immersive ? "flex-1 min-h-0" : constrained ? "flex-[1_1_0%] min-h-0" : "min-h-[30rem]";
  const contentPaddingClasses = immersive ? "py-4 sm:py-6" : constrained ? "py-3 sm:py-4" : "py-8 sm:py-12";
  const emojiClasses = immersive
    ? "mb-7 h-28 w-28 text-6xl sm:h-32 sm:w-32 sm:text-7xl"
    : constrained
      ? "mb-4 h-20 w-20 text-5xl sm:h-24 sm:w-24 sm:text-6xl"
      : "mb-5 h-24 w-24 text-5xl sm:h-28 sm:w-28 sm:text-6xl";
  const messageClasses = immersive
    ? "mt-5 text-4xl sm:text-5xl"
    : constrained
      ? "mt-3 text-[clamp(1.7rem,4.6vw,2.8rem)]"
      : "mt-4 text-3xl sm:text-4xl";

  return (
    <section
      className={`play-surface stage-entrance flex w-full ${stageHeightClasses} flex-col justify-between rounded-[2.5rem] border px-5 py-5 shadow-[0_26px_80px_rgba(255,255,255,0.18)] backdrop-blur-xl sm:px-8 sm:py-7 lg:px-10 lg:py-8`}
      style={{
        background: palette.shell,
        borderColor: palette.shellBorder
      }}
    >
      <div className={`flex flex-wrap items-start justify-between ${constrained ? "gap-3" : "gap-4"}`}>
        <div className={constrained ? "space-y-2" : "space-y-3"}>
          <p
            className={`font-display uppercase ${constrained ? "text-base tracking-[0.26em] sm:text-lg" : "text-lg tracking-[0.32em] sm:text-xl"}`}
            style={{ color: palette.badgeText }}
          >
            Nuha Keyboard
          </p>
          <div
            className={`flex flex-wrap gap-2 font-extrabold uppercase ${constrained ? "text-[10px] tracking-[0.18em] sm:text-xs" : "text-xs tracking-[0.22em] sm:text-sm"}`}
          >
            <span
              className="rounded-full px-3 py-2"
              style={{
                background: palette.badgeSurface,
                color: palette.badgeText
              }}
            >
              {modeLabel}
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
              {languageNativeLabel}
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
        {!immersive && !constrained ? (
          <p
            className="max-w-xs text-sm font-bold leading-6 sm:text-base"
            style={{ color: palette.detailText }}
          >
            Every press should feel like a tiny celebration.
          </p>
        ) : null}
      </div>

      <div className={`grid min-h-0 flex-1 place-items-center ${contentPaddingClasses}`}>
        <div
          key={burstKey}
          className={`mx-auto flex w-full ${constrained ? "max-w-3xl" : "max-w-4xl"} flex-col items-center text-center ${isIdle ? "soft-rise" : "key-burst"}`}
        >
          <div
            className={`${emojiClasses} grid place-items-center rounded-[2rem] shadow-[0_22px_45px_rgba(255,255,255,0.28)]`}
            style={{
              background: palette.badgeSurface,
              color: palette.badgeText
            }}
            aria-hidden="true"
          >
            {previewColor ? (
              <div
                className="relative h-[72%] w-[72%] overflow-hidden rounded-[1.2rem] border border-white/85 shadow-[inset_0_1px_6px_rgba(255,255,255,0.45)]"
                style={{ background: previewColor }}
              >
                <div className="absolute inset-x-2 top-1.5 h-3 rounded-full bg-white/25 blur-sm" />
              </div>
            ) : (
              emoji
            )}
          </div>

          <div
            className={`font-display ${displayTextClasses} leading-[0.82] tracking-[-0.08em]`}
            style={{
              color: palette.keyText,
              textShadow: `0 18px 55px ${palette.keyShadow}`
            }}
            dir={displayDirection}
          >
            {displayText ?? idlePrompt}
          </div>

          <p
            className={`${messageClasses} max-w-2xl font-display leading-tight`}
            style={{ color: palette.messageText }}
          >
            {displayText ? message : "Ready to play"}
          </p>

          <p
            className={`max-w-xl font-bold leading-6 ${constrained ? "mt-3 text-xs sm:text-sm" : "mt-4 text-sm sm:text-base"}`}
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
