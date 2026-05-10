import type { Palette } from "@/lib/constants";

type RecentKeyEntry = {
  label: string;
  direction: "ltr" | "rtl";
};

type RecentKeysProps = {
  keys: RecentKeyEntry[];
  palette: Palette;
};

export function RecentKeys({ keys, palette }: RecentKeysProps) {
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
          Recent keys
        </p>
        <p className="mt-1 text-sm font-bold leading-6" style={{ color: palette.detailText }}>
          The newest 10 taps stay here so the rhythm is easy to follow.
        </p>
      </div>

      {keys.length === 0 ? (
        <p className="text-sm font-bold leading-6" style={{ color: palette.detailText }}>
          The history will appear after the first key press.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-3" aria-label="Recent key history">
          {keys.map((key, index) => (
            <li
              key={`${key.label}-${index}`}
              className="min-w-16 rounded-[1.3rem] px-4 py-3 text-center font-display text-2xl shadow-[0_4px_0_rgba(45,48,71,0.14),inset_0_1px_0_rgba(255,255,255,0.5)]"
              style={{
                background: palette.historySurface,
                color: palette.historyText
              }}
              dir={key.direction}
            >
              {key.label}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
