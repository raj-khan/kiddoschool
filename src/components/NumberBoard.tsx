import type { Palette } from "@/lib/constants";

type NumberBoardProps = {
  values: readonly number[];
  visibleMaxNumber: number;
  onNumberSelect: (value: number) => void;
  palette: Palette;
  activeNumberValue?: string | null;
  orderLabel: string;
};

function getColumnCount(total: number): number {
  if (total <= 10) return 5;
  if (total <= 20) return 5;
  if (total <= 50) return 10;
  return 10;
}

export function NumberBoard({
  values,
  visibleMaxNumber,
  onNumberSelect,
  palette,
  activeNumberValue = null,
  orderLabel
}: NumberBoardProps) {
  const columns = getColumnCount(values.length);

  return (
    <section
      className="flex h-full min-h-0 w-full flex-col rounded-2xl p-2 sm:p-3"
      style={{
        background: palette.card,
        boxShadow: `0 0 0 1px ${palette.cardLine} inset, 0 4px 0 ${palette.cardShadow}40`
      }}
    >
      <div className="mb-2 hidden items-end justify-between gap-2 sm:flex">
        <p className="font-display text-base" style={{ color: palette.ink, fontWeight: 600 }}>
          Number board
        </p>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.16em]"
          style={{
            background: `${palette.primary}1a`,
            color: palette.primaryDeep,
            fontWeight: 700
          }}
        >
          {`1–${visibleMaxNumber} · ${orderLabel}`}
        </span>
      </div>

      <div
        className="grid min-h-0 flex-1 gap-1.5 sm:gap-2"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
        }}
      >
        {values.map((value) => {
          const isActive = activeNumberValue === String(value);

          return (
            <button
              key={value}
              type="button"
              onClick={() => onNumberSelect(value)}
              className={`nuha-key-tap font-key grid place-items-center rounded-xl leading-none transition duration-150 hover:-translate-y-px ${
                isActive ? "-translate-y-px scale-[1.05]" : ""
              }`}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${palette.primary}, ${palette.primaryDeep})`
                  : "#fff",
                color: isActive ? "#fff" : palette.ink,
                fontWeight: 700,
                boxShadow: isActive
                  ? `0 6px 0 ${palette.primaryDeep}, 0 14px 24px ${palette.activeKeyGlow}, 0 0 0 2px ${palette.primaryDeep} inset`
                  : `0 3px 0 ${palette.cardShadow}, 0 0 0 1px ${palette.cardLine} inset`,
                fontSize: "clamp(1.5rem, 4.6vw, 2.8rem)",
                letterSpacing: "-0.02em"
              }}
              aria-pressed={isActive}
            >
              {value}
            </button>
          );
        })}
      </div>
    </section>
  );
}
