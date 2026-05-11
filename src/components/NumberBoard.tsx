import type { Palette } from "@/lib/constants";

type NumberBoardProps = {
  values: readonly number[];
  maxNumber: number;
  onNumberSelect: (value: number) => void;
  palette: Palette;
  activeNumberValue?: string | null;
  orderLabel: string;
};

export function NumberBoard({
  values,
  maxNumber,
  onNumberSelect,
  palette,
  activeNumberValue = null,
  orderLabel
}: NumberBoardProps) {
  return (
    <section
      className="flex h-full min-h-0 w-full flex-col rounded-[1.5rem] border p-2.5 shadow-[0_22px_60px_rgba(255,255,255,0.18)] backdrop-blur-xl sm:rounded-[1.8rem] sm:p-4"
      style={{
        background: palette.shell,
        borderColor: palette.shellBorder
      }}
    >
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2 sm:mb-3 sm:gap-3">
        <div className="hidden sm:block">
          <p className="font-display text-2xl tracking-[-0.04em]" style={{ color: palette.keyText }}>
            Number board
          </p>
          <p className="mt-1 text-xs font-bold leading-5 sm:text-sm sm:leading-6" style={{ color: palette.detailText }}>
            Tap any number from 1 to {maxNumber}.
          </p>
        </div>
        <span
          className="hidden rounded-full px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] sm:inline-flex"
          style={{
            background: palette.badgeSurface,
            color: palette.badgeText
          }}
        >
          {`Range 1-${maxNumber} · ${orderLabel}`}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-1 sm:grid-cols-10 sm:gap-1.5">
        {values.map((value) => {
          const isActive = activeNumberValue === String(value);

          return (
            <button
              key={value}
              type="button"
              onClick={() => onNumberSelect(value)}
              className={`aspect-square min-w-0 rounded-[0.8rem] border px-0.5 py-0.5 text-center font-display text-[1rem] leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition duration-200 ${
                isActive ? "scale-[1.03] -translate-y-0.5" : "hover:-translate-y-0.5"
              } sm:rounded-[0.9rem] sm:text-[0.95rem]`}
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
              {value}
            </button>
          );
        })}
      </div>
    </section>
  );
}
