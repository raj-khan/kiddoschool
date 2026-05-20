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
  { className: "left-[3%] top-[6%] -rotate-12", delay: "0ms", duration: "4800ms" },
  { className: "right-[4%] top-[12%] rotate-8", delay: "100ms", duration: "4400ms" },
  { className: "left-[10%] bottom-[20%] rotate-6", delay: "200ms", duration: "5100ms" },
  { className: "right-[10%] bottom-[12%] -rotate-9", delay: "300ms", duration: "4700ms" }
] as const;

const SPARKLES = [
  { char: "✦", className: "left-[18%] top-[24%]", delay: "0ms", size: "text-xl" },
  { char: "★", className: "right-[18%] top-[20%]", delay: "80ms", size: "text-base" },
  { char: "✦", className: "left-[14%] bottom-[26%]", delay: "160ms", size: "text-sm" },
  { char: "★", className: "right-[16%] bottom-[20%]", delay: "240ms", size: "text-base" }
] as const;

function WaveIcon({ color, animate }: { color: string; animate: boolean }) {
  return (
    <span
      className={animate ? "nuha-wave-icon" : "inline-block"}
      style={{ width: 14, height: 14 }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
        <path d="M3 10v4M8 7v10M13 4v16M18 8v8M23 11v2" />
      </svg>
    </span>
  );
}

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
  void languageNativeLabel;
  const isIdle = displayText === null;
  const uppercaseLetter = activeEnglishLetter?.toUpperCase() ?? null;
  const lowercaseLetter = activeEnglishLetter?.toLowerCase() ?? null;
  const showEnglishLetterForms = uppercaseLetter !== null && lowercaseLetter !== null;
  const heroColor = isIdle ? palette.primary : palette.keyText;
  const echoText = !isIdle && displayText && displayText.length <= 3 ? displayText : floatingEchoText;
  const colorScene = previewColor && activeColorId !== null;

  const displayTextClasses = displayText
    ? immersive
      ? "text-[clamp(5rem,18vh,15rem)]"
      : constrained
        ? "text-[clamp(3.5rem,12vh,8rem)]"
        : "text-[clamp(4rem,16vh,12rem)]"
    : "text-[clamp(2.5rem,8vh,5rem)]";

  const emojiBoxClasses = constrained
    ? "h-14 w-14 text-3xl sm:h-16 sm:w-16 sm:text-4xl"
    : "h-16 w-16 text-4xl sm:h-20 sm:w-20 sm:text-5xl";

  const labelText = isIdle
    ? "Press any key to begin"
    : speechText
      ? `I said: ${speechText}`
      : "I said: it";
  const cheerText = isIdle ? "It speaks and sparkles." : message || "Great job!";

  return (
    <section
      className="stage-entrance flex h-full w-full min-h-0 flex-col"
      aria-live="polite"
    >
      {/* Hero text */}
      <div className="flex-none px-2 text-center">
        <h1
          className="font-display tracking-[-0.02em] leading-[1.05]"
          style={{
            color: palette.ink,
            fontWeight: 700,
            fontSize: constrained ? "clamp(1.1rem,2.8vh,1.75rem)" : "clamp(1.35rem,3.6vh,2.4rem)"
          }}
        >
          Press{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(120deg, ${palette.primary}, ${palette.accent})` }}
          >
            any key
          </span>
          !
        </h1>
        <p
          className="mt-0.5 hidden font-body text-xs sm:block sm:text-sm"
          style={{ color: palette.inkSoft, fontWeight: 600 }}
        >
          Hear the sound, see the letter, and learn your keyboard.
        </p>
      </div>

      {/* Pillow key card — flex to fill remaining vertical space */}
      <div
        key={burstKey}
        className="nuha-keycard relative mx-auto mt-2 flex w-full min-h-0 max-w-[44rem] flex-1 flex-col items-center justify-center overflow-hidden rounded-[1.5rem] px-3 py-3 sm:mt-3 sm:rounded-[2rem] sm:px-6 sm:py-5"
        style={{
          background: previewColor
            ? `linear-gradient(160deg, rgba(255,255,255,0.92), rgba(255,255,255,0.65)), ${previewColor}`
            : palette.card,
          boxShadow: `0 6px 0 ${palette.cardShadow}, 0 0 0 1px ${palette.cardLine} inset, 0 18px 40px -20px ${palette.cardShadow}`
        }}
      >
        {/* Confetti dots */}
        {!isIdle && (
          <>
            <span
              className="nuha-confetti"
              style={{ top: 16, left: 22, width: 10, height: 10, background: palette.sunny }}
            />
            <span
              className="nuha-confetti"
              style={{
                top: 30,
                right: 28,
                width: 8,
                height: 8,
                background: palette.accent,
                animationDelay: "100ms"
              }}
            />
            <span
              className="nuha-confetti"
              style={{
                bottom: 22,
                left: 32,
                width: 9,
                height: 9,
                borderRadius: 2,
                background: palette.mint,
                transform: "rotate(20deg)",
                animationDelay: "50ms"
              }}
            />
            <span
              className="nuha-confetti"
              style={{
                bottom: 32,
                right: 18,
                width: 12,
                height: 12,
                background: palette.sky,
                opacity: 0.75,
                animationDelay: "150ms"
              }}
            />
          </>
        )}

        {colorScene ? (
          <div className="min-h-0 flex-1 w-full">
            <ColorSceneIllustration
              colorId={activeColorId!}
              swatch={previewColor!}
              profile={kidProfile}
            />
          </div>
        ) : (
          <>
            {/* Emoji burst — the visual hero */}
            <div
              className={`${emojiBoxClasses} ${isIdle ? "nuha-mascot-bob" : "nuha-mascot-cheer"} grid place-items-center rounded-[1.25rem]`}
              style={{
                background: `linear-gradient(135deg, ${palette.primary}1a, ${palette.accent}1a)`,
                boxShadow: `0 4px 0 ${palette.cardShadow}40, 0 0 0 1px ${palette.cardLine} inset`
              }}
              aria-hidden="true"
            >
              <span>{emoji}</span>
            </div>

            {/* Big key glyph + sparkle echoes */}
            <div className="relative isolate mt-1 w-full">
              {echoText && !isIdle ? (
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  {FLOATING_ECHOES.map((echo, index) => (
                    <span
                      key={`echo-${burstKey}-${index}`}
                      className={`key-echo absolute font-key text-[clamp(1.1rem,3vw,2.2rem)] ${echo.className}`}
                      style={{
                        color: heroColor,
                        background: `${palette.primary}1a`,
                        animationDelay: echo.delay,
                        animationDuration: echo.duration,
                        boxShadow: `0 6px 14px ${palette.cardShadow}66`
                      }}
                    >
                      {echoText}
                    </span>
                  ))}
                  {SPARKLES.map((sparkle, index) => (
                    <span
                      key={`sparkle-${burstKey}-${index}`}
                      className={`absolute ${sparkle.size} ${sparkle.className}`}
                      style={{
                        color: palette.accent,
                        animationName: "sparklePop",
                        animationDuration: "1100ms",
                        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                        animationFillMode: "both",
                        animationDelay: sparkle.delay
                      }}
                    >
                      {sparkle.char}
                    </span>
                  ))}
                </div>
              ) : null}

              <div
                className={`font-key relative z-10 leading-none ${displayTextClasses} text-center select-none`}
                style={{
                  color: heroColor,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  textShadow: !isIdle ? `0 6px 0 ${palette.cardShadow}55` : "none"
                }}
                dir={displayDirection}
              >
                {displayText ?? "?"}
              </div>
            </div>

            {/* "I said: X" pill */}
            <div
              className="mt-2 inline-flex max-w-[92%] items-center gap-2 rounded-full px-3 py-1 font-body text-xs sm:text-sm"
              style={{
                background: isIdle ? `${palette.inkSoft}1f` : `${palette.primary}22`,
                color: palette.ink,
                fontWeight: 700
              }}
            >
              <WaveIcon color={isIdle ? palette.inkSoft : palette.primary} animate={!isIdle} />
              <span className="truncate" dir={displayDirection}>
                {labelText}
              </span>
            </div>

            {/* Encouragement */}
            <p
              className="mt-1.5 font-display text-base sm:text-lg"
              style={{
                color: isIdle ? palette.inkSoft : palette.primaryDeep,
                fontWeight: 600
              }}
            >
              {cheerText}
            </p>

            {/* Badges row (sm+) */}
            {!constrained && !immersive ? (
              <div className="mt-2 hidden flex-wrap items-center justify-center gap-1 sm:flex">
                <Badge text={modeLabel} palette={palette} />
                <Badge text={languageLabel} palette={palette} />
                <span className="hidden md:inline">
                  <Badge text={voiceStatus} palette={palette} muted />
                </span>
                {kidAgeLabel ? (
                  <span className="hidden md:inline">
                    <Badge text={kidAgeLabel} palette={palette} muted />
                  </span>
                ) : null}
                {kidPlayStyleLabel ? (
                  <span className="hidden lg:inline">
                    <Badge text={kidPlayStyleLabel} palette={palette} muted />
                  </span>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* Letter forms — always visible when active letter (responsive grid) */}
      {showEnglishLetterForms ? (
        <div className="mt-2 grid w-full grid-cols-2 gap-1.5 sm:mt-3 sm:grid-cols-4 sm:gap-2">
          <LetterFormCard label="Capital" value={uppercaseLetter!} palette={palette} />
          <LetterFormCard label="Small" value={lowercaseLetter!} palette={palette} />
          <LetterFormCard
            label="Hand"
            value={lowercaseLetter!}
            palette={palette}
            font='"Comic Sans MS","Marker Felt",cursive'
            italic
          />
          <LetterFormCard
            label="Trace"
            value={`${uppercaseLetter}${lowercaseLetter}${lowercaseLetter}`}
            palette={palette}
            outline
          />
        </div>
      ) : null}

      {/* Idle hint */}
      <p
        className="mx-auto mt-1 hidden max-w-2xl flex-none px-2 text-center text-xs font-body sm:block sm:text-sm"
        style={{ color: palette.inkSoft, fontWeight: 600 }}
      >
        {isIdle ? idleHint || idlePrompt : speechText ? `Says ${speechText}.` : idleHint}
      </p>
    </section>
  );
}

type BadgeProps = { text: string; palette: Palette; muted?: boolean };

function Badge({ text, palette, muted = false }: BadgeProps) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.16em]"
      style={{
        background: muted ? `${palette.inkSoft}14` : `${palette.primary}1a`,
        color: muted ? palette.inkSoft : palette.primaryDeep,
        fontWeight: 700
      }}
    >
      {text}
    </span>
  );
}

type LetterFormCardProps = {
  label: string;
  value: string;
  palette: Palette;
  font?: string;
  italic?: boolean;
  outline?: boolean;
};

function LetterFormCard({
  label,
  value,
  palette,
  font,
  italic = false,
  outline = false
}: LetterFormCardProps) {
  return (
    <div
      className="rounded-2xl px-2 py-2 text-center sm:px-3 sm:py-2.5"
      style={{
        background: palette.card,
        boxShadow: `0 3px 0 ${palette.cardShadow}, 0 0 0 1px ${palette.cardLine} inset`
      }}
    >
      <p
        className="text-[9px] uppercase tracking-[0.18em] sm:text-[10px]"
        style={{ color: palette.inkSoft, fontWeight: 700 }}
      >
        {label}
      </p>
      <p
        className={`mt-1 leading-none ${italic ? "italic" : ""} ${outline ? "text-transparent" : ""}`}
        style={{
          color: outline ? "transparent" : palette.keyText,
          fontFamily: font ?? '"Quicksand","Fredoka","Trebuchet MS",sans-serif',
          fontWeight: 700,
          fontSize: outline ? "1.6rem" : "1.9rem",
          letterSpacing: outline ? "0.18em" : "-0.02em",
          WebkitTextStroke: outline ? `1.4px ${palette.keyText}` : undefined
        }}
      >
        {value}
      </p>
    </div>
  );
}
