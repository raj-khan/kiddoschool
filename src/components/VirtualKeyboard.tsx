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

function getKeyButtonClasses(languageKey: LanguageKey, minimal: boolean, dense: boolean): string {
  if (dense) {
    const denseBaseClasses =
      "min-h-8 rounded-[0.85rem] border px-1 py-1 text-center font-display shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition duration-200 hover:-translate-y-0.5 sm:min-h-9";

    if (languageKey.size === "full") {
      return `${denseBaseClasses} w-full text-[11px] sm:text-xs`;
    }

    if (languageKey.size === "wide") {
      return `${denseBaseClasses} min-w-0 flex-[1.5_1_0%] text-[10px] sm:text-[11px]`;
    }

    const labelLength = (languageKey.label ?? languageKey.displayText ?? languageKey.value).length;

    return `${denseBaseClasses} min-w-0 flex-[1_1_0%] ${
      labelLength > 2 ? "text-[10px] sm:text-[11px]" : "text-sm sm:text-lg"
    }`;
  }

  const baseClasses = minimal
    ? "min-h-10 rounded-[0.95rem] border px-2.5 py-1.5 text-center font-display shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition duration-200 hover:-translate-y-0.5"
    : "min-h-12 rounded-[1.1rem] border px-3 py-2 text-center font-display shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition duration-200 hover:-translate-y-0.5";

  if (languageKey.size === "full") {
    return `${baseClasses} w-full ${minimal ? "text-xs" : "text-sm"}`;
  }

  if (languageKey.size === "wide") {
    return `${baseClasses} ${minimal ? "min-w-[5.4rem]" : "min-w-[7rem]"} flex-1 text-sm`;
  }

  const labelLength = (languageKey.label ?? languageKey.displayText ?? languageKey.value).length;

  return `${baseClasses} ${minimal ? "min-w-[2.35rem]" : "min-w-[2.7rem]"} flex-1 ${labelLength > 2 ? "text-sm" : minimal ? "text-[1.35rem]" : "text-2xl"}`;
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

  return (
    <section
      className={`${
        dense ? "rounded-[1.55rem] p-2 sm:p-2.5" : minimal ? "rounded-[1.7rem] p-3 sm:p-3.5" : "rounded-[2rem] p-4"
      } border shadow-[0_22px_60px_rgba(255,255,255,0.18)] backdrop-blur-xl`}
      style={{
        background: palette.shell,
        borderColor: palette.shellBorder
      }}
    >
      {!minimal ? (
        <div className="mb-4">
          <p
            className="font-display text-2xl tracking-[-0.04em]"
            style={{ color: palette.keyText }}
          >
            Virtual keyboard
          </p>
          <p className="mt-1 text-sm font-bold leading-6" style={{ color: palette.detailText }}>
            Click with a mouse or tap on a screen when a physical keyboard is not enough.
          </p>
        </div>
      ) : null}

      <div className={dense ? "space-y-1.5" : "space-y-2"} dir={languagePack.direction}>
        {visibleRows.map((row, rowIndex) => (
          <div
            key={`${languagePack.id}-${rowIndex}`}
            className={`flex ${dense ? "gap-1" : minimal ? "gap-1.5" : "gap-2"}`}
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
                  className={`${getKeyButtonClasses(languageKey, minimal, dense)} ${isActive ? "scale-[1.03] -translate-y-0.5" : ""}`}
                  style={{
                    background: isActive ? palette.activeKeySurface : palette.historySurface,
                    borderColor: isActive ? palette.activeKeyBorder : palette.buttonBorder,
                    color: isActive ? palette.activeKeyText : palette.historyText,
                    boxShadow: isActive
                      ? `0 12px 26px ${palette.activeKeyGlow}, inset 0 1px 0 rgba(255,255,255,0.72)`
                      : undefined
                  }}
                  aria-pressed={isActive}
                >
                  {languageKey.name ? (
                    <span className="flex flex-col items-center gap-0.5 leading-none">
                      <span>{languageKey.label ?? languageKey.value}</span>
                      <span className="font-body text-[9px] font-semibold tracking-wide opacity-65">{languageKey.name}</span>
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
