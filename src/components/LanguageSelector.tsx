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
  if (compact) {
    return (
      <div className="space-y-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: palette.detailText }}>
            Language pack
          </p>
          <p className="mt-1 text-sm font-bold leading-6" style={{ color: palette.detailText }}>
            Choose the active keyboard for this play session.
          </p>
        </div>

        <label className="block">
          <span className="sr-only">Choose a language pack</span>
          <select
            value={languagePack.id}
            onChange={(event) => onChange(event.target.value as LanguagePackId)}
            className="w-full rounded-[1.3rem] border px-4 py-3 text-base font-bold outline-none transition focus:ring-2"
            style={{
              background: palette.buttonSurface,
              borderColor: palette.buttonBorder,
              color: palette.buttonText
            }}
          >
            {LANGUAGE_PACKS.map((pack) => (
              <option key={pack.id} value={pack.id}>
                {pack.label} · {pack.nativeLabel}
              </option>
            ))}
          </select>
        </label>
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
          Language pack
        </p>
        <p className="mt-1 text-sm font-bold leading-6" style={{ color: palette.detailText }}>
          Switch the keyboard on top now, then add more community packs later.
        </p>
      </div>

      <label className="block">
        <span className="sr-only">Choose a language pack</span>
        <select
          value={languagePack.id}
          onChange={(event) => onChange(event.target.value as LanguagePackId)}
          className="w-full rounded-[1.3rem] border px-4 py-3 text-base font-bold outline-none transition focus:ring-2"
          style={{
            background: palette.buttonSurface,
            borderColor: palette.buttonBorder,
            color: palette.buttonText
          }}
        >
          {LANGUAGE_PACKS.map((pack) => (
            <option key={pack.id} value={pack.id}>
              {pack.label} · {pack.nativeLabel}
            </option>
          ))}
        </select>
      </label>

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
