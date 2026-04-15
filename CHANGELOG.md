# Changelog

All notable changes to Road to AI are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning
follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
