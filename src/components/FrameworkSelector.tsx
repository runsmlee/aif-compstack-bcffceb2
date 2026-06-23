import { FRAMEWORKS } from '../data/complianceRegistry';
import type { FrameworkId } from '../types';

interface FrameworkSelectorProps {
  selected: FrameworkId;
  onSelect: (frameworkId: FrameworkId) => void;
}

export function FrameworkSelector({ selected, onSelect }: FrameworkSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Select compliance framework"
      className="inline-flex flex-wrap gap-1 p-1 rounded-xl bg-neutral-900/50 border border-neutral-800"
    >
      {FRAMEWORKS.map((fw) => {
        const isActive = selected === fw.id;
        return (
          <button
            key={fw.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(fw.id)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
              isActive
                ? 'bg-brand-500 text-white shadow-glow-brand'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
            }`}
          >
            {fw.name}
          </button>
        );
      })}
    </div>
  );
}
