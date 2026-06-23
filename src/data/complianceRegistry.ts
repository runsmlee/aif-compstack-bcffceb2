import type { ComplianceControl, ComplianceFramework, FrameworkId } from '../types';

export const FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    fullName: 'SOC 2 Type II',
    description:
      'Security, availability, processing integrity, confidentiality, and privacy controls for service organizations.',
  },
  {
    id: 'hipaa',
    name: 'HIPAA',
    fullName: 'HIPAA Security Rule',
    description:
      'Administrative, physical, and technical safeguards for protected health information (PHI).',
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    fullName: 'GDPR',
    description:
      'Data protection and privacy requirements for handling personal data of EU residents.',
  },
];

export const CONTROLS: ComplianceControl[] = [
  // SOC 2 Type II Controls
  {
    id: 'soc2-audit-log',
    frameworkId: 'soc2',
    name: 'Audit Logging',
    citation: 'CC6.1',
    packageName: '@compstack/audit-log',
    installCommand: 'npm install @compstack/audit-log',
    description:
      'Tamper-evident audit logging for all security-relevant events with structured append-only storage.',
    configSnippet: `import { AuditLog } from '@compstack/audit-log';

const audit = new AuditLog({
  storage: 'append-only',
  hashChain: true,
  retention: '400d',
});

audit.log({
  actor: req.user.id,
  action: 'data.access',
  resource: '/api/records/' + recordId,
  timestamp: new Date().toISOString(),
});`,
    category: 'Monitoring',
  },
  {
    id: 'soc2-encryption-rest',
    frameworkId: 'soc2',
    name: 'Encryption at Rest',
    citation: 'CC6.1',
    packageName: '@compstack/encryption-rest',
    installCommand: 'npm install @compstack/encryption-rest',
    description:
      'AES-256 encryption for all stored data with automatic key rotation and envelope encryption.',
    configSnippet: `import { Encryption } from '@compstack/encryption-rest';

const enc = new Encryption({
  algorithm: 'aes-256-gcm',
  keyRotation: '90d',
  kms: process.env.KMS_KEY_ID,
});

const encrypted = await enc.encrypt(record.data);
await db.records.put({ ...record, data: encrypted });`,
    category: 'Encryption',
  },
  {
    id: 'soc2-access-control',
    frameworkId: 'soc2',
    name: 'Role-Based Access Control',
    citation: 'CC6.3',
    packageName: '@compstack/rbac',
    installCommand: 'npm install @compstack/rbac',
    description:
      'Fine-grained role-based access control with policy enforcement middleware and permission inheritance.',
    configSnippet: `import { RBAC } from '@compstack/rbac';

const rbac = new RBAC({
  roles: ['admin', 'engineer', 'viewer'],
  policies: policyFile,
});

app.use(rbac.middleware());
// Routes auto-enforce permissions
app.get('/admin', rbac.require('admin'), handler);`,
    category: 'Access Control',
  },
  {
    id: 'soc2-mfa',
    frameworkId: 'soc2',
    name: 'Multi-Factor Authentication',
    citation: 'CC6.1',
    packageName: '@compstack/mfa',
    installCommand: 'npm install @compstack/mfa',
    description:
      'TOTP-based multi-factor authentication with backup codes and configurable enforcement policies.',
    configSnippet: `import { MFA } from '@compstack/mfa';

const mfa = new MFA({
  methods: ['totp'],
  backupCodes: 10,
  enforceFor: ['admin', 'engineer'],
});

await mfa.enforce(user.id);
const challenge = mfa.challenge(session.id);`,
    category: 'Authentication',
  },
  {
    id: 'soc2-vuln-scan',
    frameworkId: 'soc2',
    name: 'Vulnerability Scanning',
    citation: 'CC7.1',
    packageName: '@compstack/vuln-scan',
    installCommand: 'npm install @compstack/vuln-scan',
    description:
      'Automated dependency vulnerability scanning with CVE database sync and configurable blocking thresholds.',
    configSnippet: `import { VulnScan } from '@compstack/vuln-scan';

const scanner = new VulnScan({
  severity: 'high',
  blockOn: ['critical'],
  schedule: '0 2 * * *',
});

await scanner.scan();
// Blocks CI on critical CVEs`,
    category: 'Monitoring',
  },
  {
    id: 'soc2-backup',
    frameworkId: 'soc2',
    name: 'Encrypted Backups',
    citation: 'A1.2',
    packageName: '@compstack/backup',
    installCommand: 'npm install @compstack/backup',
    description:
      'Scheduled encrypted database backups with integrity verification and point-in-time recovery.',
    configSnippet: `import { Backup } from '@compstack/backup';

const backup = new Backup({
  schedule: '0 3 * * *',
  encryption: 'aes-256',
  retention: '365d',
  verify: true,
});

backup.start();
// Auto-verifies + encrypts snapshots`,
    category: 'Availability',
  },
  {
    id: 'soc2-secrets',
    frameworkId: 'soc2',
    name: 'Secret Management',
    citation: 'CC6.1',
    packageName: '@compstack/secrets',
    installCommand: 'npm install @compstack/secrets',
    description:
      'Centralized secret management with runtime injection, rotation hooks, and zero local persistence.',
    configSnippet: `import { Secrets } from '@compstack/secrets';

const secrets = new Secrets({
  provider: 'aws-secrets-manager',
  cache: '5m',
  rotationHooks: true,
});

const dbPassword = await secrets.get('DB_PASSWORD');`,
    category: 'Encryption',
  },

  // HIPAA Controls
  {
    id: 'hipaa-access-control',
    frameworkId: 'hipaa',
    name: 'Access Control',
    citation: '164.312(a)(1)',
    packageName: '@compstack/phi-access',
    installCommand: 'npm install @compstack/phi-access',
    description:
      'Role-based PHI access control with minimum-necessary enforcement and automatic access logging.',
    configSnippet: `import { PHIAccess } from '@compstack/phi-access';

const guard = new PHIAccess({
  minNecessary: true,
  auditAll: true,
  roles: phiRoleMatrix,
});

app.use('/api/patients', guard.middleware());`,
    category: 'Access Control',
  },
  {
    id: 'hipaa-audit-controls',
    frameworkId: 'hipaa',
    name: 'Audit Controls',
    citation: '164.312(b)',
    packageName: '@compstack/audit-log',
    installCommand: 'npm install @compstack/audit-log',
    description:
      'Hardware, software, and procedural mechanisms to record and examine PHI access events.',
    configSnippet: `import { AuditLog } from '@compstack/audit-log';

const audit = new AuditLog({
  storage: 'append-only',
  hashChain: true,
  phiEvents: true,
  retention: '6y',
});

audit.log({
  actor: clinician.id,
  action: 'phi.access',
  resource: patientRecordId,
  purpose: 'treatment',
});`,
    category: 'Monitoring',
  },
  {
    id: 'hipaa-integrity',
    frameworkId: 'hipaa',
    name: 'Integrity Controls',
    citation: '164.312(c)(1)',
    packageName: '@compstack/integrity',
    installCommand: 'npm install @compstack/integrity',
    description:
      'Cryptographic integrity verification for PHI with HMAC-based tamper detection and alerting.',
    configSnippet: `import { Integrity } from '@compstack/integrity';

const guard = new Integrity({
  algorithm: 'sha-256',
  hmacKey: process.env.HMAC_KEY,
  alertOn: 'mismatch',
});

await guard.verify(patientRecord);
// Throws on tampering`,
    category: 'Encryption',
  },
  {
    id: 'hipaa-auth',
    frameworkId: 'hipaa',
    name: 'Person Authentication',
    citation: '164.312(d)',
    packageName: '@compstack/mfa',
    installCommand: 'npm install @compstack/mfa',
    description:
      'Multi-factor person authentication with unique user identification and session management for PHI systems.',
    configSnippet: `import { MFA } from '@compstack/mfa';

const mfa = new MFA({
  methods: ['totp', 'sms'],
  uniqueId: true,
  sessionTimeout: '20m',
  enforceFor: ['*'],
});

await mfa.enforce(userId);`,
    category: 'Authentication',
  },
  {
    id: 'hipaa-transmission-security',
    frameworkId: 'hipaa',
    name: 'Transmission Security',
    citation: '164.312(e)(1)',
    packageName: '@compstack/tls-enforce',
    installCommand: 'npm install @compstack/tls-enforce',
    description:
      'End-to-end encryption for PHI in transit with TLS 1.3 enforcement and certificate pinning.',
    configSnippet: `import { TLSEnforce } from '@compstack/tls-enforce';

const tls = new TLSEnforce({
  minVersion: 'TLSv1.3',
  hsts: '2y',
  cipherSuites: 'strict',
});

app.use(tls.middleware());`,
    category: 'Encryption',
  },
  {
    id: 'hipaa-encryption-rest',
    frameworkId: 'hipaa',
    name: 'Encryption at Rest',
    citation: '164.312(a)(2)(iv)',
    packageName: '@compstack/encryption-rest',
    installCommand: 'npm install @compstack/encryption-rest',
    description:
      'AES-256 encryption for all stored PHI with automatic key rotation and envelope encryption.',
    configSnippet: `import { Encryption } from '@compstack/encryption-rest';

const enc = new Encryption({
  algorithm: 'aes-256-gcm',
  keyRotation: '90d',
  kms: process.env.KMS_KEY_ID,
});

const encrypted = await enc.encrypt(phiRecord);`,
    category: 'Encryption',
  },

  // GDPR Controls
  {
    id: 'gdpr-consent',
    frameworkId: 'gdpr',
    name: 'Consent Management',
    citation: 'Art. 6(1)(a)',
    packageName: '@compstack/consent',
    installCommand: 'npm install @compstack/consent',
    description:
      'Granular consent capture, storage, and withdrawal with verifiable audit trails as required by GDPR.',
    configSnippet: `import { Consent } from '@compstack/consent';

const consent = new Consent({
  versioned: true,
  auditTrail: true,
  withdrawalApi: true,
});

await consent.capture({
  subject: userId,
  purposes: ['marketing', 'analytics'],
  timestamp: new Date().toISOString(),
});`,
    category: 'Data Rights',
  },
  {
    id: 'gdpr-data-portability',
    frameworkId: 'gdpr',
    name: 'Data Portability',
    citation: 'Art. 20',
    packageName: '@compstack/data-export',
    installCommand: 'npm install @compstack/data-export',
    description:
      'Automated data export in machine-readable JSON/CSV format with scheduled delivery for data subject requests.',
    configSnippet: `import { DataExport } from '@compstack/data-export';

const exporter = new DataExport({
  formats: ['json', 'csv'],
  include: ['profile', 'activity', 'preferences'],
  sign: true,
});

const exportUrl = await exporter.generate(userId);`,
    category: 'Data Rights',
  },
  {
    id: 'gdpr-erasure',
    frameworkId: 'gdpr',
    name: 'Right to Erasure',
    citation: 'Art. 17',
    packageName: '@compstack/erasure',
    installCommand: 'npm install @compstack/erasure',
    description:
      'Right-to-be-forgotten implementation with cascading deletion, backup purging, and verification.',
    configSnippet: `import { Erasure } from '@compstack/erasure';

const erasure = new Erasure({
  cascade: true,
  purgeBackups: true,
  verify: true,
});

await erasure.delete(userId);
// Returns deletion certificate`,
    category: 'Data Rights',
  },
  {
    id: 'gdpr-encryption-rest',
    frameworkId: 'gdpr',
    name: 'Encryption at Rest',
    citation: 'Art. 32(1)(a)',
    packageName: '@compstack/encryption-rest',
    installCommand: 'npm install @compstack/encryption-rest',
    description:
      'Encryption of personal data at rest using state-of-the-art algorithms with appropriate key management.',
    configSnippet: `import { Encryption } from '@compstack/encryption-rest';

const enc = new Encryption({
  algorithm: 'aes-256-gcm',
  keyRotation: '90d',
  kms: process.env.KMS_KEY_ID,
});

const encrypted = await enc.encrypt(personalData);`,
    category: 'Encryption',
  },
  {
    id: 'gdpr-access-control',
    frameworkId: 'gdpr',
    name: 'Access Control',
    citation: 'Art. 32(1)(b)',
    packageName: '@compstack/rbac',
    installCommand: 'npm install @compstack/rbac',
    description:
      'Capability to ensure ongoing confidentiality and integrity of processing systems via role-based access control.',
    configSnippet: `import { RBAC } from '@compstack/rbac';

const rbac = new RBAC({
  roles: ['dpo', 'processor', 'viewer'],
  policies: gdprPolicyFile,
  denyByDefault: true,
});

app.use(rbac.middleware());`,
    category: 'Access Control',
  },
  {
    id: 'gdpr-activity-log',
    frameworkId: 'gdpr',
    name: 'Activity Logging',
    citation: 'Art. 30',
    packageName: '@compstack/audit-log',
    installCommand: 'npm install @compstack/audit-log',
    description:
      'Records of processing activities with automated logging of data access, modifications, and transfers.',
    configSnippet: `import { AuditLog } from '@compstack/audit-log';

const audit = new AuditLog({
  storage: 'append-only',
  hashChain: true,
  processingActivities: true,
  retention: 'permanent',
});

audit.log({
  processor: req.user.id,
  activity: 'personal_data.processed',
  lawfulBasis: 'consent',
  dataSubjects: [subjectId],
});`,
    category: 'Monitoring',
  },
];

export function getControlsByFramework(frameworkId: FrameworkId): ComplianceControl[] {
  return CONTROLS.filter((c) => c.frameworkId === frameworkId);
}

export function getFramework(id: FrameworkId): ComplianceFramework {
  const fw = FRAMEWORKS.find((f) => f.id === id);
  if (!fw) throw new Error(`Framework ${id} not found`);
  return fw;
}
