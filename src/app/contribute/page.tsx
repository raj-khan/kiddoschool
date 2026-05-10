import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contribute | Nuha Keyboard",
  description: "Help Nuha Keyboard grow through funding, code, testing, and sharing."
};

const REPO_URL = "https://github.com/raj-khan/pre-school-keyboard";

export default function ContributePage() {
  return (
    <main className="min-h-[100svh] bg-[linear-gradient(145deg,#fff7ef_0%,#ffd6b5_38%,#bfe6ff_100%)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-[2.6rem] border border-white/80 bg-white/72 p-6 shadow-[0_24px_80px_rgba(255,255,255,0.24)] backdrop-blur-xl sm:p-8 lg:p-10">
          <p className="font-display text-lg uppercase tracking-[0.28em] text-slate-700">Contribute</p>
          <h1 className="mt-4 max-w-4xl font-display text-[clamp(3rem,8vw,6rem)] leading-[0.9] tracking-[-0.08em] text-slate-900">
            Help more kids love letters in a way school often misses.
          </h1>
          <p className="mt-5 max-w-2xl text-base font-bold leading-7 text-slate-700 sm:text-lg">
            Nuha Keyboard is trying to make keyboard learning playful, visual, and supportive for young children.
            The next big step is replacing robotic speech with real open-source kid voice packs, starting with English.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-extrabold uppercase tracking-[0.18em] text-slate-900 transition hover:-translate-y-0.5"
            >
              Back to play
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-900 bg-slate-900 px-5 py-3 text-sm font-extrabold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5"
            >
              Open GitHub repo
            </a>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-[2rem] border border-white/80 bg-white/72 p-6 backdrop-blur-xl">
            <p className="font-display text-3xl tracking-[-0.05em] text-slate-900">Fund voice packs</p>
            <p className="mt-3 text-sm font-bold leading-7 text-slate-700">
              Financial support can help with voice recording, editing, cleanup, file preparation, and reviewing each
              sound for kids.
            </p>
            <ul className="mt-5 space-y-2 text-sm font-bold leading-6 text-slate-700">
              <li>Support future real kid voice files for English first.</li>
              <li>Help maintain audio quality across many keys and languages.</li>
              <li>Make later Arabic, Bengali, and community packs easier to ship.</li>
            </ul>
          </article>

          <article className="rounded-[2rem] border border-white/80 bg-white/72 p-6 backdrop-blur-xl">
            <p className="font-display text-3xl tracking-[-0.05em] text-slate-900">Build and test</p>
            <p className="mt-3 text-sm font-bold leading-7 text-slate-700">
              Developers can add language packs, improve the virtual keyboard, build parent tools, and refine the
              learning experience.
            </p>
            <ul className="mt-5 space-y-2 text-sm font-bold leading-6 text-slate-700">
              <li>Add new keyboard layouts and speech mappings.</li>
              <li>Improve animations and accessibility.</li>
              <li>Help build future weak-letter practice modes for parents.</li>
            </ul>
          </article>

          <article className="rounded-[2rem] border border-white/80 bg-white/72 p-6 backdrop-blur-xl">
            <p className="font-display text-3xl tracking-[-0.05em] text-slate-900">Share and support</p>
            <p className="mt-3 text-sm font-bold leading-7 text-slate-700">
              Not everyone has to code. Parents, teachers, friends, and creators can help this project reach the right
              families.
            </p>
            <ul className="mt-5 space-y-2 text-sm font-bold leading-6 text-slate-700">
              <li>Share it on social media and in parent communities.</li>
              <li>Send it to teachers who want softer learning tools.</li>
              <li>Collect feedback from real kids using the keyboard.</li>
            </ul>
          </article>
        </section>

        <section className="rounded-[2.2rem] border border-white/80 bg-white/72 p-6 backdrop-blur-xl sm:p-8">
          <p className="font-display text-4xl tracking-[-0.05em] text-slate-900">What support unlocks next</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.6rem] bg-white/72 p-5">
              <p className="font-display text-2xl tracking-[-0.04em] text-slate-900">Real English kid voice</p>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                Replace the default robotic speech with warmer open-source recordings.
              </p>
            </div>
            <div className="rounded-[1.6rem] bg-white/72 p-5">
              <p className="font-display text-2xl tracking-[-0.04em] text-slate-900">Weak-letter practice</p>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                Let parents show all keys or only the letters their child needs more time with.
              </p>
            </div>
            <div className="rounded-[1.6rem] bg-white/72 p-5">
              <p className="font-display text-2xl tracking-[-0.04em] text-slate-900">More community packs</p>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                Grow the keyboard into more languages without changing the core play loop.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
