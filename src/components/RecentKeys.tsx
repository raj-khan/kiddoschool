import type { Palette } from "@/lib/constants";

export type RecentKeyEntry = {
  id: number;
  display: string;
  label?: string;
  color: string;
  direction: "ltr" | "rtl";
  isSymbol?: boolean;
};

type RecentKeysProps = {
  keys: RecentKeyEntry[];
  palette: Palette;
  compact?: boolean;
};

export function RecentKeys({ keys, palette, compact = false }: RecentKeysProps) {
  return (
    <section
      className="flex w-full flex-col rounded-2xl p-2 sm:rounded-[1.4rem] sm:p-3"
      style={{
        background: palette.card,
        boxShadow: `0 0 0 1px ${palette.cardLine} inset, 0 4px 0 ${palette.cardShadow}40`
      }}
      aria-label="Recent keys"
    >
      <div className="mb-1 flex items-center justify-between gap-2 px-1">
        <p
          className="font-display text-xs uppercase tracking-[0.2em] sm:text-sm"
          style={{ color: palette.inkSoft, fontWeight: 700 }}
        >
          Recent keys
        </p>
        {keys.length > 0 ? (
          <span
            className="font-body text-[10px] tracking-[0.16em]"
            style={{ color: palette.inkSoft, fontWeight: 600 }}
          >
            newest first
          </span>
        ) : null}
      </div>

      {keys.length === 0 ? (
        <p
          className="px-1 py-1 font-body text-xs italic sm:text-sm"
          style={{ color: palette.inkSoft, fontWeight: 600 }}
        >
          Your keys will appear here as you play.
        </p>
      ) : (
        <ul
          className="nuha-hide-scrollbar flex gap-2 overflow-x-auto pb-1"
          aria-label="Recent key history"
        >
          {keys.map((entry, index) => (
            <li
              key={entry.id}
              dir={entry.direction}
              className={`${index === 0 ? "nuha-chip-in" : ""} font-key flex shrink-0 flex-col items-center justify-center rounded-2xl ${
                compact ? "min-w-[3rem] px-2 py-1.5" : "min-w-[3.5rem] px-2.5 py-2 sm:min-w-[4rem]"
              }`}
              style={{
                background: "#fff",
                color: palette.ink,
                boxShadow: `0 4px 0 ${entry.color}88, 0 0 0 1px ${palette.cardLine} inset`
              }}
            >
              <span
                className="leading-none"
                style={{
                  fontWeight: 700,
                  fontSize: compact ? "1.25rem" : "1.6rem",
                  letterSpacing: "-0.02em"
                }}
              >
                {entry.display}
              </span>
              {entry.isSymbol && entry.label ? (
                <span
                  className="mt-0.5 font-body text-[9px] uppercase tracking-wide"
                  style={{ color: palette.inkSoft, fontWeight: 600 }}
                >
                  {entry.label}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
