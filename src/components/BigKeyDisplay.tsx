import { ColorSceneIllustration } from "@/components/ColorSceneIllustration";
import type { Palette } from "@/lib/constants";
import type { ColorOptionId } from "@/lib/learning-content";
import type { KidProfile } from "@/lib/kid-profile";

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
  activeColorId?: ColorOptionId | null;
  activeEnglishLetter?: string | null;
  floatingEchoText?: string | null;
  kidProfile?: KidProfile | null;
  kidAgeLabel?: string | null;
  kidPlayStyleLabel?: string | null;
};

const FLOATING_ECHOES = [
  { className: "left-[4%] top-[8%] -rotate-12", delay: "0ms", duration: "4800ms" },
  { className: "right-[6%] top-[14%] rotate-8", delay: "120ms", duration: "4400ms" },
  { className: "left-[12%] bottom-[18%] rotate-6", delay: "220ms", duration: "5100ms" },
  { className: "right-[12%] bottom-[12%] -rotate-9", delay: "320ms", duration: "4700ms" }
] as const;

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
  previewColor = null,
  activeColorId = null,
  activeEnglishLetter = null,
  floatingEchoText = null,
  kidProfile = null,
  kidAgeLabel = null,
  kidPlayStyleLabel = null
}: BigKeyDisplayProps) {
  const isIdle = displayText === null;
  const uppercaseLetter = activeEnglishLetter?.toUpperCase() ?? null;
  const lowercaseLetter = activeEnglishLetter?.toLowerCase() ?? null;
  const showEnglishLetterForms = uppercaseLetter !== null && lowercaseLetter !== null;
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
  const letterCardClasses =
    "rounded-[1.35rem] border px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-sm";

  return (
    <section
      className={`play-surface stage-entrance flex w-full ${stageHeightClasses} flex-col justify-between rounded-[2.5rem] border px-5 py-5 shadow-[0_26px_80px_rgba(255,255,255,0.18)] backdrop-blur-xl sm:px-8 sm:py-7 lg:px-10 lg:py-8`}
      style={{
        background: previewColor
          ? `linear-gradient(180deg, rgba(255,255,255,0.78), rgba(255,255,255,0.5)), ${previewColor}`
          : palette.shell,
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
            {kidAgeLabel ? (
              <span
                className="rounded-full px-3 py-2"
                style={{
                  background: palette.badgeSurface,
                  color: palette.badgeText
                }}
              >
                {kidAgeLabel}
              </span>
            ) : null}
            {kidPlayStyleLabel ? (
              <span
                className="rounded-full px-3 py-2"
                style={{
                  background: palette.badgeSurface,
                  color: palette.badgeText
                }}
              >
                {kidPlayStyleLabel}
              </span>
            ) : null}
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
          {previewColor && activeColorId ? (
            <ColorSceneIllustration
              colorId={activeColorId}
              swatch={previewColor}
              profile={kidProfile}
            />
          ) : (
            <div
              className={`${emojiClasses} grid place-items-center rounded-[2rem] shadow-[0_22px_45px_rgba(255,255,255,0.28)]`}
              style={{
                background: palette.badgeSurface,
                color: palette.badgeText
              }}
              aria-hidden="true"
            >
              {emoji}
            </div>
          )}

          <div className="relative isolate mt-1 w-full">
            {floatingEchoText && !isIdle ? (
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                {FLOATING_ECHOES.map((echo, index) => (
                  <span
                    key={`${burstKey}-${index}`}
                    className={`key-echo absolute font-display text-[clamp(1.4rem,4vw,2.8rem)] ${echo.className}`}
                    style={{
                      color: palette.badgeText,
                      background: palette.badgeSurface,
                      animationDelay: echo.delay,
                      animationDuration: echo.duration,
                      boxShadow: `0 18px 35px ${palette.keyShadow}`
                    }}
                  >
                    {floatingEchoText}
                  </span>
                ))}
              </div>
            ) : null}

            <div
              className={`relative z-10 font-display ${displayTextClasses} leading-[0.82] tracking-[-0.08em]`}
              style={{
                color: palette.keyText,
                textShadow: displayText
                  ? `0 3px 0 ${palette.activeKeyBorder}, 0 6px 0 ${palette.activeKeyBorder}, 0 9px 0 ${palette.activeKeyBorder}, 0 12px 16px rgba(0,0,0,0.08)`
                  : `0 18px 55px ${palette.keyShadow}`
              }}
              dir={displayDirection}
            >
              {displayText ?? idlePrompt}
            </div>
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
            {speechText
              ? showEnglishLetterForms
                ? `Capital ${uppercaseLetter} and small ${lowercaseLetter}.`
                : `Says ${speechText}`
              : idleHint}
          </p>

          {showEnglishLetterForms ? (
            <div className="mt-4 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              <div
                className={letterCardClasses}
                style={{ background: palette.buttonSurface, borderColor: palette.buttonBorder }}
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: palette.detailText }}>
                  Capital
                </p>
                <p className="mt-2 font-display text-5xl leading-none" style={{ color: palette.keyText }}>
                  {uppercaseLetter}
                </p>
              </div>

              <div
                className={letterCardClasses}
                style={{ background: palette.buttonSurface, borderColor: palette.buttonBorder }}
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: palette.detailText }}>
                  Small
                </p>
                <p className="mt-2 font-body text-5xl font-extrabold leading-none" style={{ color: palette.keyText }}>
                  {lowercaseLetter}
                </p>
              </div>

              <div
                className={letterCardClasses}
                style={{ background: palette.buttonSurface, borderColor: palette.buttonBorder }}
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: palette.detailText }}>
                  Handwriting
                </p>
                <p
                  className="mt-2 text-5xl italic leading-none"
                  style={{ color: palette.keyText, fontFamily: '"Comic Sans MS", "Marker Felt", cursive' }}
                >
                  {lowercaseLetter}
                </p>
              </div>

              <div
                className={letterCardClasses}
                style={{ background: palette.buttonSurface, borderColor: palette.buttonBorder }}
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.18em]" style={{ color: palette.detailText }}>
                  Trace
                </p>
                <p
                  className="mt-2 font-display text-4xl leading-none tracking-[0.18em] text-transparent"
                  style={{ WebkitTextStroke: `1.6px ${palette.keyText}` }}
                >
                  {`${uppercaseLetter}${lowercaseLetter}${lowercaseLetter}`}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
