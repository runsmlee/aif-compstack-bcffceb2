import { useEffect, useState, useCallback } from 'react';
import { FrameworkSelector } from './components/FrameworkSelector';
import { ControlCard } from './components/ControlCard';
import { CoverageScore } from './components/CoverageScore';
import { EvidenceExport } from './components/EvidenceExport';
import { useComplianceStack } from './hooks/useComplianceStack';
import { getFramework } from './data/complianceRegistry';
import type { FrameworkId } from './types';

function trackEvent(event: string, props?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && window.aif?.track) {
    window.aif.track(event, props);
  }
}

const FRAMEWORK_FLAGS: Record<FrameworkId, string> = {
  soc2: '--framework=soc2',
  hipaa: '--framework=hipaa',
  gdpr: '--framework=gdpr',
};

export default function App() {
  const stack = useComplianceStack();
  const framework = getFramework(stack.frameworkId);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    trackEvent('page_view', { path: window.location.pathname });
  }, []);

  const initCommand = `npx compstack init ${FRAMEWORK_FLAGS[stack.frameworkId]}`;

  const handleCopyInit = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(initCommand).catch(() => {});
    }
    setCopied(true);
    trackEvent('install_command_copied', { command: initCommand });
    setTimeout(() => setCopied(false), 2000);
  }, [initCommand]);

  return (
    <div className="min-h-screen bg-neutral-950 relative">
      {/* Header bar */}
      <header className="sticky top-0 z-50 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-lg px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-b from-brand-500 to-brand-600 flex items-center justify-center shadow-glow-brand">
              <span className="text-white text-xs font-bold font-mono">CS</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">CompStack</span>
            <span className="text-neutral-600 text-xs font-mono ml-1">v0.1.0</span>
          </div>
          <span className="text-xs font-mono text-neutral-600">
            $50K consulting → 60 seconds
          </span>
        </div>
      </header>

      {/* Hero / Main builder */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-10">
        {/* README-style hero: install command first */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-50 mb-2 font-mono">
            CompStack
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed mb-4">
            SOC 2, HIPAA, and GDPR compliance controls as installable npm packages. No consultants, no 6-month engagements.
          </p>

          {/* Copyable install command — the hero CTA */}
          <div className="flex items-center gap-2 max-w-xl">
            <div className="flex-1 flex items-center gap-1 font-mono text-sm px-3 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 overflow-x-auto">
              <span className="text-neutral-600 select-none">$</span>
              <code className="text-brand-400 whitespace-nowrap" data-testid="init-command">
                {initCommand}
              </code>
            </div>
            <button
              type="button"
              aria-label="Copy install command"
              onClick={handleCopyInit}
              className="shrink-0 px-3 py-2.5 rounded-lg text-sm font-medium bg-brand-500 text-white hover:bg-brand-600 transition-all duration-200 active:scale-95 shadow-glow-brand min-w-[72px] text-center"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Before/after contrast */}
          <div className="flex items-center gap-3 mt-3 text-xs font-mono">
            <span className="text-neutral-500 line-through decoration-neutral-700">
              $50,000 audit consultant · 3–6 months
            </span>
            <span className="text-neutral-600">→</span>
            <span className="text-brand-400">
              npm install · 60 seconds · export evidence
            </span>
          </div>
        </div>

        {/* Builder layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left: Framework + Controls */}
          <div className="space-y-5">
            {/* Framework selector */}
            <div className="animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <label className="section-label">
                  Framework
                </label>
                <span className="text-xs text-neutral-500 font-mono">
                  {stack.controls.length} controls
                </span>
              </div>
              <FrameworkSelector
                selected={stack.frameworkId}
                onSelect={stack.selectFramework}
              />
              <p className="text-sm text-neutral-500 mt-3 leading-relaxed">{framework.description}</p>
            </div>

            {/* Control cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stack.controls.map((control) => (
                <ControlCard
                  key={control.id}
                  control={control}
                  implemented={stack.isControlImplemented(control.id)}
                  onToggle={stack.toggleControl}
                  onCopyInstall={stack.copyInstallCommand}
                />
              ))}
            </div>
          </div>

          {/* Right: Coverage + Export */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <CoverageScore
              implemented={stack.implementedCount}
              total={stack.totalCount}
            />

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 shadow-card">
              <h2 className="section-label mb-3">
                Evidence Artifact
              </h2>
              <EvidenceExport
                implementedControls={stack.implementedControls}
                frameworkName={framework.fullName}
              />
              {stack.implementedCount > 0 ? (
                <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                  Export a markdown report of your {stack.implementedCount} implemented{' '}
                  {stack.implementedCount === 1 ? 'control' : 'controls'}.
                </p>
              ) : (
                <p className="text-xs text-neutral-600 mt-3 leading-relaxed">
                  Mark controls as implemented to enable evidence export.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 px-4 sm:px-6 py-6 mt-12 relative z-10">
        <div className="max-w-6xl mx-auto text-center text-xs text-neutral-600 font-mono">
          npx compstack init --framework=soc2
        </div>
      </footer>
    </div>
  );
}
