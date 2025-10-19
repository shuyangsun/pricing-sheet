# Pricing Sheet Prototype Constitution

This constitution defines the minimum set of rules and acceptance criteria for a static website prototype of a pricing sheet. It is intentionally simple: only HTML, CSS, and vanilla JavaScript are allowed; all data is hardcoded; there are no network/API calls, build steps, or external libraries.

## Core Principles

### I. Static-only, No Build, No Frameworks

- Stack is limited to HTML5, CSS3, and vanilla ES6 JavaScript.
- No TypeScript, React/Vue/etc., UI libraries, CSS frameworks, bundlers, transpilers, or package managers.
- Deliverables are plain files that open directly in a browser via file:// or static hosting.

### II. Hardcoded Prototype Data

- All input/output data is embedded as constants inside `index.html` (e.g., inline `<script>` or data attributes).
- No network calls of any kind (fetch/XHR/websocket/beacon); external fonts/scripts/styles are forbidden.
- Interactions that would normally require an API must be simulated in-memory.

### III. Semantic, Accessible, Responsive by Default

- Use semantic HTML elements and ARIA where needed; keyboard navigation must work for all interactive controls.
- Mobile-first responsive layout using CSS Flexbox/Grid; no JS layout hacks.
- Color contrast meets WCAG AA for text and interactive elements.

### IV. Minimalism and Performance Budgets

- Keep total page weight small (target: HTML+CSS+JS < 200KB uncompressed; images/graphics < 300KB total).
- Prefer system font stack; avoid custom web fonts and heavy images.
- Defer non-critical JS; do not block first paint with scripts.

### V. Privacy and Security Hygiene

- No analytics, trackers, or third-party embeds.
- No inline event handlers that mix content and behavior; use `script.js` for logic.
- All interactions are local; no persistence beyond page lifecycle.

### VI. Rapid LLM-Assisted Iteration (Prototype-First)

- Prioritize speed of iteration and demonstrable UX over production-quality code, architecture, or abstractions.
- Generating and editing code with LLM assistance is the default workflow; prompts and intent may be captured as comments.
- Optimize for time-to-working-demo: accept duplication, minimal typing, and simplified structures to meet the prototype goals quickly.
- Prefer stubbing/simulating behavior in-memory to unblock flow; defer refactors until after UX validation.
- Code quality gates focus on usability, accessibility, and correctness of the demo rather than polish or patterns.

## Project Constraints & Structure

### File/Folder Layout

- Root or `prototype/` directory contains:
  - `index.html` – single entry page (may link to additional static pages if needed); includes all hardcoded data inline.
  - `styles.css` – site styles.
  - `script.js` – behavior only (reads inline data from `index.html`); no fetching or external imports.
  - `assets/` – optional local images/icons (SVG preferred), kept small.

### Prohibitions (Non-Negotiable)

- No TypeScript or build tooling; no Node/npm/yarn/pnpm required.
- No runtime network access; any fetch/XHR/websocket usage is a violation.

## Development Workflow & Quality Gates

### Authoring

- Two-space indentation; semantic HTML; class names are lowercase with hyphens.
- Separate concerns: structure (HTML), presentation (CSS), behavior (JS).

### LLM Collaboration & Review Focus

- Default to LLM-assisted edits for copy, markup, styles, and JS interactions to accelerate iteration.
- Timebox tasks (e.g., 60–90 minutes) to achieve a working slice before any refactoring.
- Reviews prioritize: (1) scope/requirements fit, (2) UX/accessibility, (3) correctness of interactions; do not block on code style unless it impairs function.
- TODO/FIXME comments are acceptable to note deferred improvements; non-blocking issues can be tracked in a checklist within the PR.
- Keep changes small and demoable; prefer incremental commits with clear, outcome-oriented messages.

### Manual QA Checklist (must pass before merge)

1. Open `index.html` directly in a browser from disk; page renders without errors in console.
2. Toggle Monthly/Annual updates all visible prices correctly and accessibly (announced via aria-live or visible text change).
3. Keyboard-only operation: can tab to all interactive controls; visible focus states; Enter/Space activates buttons/toggles.
4. No network requests in DevTools Network panel (filter: All) after initial load and during interactions.
5. Lighthouse (or equivalent) scores ≥ 90 for Performance, Accessibility, Best Practices on a throttled mobile profile.
6. HTML and CSS validate with zero errors on W3C validators (warnings acceptable if intentional and documented).
7. Total page weight within budgets; assets optimized; images use modern formats/SVG when possible.

### Acceptance Criteria (Definition of Done)

- Single static page (plus assets) implements the pricing sheet with at least 3 example plans and ≥ 8 example features.
- Billing toggle functional and stateful (defaults to Monthly; Annual shows discounted price).
- “Select” action produces local, non-persistent feedback; no page reloads required.
- No external network calls; all resources load from local files; console contains no errors.

## Governance

- This constitution supersedes other practices for the prototype scope described herein.
- Any amendment requires: (a) rationale, (b) updated acceptance criteria if applicable, (c) review approval.
- Pull requests must explicitly attest compliance with Core Principles, Prohibitions, and QA Checklist.

**Version**: 1.0.0 | **Ratified**: 2025-10-19 | **Last Amended**: 2025-10-19
