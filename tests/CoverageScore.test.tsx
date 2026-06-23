import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CoverageScore } from '../src/components/CoverageScore';

describe('CoverageScore', () => {
  it('renders without crash', () => {
    render(<CoverageScore implemented={0} total={10} />);
  });

  it('displays 0% when no controls are implemented', () => {
    render(<CoverageScore implemented={0} total={10} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('updates percentage when controls are toggled', () => {
    const { rerender } = render(<CoverageScore implemented={0} total={10} />);
    expect(screen.getByText('0%')).toBeInTheDocument();

    rerender(<CoverageScore implemented={5} total={10} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('displays correct percentage: (implemented / total required) * 100', () => {
    render(<CoverageScore implemented={3} total={7} />);
    // 3/7 * 100 = 42.857... → 43
    expect(screen.getByText('43%')).toBeInTheDocument();
  });

  it('shows color change: red < 40%, amber 40-79%, green ≥ 80%', () => {
    const { rerender } = render(<CoverageScore implemented={1} total={10} />);
    // 10% - red
    const scoreContainer = screen.getByText('10%').closest('[data-coverage-level]')!;
    expect(scoreContainer).toHaveAttribute('data-coverage-level', 'low');

    rerender(<CoverageScore implemented={5} total={10} />);
    // 50% - amber
    const amberContainer = screen.getByText('50%').closest('[data-coverage-level]')!;
    expect(amberContainer).toHaveAttribute('data-coverage-level', 'medium');

    rerender(<CoverageScore implemented={9} total={10} />);
    // 90% - green
    const greenContainer = screen.getByText('90%').closest('[data-coverage-level]')!;
    expect(greenContainer).toHaveAttribute('data-coverage-level', 'high');
  });
});
