import Link from "next/link";
import type { ReactNode } from "react";

import { SITE_NAME } from "@/lib/site";

type SiteNavProps = {
  currentPath: "/" | "/contribute";
  overlay?: boolean;
};

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M3.5 11.2 12 4l8.5 7.2" stroke="#52b6ff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 10.5v8.2h11v-8.2" fill="#fff4d8" stroke="#f4b678" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M10 18.7v-4.5h4v4.5" fill="#ff8fab" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path d="M12 20s-7.5-4.3-7.5-10A4.2 4.2 0 0 1 12 7.3 4.2 4.2 0 0 1 19.5 10c0 5.7-7.5 10-7.5 10Z" fill="#ffe1e9" stroke="#ff8fab" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 12h6M12 9v6" stroke="#7a284f" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconWrap({ children }: { children: ReactNode }) {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/82" aria-hidden="true">
      {children}
    </span>
  );
}

export function SiteNav({ currentPath, overlay = false }: SiteNavProps) {
  return (
    <nav
      className={
        overlay
          ? "fixed left-3 top-3 z-30 block sm:left-4 sm:top-4"
          : "sticky top-4 z-20"
      }
    >
      <div className="rounded-full border border-white/80 bg-white/82 p-1 shadow-[0_10px_30px_rgba(15,35,57,0.08)] backdrop-blur-xl">
        <div className="flex items-center gap-1">
          <Link
            href="/"
            aria-label={`${SITE_NAME} home`}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
              currentPath === "/" ? "bg-slate-900" : "hover:bg-white"
            }`}
          >
            <IconWrap>
              <HomeIcon />
            </IconWrap>
          </Link>
          <Link
            href="/contribute"
            aria-label="Support"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
              currentPath === "/contribute" ? "bg-slate-900" : "hover:bg-white"
            }`}
          >
            <IconWrap>
              <SupportIcon />
            </IconWrap>
          </Link>
        </div>
      </div>
    </nav>
  );
}
