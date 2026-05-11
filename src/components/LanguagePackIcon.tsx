import type { LanguagePackId } from "@/lib/language-packs";

const LANGUAGE_ICON_TEXT: Record<LanguagePackId, readonly string[]> = {
  english: ["A", "B", "C"],
  numbers: ["1", "2", "3"],
  arabic: ["أ", "ب", "ت"],
  bengali: ["অ", "আ", "ই"]
};

const LANGUAGE_ICON_COLORS = ["#ff8fab", "#52b6ff", "#70d96f"] as const;

type LanguagePackIconProps = {
  languageId: LanguagePackId;
  active?: boolean;
  compact?: boolean;
};

export function LanguagePackIcon({
  languageId,
  active = false,
  compact = false
}: LanguagePackIconProps) {
  return (
    <span
      className={`flex items-center justify-center font-display leading-none ${
        compact ? "gap-0.5" : "min-h-12 gap-1 rounded-[1rem] px-2"
      }`}
      dir={languageId === "arabic" ? "rtl" : "ltr"}
      aria-hidden="true"
    >
      {LANGUAGE_ICON_TEXT[languageId].map((letter, index) => (
        <span
          key={`${languageId}-${letter}`}
          className={`drop-shadow-sm transition ${
            compact ? "text-[1.05rem] sm:text-[1.2rem]" : active ? "text-[1.75rem]" : "text-[1.55rem]"
          }`}
          style={{ color: LANGUAGE_ICON_COLORS[index] }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
