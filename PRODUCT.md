# Product

## Register

product

## Users

Two types of users, both in a task-focused context:

1. **IntegraAiCom ops team** — preparing contact batches for WhatsApp blasts on behalf of clients. They run this tool repeatedly, know the workflow, and care about speed and correctness.
2. **Clients** — uploading their own spreadsheets to format their contact lists independently. They may be non-technical; they need the tool to auto-detect the right columns and surface any problems clearly.

Both groups arrive with a spreadsheet, leave with a ZIP. The tool disappears into that job.

## Product Purpose

Takes a raw contact spreadsheet (`.xlsx`, `.csv`), detects name and phone number columns, validates and formats numbers to WhatsApp's `55 + DDD + number` standard, splits the list into batches, and downloads a ZIP of ready-to-use files. Processing is 100% in the browser; no data leaves the user's machine.

Success: the user uploads a file, confirms or adjusts the column mapping, clicks one button, and gets a ZIP they can load straight into IntegraAiCom without any cleanup.

## Brand Personality

Eficiente, técnico, confiável.

The tool should feel like professional software: precise, fast, trustworthy. It earns trust by showing the user what it's doing (column detection, preview rows, batch counts) rather than hiding complexity behind reassuring copy.

## Anti-references

- Consumer-app bubbly feel: rounded everything, playful illustrations, onboarding mascots, big gradient CTAs, marketing copy in a utility tool.
- Generic SaaS startup scaffold: hero metric cards, identical icon-card grids, eyebrow labels on every section, numbered step markers as decoration.

## Design Principles

1. **Output-first.** Every screen decision should make the user feel closer to the ZIP file. The primary action (download) and the preview of what will be in it are always visible.
2. **Earned familiarity.** Standard affordances for standard tasks. Form controls, dropdowns, buttons, and error states should all behave exactly as expected — no invented interactions.
3. **Progressive disclosure.** Advanced options (per-section config, DDD column, alternative number columns) appear only when the uploaded spreadsheet calls for them. Don't show what doesn't apply.
4. **Transparency over reassurance.** Show the user what the tool detected and what it will produce (preview table, column mapping, batch counts), rather than generic "we'll handle it" copy.
5. **Professional density.** This is a data tool used by people who are comfortable with spreadsheets. Tables, labels, and configuration panels can run dense; no need to pad whitespace for a consumer feel.

## Accessibility & Inclusion

- WCAG AA minimum (4.5:1 body text contrast, 3:1 large text and UI components).
- Focus-visible on all interactive elements.
- Error messages attached to their field, not floating.
- Reduced motion support for all transitions.
