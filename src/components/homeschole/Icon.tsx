import type { CSSProperties, ReactNode } from "react";

// Calm rounded line-icon set. All 24×24, stroke = currentColor, round caps/joins.
const ICON_PATHS = {
  today: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9.5" />
      <path d="M10 20v-5a2 2 0 0 1 4 0v5" />
    </>
  ),
  garden: (
    <>
      <path d="M12 21v-7" />
      <path d="M12 14c0-3 2.2-5 5-5 0 3-2.2 5-5 5Z" />
      <path d="M12 12c0-3-2.2-5-5-5 0 3 2.2 5 5 5Z" />
      <path d="M7 21h10" />
    </>
  ),
  parent: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20c.4-3.6 3.2-6 6.5-6s6.1 2.4 6.5 6" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2.4" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  sound: (
    <>
      <path d="M5 9v6h3l4 3.5V5.5L8 9H5Z" />
      <path d="M16 9.5a3.5 3.5 0 0 1 0 5" />
      <path d="M18.5 7a7 7 0 0 1 0 10" />
    </>
  ),
  mute: (
    <>
      <path d="M5 9v6h3l4 3.5V5.5L8 9H5Z" />
      <path d="m16 10 4 4M20 10l-4 4" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  star: (
    <path d="M12 4.5c.6 1.7 1.2 3.3 2.4 4.4 1.2 1 2.9 1.4 4.6 1.6-1.3 1.1-2.6 2.1-3.1 3.6-.5 1.5-.2 3.2.1 4.9-1.5-.8-3-1.7-4-1.7s-2.5.9-4 1.7c.3-1.7.6-3.4.1-4.9-.5-1.5-1.8-2.5-3.1-3.6 1.7-.2 3.4-.6 4.6-1.6C10.8 7.8 11.4 6.2 12 4.5Z" />
  ),
  seed: (
    <>
      <path d="M12 20c4 0 7-3 7-7-4 0-7 3-7 7Z" />
      <path d="M12 20c-4 0-7-3-7-7 4 0 7 3 7 7Z" />
      <path d="M12 20v-9" />
    </>
  ),
  trace: (
    <>
      <path d="M5 19c2-.4 3-1.4 3.5-3" />
      <path d="M16.5 4.6a2.1 2.1 0 0 1 3 3L9 18l-4 1 1-4Z" />
    </>
  ),
  match: (
    <>
      <rect x="4" y="5" width="7" height="7" rx="2" />
      <rect x="13" y="12" width="7" height="7" rx="2" />
      <path d="M9 15.5h2.5M14.5 8.5H17" />
    </>
  ),
  phonics: <path d="M4 12h2l2-5 3 11 3-9 2 3h4" />,
  connect: (
    <>
      <circle cx="7" cy="7" r="2.4" />
      <circle cx="17" cy="17" r="2.4" />
      <path d="M9 9c3 1 4 4 6 6" />
    </>
  ),
  memory: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.8" />
      <rect x="13" y="4" width="7" height="7" rx="1.8" />
      <rect x="4" y="13" width="7" height="7" rx="1.8" />
      <rect x="13" y="13" width="7" height="7" rx="1.8" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.5C10.5 5.2 8.5 4.8 5 5v13c3.5-.2 5.5.2 7 1.5 1.5-1.3 3.5-1.7 7-1.5V5c-3.5-.2-5.5.2-7 1.5Z" />
      <path d="M12 6.5v13" />
    </>
  ),
  letters: (
    <>
      <path d="M4 18 7.5 7l3.5 11M5.2 14h4.6" />
      <path d="M14 18V8h2.5a2.5 2.5 0 0 1 0 5H14m0 0h2.8a2.6 2.6 0 0 1 0 5.2H14" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 5c.4 2.6 1.4 3.6 4 4-2.6.4-3.6 1.4-4 4-.4-2.6-1.4-3.6-4-4 2.6-.4 3.6-1.4 4-4Z" />
      <path d="M18 14c.2 1.3.7 1.8 2 2-1.3.2-1.8.7-2 2-.2-1.3-.7-1.8-2-2 1.3-.2 1.8-.7 2-2Z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
      <path d="M4 9.5h16M8 3.5v3M16 3.5v3" />
    </>
  ),
  chart: (
    <>
      <path d="M5 19V5M5 19h14" />
      <path d="M8.5 19v-5M12.5 19v-9M16.5 19v-3" />
    </>
  ),
  printer: (
    <>
      <path d="M7 9V4h10v5" />
      <rect x="4" y="9" width="16" height="7" rx="2" />
      <path d="M7 14h10v5H7z" />
      <circle cx="17" cy="12" r=".6" fill="currentColor" stroke="none" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  back: <path d="m14 6-6 6 6 6" />,
  next: <path d="m10 6 6 6-6 6" />,
  down: <path d="m6 10 6 6 6-6" />,
  heart: <path d="M12 19s-6-4-8-8c-1.2-2.4.4-5 3-5 1.8 0 3 1.2 5 3 2-1.8 3.2-3 5-3 2.6 0 4.2 2.6 3 5-2 4-8 8-8 8Z" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.5M12 18.5V21M21 12h-2.5M5.5 12H3M18.4 5.6 16.6 7.4M7.4 16.6 5.6 18.4M18.4 18.4l-1.8-1.8M7.4 7.4 5.6 5.6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2.5 2.2 2.5 13.8 0 16M12 4c-2.5 2.2-2.5 13.8 0 16" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 6-13 14-13 0 8-6 13-14 13Z" />
      <path d="M5 19C8 14 11 11 16 9" />
    </>
  ),
  flower: (
    <>
      <circle cx="12" cy="12" r="2.4" />
      <path d="M12 9.6c0-2.2-2.4-3.4-2.4-3.4S8.4 8.8 12 9.6Zm0 4.8c0 2.2 2.4 3.4 2.4 3.4s1.2-2.6-2.4-3.4Zm2.4-2.4c2.2 0 3.4-2.4 3.4-2.4s-2.6-1.2-3.4 2.4Zm-4.8 0c-2.2 0-3.4 2.4-3.4 2.4s2.6 1.2 3.4-2.4Z" />
    </>
  ),
  pause: (
    <>
      <rect x="7" y="6" width="3.2" height="12" rx="1.4" />
      <rect x="13.8" y="6" width="3.2" height="12" rx="1.4" />
    </>
  ),
  refresh: (
    <>
      <path d="M19 11a7 7 0 1 0-1.2 5.5" />
      <path d="M19 5v4h-4" />
    </>
  ),
  close: <path d="m7 7 10 10M17 7 7 17" />,
  blocks: (
    <>
      <rect x="4.5" y="5" width="15" height="15" rx="4.5" />
      <path d="M9.2 16 12 8.5 14.8 16M10.2 13.4h3.6" />
    </>
  ),
  play: <path d="M8 6.5v11l9-5.5-9-5.5Z" />
} as const satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICON_PATHS;

export interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  color?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 24, stroke = 2, color, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color ?? "currentColor"}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
