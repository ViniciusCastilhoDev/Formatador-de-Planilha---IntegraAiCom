---
name: IntegraAiCom Spreadsheet Organizer
description: Contact list preparation tool for WhatsApp blasts — precise, browser-native, zero data egress
colors:
  signal-cyan: "#00c8c8"
  signal-cyan-dark: "#00a0a0"
  signal-cyan-light: "#e0fafa"
  page-bg: "#f7fafa"
  surface-white: "#ffffff"
  dark-panel: "#0f2222"
  deep-void: "#0a1a1a"
  ink-primary: "#1a2a2a"
  ink-secondary: "#3d5454"
  ink-muted: "#6b8888"
  error: "#ef4444"
  success: "#22c55e"
  warning: "#f59e0b"
typography:
  display:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "clamp(2.25rem, 4.2vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.6
  label:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.07em"
  data:
    fontFamily: "'Space Grotesk', monospace"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  pill: "50px"
  lg: "20px"
  md: "16px"
  sm: "10px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "20px"
  lg: "36px"
  xl: "56px"
components:
  button-primary:
    backgroundColor: "{colors.signal-cyan}"
    textColor: "{colors.deep-void}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.signal-cyan-dark}"
    textColor: "{colors.surface-white}"
  input-default:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.sm}"
    padding: "13px 16px"
  chip-badge:
    backgroundColor: "{colors.signal-cyan-light}"
    textColor: "{colors.signal-cyan-dark}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  card-form:
    backgroundColor: "{colors.surface-white}"
    rounded: "{rounded.lg}"
    padding: "36px"
  card-dark-panel:
    backgroundColor: "{colors.dark-panel}"
    rounded: "{rounded.lg}"
    padding: "32px"
---

# Design System: IntegraAiCom Spreadsheet Organizer

## 1. Overview

**Creative North Star: "The Signal Room"**

