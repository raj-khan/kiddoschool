import { useState } from "react";

import type { Palette } from "@/lib/constants";
import {
  DEFAULT_KID_PROFILE,
  KID_AGE_OPTIONS,
  KID_PLAY_STYLE_OPTIONS,
  type KidAgeGroup,
  type KidPlayStyle,
  type KidProfile
} from "@/lib/kid-profile";

type KidProfileSheetProps = {
  isOpen: boolean;
  initialProfile: KidProfile | null;
  palette: Palette;
  canClose: boolean;
  onSave: (profile: KidProfile) => void;
  onClose: () => void;
};

function PrinceIcon() {
  return (
    <svg viewBox="0 0 64 80" fill="none" className="h-20 w-16" aria-hidden="true">
      {/* Crown */}
      <path d="M18 30 L14 14 L24 22 L32 10 L40 22 L50 14 L46 30 Z" fill="#F59E0B" />
      <rect x="16" y="28" width="32" height="6" rx="3" fill="#D97706" />
      {/* Head */}
      <circle cx="32" cy="43" r="13" fill="#FDDBA8" />
      {/* Hair */}
      <path d="M19 40 Q19 30 32 30 Q45 30 45 40" fill="#92400E" />
      {/* Eyes */}
      <circle cx="27" cy="42" r="2.2" fill="#1E293B" />
      <circle cx="37" cy="42" r="2.2" fill="#1E293B" />
      {/* Smile */}
      <path d="M27 49 Q32 54 37 49" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Body / tunic */}
      <path d="M20 58 L14 80 L50 80 L44 58 Q32 54 20 58 Z" fill="#3B82F6" />
      {/* Cape */}
      <path d="M20 58 L12 80 L26 73 L32 76 L38 73 L52 80 L44 58 Q32 54 20 58 Z" fill="#DC2626" opacity="0.82" />
      {/* Sword handle */}
      <rect x="47" y="54" width="3.5" height="18" rx="1.5" fill="#94A3B8" />
      <rect x="43" y="60" width="12" height="3" rx="1.5" fill="#F59E0B" />
      <circle cx="48.8" cy="54" r="2.5" fill="#F59E0B" />
    </svg>
  );
}

function PrincessIcon() {
  return (
    <svg viewBox="0 0 64 80" fill="none" className="h-20 w-16" aria-hidden="true">
      {/* Crown */}
      <path d="M20 28 L16 10 L26 20 L32 8 L38 20 L48 10 L44 28 Z" fill="#EC4899" />
      <circle cx="32" cy="10" r="3" fill="#FDE68A" />
      <circle cx="20" cy="15" r="2" fill="#A78BFA" />
      <circle cx="44" cy="15" r="2" fill="#A78BFA" />
      <rect x="18" y="26" width="28" height="5" rx="2.5" fill="#BE185D" />
      {/* Hair */}
      <path d="M19 44 Q18 30 32 29 Q46 30 45 44" fill="#F472B6" />
      <path d="M19 44 L16 62" stroke="#F472B6" strokeWidth="5" strokeLinecap="round" />
      <path d="M45 44 L48 62" stroke="#F472B6" strokeWidth="5" strokeLinecap="round" />
      {/* Head */}
      <circle cx="32" cy="42" r="13" fill="#FDDBA8" />
      {/* Eyes */}
      <circle cx="27" cy="41" r="2" fill="#1E293B" />
      <circle cx="37" cy="41" r="2" fill="#1E293B" />
      {/* Blush */}
      <ellipse cx="23" cy="46" rx="3.5" ry="2" fill="#FCA5A5" opacity="0.7" />
      <ellipse cx="41" cy="46" rx="3.5" ry="2" fill="#FCA5A5" opacity="0.7" />
      {/* Smile */}
      <path d="M27 48 Q32 53 37 48" stroke="#BE185D" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Dress */}
      <path d="M22 57 L12 80 L52 80 L42 57 Q32 53 22 57 Z" fill="#F9A8D4" />
      <path d="M25 57 L17 80 L47 80 L39 57 Q32 54 25 57 Z" fill="#FBCFE8" />
      {/* Wand */}
      <line x1="50" y1="56" x2="58" y2="46" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M58 43 L60 47 L56 48 L54 44 L57 41 Z" fill="#FDE68A" />
      <circle cx="57" cy="44" r="3" fill="#FDE68A" opacity="0.7" />
    </svg>
  );
}

