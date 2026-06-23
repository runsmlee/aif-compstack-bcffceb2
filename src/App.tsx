import { useEffect } from 'react';
import { FrameworkSelector } from './components/FrameworkSelector';
import { ControlCard } from './components/ControlCard';
import { CoverageScore } from './components/CoverageScore';
import { EvidenceExport } from './components/EvidenceExport';
import { useComplianceStack } from './hooks/useComplianceStack';
import { getFramework } from './data/complianceRegistry';

function trackEvent(event: string, props?: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && window.aif?.track) {
    window.aif.track(event, props);
  }
}

export default function App() {
  const stack = useComplianceStack();
  const framework = getFramework(stack.frameworkId);

  useEffect(() => {
    trackEvent('page_view', { path: window.location.pathname });
  }, []);

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
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-neutral-400 hover:text-brand-400 transition-colors px-3 py-2 -mr-2 rounded-md hover:bg-neutral-800/50"
          >
            Docs
          </a>
        </div>
      </header>

      {/* Hero / Main builder */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 relative z-10">
        {/* H1 + tagline */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-50 mb-2">
            Compliance Stack Builder
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl leading-relaxed">
            Pick a framework, toggle controls, and export audit-ready evidence. Real npm packages mapped to SOC 2, HIPAA, and GDPR requirements.
          </p>
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
        <div className="max-w-6xl mx-auto text-center text-xs text-neutral-600">
          CompStack — Compliance controls as installable developer dependencies
        </div>
      </footer>
    </div>
  );
}