This is a telecoms operations center aesthetic: raw contact data flows in on the left, processed signal comes out on the right. The interface never decorates. It monitors, validates, and emits. Signal Cyan (#00c8c8) is the live-feed color: it appears on the things that are alive, active, or ready to transmit. The dark output panel (#0f2222) is where the processed result lives. The light input surface (#f7fafa) is where configuration happens. Two zones, one workflow, zero noise.

The system is built for people who are comfortable with data. Plus Jakarta Sans carries the interface language with precision and weight. Space Grotesk carries the data: phone numbers, file names, batch identifiers. The split is deliberate — users recognize data type by font before they read the value.

This system explicitly rejects the consumer-app aesthetic: no rounded-corner-over-rounded-corner cards stacked in grids, no gradient CTAs, no onboarding mascots, no marketing copy in a utility surface. It also rejects the generic SaaS scaffold: no hero-metric cards with big numbers and gradient accents, no eyebrow labels on every configuration section, no decorative glassmorphism. The tool is professional software. It earns trust by showing the user what it detected and what it will produce, not by reassuring them with warm copy.

**Key Characteristics:**
- Two-zone layout: light (input/configure) and dark (output/results)
- Signal Cyan marks live, active, and primary action states only
- Space Grotesk is the data layer; Plus Jakarta Sans is the interface layer
- Flat surfaces at rest; depth appears only where functional (cards, panels, tooltips)
- Dense configuration panels are acceptable; the users are spreadsheet-fluent

## 2. Colors: The Signal Palette

A restrained palette built around one accent that earns its presence. Signal Cyan is the only chromatic color on the light surface; the rest of the palette is near-black neutrals and controlled tints.

### Primary
- **Signal Cyan** (#00c8c8): The live-feed indicator. Used on primary action buttons, active flow nodes, progress bars, selected states, and focus rings. Appears as a glow (`rgba(0,200,200,0.35)`) on hover. Never used decoratively.
- **Signal Cyan Dark** (#00a0a0): The interactive text form of the accent. Used on clickable text, DDD values in the preview table, form-section subheaders, and the chevron in custom selects. Also the focus ring color.
- **Signal Cyan Light** (#e0fafa): The tint. Used as the background for tab/section configuration panels, active file drop zones, and badge chips. Carries the brand hue without competing with the primary CTA.

### Neutral
- **Page Background** (#f7fafa): The base canvas. A near-white with a faint cyan tint (not warm, not cream). Not white; not quite gray.
- **Surface White** (#ffffff): Card surfaces, inputs, buttons at rest. Pure white for maximum contrast against the page background.
- **Dark Panel** (#0f2222): The output zone surface. Used exclusively on the mockup/summary card where processed results and progress live. Signals "this is the result, not the input."
- **Deep Void** (#0a1a1a): The deepest surface. Used for tooltips, and as the text color on Signal Cyan buttons. Near-black with a teal cast.
- **Ink Primary** (#1a2a2a): Primary body text, headings, strong labels. Near-black with a teal cast; never pure black.
- **Ink Secondary** (#3d5454): Secondary body text, metadata, descriptions. Verified against white background: passes 4.5:1.
- **Ink Muted** (#6b8888): Tertiary text, placeholder labels, help text. Used only above white (#ffffff) or page-bg (#f7fafa) at 14px+ size. Do not use on the dark panel without converting to an `rgba(255,255,255,X)` equivalent.

### Semantic
- **Error Red** (#ef4444): Error states, field validation, invalid file indicators. Never decorative.
- **Success Green** (#22c55e): Completion states, processed-successfully metrics in the dark panel.
- **Warning Amber** (#f59e0b): Out-of-range or fallback states in metrics.

### Named Rules
**The One Signal Rule.** Signal Cyan appears on primary actions, active states, progress indicators, and live feed dots. Never as a border accent, never as a decorative gradient, never on inactive elements. Its scarcity is the reason it reads as live.

**The Zone Purity Rule.** Ink colors (#1a2a2a, #3d5454, #6b8888) are for the light surface only. On the dark panel (#0f2222), text uses `rgba(255,255,255,X)` values. Do not paste a light-surface text color onto a dark-panel element.

## 3. Typography

**Body Font:** Plus Jakarta Sans (with sans-serif fallback) — weights 400, 500, 600, 700, 800
**Data/Label Font:** Space Grotesk (with monospace fallback) — weights 500, 600, 700

**Character:** A technical pairing where the split between fonts carries semantic meaning, not decoration. Plus Jakarta Sans has confident weight contrast between 500 and 800, giving the hierarchy real breathing room. Space Grotesk's fixed-proportion geometry makes numbers and identifiers instantly scannable. The two families share a geometric-adjacent skeleton without being too similar to each other.

### Hierarchy
- **Display** (800, clamp 36px→60px, line-height 1.1, -0.04em): Hero title only. Single-use per page. The opening statement.
- **Headline** (800, 20px, line-height 1.2, -0.025em): Card section titles like "Configurar preparação". One per card.
- **Title** (700, 14px, line-height 1.3): File names, strong inline labels, named values.
- **Body** (500, 14px, line-height 1.6): Descriptive text, subtitles, help copy. Max 65–75ch line length.
- **Label** (700, 11px, 0.07em letter-spacing, uppercase): Form section headers, column headers in the preview table, badge text, small uppercase identifiers. Maximum 4 words. Never full sentences.
- **Data** (Space Grotesk, 600–700, 13–15px, line-height 1.4): Phone numbers, file names, batch counts, any value the user would copy-paste or read as data. This font change is functional.

### Named Rules
**The Data Font Rule.** Space Grotesk is reserved for values the user treats as data: phone numbers, file names, section identifiers, batch counts, output format labels. All interface language (headings, descriptions, labels, buttons, error messages) uses Plus Jakarta Sans. If it is copy, it is Jakarta. If it is data, it is Grotesk.

**The No-Sentence Caps Rule.** Uppercase text is legal only for labels of four words or fewer. No sentence in uppercase. No paragraph in uppercase.

## 4. Elevation

This system is flat by default. Depth signals function, not decoration. A surface receives a shadow only when it needs to lift content off the page for structural reason: a persistent card, a floating tooltip, a dark panel that is distinct from its context. Hover glows are Signal Cyan only, and only on interactive elements.

Three functional elevation tiers:

1. **Card elevation** — persistent containers (form card, preview panel) sit slightly above the page: `0 20px 56px rgba(0,0,0,0.07)`. Barely perceptible on the light surface. Enough to read as card, not as decoration.
2. **Panel elevation** — the dark output panel uses a stronger structural shadow (`0 24px 64px rgba(0,0,0,0.18)`) because it sits on the same light surface and needs to read as a distinct zone, not just a colored card.
3. **Popup elevation** — tooltips float above everything: `0 8px 24px rgba(0,0,0,0.30)`. Stronger contrast because they're transient and must read above any background.

No decorative hover shadows on cards. The Signal Cyan glow (`0 12px 30px rgba(0,200,200,0.35)`) appears only on the primary button hover state.

### Shadow Vocabulary
- **card-lift** (`0 20px 56px rgba(0,0,0,0.07)`): Persistent form cards and preview panels on the light surface.
- **panel-ground** (`0 24px 64px rgba(0,0,0,0.18)`): Dark output panel — needs more contrast to read against the light bg.
- **popup** (`0 8px 24px rgba(0,0,0,0.30)`): Tooltips. Stronger than cards because they are transient.
- **accent-glow** (`0 12px 30px rgba(0,200,200,0.35)`): Primary button hover only. Never on inactive elements.

### Named Rules
**The Flat-By-Default Rule.** At rest, surfaces are flat. A shadow is a functional signal: "this is a persistent layer" or "this is floating above the page." If removing the shadow doesn't change how the user reads the UI, the shadow should not be there.

## 5. Components

### Buttons
Confident and unambiguous. Full pill (50px radius) for primary and secondary. No square or lightly-rounded buttons.

- **Shape:** Full pill (50px radius)
- **Primary:** Signal Cyan background (#00c8c8), Deep Void text (#0a1a1a), 16px/32px padding, 700 weight, 15px size
- **Hover:** Signal Cyan Dark background (#00a0a0), Surface White text, -2px translateY lift, accent-glow shadow (0 12px 30px rgba(0,200,200,0.35))
- **Disabled:** 40% opacity. No hover effects. `cursor: not-allowed`.
- **Large variant:** 18px/36px padding, 16px size, 100% width. Used for the primary download action.

### File Drop Zone
The entry point for the workflow. States carry the most design work here.

- **Default:** Dashed 1.5px border (`rgba(0,200,200,0.35)`), Page Background fill, 10px radius, gap layout with icon + text + action button
- **Hover / Drag-over:** Solid Signal Cyan border, Signal Cyan Light background
- **Loaded:** Solid border (`rgba(0,200,200,0.40)`), Signal Cyan Light background, icon swaps to Signal Cyan on white bg
- **Error:** Solid Error Red border (#ef4444), faint error tint background

### Form Card
The configuration container on the left column.

- **Background:** Surface White (#ffffff)
- **Border:** 1px solid `rgba(0,200,200,0.15)` — barely visible; structure, not decoration
- **Radius:** 20px
- **Shadow:** card-lift (`0 20px 56px rgba(0,0,0,0.07)`)
- **Padding:** 36px
- **Internal sections** divided by 1px `rgba(0,200,200,0.10)` hairlines

### Inputs and Selects
Standard and predictable. No invented form controls.

- **Style:** 1.5px solid border (`rgba(0,200,200,0.15)`), Surface White background, 10px radius, 13–14px text at 600 weight
- **Focus:** Border shifts to Signal Cyan (#00c8c8), focus ring `0 0 0 3px rgba(0,200,200,0.12)`
- **Error:** Border shifts to Error Red (#ef4444), error ring `0 0 0 3px rgba(239,68,68,0.12)`
- **Disabled:** 55% opacity, `cursor: not-allowed`
- **Custom select:** Chevron rendered in Signal Cyan Dark. `appearance: none` to allow custom styling.

### Chips and Badges
- **Status chip** (e.g. "Online"): Signal Cyan Light bg (#e0fafa), Signal Cyan Dark text (#00a0a0), full pill radius, 10–11px uppercase 800 weight text, 1.5px letter-spacing
- **Section tab chip:** Same treatment in lighter form
- **Error/warning badges:** Follow the same shape pattern but use semantic colors

### Dark Output Panel
The signature component. Visually distinct from everything else on the page.

- **Background:** Dark Panel (#0f2222)
- **Radius:** 20px
- **Shadow:** panel-ground (`0 24px 64px rgba(0,0,0,0.18)`)
- **Decorative radial glow:** `radial-gradient(circle, rgba(0,200,200,0.12), transparent)` at top-right corner, `pointer-events: none`. Subtle atmospheric element.
- **Internal text:** `rgba(255,255,255,X)` scale — 0.85 for values, 0.45 for labels, 0.35 for secondary
- **Progress bar:** 6px height, Signal Cyan fill with `0 0 12px rgba(0,200,200,0.5)` glow, `rgba(255,255,255,0.07)` track

### Flow Indicator
Signature component showing the Upload → Process → Download pipeline status.

- **Icon nodes:** 76px square, 20px radius, white bg, `rgba(0,200,200,0.18)` border at rest. Core node 90px.
- **Active state:** Signal Cyan background, Deep Void icon color, `0 10px 30px rgba(0,200,200,0.40)` glow
- **Connector line:** 2px, `rgba(0,200,200,0.12)` track. A scanning pulse (Signal Cyan gradient) animates left-to-right when active.
- **Labels:** 12px uppercase, 1.5px letter-spacing, Ink Muted at rest, Signal Cyan Dark when active

### Navigation (Top Bar)
- **Background:** `rgba(247,250,250,0.85)` frosted — `backdrop-filter: blur(14px)`. Sticky.
- **Brand logo:** 40px square, 10px radius, white bg, ciano border. `object-fit: contain`.
- **Meta pill:** Full pill, white bg with ciano border, 12px text. Right-aligned.
- **Border:** 1px `rgba(0,200,200,0.10)` hairline at bottom.

## 6. Do's and Don'ts

### Do:
- **Do** use Signal Cyan only on interactive, active, or live-state elements. One look at a screen should reveal what the user can act on, and cyan is that signal.
- **Do** use Space Grotesk for any value the user reads as data: phone numbers, file names, identifiers, batch counts. Switch on data type, not on visual variety.
- **Do** verify contrast on every text element that uses Ink Muted (#6b8888). It passes 4.5:1 against Surface White and passes 3:1 against Page Background for 14px+ sizes. Do not use it below 13px on the page background.
- **Do** use the full pill (50px radius) on all CTA buttons and badge chips. The pill is the shape language for actions and labels. Rounded-rect buttons and pills on the same page read as two different affordances.
- **Do** reserve the dark panel surface (#0f2222) for output-zone content only: the results mockup, processing progress, post-run metrics. It signals "this is what you're sending."
- **Do** add `prefers-reduced-motion` alternatives for every keyframe animation. Swap continuous pulses (pulse-dot, connectorPulse, pulse-running) to static states; swap fadeUp entry to an instant opacity change.
- **Do** write button labels as verb + object: "Preparar e baixar ZIP", "Selecionar arquivo". Never "OK", never "Sim".

### Don't:
- **Don't** use a `border-left` or `border-right` greater than 1px as a colored accent stripe on cards, callouts, or list items. Rewrite with a background tint or a full border.
- **Don't** apply `background-clip: text` with a gradient to create gradient text. Single solid color only. Emphasis via weight or size.
- **Don't** add glassmorphism (blur + translucent bg) decoratively. The top bar blur is structural (sticky, content underneath). The dark panel radial gradient is a single subtle atmosphere. No frosted-glass cards.
- **Don't** make the tool feel like a consumer app: no playful illustrations, no round emoji-style icons in CTAs, no onboarding mascots, no full-width gradient hero buttons, no copy that says "seamless", "effortless", or "powerful".
- **Don't** apply the generic SaaS scaffold: no eyebrow labels on every configuration card, no numbered step markers (01/02/03) as decoration, no hero-metric template (big number, small label, gradient underline).
- **Don't** use Ink colors (#1a2a2a, #3d5454, #6b8888) on the dark panel surface. On #0f2222, all text must be `rgba(255,255,255,X)`.
- **Don't** animate layout properties (width, height, padding, grid-template-columns). Animate only transform and opacity for state transitions; add box-shadow changes for glow states.
- **Don't** show the complex per-section configuration UI before a spreadsheet is loaded and tabs are detected. Progressive disclosure: only show what the current state of the file calls for.
