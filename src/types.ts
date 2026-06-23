export type FrameworkId = 'soc2' | 'hipaa' | 'gdpr';

export interface ComplianceFramework {
  id: FrameworkId;
  name: string;
  fullName: string;
  description: string;
}

export interface ComplianceControl {
  id: string;
  frameworkId: FrameworkId;
  name: string;
  citation: string;
  packageName: string;
  installCommand: string;
  description: string;
  configSnippet: string;
  category: string;
}

export interface ImplementedState {
  frameworkId: FrameworkId;
  implementedControlIds: string[];
}
