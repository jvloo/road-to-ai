# Road to AI Curriculum

The flagship content for the Road to AI platform. Licensed **CC-BY-SA 4.0**.

## Level file format

Every level is a single markdown file under `levels/track-a/` (foundations) or `levels/track-b/` (frontier). Naming: `<ID>_<slug>.md`, e.g., `F14_gradient_descent.md`.

## Frontmatter

See the design spec for the full schema: `docs/superpowers/specs/2026-04-15-road-to-ai-curriculum-and-platform-design.md#6c--level-file-format`.

Required fields: `id`, `title`, `track`, `tier`, `xp`, `prereqs`, `unlocks`, `status`, `completed_at`.

## Authoring rules

1. Every level **must** include a "Why this level matters (lineage)" section naming at least one classical root and at least one modern descendant (or vice versa for Track B).
2. If `luminary` is set, the body must include a "Luminary spotlight" section of 3–5 sentences.
3. If `glossary_terms` are declared, each term must exist in `glossary.md`.
4. Aim for ≥1 visual element per level (Mermaid diagram, equation, image, or code block).

## Contributing

See root `CONTRIBUTING.md`.
