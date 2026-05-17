import type { Palette } from "@/lib/constants";

type NuhaLogoProps = {
  palette: Palette;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
};

export function NuhaLogo({ palette, size = "md", showTagline = true }: NuhaLogoProps) {
  const badgePx = size === "sm" ? 32 : size === "lg" ? 44 : 38;
  const titlePx = size === "sm" ? 15 : size === "lg" ? 20 : 17;
  const taglinePx = size === "sm" ? 10 : size === "lg" ? 12 : 11;
  const dotPx = Math.round(badgePx * 0.3);

  return (
    <div className="inline-flex items-center gap-2.5">
      <div
        className="relative shrink-0"
        style={{ width: badgePx, height: badgePx }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 grid place-items-center rounded-[0.85rem] font-display font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})`,
            boxShadow: `0 ${Math.round(badgePx * 0.1)}px 0 ${palette.primaryDeep}`,
            fontSize: Math.round(badgePx * 0.55),
            letterSpacing: -0.5
          }}
        >
          n
        </div>
        <div
          className="absolute -right-1 -top-1 rounded-full border-2 border-white"
          style={{ width: dotPx, height: dotPx, background: palette.sunny }}
        />
      </div>
      <div className="flex min-w-0 flex-col leading-none">
        <div
          className="font-display font-semibold tracking-[-0.01em] whitespace-nowrap"
          style={{ fontSize: titlePx, color: palette.ink }}
        >
          Nuha <span style={{ color: palette.primaryDeep }}>Keyboard</span>
        </div>
        {showTagline ? (
          <div
            className="mt-1 font-semibold whitespace-nowrap"
            style={{ fontSize: taglinePx, color: palette.inkSoft }}
          >
            Hear it. See it. Learn it.
          </div>
        ) : null}
      </div>
    </div>
  );
}
