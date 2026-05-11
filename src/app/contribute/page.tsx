import type { Metadata } from "next";
import Link from "next/link";

import { ShareActions } from "@/components/ShareActions";
import { SiteNav } from "@/components/SiteNav";
import {
  REPO_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL
} from "@/lib/site";

export const metadata: Metadata = {
  title: `Contribute | ${SITE_NAME}`,
  description: `${SITE_DESCRIPTION} Open source and browser-only — contribute code or share with families.`,
  keywords: [
    "kids keyboard learning",
    "early learning app",
    "alphabet for kids",
    "letters colors numbers",
    "open source education",
    "family learning tool",
    "Arabic letters for kids",
    "Bengali alphabet",
    "preschool keyboard"
  ],
  openGraph: {
    type: "website",
    title: `Contribute | ${SITE_NAME}`,
    description: `${SITE_DESCRIPTION} Open source — contribute code or share with families.`,
    url: `${SITE_URL}/contribute`,
    siteName: SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — letters, colors, numbers, and early keyboard play`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `Contribute | ${SITE_NAME}`,
    description: `${SITE_DESCRIPTION} Open source — contribute code or share with families.`,
    images: ["/opengraph-image"]
  }
};

const SHARE_TEXT =
  `${SITE_NAME} — a free, browser-only learning app for kids. Letters, numbers, colors, and gentle keyboard play. No sign-up needed.`;

export default function ContributePage() {
  return (
    <main className="min-h-[100svh] bg-[linear-gradient(155deg,#fff7ef_0%,#ffe8d0_30%,#d6f1ff_72%,#f2ffe7_100%)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-2xl space-y-5">
        <SiteNav currentPath="/contribute" />

        <header className="overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/72 p-6 backdrop-blur-xl sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-slate-500">
            {SITE_NAME}
          </p>
          <h1 className="mt-2 font-display text-[clamp(2.4rem,7vw,4rem)] leading-[0.95] tracking-[-0.06em] text-slate-900">
            A learning tool built for families.
          </h1>
          <p className="mt-3 max-w-prose text-base font-bold leading-7 text-slate-600">
            {SITE_DESCRIPTION}
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
            Browser-only · Open source · No sign-up · No tracking
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-extrabold uppercase tracking-[0.18em] text-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5"
          >
            Back to play
          </Link>
        </header>

        <section className="overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/72 p-6 backdrop-blur-xl sm:p-8">
          <p className="font-display text-3xl tracking-[-0.05em] text-slate-900">
            Contribute on GitHub
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
            Code, bug reports, language packs, voice recordings, or feedback — all welcome.
          </p>
          <div className="mt-5">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-extrabold uppercase tracking-[0.18em] text-white shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Open GitHub repo
            </a>
          </div>
        </section>

        <section className="overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/72 p-6 backdrop-blur-xl sm:p-8">
          <p className="font-display text-3xl tracking-[-0.05em] text-slate-900">
            Share with others
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
            The fastest way to help is to share with a parent, teacher, or family group.
          </p>
          <div className="mt-5">
            <ShareActions
              title={SITE_NAME}
              text={SHARE_TEXT}
              url={SITE_URL}
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/72 p-6 backdrop-blur-xl sm:p-8">
          <p className="font-display text-3xl tracking-[-0.05em] text-slate-900">
            Resource credits
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
            Arabic princess voice audio is credited to{" "}
            <a
              href="https://namaj.info/arabic-alphabets-with-mp3-audio-with-bangla-pronunciation/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-900 underline decoration-slate-300 underline-offset-4"
            >
              namaj.info
            </a>
            . If you are the rightful owner and would like it removed, share feedback through GitHub and we will remove it promptly.
          </p>
        </section>
      </div>
    </main>
  );
}
