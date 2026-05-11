import Link from "next/link";

import { REPO_URL, SITE_NAME } from "@/lib/site";

type SiteNavProps = {
  currentPath: "/" | "/contribute";
  overlay?: boolean;
};

export function SiteNav({ currentPath, overlay = false }: SiteNavProps) {
  return (
    <nav
      className={
        overlay
          ? "fixed left-4 top-4 z-30 block"
          : "sticky top-4 z-20"
      }
    >
      <div className="rounded-full border border-white/80 bg-white/78 px-3 py-2 shadow-[0_18px_55px_rgba(255,255,255,0.24)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="rounded-full bg-slate-900 px-3 py-2 font-display text-sm tracking-[-0.03em] text-white"
          >
            {SITE_NAME}
          </Link>
          <Link
            href="/"
            className={`rounded-full px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] transition ${
              currentPath === "/" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-white"
            }`}
          >
            Play
          </Link>
          <Link
            href="/contribute"
            className={`rounded-full px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] transition ${
              overlay ? "hidden sm:block" : ""
            } ${currentPath === "/contribute" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-white"}`}
          >
            Contribute
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className={`rounded-full px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-700 transition hover:bg-white ${overlay ? "hidden sm:block" : ""}`}
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
