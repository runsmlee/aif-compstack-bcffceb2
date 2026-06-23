interface CoverageScoreProps {
  implemented: number;
  total: number;
}

export function CoverageScore({ implemented, total }: CoverageScoreProps) {
  const percentage = total > 0 ? Math.round((implemented / total) * 100) : 0;

  const level = percentage < 40 ? 'low' : percentage < 80 ? 'medium' : 'high';

  const config = {
    low: {
      text: 'text-brand-400',
      bar: 'bg-gradient-to-r from-brand-500 to-brand-400',
      bg: 'bg-brand-500/5',
      border: 'border-brand-500/20',
      label: 'Getting Started',
    },
    medium: {
      text: 'text-amber-400',
      bar: 'bg-gradient-to-r from-amber-500 to-amber-400',
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/20',
      label: 'In Progress',
    },
    high: {
      text: 'text-emerald-400',
      bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/20',
      label: 'Strong Coverage',
    },
  };

  const c = config[level];

  return (
    <div
      data-coverage-level={level}
      className={`rounded-xl border ${c.border} ${c.bg} p-5 shadow-card`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Coverage Score
        </span>
        <span className={`text-[11px] font-medium ${c.text} px-2 py-0.5 rounded-full ${c.bg} border ${c.border}`}>
          {c.label}
        </span>
      </div>

      {/* Big percentage */}
      <div className="flex items-baseline gap-1.5 mb-4">
        <span className={`text-4xl font-bold ${c.text} tabular-nums tracking-tight`}>
          {percentage}
        </span>
        <span className={`text-xl font-bold ${c.text}`}>
          %
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-neutral-800/80 overflow-hidden mb-3">
        <div
          className={`h-full ${c.bar} rounded-full transition-all duration-500 ease-out-expo`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Count */}
      <div className="text-xs text-neutral-500">
        <span className="text-neutral-400 font-medium tabular-nums">{implemented}</span>
        {' / '}
        <span className="tabular-nums">{total}</span>
        {' controls implemented'}
      </div>
    </div>
  );
}
