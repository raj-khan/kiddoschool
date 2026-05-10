import type { Palette } from "@/lib/constants";
import {
  getResolvedColorOptions,
  type ColorOptionId
} from "@/lib/learning-content";
import type { LanguagePackId } from "@/lib/language-packs";

type ColorPaletteBarProps = {
  languagePackId: LanguagePackId;
  onColorSelect: (colorId: ColorOptionId) => void;
  palette: Palette;
  activeColorId?: string | null;
};

export function ColorPaletteBar({
  languagePackId,
  onColorSelect,
  palette,
  activeColorId = null
}: ColorPaletteBarProps) {
  const colorOptions = getResolvedColorOptions(languagePackId);

  return (
    <section
      className="rounded-[1.7rem] border p-3 sm:p-3.5 shadow-[0_22px_60px_rgba(255,255,255,0.18)] backdrop-blur-xl"
      style={{
        background: palette.shell,
        borderColor: palette.shellBorder
      }}
    >
      <div className="flex flex-wrap gap-2">
        {colorOptions.map((colorOption) => {
          const isActive = activeColorId === colorOption.id;

          return (
            <button
              key={colorOption.id}
              type="button"
              onClick={() => onColorSelect(colorOption.id)}
              className={`min-h-14 min-w-[5.2rem] flex-1 rounded-[1.1rem] border px-2.5 py-2 text-center transition ${isActive ? "scale-[1.03] -translate-y-0.5" : "hover:-translate-y-0.5"}`}
              style={{
                background: isActive ? palette.activeKeySurface : palette.buttonSurface,
                borderColor: isActive ? colorOption.ring : palette.buttonBorder,
                color: isActive ? palette.activeKeyText : palette.buttonText,
                boxShadow: isActive ? `0 14px 28px ${palette.activeKeyGlow}` : undefined
              }}
              aria-pressed={isActive}
              dir={colorOption.textDirection}
            >
              <span
                className="mx-auto mb-2 block h-4 w-full max-w-[3.8rem] rounded-full border"
                style={{
                  background: colorOption.swatch,
                  borderColor: isActive ? colorOption.ring : "rgba(255,255,255,0.85)"
                }}
                aria-hidden="true"
              />
              <span className="block text-sm font-extrabold leading-5" style={{ color: colorOption.labelTextColor }}>
                {colorOption.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
