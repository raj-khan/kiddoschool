import Link from "next/link";
import type { ReactNode } from "react";

import { LanguagePackIcon } from "@/components/LanguagePackIcon";
import { LANGUAGE_PACKS, type LanguagePackId } from "@/lib/language-packs";
import { SITE_NAME } from "@/lib/site";

type SiteNavProps = {
  currentPath: "/" | "/contribute";
  overlay?: boolean;
  languagePackId?: LanguagePackId;
  onLanguageChange?: (languageId: LanguagePackId) => void;
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

function PlayIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="#dcf7ea" stroke="#70d96f" strokeWidth="2.4" />
      <path d="M13.2 10.2v11.6L22.5 16l-9.3-5.8Z" fill="#17324d" />
      <path d="M9.3 24.4h13.4" stroke="#f4b678" strokeWidth="2.2" strokeLinecap="round" />
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
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/78" aria-hidden="true">
      {children}
    </span>
  );
}

export function SiteNav({
  currentPath,
  overlay = false,
  languagePackId,
  onLanguageChange
}: SiteNavProps) {
  const showLanguageSwitcher = Boolean(languagePackId && onLanguageChange);

  return (
    <nav
      className={
        overlay
          ? "fixed left-4 top-4 z-30 block"
          : "sticky top-4 z-20"
      }
    >
      <div className="max-w-[calc(100vw-5.5rem)] rounded-full border border-white/80 bg-white/78 px-2 py-1.5 shadow-[0_18px_55px_rgba(255,255,255,0.24)] backdrop-blur-xl sm:max-w-none sm:px-3 sm:py-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/"
            aria-label={SITE_NAME}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 p-1.5 font-display text-sm tracking-[-0.03em] text-white sm:px-2 sm:py-1.5 sm:pr-3"
          >
            <IconWrap>
              <HomeIcon />
            </IconWrap>
            <span className="hidden sm:inline">{SITE_NAME}</span>
          </Link>
          <Link
            href="/"
            aria-label="Play"
            className={`items-center justify-center rounded-full p-1.5 transition ${
              overlay ? "hidden sm:inline-flex" : "inline-flex"
            } ${
              currentPath === "/" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-white"
            }`}
          >
            <IconWrap>
              <PlayIcon />
            </IconWrap>
          </Link>
          <Link
            href="/contribute"
            aria-label="Support"
            className={`items-center justify-center rounded-full p-1.5 transition ${
              overlay ? "hidden sm:inline-flex" : "inline-flex"
            } ${currentPath === "/contribute" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-white"}`}
          >
            <IconWrap>
              <SupportIcon />
            </IconWrap>
          </Link>
          {showLanguageSwitcher ? (
            <div className="flex items-center gap-1 rounded-full bg-white/55 p-1" aria-label="Choose letter layout">
              {LANGUAGE_PACKS.map((pack) => {
                const isActive = pack.id === languagePackId;

                return (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => onLanguageChange?.(pack.id)}
                    className="grid h-9 min-w-10 place-items-center rounded-full border px-1.5 transition hover:-translate-y-0.5 sm:min-w-12 sm:px-2"
                    style={{
                      background: isActive ? "#fff4d8" : "rgba(255,255,255,0.68)",
                      borderColor: isActive ? "#f4b678" : "rgba(255,255,255,0.88)",
                      boxShadow: isActive ? "0 8px 18px rgba(244,182,120,0.28)" : undefined
                    }}
                    aria-pressed={isActive}
                    aria-label={`Use ${pack.label}`}
                  >
                    <LanguagePackIcon languageId={pack.id} compact />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
