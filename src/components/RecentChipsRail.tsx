import type { Palette } from "@/lib/constants";

export type RecentChipEntry = {
  id: number;
  display: string;
  label?: string;
  color: string;
  direction: "ltr" | "rtl";
  isSymbol?: boolean;
};

type RecentChipsRailProps = {
  chips: RecentChipEntry[];
  palette: Palette;
  compact?: boolean;
};

export function RecentChipsRail({ chips, palette, compact = false }: RecentChipsRailProps) {
  return (
    <div
      className="nuha-hide-scrollbar flex items-center gap-2 overflow-x-auto pb-1"
      aria-label="Recent keys"
    >
      <div
        className="shrink-0 px-1 text-[11px] uppercase tracking-[0.2em]"
        style={{ color: palette.inkSoft, fontWeight: 700 }}
      >
        Recent
      </div>
      {chips.length === 0 ? (
        <span
          className="font-body text-xs italic sm:text-sm"
          style={{ color: palette.inkSoft, fontWeight: 600 }}
        >
          your keys will appear here
        </span>
      ) : (
        chips.map((chip, index) => (
          <div
            key={chip.id}
            dir={chip.direction}
            className={`${index === 0 ? "nuha-chip-in" : ""} font-key shrink-0 inline-flex items-center gap-1.5 rounded-2xl ${
              compact ? "px-2.5 py-1.5 text-sm" : "px-3 py-2 text-base"
            }`}
            style={{
              background: "#fff",
              color: palette.ink,
              fontWeight: 700,
              boxShadow: `0 3px 0 ${chip.color}66, 0 0 0 1px ${palette.cardLine} inset`
            }}
          >
            <span
              className="inline-block rounded-full"
              style={{ width: 8, height: 8, background: chip.color }}
              aria-hidden="true"
            />
            <span className="min-w-[14px] text-center">{chip.display}</span>
            {chip.isSymbol && chip.label ? (
              <span
                className="font-body ml-1 text-[11px] normal-case"
                style={{ color: palette.inkSoft, fontWeight: 600 }}
              >
                {chip.label}
              </span>
            ) : null}
          </div>
        ))
      )}
    </div>
  );
}
