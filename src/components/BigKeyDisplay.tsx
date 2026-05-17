import { ColorSceneIllustration } from "@/components/ColorSceneIllustration";
import { MascotStar } from "@/components/Mascot";
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
  void emoji;
  void floatingEchoText;
  void languageNativeLabel;
  const isIdle = displayText === null;
  const uppercaseLetter = activeEnglishLetter?.toUpperCase() ?? null;
  const lowercaseLetter = activeEnglishLetter?.toLowerCase() ?? null;
  const showEnglishLetterForms = uppercaseLetter !== null && lowercaseLetter !== null;
  const heroColor = isIdle ? palette.primary : palette.keyText;
  const displayTextClasses = displayText
    ? immersive
      ? "text-[clamp(5rem,18vh,15rem)]"
      : constrained
        ? "text-[clamp(3.5rem,12vh,8rem)]"
        : "text-[clamp(4rem,16vh,12rem)]"
    : "text-[clamp(2.5rem,8vh,5rem)]";
  const labelText = isIdle
    ? "Press any key to begin"
    : speechText
      ? `I said: ${speechText}`
      : "I said: it";
  const cheerText = isIdle ? "It speaks and sparkles." : message || "Great job!";
  const colorScene = previewColor && activeColorId !== null;

  return (
    <section
      className="stage-entrance flex h-full w-full min-h-0 flex-col"
      aria-live="polite"
    >
      {/* Hero text */}
      <div className="flex-none px-2 text-center">
        <h1
          className="font-display font-bold tracking-[-0.02em] leading-[1.05]"
          style={{
            color: palette.ink,
            fontSize: constrained ? "clamp(1.25rem,3.2vh,2rem)" : "clamp(1.5rem,4vh,2.6rem)"
          }}
        >
          Press{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(120deg, ${palette.primary}, ${palette.accent})`
            }}
          >
            any key
          </span>
          !
        </h1>
        <p
          className="mt-0.5 text-xs font-semibold sm:text-sm"
          style={{ color: palette.inkSoft }}
        >
          Hear the sound, see the letter, and learn your keyboard.
        </p>
      </div>

      {/* Key card — flex to fill remaining vertical space */}
      <div
        key={burstKey}
        className={`nuha-keycard relative mx-auto mt-2 flex w-full min-h-0 max-w-[44rem] flex-1 flex-col items-center justify-center overflow-hidden rounded-[1.5rem] px-3 py-3 sm:mt-3 sm:rounded-[2rem] sm:px-6 sm:py-5`}
        style={{
          background: previewColor
            ? `linear-gradient(160deg, rgba(255,255,255,0.92), rgba(255,255,255,0.65)), ${previewColor}`
            : palette.card,
          boxShadow: `0 6px 0 ${palette.cardShadow}, 0 0 0 1px ${palette.cardLine} inset, 0 18px 40px -20px ${palette.cardShadow}`
        }}
      >
        {/* confetti dots (only on key press) */}
        {!isIdle && (
          <>
            <span
              className="nuha-confetti"
              style={{ top: 18, left: 24, width: 10, height: 10, background: palette.sunny }}
            />
            <span
              className="nuha-confetti"
              style={{
                top: 38,
                right: 32,
                width: 7,
                height: 7,
                background: palette.accent,
                animationDelay: "100ms"
              }}
            />
            <span
              className="nuha-confetti"
              style={{
                bottom: 26,
                left: 40,
                width: 8,
                height: 8,
                borderRadius: 2,
                background: palette.mint,
                transform: "rotate(20deg)",
                animationDelay: "50ms"
              }}
            />
            <span
              className="nuha-confetti"
              style={{
                bottom: 36,
                right: 22,
                width: 12,
                height: 12,
                background: palette.sky,
                opacity: 0.7,
                animationDelay: "150ms"
              }}
            />
          </>
        )}

        {/* Color scene replaces mascot when active */}
        {colorScene ? (
          <div className="min-h-0 flex-1 w-full">
            <ColorSceneIllustration
              colorId={activeColorId!}
              swatch={previewColor!}
              profile={kidProfile}
            />
          </div>
        ) : (
          <div className={isIdle ? "nuha-mascot-bob" : "nuha-mascot-cheer"}>
            <MascotStar
              palette={palette}
              size={constrained ? 56 : 76}
              mood={isIdle ? "happy" : "wow"}
            />
          </div>
        )}

        {/* Big key glyph */}
        {!colorScene ? (
          <div
            className={`font-display font-extrabold leading-none ${displayTextClasses} mt-1 select-none`}
            style={{
              color: heroColor,
              textShadow: !isIdle ? `0 6px 0 ${palette.cardShadow}55` : "none",
              letterSpacing: "-0.04em"
            }}
            dir={displayDirection}
          >
            {displayText ?? "?"}
          </div>
        ) : null}

        {/* "I said: X" pill */}
        <div
          className="mt-2 inline-flex max-w-[92%] items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold sm:text-sm"
          style={{
            background: isIdle ? `${palette.inkSoft}1f` : `${palette.primary}22`,
            color: palette.ink
          }}
        >
          <WaveIcon color={isIdle ? palette.inkSoft : palette.primary} animate={!isIdle} />
          <span className="truncate" dir={displayDirection}>
            {labelText}
          </span>
        </div>

        {/* Encouragement */}
        <p
          className="mt-1.5 font-display text-sm font-semibold sm:text-base"
          style={{ color: isIdle ? palette.inkSoft : palette.primaryDeep }}
        >
          {cheerText}
        </p>

        {/* Mini badge row (only when card has room) */}
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
      </div>

      {/* Letter forms (English letters only) — hidden when constrained to save space */}
      {showEnglishLetterForms && !constrained ? (
        <div className="mx-auto mt-2 hidden w-full max-w-[44rem] grid-cols-4 gap-2 sm:grid">
          <LetterFormCard label="Capital" value={uppercaseLetter!} palette={palette} />
          <LetterFormCard label="Small" value={lowercaseLetter!} palette={palette} />
          <LetterFormCard
            label="Handwriting"
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

      {/* Idle hint or speech caption — hidden on small screens to save space */}
      <p
        className="mx-auto mt-1 hidden max-w-2xl flex-none px-2 text-center text-xs font-semibold sm:block sm:text-sm"
        style={{ color: palette.inkSoft }}
      >
        {isIdle
          ? idleHint || idlePrompt
          : showEnglishLetterForms
            ? `Capital ${uppercaseLetter} and small ${lowercaseLetter}.`
            : speechText
              ? `Says ${speechText}.`
              : idleHint}
      </p>
    </section>
  );
}

type BadgeProps = { text: string; palette: Palette; muted?: boolean };

function Badge({ text, palette, muted = false }: BadgeProps) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em]"
      style={{
        background: muted ? `${palette.inkSoft}14` : `${palette.primary}1a`,
        color: muted ? palette.inkSoft : palette.primaryDeep
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
      className="rounded-2xl px-3 py-3 text-center"
      style={{
        background: palette.card,
        boxShadow: `0 4px 0 ${palette.cardShadow}, 0 0 0 1px ${palette.cardLine} inset`
      }}
    >
      <p
        className="text-[10px] font-extrabold uppercase tracking-[0.18em]"
        style={{ color: palette.inkSoft }}
      >
        {label}
      </p>
      <p
        className={`mt-1.5 leading-none ${italic ? "italic" : ""} ${outline ? "text-transparent" : ""}`}
        style={{
          color: outline ? "transparent" : palette.keyText,
          fontFamily: font ?? '"Fredoka","Nunito",sans-serif',
          fontWeight: 800,
          fontSize: outline ? "2.25rem" : "2.75rem",
          letterSpacing: outline ? "0.18em" : "-0.02em",
          WebkitTextStroke: outline ? `1.6px ${palette.keyText}` : undefined
        }}
      >
        {value}
      </p>
    </div>
  );
}
