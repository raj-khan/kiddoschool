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
      className="flex h-full min-h-0 w-full flex-col rounded-2xl p-2 sm:p-3"
      style={{
        background: palette.card,
        boxShadow: `0 0 0 1px ${palette.cardLine} inset, 0 4px 0 ${palette.cardShadow}40`
      }}
    >
      <div className="grid min-h-0 flex-1 grid-cols-5 gap-1.5 sm:grid-cols-7 sm:gap-2 md:grid-cols-10 md:gap-2.5">
        {colorOptions.map((colorOption) => {
          const isActive = activeColorId === colorOption.id;

          return (
            <button
              key={colorOption.id}
              type="button"
              onClick={() => onColorSelect(colorOption.id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 transition duration-150 hover:-translate-y-px ${
                isActive ? "-translate-y-px" : ""
              }`}
              style={{
                background: "#fff",
                boxShadow: isActive
                  ? `0 4px 0 ${colorOption.ring}, 0 0 0 2px ${colorOption.ring} inset`
                  : `0 3px 0 ${palette.cardShadow}, 0 0 0 1px ${palette.cardLine} inset`
              }}
              aria-pressed={isActive}
              dir={colorOption.textDirection}
            >
              <span
                className="block w-full max-w-[3.5rem] rounded-full border-2 border-white"
                style={{
                  background: colorOption.swatch,
                  height: "clamp(1.25rem, 3.5vw, 2.25rem)",
                  boxShadow: `0 2px 0 ${palette.cardShadow}33`
                }}
                aria-hidden="true"
              />
              <span
                className="block text-center font-display leading-tight"
                style={{
                  color: palette.ink,
                  fontWeight: 600,
                  fontSize: "clamp(10px, 1.2vw, 13px)"
                }}
              >
                {colorOption.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
