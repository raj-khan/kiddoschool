import type { Palette } from "@/lib/constants";

export type StartRailItem = {
  id: string;
  label: string;
  ariaLabel: string;
  direction?: "ltr" | "rtl";
  swatch?: string;
};

type StartRailProps = {
  items: readonly StartRailItem[];
  activeItemId?: string | null;
  title: string;
  onSelect: (item: StartRailItem) => void;
  palette: Palette;
};

export function StartRail({
  items,
  activeItemId = null,
  title,
  onSelect,
  palette
}: StartRailProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="hidden rounded-[1.6rem] border p-2.5 shadow-[0_18px_48px_rgba(255,255,255,0.16)] backdrop-blur-xl sm:block sm:p-3"
      style={{
        background: palette.shell,
        borderColor: palette.shellBorder
      }}
      aria-label={title}
    >
      <div className="flex items-center gap-2">
        <p
          className="hidden shrink-0 px-2 text-xs font-extrabold uppercase tracking-[0.18em] sm:block"
          style={{ color: palette.detailText }}
        >
          {title}
        </p>
        <div className="grid flex-1 grid-cols-4 gap-1.5 sm:flex sm:gap-2">
          {items.map((item) => {
            const isActive = item.id === activeItemId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className={`min-h-14 min-w-0 rounded-[1.05rem] border px-2 py-2 text-center font-display text-2xl leading-none transition duration-150 sm:min-w-20 ${
                  isActive ? "scale-[1.03] -translate-y-0.5" : "hover:-translate-y-0.5"
                }`}
                style={{
                  background: isActive ? palette.activeKeySurface : palette.historySurface,
                  borderColor: isActive ? palette.activeKeyBorder : palette.buttonBorder,
                  color: isActive ? palette.activeKeyText : palette.historyText,
                  boxShadow: isActive
                    ? `0 12px 26px ${palette.activeKeyGlow}, inset 0 1px 0 rgba(255,255,255,0.72)`
                    : undefined
                }}
                aria-label={item.ariaLabel}
                aria-pressed={isActive}
                dir={item.direction ?? "ltr"}
              >
                {item.swatch ? (
                  <span
                    className="mx-auto block h-8 w-12 rounded-full border border-white/80"
                    style={{ background: item.swatch }}
                    aria-hidden="true"
                  />
                ) : (
                  item.label
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