const AGE_ICONS: Record<string, React.ReactNode> = {
  "2-4": (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 shrink-0" aria-hidden="true">
      <circle cx="12" cy="8" r="4.5" fill="currentColor" opacity="0.9" />
      <path d="M6 20 Q6 15 12 15 Q18 15 18 20" fill="currentColor" opacity="0.7" />
      {/* tiny star above */}
      <path d="M12 1 L12.6 2.8 L14.5 2.8 L13 3.9 L13.5 5.7 L12 4.6 L10.5 5.7 L11 3.9 L9.5 2.8 L11.4 2.8 Z" fill="#F59E0B" />
    </svg>
  ),
  "5-7": (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 shrink-0" aria-hidden="true">
      <circle cx="12" cy="7.5" r="5" fill="currentColor" opacity="0.9" />
      <path d="M5 21 Q5 14.5 12 14.5 Q19 14.5 19 21" fill="currentColor" opacity="0.7" />
    </svg>
  ),
  "8+": (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 shrink-0" aria-hidden="true">
      <circle cx="12" cy="7" r="5.5" fill="currentColor" opacity="0.9" />
      <path d="M4 22 Q4 14 12 14 Q20 14 20 22" fill="currentColor" opacity="0.7" />
      {/* graduate cap */}
      <path d="M8 6.5 L12 4.5 L16 6.5 L12 8.5 Z" fill="white" opacity="0.85" />
      <rect x="14.5" y="6.5" width="1" height="3" fill="white" opacity="0.85" />
    </svg>
  )
};

const PLAY_STYLE_ICONS: Record<string, React.ReactNode> = {
  adventure: <PrinceIcon />,
  storybook: <PrincessIcon />
};

