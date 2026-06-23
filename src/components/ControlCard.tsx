import type { ComplianceControl } from '../types';

interface ControlCardProps {
  control: ComplianceControl;
  implemented: boolean;
  onToggle: (controlId: string) => void;
  onCopyInstall: (command: string) => void;
}

export function ControlCard({
  control,
  implemented,
  onToggle,
  onCopyInstall,
}: ControlCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 card-hover shadow-card ${
        implemented
          ? 'border-emerald-600/40 bg-emerald-950/10'
          : 'border-neutral-800 bg-neutral-900/50'
      }`}
      data-testid={`control-card-${control.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-semibold text-neutral-100 leading-snug">{control.name}</h3>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-neutral-800/80 text-brand-400 border border-neutral-700/50">
              {control.citation}
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">{control.description}</p>
        </div>
        {implemented && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-600/30 shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Implemented
          </span>
        )}
      </div>

      {/* Package name */}
      <div className="text-[11px] text-neutral-500 mb-2.5 flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
        <span className="font-mono text-brand-400">{control.packageName}</span>
      </div>

      {/* Install command */}
      <div className="flex items-center gap-2 mb-2.5">
        <code className="flex-1 text-xs font-mono px-3 py-2 rounded-md bg-neutral-950 border border-neutral-800 text-neutral-300 overflow-x-auto whitespace-nowrap">
          {control.installCommand}
        </code>
        <button
          type="button"
          aria-label="Copy install command"
          onClick={() => onCopyInstall(control.installCommand)}
          className="shrink-0 p-2 rounded-md text-neutral-400 hover:text-brand-400 hover:bg-neutral-800 transition-all duration-200 hover:scale-105 active:scale-95"
          title="Copy install command"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>

      {/* Config snippet */}
      <pre className="text-xs font-mono px-3 py-2.5 rounded-md bg-neutral-950 border border-neutral-800 text-neutral-300 overflow-x-auto mb-3.5">
        <code>{control.configSnippet}</code>
      </pre>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => onToggle(control.id)}
        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
          implemented
            ? 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700/80 border border-neutral-700/50'
            : 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm hover:shadow-glow-brand'
        }`}
      >
        {implemented ? 'Unmark as Implemented' : 'Mark as Implemented'}
      </button>
    </div>
  );
}
