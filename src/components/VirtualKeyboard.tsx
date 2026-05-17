import type { Palette } from "@/lib/constants";
import {
  filterLanguageRows,
  normalizeLanguageLookupValue,
  type LanguageKey,
  type LanguagePack
} from "@/lib/language-packs";

type VirtualKeyboardProps = {
  languagePack: LanguagePack;
  onKeyPress: (languageKey: LanguageKey) => void;
  palette: Palette;
  visibleKeyIds?: ReadonlySet<string>;
  minimal?: boolean;
  dense?: boolean;
  activeKeyValue?: string | null;
};

function keyFlex(languageKey: LanguageKey): string {
  if (languageKey.size === "full") return "w-full";
  if (languageKey.size === "wide") return "flex-[1.6_1_0%] min-w-0";
  return "flex-[1_1_0%] min-w-0";
}

function keyTextSize(languageKey: LanguageKey, dense: boolean): string {
  const labelLength = (languageKey.label ?? languageKey.displayText ?? languageKey.value).length;

  if (languageKey.size === "full") {
    return dense ? "text-xs sm:text-sm" : "text-sm sm:text-base";
  }
  if (languageKey.size === "wide") {
    return dense ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm";
  }
  if (labelLength > 2) {
    return dense ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm";
  }
  return dense
    ? "text-lg sm:text-xl md:text-2xl"
    : "text-2xl sm:text-3xl md:text-4xl";
}

export function VirtualKeyboard({
  languagePack,
  onKeyPress,
  palette,
  visibleKeyIds,
  minimal = false,
  dense = false,
  activeKeyValue = null
}: VirtualKeyboardProps) {
  const visibleRows = filterLanguageRows(languagePack, visibleKeyIds);
  const normalizedActiveKeyValue = activeKeyValue ? normalizeLanguageLookupValue(activeKeyValue) : null;
  const bengaliExtras = languagePack.id === "bengali" ? "font-body leading-snug" : "";
  const keyMinHeight = dense ? "min-h-11 sm:min-h-12" : "min-h-12 sm:min-h-14";
  const gap = dense ? "gap-1.5" : "gap-2";
  const rowGap = dense ? "space-y-1.5" : "space-y-2";

  return (
    <section
      className={`flex h-full min-h-0 w-full flex-col rounded-2xl ${minimal || dense ? "p-2 sm:p-3" : "p-3 sm:p-4"}`}
      style={{
        background: palette.card,
        boxShadow: `0 0 0 1px ${palette.cardLine} inset, 0 4px 0 ${palette.cardShadow}40`
      }}
    >
      {!minimal && !dense ? (
        <div className="mb-2 flex items-center gap-2">
          <span
            className="grid h-7 w-7 place-items-center rounded-lg"
            style={{ background: `${palette.primary}1a`, color: palette.primaryDeep }}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="6" width="20" height="13" rx="2.5" />
              <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h.01M10 14h6M6 18h12" />
            </svg>
          </span>
          <p className="font-display text-base font-bold" style={{ color: palette.ink }}>
            Virtual keyboard
          </p>
        </div>
      ) : null}

      <div className={`flex min-h-0 flex-1 flex-col ${rowGap}`} dir={languagePack.direction}>
        {visibleRows.map((row, rowIndex) => (
          <div
            key={`${languagePack.id}-${rowIndex}`}
            className={`flex flex-1 min-h-0 ${gap}`}
          >
            {row.map((languageKey, keyIndex) => {
              const isActive =
                normalizedActiveKeyValue !== null &&
                normalizeLanguageLookupValue(languageKey.value) === normalizedActiveKeyValue;

              return (
                <button
                  key={`${languagePack.id}-${rowIndex}-${keyIndex}`}
                  type="button"
                  onClick={() => onKeyPress(languageKey)}
                  className={`${keyFlex(languageKey)} ${keyTextSize(languageKey, dense)} ${bengaliExtras} ${keyMinHeight} grid place-items-center rounded-xl font-display font-bold leading-none transition duration-150 hover:-translate-y-px active:translate-y-0.5`}
                  style={{
                    background: isActive ? palette.primary : "#fff",
                    color: isActive ? "#fff" : palette.ink,
                    boxShadow: isActive
                      ? `0 4px 0 ${palette.primaryDeep}, 0 0 0 1px ${palette.primaryDeep} inset`
                      : `0 3px 0 ${palette.cardShadow}, 0 0 0 1px ${palette.cardLine} inset`
                  }}
                  aria-pressed={isActive}
                >
                  {languageKey.name ? (
                    <span className="flex flex-col items-center gap-0.5 leading-none">
                      <span>{languageKey.label ?? languageKey.value}</span>
                      <span
                        className="font-body text-[9px] font-semibold tracking-wide"
                        style={{ color: isActive ? "rgba(255,255,255,0.85)" : palette.inkSoft }}
                      >
                        {languageKey.name}
                      </span>
                    </span>
                  ) : (
                    languageKey.label ?? languageKey.displayText ?? languageKey.value
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
