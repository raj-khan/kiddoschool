import type { Palette } from "@/lib/constants";

export type MascotMood = "happy" | "wow";

type MascotProps = {
  palette: Palette;
  mood?: MascotMood;
  size?: number;
};

export function MascotStar({ palette, mood = "happy", size = 96 }: MascotProps) {
  const wink = mood === "wow";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="nuha-star-grad" cx="50%" cy="35%" r="60%">
          <stop offset="0" stopColor="#FFE49A" />
          <stop offset="1" stopColor={palette.sunny} />
        </radialGradient>
      </defs>
      <path
        d="M50 6 L60 38 L94 40 L67 60 L77 92 L50 73 L23 92 L33 60 L6 40 L40 38 Z"
        fill="url(#nuha-star-grad)"
        stroke="#E8A93B"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <ellipse cx="36" cy="56" rx="4" ry="2.5" fill={palette.accent} opacity="0.7" />
      <ellipse cx="64" cy="56" rx="4" ry="2.5" fill={palette.accent} opacity="0.7" />
      {wink ? (
        <>
          <path
            d="M34 49 Q38 45 42 49"
            stroke="#2B1B3D"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="62" cy="48" r="3.2" fill="#2B1B3D" />
          <circle cx="63.2" cy="46.8" r="1" fill="#fff" />
        </>
      ) : (
        <>
          <circle cx="38" cy="48" r="3.2" fill="#2B1B3D" />
          <circle cx="39.2" cy="46.8" r="1" fill="#fff" />
          <circle cx="62" cy="48" r="3.2" fill="#2B1B3D" />
          <circle cx="63.2" cy="46.8" r="1" fill="#fff" />
        </>
      )}
      <path
        d={wink ? "M42 60 Q50 70 58 60" : "M42 58 Q50 66 58 58"}
        stroke="#2B1B3D"
        strokeWidth="3"
        fill="#FF7A8E"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
