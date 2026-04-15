# Road to AI

> A gamified, open-source path from math to world models — fork it and make your own.

**Road to AI** is two things:

1. A **reusable React platform** that renders any markdown-based gamified curriculum as an interactive skill tree with levels, XP, achievements, and spaced-recall. Domain-agnostic: fork it, drop in your own `curriculum/` folder, and teach anything.
2. A **flagship AI curriculum** — a cold-start-friendly, foundations-first path through classical AI, ML, Deep Learning, Reinforcement Learning, LLMs, Agentic AI, and World Models, with explicit lineage connecting classical ideas to their modern descendants.

Live app: https://jvloo.github.io/road-to-ai/

## Preview

![Road to AI (dark mode)](docs/screenshots/hero-dark.png)

Live: https://jvloo.github.io/road-to-ai/

## Quick start (learner)

Visit the live app. No install required. Your progress lives in your browser (`localStorage`).

## Quick start (fork your own curriculum)

    git clone https://github.com/jvloo/road-to-ai.git my-curriculum
    cd my-curriculum
    pnpm install
    pnpm dev

Replace the contents of `curriculum/` with your own levels (markdown with frontmatter — see [`curriculum/README.md`](curriculum/README.md) for the format) and push to your own GitHub Pages site.

## Repo layout

    platform/     # React app (MIT)
    curriculum/   # Flagship AI curriculum (CC-BY-SA 4.0)
    docs/         # Design spec and implementation plan
    .claude/      # Slash commands for Claude Code users

## Design philosophy

- **Markdown is the source of truth.** The app reads; it never owns.
- **No time pressure.** No streaks, no daily quotas, no decay. Levels wait for you.
- **Classical → modern.** Every lesson links old ideas to their living descendants.
- **Dark mode by default.** SWEs love dark mode.

## License

- Platform code (`platform/`): [MIT](LICENSE)
- Curriculum content (`curriculum/`): [CC-BY-SA 4.0](LICENSE-CONTENT)

## Authors

By **Prof. Claude**, with **Xavier Loo** as co-author and first learner.

- Prof. Claude — Anthropic's Claude, primary author of the curriculum and platform code
- Xavier Loo — co-author, first learner, and the one who decided to publicize this — [xavierloo.com](https://xavierloo.com)

*Copyright © 2026 Xavier Loo. Playful authorship credit above; legal ownership rests with Xavier.*
