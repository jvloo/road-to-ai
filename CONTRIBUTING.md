# Contributing to Road to AI

Contributions welcome across three lanes:

## 1. Platform (`platform/`)

Code improvements, accessibility fixes, performance, new UI features that serve every fork. See [docs/superpowers/specs/](docs/superpowers/specs/) for the design.

Requirements:
- TypeScript strict mode passes (`pnpm typecheck`)
- All tests pass (`pnpm test`)
- Domain-agnostic: no AI-specific terms in `platform/src/` (CI enforces)

## 2. Curriculum (`curriculum/`)

AI-curriculum-specific: new levels, corrections, luminary spotlights, glossary entries.

Requirements:
- Each level file has populated frontmatter (id, title, track, tier, xp, prereqs, unlocks)
- Each level has a "Why this level matters (lineage)" section
- Glossary entries are ≤3 sentences

## 3. A new curriculum for a different subject

Fork the repo and replace `curriculum/`. We'd love to feature great forks in the README — open an issue.

## Commit style

Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`).
