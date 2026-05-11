import { LanguagePackIcon } from "@/components/LanguagePackIcon";
import type { Palette } from "@/lib/constants";
import {
  LANGUAGE_PACKS,
  type LanguagePack,
  type LanguagePackId
} from "@/lib/language-packs";

type LanguageSelectorProps = {
  languagePack: LanguagePack;
  onChange: (languageId: LanguagePackId) => void;
  palette: Palette;
  compact?: boolean;
};

export function LanguageSelector({
  languagePack,
  onChange,
  palette,
  compact = false
}: LanguageSelectorProps) {
  const title = compact ? "Letter layout" : "Language pack";
  const description = compact
    ? "Choose the keyboard for this play session."
    : "Switch the keyboard now, then add more community packs later.";
  const gridClasses = compact
    ? "grid grid-cols-4 gap-2"
    : "grid grid-cols-2 gap-3 sm:grid-cols-4";

  if (compact) {
    return (
      <div className="space-y-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: palette.detailText }}>
            {title}
          </p>
          <p className={`${compact ? "hidden sm:block" : ""} mt-1 text-sm font-bold leading-6`} style={{ color: palette.detailText }}>
            {description}
          </p>
        </div>

        <div className={gridClasses}>
          {LANGUAGE_PACKS.map((pack) => {
            const isActive = pack.id === languagePack.id;

            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => onChange(pack.id)}
                className={`min-w-0 rounded-[1.1rem] border px-1.5 py-2 text-center transition duration-150 ${
                  isActive ? "scale-[1.02]" : "hover:-translate-y-0.5"
                }`}
                style={{
                  background: isActive ? palette.activeKeySurface : palette.shell,
                  borderColor: isActive ? palette.activeKeyBorder : palette.buttonBorder,
                  color: isActive ? palette.activeKeyText : palette.buttonText,
                  boxShadow: isActive ? `0 10px 22px ${palette.activeKeyGlow}` : undefined
                }}
                aria-pressed={isActive}
                aria-label={`Use ${pack.label}`}
              >
                <LanguagePackIcon languageId={pack.id} active={isActive} />
                <span className="mt-1 block truncate text-[10px] font-extrabold uppercase tracking-[0.08em] sm:text-[11px]">
                  {pack.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
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
          {title}
        </p>
        <p className="mt-1 text-sm font-bold leading-6" style={{ color: palette.detailText }}>
          {description}
        </p>
      </div>

      <div className={gridClasses}>
        {LANGUAGE_PACKS.map((pack) => {
          const isActive = pack.id === languagePack.id;

          return (
            <button
              key={pack.id}
              type="button"
              onClick={() => onChange(pack.id)}
              className={`rounded-[1.25rem] border px-3 py-3 text-center transition duration-150 ${
                isActive ? "scale-[1.02]" : "hover:-translate-y-0.5"
              }`}
              style={{
                background: isActive ? palette.activeKeySurface : palette.buttonSurface,
                borderColor: isActive ? palette.activeKeyBorder : palette.buttonBorder,
                color: isActive ? palette.activeKeyText : palette.buttonText,
                boxShadow: isActive ? `0 12px 26px ${palette.activeKeyGlow}` : undefined
              }}
              aria-pressed={isActive}
            >
              <LanguagePackIcon languageId={pack.id} active={isActive} />
              <span className="mt-2 block text-xs font-extrabold uppercase tracking-[0.12em]">
                {pack.label}
              </span>
            </button>
          );
        })}
      </div>

      <p
        className="mt-3 font-display text-2xl tracking-[-0.04em]"
        style={{ color: palette.messageText }}
      >
        {languagePack.nativeLabel}
      </p>
      <p className="mt-2 text-sm font-bold leading-6" style={{ color: palette.detailText }}>
        {languagePack.description}
      </p>
    </section>
  );
}
