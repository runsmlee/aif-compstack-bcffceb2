import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EvidenceExport } from '../src/components/EvidenceExport';
import type { ComplianceControl } from '../src/types';

const mockControls: ComplianceControl[] = [
  {
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
  },
  {
    id: 'soc2-encryption-rest',
    frameworkId: 'soc2',
    name: 'Encryption at Rest',
    citation: 'CC6.1',
    packageName: '@compstack/encryption-rest',
    installCommand: 'npm install @compstack/encryption-rest',
    description: 'AES-256 encryption.',
    configSnippet: `import { Encryption } from '@compstack/encryption-rest';
const enc = new Encryption();`,
    category: 'Encryption',
  },
];

describe('EvidenceExport', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crash', () => {
    render(<EvidenceExport implementedControls={[]} frameworkName="SOC 2 Type II" />);
  });

  it('"Export Evidence" button is disabled when no controls are implemented', () => {
    render(<EvidenceExport implementedControls={[]} frameworkName="SOC 2 Type II" />);
    const button = screen.getByRole('button', { name: /export evidence/i });
    expect(button).toBeDisabled();
  });

  it('button enables when at least one control is implemented', () => {
    render(
      <EvidenceExport implementedControls={mockControls} frameworkName="SOC 2 Type II" />,
    );
    const button = screen.getByRole('button', { name: /export evidence/i });
    expect(button).not.toBeDisabled();
  });

  it('clicking export generates a markdown blob with control data', async () => {
    const user = userEvent.setup();
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:test-url');
    const mockRevokeObjectURL = vi.fn();

    vi.stubGlobal('URL', {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    });

    // Mock createElement to return elements with click spy
    const originalCreateElement = document.createElement.bind(document);
    const mockClick = vi.fn();
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') {
        el.click = mockClick;
      }
      return el;
    });

    render(
      <EvidenceExport implementedControls={mockControls} frameworkName="SOC 2 Type II" />,
    );

    const button = screen.getByRole('button', { name: /export evidence/i });
    await user.click(button);

    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    const blobArg = mockCreateObjectURL.mock.calls[0][0] as Blob;
    expect(blobArg).toBeInstanceOf(Blob);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('exported markdown contains framework name, control citations, and package names', async () => {
    const user = userEvent.setup();
    let capturedBlob: Blob | null = null;
    const mockCreateObjectURL = vi.fn().mockImplementation((blob: Blob) => {
      capturedBlob = blob;
      return 'blob:test-url';
    });
    const mockRevokeObjectURL = vi.fn();

    vi.stubGlobal('URL', {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    });

    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === 'a') {
        el.click = vi.fn();
      }
      return el;
    });

    render(
      <EvidenceExport implementedControls={mockControls} frameworkName="SOC 2 Type II" />,
    );

    const button = screen.getByRole('button', { name: /export evidence/i });
    await user.click(button);

    expect(capturedBlob).not.toBeNull();
    const text = await capturedBlob!.text();

    expect(text).toContain('SOC 2 Type II');
    expect(text).toContain('CC6.1');
    expect(text).toContain('@compstack/audit-log');
    expect(text).toContain('@compstack/encryption-rest');
    expect(text).toContain('Audit Logging');
    expect(text).toContain('Encryption at Rest');
  });
});
