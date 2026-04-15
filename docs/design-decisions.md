# Design Decisions

Append a one-line entry whenever a design-level choice is made or revised.
Keep this short — rationale lives in commits or the spec.

| Date       | Decision                                                      | Rationale                                                 |
|------------|---------------------------------------------------------------|-----------------------------------------------------------|
| 2026-04-15 | Extracted tokens from xavierloo.com to tokens.css             | Source of visual identity per spec §6.H                   |
| 2026-04-15 | Dark mode is default; light mirrors source site               | Per user feedback (SWE audience)                          |
| 2026-04-15 | Single accent across themes (dark's cyan #22d3ee)             | Spec §6.H: one accent color; source site diverges (see note) |
| 2026-04-15 | Inter / JetBrains Mono stay as body/mono fonts                | Geist not yet bundled; stacks list Geist as preference for future task |

## Token extraction log — 2026-04-15

Extraction method: `curl` of https://xavierloo.com (Next.js app) →
linked stylesheet at `/_next/static/css/8528e78edbdce99d.css` →
pretty-print and grep for `--` custom properties and `font-family`.

### Read directly from the source CSS

Source CSS literally defines two palette scopes: `:root { ... }` (light) and
`.dark { ... }` (dark). Values were copied as-is into `tokens.css`.

**Dark palette — from `.dark { ... }`** (our default theme):

- `--color-bg`       `#060610`  ← source `--background`
- `--color-fg`       `#e4e4f0`  ← source `--foreground`
- `--color-muted`    `#8888aa`  ← source `--muted-foreground` (shorthand `#88a` expanded for clarity; identical value)
- `--color-border`   `#18182a`  ← source `--border`
- `--color-surface`  `#0c0c1a`  ← source `--surface` (source also has `--card: #0a0a18`; we consolidated on `--surface`)
- `--color-accent`   `#22d3ee`  ← source dark `--accent` (Tailwind cyan-400)
- `--color-accent-fg` `#060610` ← source `--primary-foreground` (dark bg, reads well on cyan)

**Light palette — from `:root { ... }`** (copied exactly for `html.light`):

- `--color-bg`       `#f8f9fb`  ← source `--background`
- `--color-fg`       `#0a0a0a`  ← source `--foreground`
- `--color-muted`    `#64648a`  ← source `--muted-foreground`
- `--color-border`   `#dfe0ea`  ← source `--border`
- `--color-surface`  `#f0f1f7`  ← source `--surface` (source also has `--card: #fff`)
- `--color-accent-fg` `#ffffff` ← source `--primary-foreground` in light

**Typography — from source CSS**:

- Source body stack: `var(--font-sans), system-ui, sans-serif` with `--font-sans: var(--font-geist-sans)` → `"Geist", "Geist Fallback"`
- Source mono stack: `var(--default-mono-font-family)` → `"Geist Mono", "Geist Mono Fallback", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

**Motion — from source CSS**:

- `--default-transition-duration: .15s`
- `--ease-in-out: cubic-bezier(.4, 0, .2, 1)`

### Values requiring inference or policy call

1. **Single accent across themes.** The source site actually defines two accents:
   `#06b6d4` (light, cyan-500) and `#22d3ee` (dark, cyan-400). The spec
   (§6.H) and task brief explicitly call for a single accent. We picked
   `#22d3ee` (dark-mode value) as canonical because dark is our default.
   A future revision could re-introduce a light-mode accent override if the
   contrast on the lighter background warrants it.

2. **Primary vs accent naming.** The source site distinguishes a purple
   `--primary` (`#6366f1` / `#818cf8`) from a cyan `--accent`
   (`#06b6d4` / `#22d3ee`). Our token set has only one "accent" slot.
   We mapped to source `--accent` (cyan) because that is the element the
   brief pointed at ("LIVE-badge hue, bright accent"). Source `--primary`
   (indigo) is reserved for a future task if we need a second brand hue.

3. **Fonts: Geist not installed.** xavierloo.com uses `Geist` and
   `Geist Mono` (self-hosted via Next.js). The task brief says "don't
   install new font packages here," so we kept Inter / JetBrains Mono
   (already bundled) as the first entries in the stacks and listed
   `Geist` / `Geist Mono` as preferred fallbacks. A future task can add
   `@fontsource/geist` + `@fontsource/geist-mono` and shuffle the stack
   order.

4. **`--color-surface` vs `--color-card`.** Source has both. We kept only
   `--color-surface` (the slightly-raised neutral) to keep the token set
   lean; a future task can split them if needed.

5. **Shadows, radii, spacing scale.** The source site exposes
   `--radius-md .375rem / --radius-lg .5rem / --radius-xl .75rem` but
   doesn't publish an explicit shadow or spacing scale in CSS custom
   properties (Tailwind v4 resolves those at compile time from utility
   classes). We used the spec-provided defaults (8px base, two shadow
   levels) rather than inferring from per-element styles.

## Visual parity audit — 2026-04-15

Compared the app's dark-mode rendering at `/road-to-ai/` against
https://xavierloo.com:

- **Palette:** monochrome base with cyan `#22d3ee` accent matches the source site's LIVE-badge accent.
- **Typography:** body uses Inter (close analog to the source site's Geist); code uses JetBrains Mono (site uses Geist Mono). Noted in an earlier log as intentional — install Geist in a future task if we want exact parity.
- **Code-comment dividers** (`// foundations`, `// progress`, etc.) match the source site's `// work` / `// projects` idiom exactly.
- **Spacing:** generous whitespace preserved; max-width constraints match.
- **Dark mode:** default on first load; light mode available via Settings.

No regressions flagged against the source site's current visual design.
