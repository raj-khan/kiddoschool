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

export function LearningModeSelector({
  learningMode,
  onChange,
  palette
}: LearningModeSelectorProps) {
  return (
    <section
      className="rounded-[1.6rem] border p-4"
      style={{
        background: palette.buttonSurface,
        borderColor: palette.buttonBorder
      }}
    >
      <div>
        <p className="font-display text-2xl tracking-[-0.04em]" style={{ color: palette.keyText }}>
          Learning focus
        </p>
        <p className="mt-1 text-sm font-bold leading-6" style={{ color: palette.detailText }}>
          Choose what the child should practice right now.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {LEARNING_MODE_OPTIONS.map((option) => {
          const isActive = option.id === learningMode;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`rounded-[1.3rem] border px-4 py-3 text-left transition ${isActive ? "scale-[1.01]" : "hover:-translate-y-0.5"}`}
              style={{
                background: isActive ? palette.activeKeySurface : palette.shell,
                borderColor: isActive ? palette.activeKeyBorder : palette.buttonBorder,
                color: isActive ? palette.activeKeyText : palette.buttonText,
                boxShadow: isActive ? `0 14px 26px ${palette.activeKeyGlow}` : undefined
              }}
              aria-pressed={isActive}
            >
              <p className="font-display text-2xl tracking-[-0.04em]">{option.label}</p>
              <p className="mt-1 text-xs font-bold leading-5 opacity-85">{option.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
