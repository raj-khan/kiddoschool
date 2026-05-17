import type { Palette } from "@/lib/constants";
import type { LearningMode } from "@/lib/learning-content";
import type { LanguagePackId } from "@/lib/language-packs";

export type ModeTabId = "free" | "letters" | "numbers" | "computer" | "colors";

type ModeTabsRailProps = {
  palette: Palette;
  learningMode: LearningMode;
  selectedLanguageId: LanguagePackId;
  onSelectTab: (tab: ModeTabId) => void;
  compact?: boolean;
};

const TAB_META: Record<ModeTabId, { label: string; glyph: string }> = {
  free: { label: "Free Play", glyph: "✨" },
  letters: { label: "Letters", glyph: "A" },
  numbers: { label: "Numbers", glyph: "1" },
  computer: { label: "Computer", glyph: "⌨" },
  colors: { label: "Colors", glyph: "🎨" }
};

const TAB_ORDER: readonly ModeTabId[] = ["free", "letters", "numbers", "computer", "colors"];

function getActiveTab(
  learningMode: LearningMode,
  selectedLanguageId: LanguagePackId
): ModeTabId {
  if (learningMode === "colors") return "colors";
  if (learningMode === "computer") return "computer";
  if (learningMode === "letters" && selectedLanguageId === "numbers") return "numbers";
  if (learningMode === "letters" && selectedLanguageId === "english") return "free";
  return "letters";
}

export function ModeTabsRail({
  palette,
  learningMode,
  selectedLanguageId,
  onSelectTab,
  compact = false
}: ModeTabsRailProps) {
  const active = getActiveTab(learningMode, selectedLanguageId);

  return (
    <div
      className="nuha-hide-scrollbar flex w-full gap-1.5 overflow-x-auto rounded-2xl p-1.5"
      style={{
        background: "#fff",
        boxShadow: `0 0 0 1px ${palette.cardLine} inset`
      }}
      role="tablist"
      aria-label="Learning modes"
    >
      {TAB_ORDER.map((tabId) => {
        const meta = TAB_META[tabId];
        const isActive = tabId === active;

        return (
          <button
            key={tabId}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectTab(tabId)}
            className={`flex flex-1 min-w-[5.5rem] items-center justify-center gap-1.5 rounded-xl font-display font-bold transition ${
              compact ? "px-2 py-2 text-xs" : "px-3 py-2.5 text-sm"
            }`}
            style={{
              background: isActive ? palette.primary : "transparent",
              color: isActive ? "#fff" : palette.ink,
              boxShadow: isActive ? `0 3px 0 ${palette.primaryDeep}` : "none"
            }}
          >
            <span
              className="grid place-items-center rounded-md text-[11px] font-extrabold"
              style={{
                width: 20,
                height: 20,
                background: isActive ? "rgba(255,255,255,0.25)" : `${palette.primary}1a`,
                color: isActive ? "#fff" : palette.primaryDeep
              }}
              aria-hidden="true"
            >
              {meta.glyph}
            </span>
            <span className="whitespace-nowrap">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
