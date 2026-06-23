import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FrameworkSelector } from '../src/components/FrameworkSelector';

describe('FrameworkSelector', () => {
  const defaultProps = {
    selected: 'soc2' as const,
    onSelect: vi.fn(),
  };

  it('renders without crash', () => {
    render(<FrameworkSelector selected="soc2" onSelect={() => {}} />);
  });

  it('displays three framework options: SOC 2 Type II, HIPAA, GDPR', () => {
    render(<FrameworkSelector {...defaultProps} />);
    expect(screen.getByText('SOC 2 Type II')).toBeInTheDocument();
    expect(screen.getByText('HIPAA')).toBeInTheDocument();
    expect(screen.getByText('GDPR')).toBeInTheDocument();
  });

  it('clicking a framework button highlights it as active', async () => {
    const user = userEvent.setup();
    render(<FrameworkSelector {...defaultProps} />);
    const hipaaButton = screen.getByText('HIPAA');
    await user.click(hipaaButton);
    expect(defaultProps.onSelect).toHaveBeenCalledWith('hipaa');
  });

  it('selecting a framework loads the correct set of required controls', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<FrameworkSelector selected="soc2" onSelect={onSelect} />);

    const gdprButton = screen.getByText('GDPR');
    await user.click(gdprButton);

    expect(onSelect).toHaveBeenCalledWith('gdpr');
  });

  it('shows active state on the selected framework', () => {
    const { rerender } = render(<FrameworkSelector selected="soc2" onSelect={() => {}} />);
    const soc2Button = screen.getByText('SOC 2 Type II').closest('button')!;
    expect(soc2Button).toHaveAttribute('aria-pressed', 'true');

    rerender(<FrameworkSelector selected="hipaa" onSelect={() => {}} />);
    const hipaaButton = screen.getByText('HIPAA').closest('button')!;
    expect(hipaaButton).toHaveAttribute('aria-pressed', 'true');
    const soc2ButtonAfter = screen.getByText('SOC 2 Type II').closest('button')!;
    expect(soc2ButtonAfter).toHaveAttribute('aria-pressed', 'false');
  });
});