export function KidProfileSheet({
  isOpen,
  initialProfile,
  palette,
  canClose,
  onSave,
  onClose
}: KidProfileSheetProps) {
  const [ageGroup, setAgeGroup] = useState<KidAgeGroup>(initialProfile?.ageGroup ?? DEFAULT_KID_PROFILE.ageGroup);
  const [playStyle, setPlayStyle] = useState<KidPlayStyle>(
    initialProfile?.playStyle ?? DEFAULT_KID_PROFILE.playStyle
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/28 backdrop-blur-[3px]">
      <div className="absolute inset-x-3 bottom-3 top-8 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-6 sm:w-[min(94vw,32rem)]">
        <section
          className="flex h-full flex-col overflow-hidden rounded-[2.2rem] border shadow-[0_30px_90px_rgba(15,35,57,0.26)] backdrop-blur-xl"
          style={{
            background: palette.shell,
            borderColor: palette.shellBorder
          }}
        >
          <div
            className="shrink-0 border-b px-5 pb-4 pt-3 sm:px-6 sm:pb-5 sm:pt-5"
            style={{ borderColor: palette.shellBorder }}
          >
            <div
              className="mx-auto mb-3 h-1.5 w-16 rounded-full sm:hidden"
              style={{ background: palette.buttonBorder }}
              aria-hidden="true"
            />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-[clamp(2rem,6vw,2.7rem)] tracking-[-0.05em]" style={{ color: palette.keyText }}>
                  Tell us about your little learner
                </p>
                <p className="mt-2 max-w-xl text-sm font-bold leading-6" style={{ color: palette.detailText }}>
                  We can start with calmer defaults for younger kids and a more playful style the child will enjoy.
                </p>
              </div>
              {canClose ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border text-xl font-bold transition hover:-translate-y-0.5"
                  style={{
                    background: palette.buttonSurface,
                    borderColor: palette.buttonBorder,
                    color: palette.buttonText
                  }}
                  aria-label="Close child profile"
                >
                  ×
                </button>
              ) : null}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-4 sm:px-6">
            <div className="space-y-5">
              {/* Age group */}
              <section
                className="rounded-[1.6rem] border p-4"
                style={{
                  background: palette.buttonSurface,
                  borderColor: palette.buttonBorder
                }}
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: palette.detailText }}>
                  How old?
                </p>

                <div className="mt-3 grid gap-2">
                  {KID_AGE_OPTIONS.map((option) => {
                    const isActive = option.id === ageGroup;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setAgeGroup(option.id)}
                        className={`flex items-center gap-3 rounded-[1.15rem] border px-3 py-2.5 text-left transition ${
                          isActive ? "scale-[1.01]" : "hover:-translate-y-0.5"
                        }`}
                        style={{
                          background: isActive ? palette.activeKeySurface : palette.shell,
                          borderColor: isActive ? palette.activeKeyBorder : palette.buttonBorder,
                          color: isActive ? palette.activeKeyText : palette.buttonText,
                          boxShadow: isActive ? `0 10px 22px ${palette.activeKeyGlow}` : undefined
                        }}
                        aria-pressed={isActive}
                      >
                        {AGE_ICONS[option.id]}
                        <div>
                          <p className="font-display text-xl tracking-[-0.03em]">{option.label}</p>
                          <p className="text-xs font-bold leading-5 opacity-75">{option.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Play style */}
              <section
                className="rounded-[1.6rem] border p-4"
                style={{
                  background: palette.buttonSurface,
                  borderColor: palette.buttonBorder
                }}
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: palette.detailText }}>
                  Play style
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {KID_PLAY_STYLE_OPTIONS.map((option) => {
                    const isActive = option.id === playStyle;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setPlayStyle(option.id)}
                        className={`flex flex-col items-center rounded-[1.3rem] border px-3 pb-4 pt-3 text-center transition ${
                          isActive ? "scale-[1.02]" : "hover:-translate-y-0.5"
                        }`}
                        style={{
                          background: isActive ? palette.activeKeySurface : palette.shell,
                          borderColor: isActive ? palette.activeKeyBorder : palette.buttonBorder,
                          color: isActive ? palette.activeKeyText : palette.buttonText,
                          boxShadow: isActive ? `0 14px 26px ${palette.activeKeyGlow}` : undefined
                        }}
                        aria-pressed={isActive}
                      >
                        {PLAY_STYLE_ICONS[option.id]}
                        <p className="mt-2 font-display text-xl tracking-[-0.03em]">{option.label}</p>
                        <p className="mt-0.5 text-xs font-bold leading-5 opacity-75">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Privacy note */}
              <section
                className="rounded-[1.6rem] border p-4"
                style={{
                  background: palette.historySurface,
                  borderColor: palette.buttonBorder
                }}
              >
                <p className="font-display text-lg tracking-[-0.03em]" style={{ color: palette.keyText }}>
                  Privacy note
                </p>
                <p className="mt-1.5 text-sm font-bold leading-6" style={{ color: palette.detailText }}>
                  We only remember this on this device so the app can open the same way next time. Nothing is sent,
                  shared, or stored online.
                </p>
              </section>
            </div>
          </div>

          <div
            className="shrink-0 border-t px-5 pb-5 pt-4 sm:px-6"
            style={{ borderColor: palette.shellBorder }}
          >
            <button
              type="button"
              onClick={() => onSave({ ageGroup, playStyle })}
              className="w-full rounded-full border px-5 py-3 text-sm font-extrabold uppercase tracking-[0.18em] transition hover:-translate-y-0.5"
              style={{
                background: palette.activeKeySurface,
                borderColor: palette.activeKeyBorder,
                color: palette.activeKeyText,
                boxShadow: `0 14px 26px ${palette.activeKeyGlow}`
              }}
            >
              {canClose ? "Save child setup" : "Start playing"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
