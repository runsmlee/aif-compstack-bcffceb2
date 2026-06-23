import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ControlCard } from '../src/components/ControlCard';
import type { ComplianceControl } from '../src/types';

const mockControl: ComplianceControl = {
  id: 'soc2-audit-log',
  frameworkId: 'soc2',
  name: 'Audit Logging',
  citation: 'CC6.1',
  packageName: '@compstack/audit-log',
  installCommand: 'npm install @compstack/audit-log',
  description: 'Tamper-evident audit logging.',
  configSnippet: `import { AuditLog } from '@compstack/audit-log';
const audit = new AuditLog();`,
  category: 'Monitoring',
};

describe('ControlCard', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders without crash', () => {
    render(
      <ControlCard
        control={mockControl}
        implemented={false}
        onToggle={() => {}}
        onCopyInstall={() => {}}
      />,
    );
  });

  it('displays npm package name and install command', () => {
    render(
      <ControlCard
        control={mockControl}
        implemented={false}
        onToggle={() => {}}
        onCopyInstall={() => {}}
      />,
    );
    expect(screen.getByText('@compstack/audit-log')).toBeInTheDocument();
    expect(screen.getByText(/npm install @compstack\/audit-log/)).toBeInTheDocument();
  });

  it('displays framework reference citation (e.g., "CC6.1")', () => {
    render(
      <ControlCard
        control={mockControl}
        implemented={false}
        onToggle={() => {}}
        onCopyInstall={() => {}}
      />,
    );
    expect(screen.getByText('CC6.1')).toBeInTheDocument();
  });

  it('shows configuration code snippet by default', () => {
    render(
      <ControlCard
        control={mockControl}
        implemented={false}
        onToggle={() => {}}
        onCopyInstall={() => {}}
      />,
    );
    expect(screen.getByText(/import.*AuditLog.*from/)).toBeInTheDocument();
  });

  it('clicking the implement toggle switches status to "implemented"', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <ControlCard
        control={mockControl}
        implemented={false}
        onToggle={onToggle}
        onCopyInstall={() => {}}
      />,
    );

    const toggleButton = screen.getByRole('button', { name: /implement/i });
    await user.click(toggleButton);
    expect(onToggle).toHaveBeenCalledWith(mockControl.id);
  });

  it('clicking copy button copies the install command to clipboard', async () => {
    const user = userEvent.setup();
    const onCopyInstall = vi.fn();
    render(
      <ControlCard
        control={mockControl}
        implemented={false}
        onToggle={() => {}}
        onCopyInstall={onCopyInstall}
      />,
    );

    const copyButton = screen.getByRole('button', { name: /copy/i });
    await user.click(copyButton);
    expect(onCopyInstall).toHaveBeenCalledWith('npm install @compstack/audit-log');
  });

  it('shows "Implemented" badge when toggled on', () => {
    render(
      <ControlCard
        control={mockControl}
        implemented={true}
        onToggle={() => {}}
        onCopyInstall={() => {}}
      />,
    );
    // The badge specifically says "Implemented" (not the toggle button which says "Unmark as Implemented")
    const badge = screen.getByText('Implemented');
    expect(badge).toBeInTheDocument();
    expect(badge.tagName).toBe('SPAN');
  });
});
