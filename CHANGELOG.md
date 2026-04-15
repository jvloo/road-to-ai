# Changelog

All notable changes to Road to AI are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning
follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [platform-v0.3.0] — 2026-04-15

### Added
- First 15 Tier-1 Math Foundations levels authored end-to-end (F00–F14)
  - F00 Welcome · F01 Dev Environment · F02 How to Read a Paper (Keshav)
  - F03 Python Numerical Stack (Oliphant) · F04 Vectors (Grassmann)
  - F05 Matrices · F06 Dot Products (Hamilton) · F07 Linear Independence
  - F08 Linear Systems (Gauss) · F09 Eigenvalues · F10 Limits (Weierstrass)
  - F11 Derivatives (Leibniz) · F12 Gradients · F13 Loss Surfaces
  - F14 Gradient Descent (Cauchy) — flagship exemplar with Python code + quiz
- Glossary seeded with 10 entries (XP, SGD, learning-rate, loss-surface, etc.)
- Root `CLAUDE.md` + 7 slash commands (`/status`, `/lesson`, `/level-up`,
  `/paper-week`, `/review`, `/tree`, `/new-level`)
- Mobile-responsive SkillTree height, hero typography, and LevelPage modal
- First-time onboarding block on HomePage when xp_total === 0
- Root `README.md` preview section + docs/screenshots/ directory

### Fixed
- Glossary body now renders markdown (**bold** resolves correctly)

### Changed
- HomePage displays a highlighted "Start with F00" affordance for brand-new learners

## [platform-v0.2.0] — 2026-04-15

### Added
- Progress persistence via localStorage; tier computed from XP total
- `XpBar`, `TierBadge`, `AchievementShelf`, `ProgressDashboard` components wired into HomePage above the skill tree
- Achievements engine with 4 seeded rules (first-step, met-10-luminaries, met-25-luminaries, glossary-trailblazer stub)
- Luminary spotlight card on levels with `luminary:` frontmatter (S. Keshav currently on F02)
- `/luminaries` index page aggregating luminaries across levels with their level IDs
- `/glossary` index page with 8 starter entries rendered through the markdown pipeline
- `GlossaryChip` inline hover component (unwired, ready for future per-level opt-in)
- Footnote styling with `// footnotes` code-comment marker
- Recall system: auto-recall header on levels, inline `LevelQuiz` (self-attest + multiple-choice), periodic `RecallChallenge` modal every 5 completions
- Highlight-to-translate popover using the browser's Translation API with Google Translate fallback
- `/settings` page for theme, target language, translation provider, and completion-chime toggle
- Top navigation with hash-based routing (`#/`, `#/luminaries`, `#/glossary`, `#/settings`)

### Fixed
- Glossary entry bodies now render markdown (e.g., `**Experience Points.**` shows as bold, not literal asterisks)

## [platform-v0.1.0] — 2026-04-15

### Added
- Level markdown parser with strict frontmatter validation (gray-matter + types)
- Curriculum loader using Vite's `import.meta.glob` at build time
- First three Tier-0 Prelude levels (F00 welcome, F01 dev env, F02 paper reading)
- First luminary spotlight (S. Keshav in F02)
- Graph builder turning levels into Cytoscape node + edge elements with `unlocked` state
- `SkillTree` Cytoscape wrapper component with 4 status states and screen-reader list fallback
- `LevelPane` modal with Mermaid diagrams, KaTeX math, and Shiki code highlighting
- `renderMarkdown` unified pipeline (remark-parse + remark-gfm + remark-math + rehype-katex + Shiki + Mermaid post-processors)
- Zustand store orchestrating curriculum loading, level selection, and optimistic mark-done
- HomePage + LevelPage route-style pages; App.tsx becomes a thin shell
- `@tailwindcss/typography` plugin for prose rendering
- `curriculum/meta.json` defining 9 tiers and 6 XP tier-bands
- Achievement definitions seed (7 starter achievements)

## [platform-v0.0.1] — 2026-04-15

### Added
- M1 scaffold: Vite + React 19 + TS + Tailwind v4 app live at https://jvloo.github.io/road-to-ai/
- Design tokens extracted from xavierloo.com (monochrome + cyan accent)
- Reusable `<Divider>` component using the "// section-name" code-comment idiom
- GitHub Actions workflow for auto-deploy on push to main
- Issue templates (bug report, curriculum correction, feature request)
- ESLint flat config + Playwright E2E smoke test for the landing page
- Dark mode default with light-mode override
