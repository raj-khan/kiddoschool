import Link from "next/link";

import { LanguagePackIcon } from "@/components/LanguagePackIcon";
import { LANGUAGE_PACKS, type LanguagePackId } from "@/lib/language-packs";
import { REPO_URL, SITE_NAME } from "@/lib/site";

type SiteNavProps = {
  currentPath: "/" | "/contribute";
  overlay?: boolean;
  languagePackId?: LanguagePackId;
  onLanguageChange?: (languageId: LanguagePackId) => void;
};

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
      <div className="max-w-[calc(100vw-6.5rem)] rounded-[1.5rem] border border-white/80 bg-white/78 px-3 py-2 shadow-[0_18px_55px_rgba(255,255,255,0.24)] backdrop-blur-xl sm:max-w-none sm:rounded-full">
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
              overlay ? "hidden sm:block" : ""
            } ${
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
          {showLanguageSwitcher ? (
            <div className="hidden items-center gap-1 rounded-full bg-white/55 p-1 sm:flex" aria-label="Choose letter layout">
              {LANGUAGE_PACKS.map((pack) => {
                const isActive = pack.id === languagePackId;

                return (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => onLanguageChange?.(pack.id)}
                    className="grid h-9 min-w-12 place-items-center rounded-full border px-2 transition hover:-translate-y-0.5"
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
        {showLanguageSwitcher ? (
          <div className="mt-2 grid grid-cols-4 gap-1.5 sm:hidden" aria-label="Choose letter layout">
            {LANGUAGE_PACKS.map((pack) => {
              const isActive = pack.id === languagePackId;

              return (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => onLanguageChange?.(pack.id)}
                  className={`grid h-10 min-w-0 place-items-center rounded-full border transition ${
                    isActive ? "scale-[1.03]" : "hover:-translate-y-0.5"
                  }`}
                  style={{
                    background: isActive ? "#fff4d8" : "rgba(255,255,255,0.7)",
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
    </nav>
  );
}
