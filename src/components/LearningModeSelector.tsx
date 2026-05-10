import type { Palette } from "@/lib/constants";
import {
  LEARNING_MODE_OPTIONS,
  type LearningMode
} from "@/lib/learning-content";

type LearningModeSelectorProps = {
  learningMode: LearningMode;
  onChange: (learningMode: LearningMode) => void;
  palette: Palette;
};

function LettersIcon() {
  return (
    <span className="flex items-baseline gap-0.5 font-display leading-none" aria-hidden="true">
      <span className="text-[1.6rem] font-bold leading-none">A</span>
      <span className="text-[1.1rem] font-normal leading-none opacity-65">a</span>
    </span>
  );
}

function ComputerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <rect x="2" y="6" width="20" height="13" rx="2.5" />
      <line x1="6"  y1="10" x2="6.01"  y2="10" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="10" y1="10" x2="10.01" y2="10" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="14" y1="10" x2="14.01" y2="10" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="18" y1="10" x2="18.01" y2="10" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="5"  y1="14" x2="8"  y2="14" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="11" y1="14" x2="13" y2="14" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="16" y1="14" x2="19" y2="14" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="8"  y1="18" x2="16" y2="18" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function ColorsIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <circle cx="10" cy="14" r="7" fill="#FF9BAA" />
      <circle cx="22" cy="14" r="7" fill="#7DD3FC" />
      <circle cx="16" cy="22" r="7" fill="#86EFAC" />
    </svg>
  );
}

const MODE_ICONS: Record<LearningMode, React.ReactNode> = {
  letters: <LettersIcon />,
  computer: <ComputerIcon />,
  colors: <ColorsIcon />
};

export function LearningModeSelector({
  learningMode,
  onChange,
  palette
}: LearningModeSelectorProps) {
  return (
    <div className="space-y-2">
      <p
        className="text-xs font-extrabold uppercase tracking-[0.22em]"
        style={{ color: palette.detailText }}
      >
        Learning focus
      </p>

      <div className="grid grid-cols-3 gap-2">
        {LEARNING_MODE_OPTIONS.map((option) => {
          const isActive = option.id === learningMode;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`flex flex-col items-center gap-1.5 rounded-[1.15rem] border px-2 py-3 transition duration-150 ${
                isActive ? "scale-[1.02]" : "hover:-translate-y-0.5"
              }`}
              style={{
                background: isActive ? palette.activeKeySurface : palette.shell,
                borderColor: isActive ? palette.activeKeyBorder : palette.buttonBorder,
                color: isActive ? palette.activeKeyText : palette.buttonText,
                boxShadow: isActive ? `0 10px 22px ${palette.activeKeyGlow}` : undefined
              }}
              aria-pressed={isActive}
              aria-label={option.label}
            >
              {MODE_ICONS[option.id]}
              <span className="text-[11px] font-bold uppercase tracking-[0.1em]">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
