---
name: frontend-design
description: Craft distinctive, production-grade frontend prototypes from product docs. Use when the user asks to scaffold a UI, mock up screens, or translate a PRD/UX spec into a running React app.
---

# Frontend Design Skill

Build React interfaces that are visually distinctive, production-quality, and impossible to mistake for default AI output. This skill guides every decision from typography to motion.

> Attribution: this skill draws philosophical inspiration from Anthropic's `frontend-design` skill for Claude Code, adapted for prototype workflows with additional component-sourcing and anti-slop rules.

---

## 1. Before writing any code, commit to a direction

Ask yourself three questions:
1. **Who uses this?** Student, analyst, consumer, professional—each calls for a different register.
2. **What is the dominant feeling?** Pick an extreme: editorially minimal, maximalist, brutalist-grid, warm-organic, industrial, retro-tech. Avoid "modern and clean"—it is not a direction.
3. **What will make this screen unforgettable?** One strong choice (a typographic scale that breaks the grid, a color that makes you look twice, a transition that feels earned) beats ten small refinements.

Only start coding once these are answered in comments at the top of your entry file.

---

## 2. Typography

- **Pair a display font with a body font.** Display: something with visible personality (Syne, Cabinet Grotesk, Instrument Serif, DM Serif Display). Body: legible and complementary (DM Sans, Plus Jakarta Sans, Lato, Source Serif 4 for editorial contexts).
- **Scale deliberately.** Use a modular scale (1.333 or 1.5 ratio). Never set everything in 14–16 px with no contrast.
- **Weight as structure.** Use weight jumps (400 → 700 → 900) to create visual hierarchy, not just size jumps.
- **Avoid:** Inter as a display face, Roboto, system-ui as the dominant style. Reserve them only as fallbacks.

---

## 3. Color

- **Commit to a palette, not a gradient.** Pick 1–2 dominant hues, 1 sharp accent, neutrals derived from the dominant hue (not pure gray).
- **Dark-mode first.** Start with a dark background (`oklch(12% 0.02 260)` range) and derive the light mode from there. Defaulting to white backgrounds produces forgettable output.
- **Use tweakcn or Magic UI themed palettes** for pre-built CSS variable sets worth stealing. Never ship the default shadcn slate palette unchanged.
- **One accent, used sparingly.** The accent exists to pull the eye to exactly one thing per screen. If everything is accented, nothing is.
- **Avoid:** purple-on-white gradients, "glassmorphism" without a real backdrop, rainbow gradient text as decoration.

---

## 4. Spacing and composition

- **Asymmetry creates interest.** A 60/40 column split outperforms a centered layout. Offset cards, staggered grids, and deliberate white-space voids signal design intent.
- **Generous padding, tight grouping.** Related elements should cluster tightly; unrelated elements need significant breathing room.
- **Break the grid intentionally.** One element per view that bleeds, overlaps, or sits at an unexpected angle signals visual confidence.

---

## 5. Motion

- **Subtle and purposeful only.** Motion should communicate—page load reveals (staggered fade-in-up), state changes (200ms ease-out), hover feedback (scale 1.02). Never animate for decoration.
- **Use Framer Motion** when the project has React and animation is non-trivial (page transitions, drag, gesture-based interactions). CSS transitions suffice for hover/focus states.
- **Respect `prefers-reduced-motion`.** Wrap all transitions in a media query check or Framer's `useReducedMotion()`.

---

## 6. Component sourcing priority

When implementing UI components, source in this order:

1. **shadcn/ui primitives** — accessibility-complete, unstyled building blocks (Button, Card, Dialog, Input, Table, Tabs, etc.). Always prefer these for interactive and form elements.
2. **Magic UI** (`@magicui/*`) — hero-section flair, animated counters, bento-grid layouts, beam effects, marquees. Use for landing-page impact moments, not data-dense views.
3. **Origin UI** (`@originui/*`) — data-dense components, advanced form patterns, filter UIs, data tables with actions. Prefer for dashboard and back-office contexts.
4. **Hand-rolled** — only when none of the above provides the right semantic or visual fit. Keep custom components small and composable.

Install components via the shadcn MCP (if available) or `npx shadcn@latest add <component>`.

---

## 7. Anti-slop rules

These patterns signal default AI output. Never produce them:

- **No center-aligned hero with a gradient blob behind the title.** If you use a gradient, it should be architectural (a full-background gradient that defines the palette), not decorative.
- **No "Lorem ipsum."** Every string in a prototype should be plausible product copy in the target language.
- **No emoji as visual decoration** in UI text. Emoji in a chat bubble or user-generated content is fine; emoji replacing iconography is not.
- **No "card grid with three equal columns, each with a blue icon."** Vary density, break the grid, use different card weights.
- **No default Tailwind button colors** (`bg-blue-500 hover:bg-blue-600`). Derive from your committed palette.
- **No Lorem ipsum placeholders in image slots.** Use a placeholder service (`picsum.photos`, `placehold.co`) with real dimensions, or a themed SVG placeholder.
