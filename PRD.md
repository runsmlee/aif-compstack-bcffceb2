# CompStack — Product Requirements Document

## Problem
Engineering teams building B2B software face a painful disconnect: compliance requirements (SOC 2, HIPAA, GDPR) are written in regulatory language, interpreted by consultants, and then implemented as one-off code scattered across the application. Developers don't know which controls they need, consultants charge $50K+ to translate frameworks into technical requirements, and auditors collect evidence manually via screenshots. The result is a 3-6 month compliance process that treats compliance as an external process layer rather than what it should be: installable infrastructure primitives that live inside the codebase.

## Target Users
Senior backend/full-stack engineers at B2B SaaS startups (Series A-B, 10-100 employees) who have been told "we need SOC 2 / HIPAA compliance" and are responsible for implementing the technical controls. They are comfortable with npm/yarn, prefer copy-paste configuration over GUI wizards, and want to understand exactly what each control does rather than blindly trusting a black-box platform.

## Core Feature (default: exactly ONE)
- **Interactive Compliance Stack Builder**: Developer selects a regulatory framework (SOC 2 Type II, HIPAA, GDPR), sees every required technical control mapped to an installable package with real installation code and configuration snippets, toggles controls as "implemented" to build their stack, and watches a live compliance coverage score calculate in real-time. Each control card shows the npm package name, install command, usage example, and which specific framework requirement it satisfies — Acceptance Criteria: Developer can select SOC 2 framework, toggle at least 5 controls as implemented, copy real `npm install` + config code from the control cards, and see the coverage score update from 0% to the percentage of implemented controls, all within the hero viewport without scrolling or navigating away.

## Should Have (optional — only if the ONE feature requires it)
- **Evidence Artifact Preview**: Generates a real downloadable markdown evidence document from the currently implemented controls, listing each control's framework reference, implementation status, package version, and configuration — mirroring what an auditor would receive. Triggered by a single "Export Evidence" button that produces the file using actual control data — Acceptance Criteria: Clicking "Export Evidence" downloads a `.md` file containing every implemented control with its framework citation, npm package name, and config snippet, formatted as an audit-ready artifact.

## Out of Scope (v1) — LIST AT LEAST 3 things explicitly NOT being built
- **Actual publishable npm packages**: The MVP shows real installation code and package names but does not publish working packages to npm. Publishing requires separate SDK engineering, security review, and maintenance infrastructure that would dilute focus from validating the core builder experience.
- **CI/CD pipeline integration**: Auto-scanning a codebase to detect which controls are already implemented would require building a static analysis engine. This is a powerful adjacent feature but breaks single-purpose focus — the MVP is a planning and configuration tool, not a code scanner.
- **Multi-tenant team dashboards / collaboration**: Real-time multi-user editing, role assignments, and approval workflows are what Vanta/Drata offer. Adding these would make this a GRC platform clone rather than a developer-first primitive. Teams can share the exported evidence artifact manually in v1.
- **Continuous compliance monitoring / alerting**: Runtime drift detection and Slack/email alerts when controls change are valuable post-implementation features, but they require a backend and agent infrastructure that contradicts the lightweight, local-first MVP philosophy.

## Success Metrics
- Primary: Developer configures a complete framework stack (selects framework + toggles ≥80% of required controls + copies at least one install command) in under 60 seconds on first visit
- Secondary: Evidence artifact export is triggered by ≥40% of users who reach >50% coverage score

## Design Principles
- **Code-first, always**: Every control is shown as real code, not abstract descriptions. Developers trust what they can read and paste.
- **Progressive disclosure with full transparency**: Coverage score is always visible, control details expand on demand but the install command is always shown by default
- The hero contains the working compliance builder directly — no "Get Started" button, no marketing copy above the tool. Framework selector, control list, and coverage score are all immediately interactive in the viewport.
