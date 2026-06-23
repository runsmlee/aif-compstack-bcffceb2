# Test Specifications

## Unit Tests (Vitest + React Testing Library)

### FrameworkSelector.test.tsx
- [ ] renders without crash
- [ ] displays three framework options: SOC 2 Type II, HIPAA, GDPR
- [ ] clicking a framework button highlights it as active
- [ ] selecting a framework loads the correct set of required controls

### ControlCard.test.tsx
- [ ] renders without crash
- [ ] displays npm package name and install command
- [ ] displays framework reference citation (e.g., "CC6.1", "164.312(a)(2)(iii)")
- [ ] shows configuration code snippet by default
- [ ] clicking the implement toggle switches status to "implemented"
- [ ] clicking copy button copies the install command to clipboard
- [ ] shows "Implemented" badge when toggled on

### CoverageScore.test.tsx
- [ ] renders without crash
- [ ] displays 0% when no controls are implemented
- [ ] updates percentage when controls are toggled
- [ ] displays correct percentage: (implemented / total required) * 100
- [ ] shows color change: red < 40%, amber 40-79%, green ≥ 80%

### EvidenceExport.test.tsx
- [ ] renders without crash
- [ ] "Export Evidence" button is disabled when no controls are implemented
- [ ] button enables when at least one control is implemented
- [ ] clicking export generates a markdown blob with control data
- [ ] exported markdown contains framework name, control citations, and package names

## User Journey Tests

### Primary Workflow
1. App loads → SOC 2 Type II is pre-selected as default framework, coverage score shows 0%
2. User clicks "implement" toggle on "Audit Logging" control → coverage score updates, control shows "Implemented" badge
3. User clicks copy button on any control card → install command is copied to clipboard
4. User toggles multiple controls → coverage score recalculates in real-time
5. User clicks "Export Evidence" → downloads markdown file with all implemented controls
6. User reloads page → selected framework and implemented controls persist via localStorage

## Acceptance Criteria Checklist
(Reviewer verifies these against PRD.md Must Have features)
- [ ] AC: Developer can select SOC 2 framework, toggle at least 5 controls as implemented, copy real `npm install` + config code from the control cards, and see the coverage score update from 0% to the percentage of implemented controls, all within the hero viewport without scrolling or navigating away.
- [ ] AC: Clicking "Export Evidence" downloads a `.md` file containing every implemented control with its framework citation, npm package name, and config snippet, formatted as an audit-ready artifact.
