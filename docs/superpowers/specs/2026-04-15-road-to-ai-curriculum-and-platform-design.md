# Road to AI — Curriculum & Platform Design

**Status:** Draft for review
**Author:** Xavier Loo (<https://xavierloo.com>)
**Design date:** 2026-04-15
**Repository:** `jvloo/road-to-ai` (public, monorepo)
**Licenses:** MIT (code) + CC-BY-SA 4.0 (curriculum content)

---

## 1. Overview

**Road to AI** is a gamified, open-source, self-paced curriculum that takes a cold-start learner from mathematical foundations through modern frontier AI — classical ML, Deep Learning, Reinforcement Learning, Large Language Models, Agentic AI, and World Models — with explicit lineage connecting classical ideas to their modern descendants.

The project ships as two cleanly separated layers:

- **Platform** — a reusable, domain-agnostic React dashboard that renders any markdown-based gamified curriculum (skill tree, XP, levels, achievements). Anyone can fork it and plug in their own content for any subject.
- **Curriculum** — the flagship AI curriculum, shipped as the platform's default example content and maintained as a first-class deliverable.

Markdown files are the source of truth. The React app is a view/interaction layer. Progress is a single JSON file per user fork. No backend, no auth, no database.

## 2. Motivation & context

The learner (Xavier) is a cold-start programmer with rusty math who wants to build ground-up knowledge across the full AI spectrum — foundations first — with the stretch goal of contributing novel research. The study schedule is opportunistic (busy weeks including weekends are expected), which rules out time-pressured mechanics (streaks, daily quotas).

The learning shape is **Shape 3 — dual-track parallel**: a Foundations track (textbook + problem sets, bottom-up) running alongside a Frontier track (paper-reading + reproduction, scaffolded for cold-start). Both tracks are active from day 1 and cross-reference each other so every classical topic names modern descendants and every modern topic traces classical roots.

Making the platform reusable (rather than bespoke) is a deliberate choice: it forces domain-agnostic architecture, benefits other self-learners, and earns Xavier early OSS-author credibility.

## 3. Scope

**In scope:**

- Full AI map: Symbolic AI / GOFAI + Classical ML + Deep Learning + Reinforcement Learning + LLMs + Agentic AI + World Models
- All essential branches: math foundations, probabilistic/Bayesian ML, computer vision, generative models, search & planning, embeddings & retrieval, evaluation
- All optional branches: GNNs, time series, speech, recommender systems, robotics, multimodal, interpretability, MLOps, safety & alignment, causal inference
- Gamification mechanics: levels, XP, tier bands, boss levels, side quests, achievements, interactive skill tree
- Reusable platform: runtime markdown parsing, swappable curriculum directory, open licenses
- GitHub Pages deployment from `main`

**Out of scope:**

- Time-based punishment mechanics (streaks, daily quotas, decay)
- Backend services, user accounts, or multi-user features
- Credentialing or certification
- Mobile native apps (web responsive only)
- Auto-grading (all "done" criteria are self-attested)

**Deferred (may become future side quests / community contributions):**

- Obsidian plugin for level authoring
- CLI tool for level scaffolding outside of Claude Code
- Spaced-repetition engine beyond the basic `/review` command

## 4. Audience

1. **Primary — Xavier Loo.** Single learner whose progress drives the flagship curriculum's evolution and validates the platform.
2. **Secondary — self-directed learners in any domain.** Fork the repo, replace `curriculum/` with their own content, deploy their own dashboard.
3. **Tertiary — contributors.** Open-source contributors who want to improve the platform or propose curriculum expansions.

## 5. Architecture

```
┌──────────────────────────────────────────────────────────┐
│                       User's browser                     │
│                                                          │
│   ┌──────────────────────────────────────────────────┐   │
│   │              React app (platform/)               │   │
│   │                                                  │   │
│   │   ┌───────────┐  ┌──────────┐  ┌─────────────┐   │   │
│   │   │ SkillTree │  │ LevelPane│  │ XP + Tier   │   │   │
│   │   │ (Cytoscape)  │ (markdown)  │ + Achievements  │   │
│   │   └───────────┘  └──────────┘  └─────────────┘   │   │
│   └──────────────────────────────────────────────────┘   │
│           ▲                              │               │
│           │ fetch                        │ fetch+write   │
└───────────┼──────────────────────────────┼───────────────┘
            │                              │
            ▼                              ▼
    ┌───────────────┐             ┌────────────────┐
    │ curriculum/   │             │ progress.json  │
    │   levels/*.md │             │  (gitignored   │
    │   meta.json   │             │   in user fork)│
    └───────────────┘             └────────────────┘
                    ▲                   ▲
                    │ read/write        │ read/write
                    └──────────────┬────┘
                                   │
                        ┌──────────────────────┐
                        │  Claude Code session │
                        │  (slash commands)    │
                        └──────────────────────┘
```

**Key principles:**

- **Markdown is the source of truth.** Levels, notes, and progress live as human-readable files under version control (progress.json is per-user, gitignored in forks).
- **Runtime parsing.** The app fetches and parses markdown at runtime via `remark` + `gray-matter`. Adding a level = drop a file + refresh. No rebuild, no redeploy.
- **The app reads, Claude writes.** Mutations (marking a level done, updating XP, adding achievements) flow through Claude slash commands that operate on markdown/JSON. The UI can also perform a small set of writes (mark done, toggle status) for users who don't use Claude.
- **Domain-agnostic platform.** The `platform/` directory contains zero AI-specific code. All AI content lives in `curriculum/`.

## 6. Curriculum design

### 6.A — Gamification model

**Atomic unit: the Level.** Each lesson is one level, stored as a self-contained markdown file with YAML frontmatter.

**Two parallel tracks:**

- **Track A — Foundations** (`F##` IDs): textbook + problem sets, strict bottom-up, ~120 levels
- **Track B — Frontier** (`P##` IDs): paper-reading + reproduction, scaffolded for cold-start, ~80 levels

**Progression mechanics:**

- **Levels unlock** when their `prereqs` (list of level IDs) are all completed. Non-linear — multiple levels can be in-progress at once.
- **XP** is awarded on completion. `xp` in frontmatter = estimated hours to complete.
- **Tier bands** (decorative milestones by total XP):
  - Novice: 0–100
  - Apprentice: 100–400
  - Journeyman: 400–1000
  - Practitioner: 1000–2000
  - Specialist: 2000–3500
  - Researcher: 3500+
- **Boss levels** — mandatory capstones at the end of each major tier (produce an artifact: a from-scratch implementation, a reproduction, or a writeup).
- **Side quests** — optional branches (GNNs, causal inference, MLOps, safety, etc.). Can be attempted any time after prerequisites are met. Award XP; not required for main-path progression.
- **Achievements** — narrative milestones auto-triggered by specific events (e.g., "First Paper Reproduced", "Derived Backprop by Hand", "Implemented Transformer From Scratch", "Wrote Your First Explainer").

**Explicitly excluded mechanics:**

- No streaks, daily quotas, or decay
- No time limits on levels
- No "losing XP"
- No leaderboards in the default build (may be a future optional feature for forks)

### 6.B — Dual-track structure (Shape 3)

Both tracks run in parallel from day 1 with an informal **70% A / 30% B** weight balanced across weeks (not per session). A session = one sitting, any length. The learner picks Track A or Track B per session based on mood/energy.

**Track B scaffolding schedule** (key cold-start adaptation):

- **P01–P15 "Annotated Companion":** paper + a famous explainer (Karpathy, Lilian Weng, Distill, 3Blue1Brown) side-by-side. Goal: paper-reading *stamina*, not full comprehension.
- **P16–P35 "Semi-guided":** paper + light walkthrough + three self-answered comprehension questions.
- **P36+ "Raw":** paper + blank page. Learner writes the explainer from scratch. This is the research-grade habit.

**Cross-referencing:** Every Track B level names the Track A levels that unlock deeper understanding. Example:

> P08 — "Attention Is All You Need"
> You'll understand ~40% now; F22 (linear algebra of attention), F41 (softmax + Jacobians), and F58 (RNN context) will each unlock more.

### 6.C — Level file format

Every level lives at `curriculum/levels/<track>/<id>_<slug>.md`:

```markdown
---
id: F14
title: Gradient Descent Intuition
track: A                       # A or B
tier: 1                        # 0..8 (matches roadmap tier numbers)
xp: 6                          # estimated hours to complete
prereqs: [F10, F12, F13]       # level IDs required before this unlocks
unlocks: [F15, F18, P04]       # level IDs this level unlocks (for graph rendering)
status: pending                # pending | in-progress | done  (authored as pending)
completed_at: null             # ISO date when marked done; null until then
tags: [optimization, calculus] # free-form for search/filter
achievements: []               # achievement IDs triggered on completion
---

## Why this level matters (lineage)

**Classical root:** Cauchy (1847) — steepest descent.
**Modern descendants:** SGD → Adam → AdamW → Lion; the optimizer family used in every
deep learning model today.

## Objectives

- Derive the GD update rule from a first-order Taylor expansion
- Understand learning rate geometrically (step size on the loss surface)
- Implement vanilla GD on a 2D bowl and visualize trajectories

## Resources

- **Primary:** Deisenroth *Mathematics for Machine Learning* §7.1
- **Visual:** 3Blue1Brown — "Gradient descent, how neural networks learn"
- **Optional deep cut:** Boyd & Vandenberghe *Convex Optimization* §9.3

## Tasks

- [ ] Work through §7.1 problems 1–4 on paper
- [ ] Code `gd.py` — minimize f(x,y) = x² + 10y², plot trajectory for 3 learning rates
- [ ] Write a one-paragraph "what I learned" note in `notes/F14.md`

## Done criteria

All three tasks checked. You can explain (aloud, to yourself, without notes) why a learning rate that is too high oscillates and one that is too low stalls.

## Bridge to modern

Once done, **P04 (Kingma & Ba — Adam)** becomes readable. Adam's entire innovation — per-parameter adaptive learning rates — is a direct extension of the step-size geometry you just built intuition for.
```

**Authoring rules:**

- Every level must include a **"Why this level matters (lineage)"** section naming at least one classical root and at least one modern descendant (or vice versa for Track B).
- `xp` is honest effort estimate in hours; the platform assumes 1 XP = 1 hour of focused work.
- `prereqs` and `unlocks` should be kept consistent (if A lists B as a prereq, B should list A in unlocks).

### 6.D — Tier & branch roadmap

Tier structure (approximate level counts; exact counts firmed up during implementation):

| Tier | Name | Levels | Approx XP | Boss artifact |
|---|---|---|---|---|
| 0 | Prelude (setup, how to learn) | F00–F03, P01 | ~10 | none |
| 1 | Math Foundations | F04–F25 | ~120 | Derive backprop from scratch + implement in NumPy |
| 2 | Classical ML (+ Bayesian branch) | F26–F45 | ~120 | End-to-end Kaggle-style project with writeup |
| 3 | Symbolic AI / GOFAI | F46–F52 | ~40 | Implement MCTS on tic-tac-toe and connect-4 |
| 4 | Deep Learning (+ CV, + generative) | F53–F80 | ~200 | Implement a transformer from scratch, train toy translation |
| 5 | Reinforcement Learning | F81–F95 | ~120 | Solve CartPole with REINFORCE, then LunarLander with PPO |
| 6 | LLMs (+ retrieval, multimodal, evals, interp) | F96–F115 | ~200 | Fine-tune and deploy a small instruction-following model |
| 7 | Agentic AI | F116–F125 | ~100 | Build an agent that solves a real end-to-end task |
| 8 | World Models | F126–F135 | ~120 | Reproduce a minimal Dreamer on a gym env |

**Side quests** (parallel, unlocked after their prereqs): `SQ-GNN`, `SQ-TimeSeries`, `SQ-Speech`, `SQ-Recsys`, `SQ-Robotics`, `SQ-Causal`, `SQ-MLOps`, `SQ-Safety` (★ recommended), `SQ-DevDashboard` (optional meta — the learner themselves could contribute platform features).

**Track B** runs alongside: roughly 1 P-level per 3 F-levels, with explicit cross-references as described in 6.B.

**Honest calendar estimate** at opportunistic pace (≈8 hrs/week when active): main spine + bosses ≈ 2–3 years; all side quests ≈ 3.5–5 years total. No deadline; this is a ladder, not a race.

### 6.E — Connecting classical to modern (required thread)

Every level file must honor the **"lineage"** thread — a mandatory section that connects old to new. Examples of the bridges the curriculum will explicitly build:

| Classical | Modern descendant(s) |
|---|---|
| Perceptron (1958) | MLP → transformer attention |
| Bellman equations | Q-learning → DQN → PPO → RLHF / GRPO |
| Symbolic planning (STRIPS) | MCTS → MuZero → LLM tree-of-thought planners |
| Nonequilibrium thermodynamics + score matching | Diffusion models → Sora |
| Convolution (signal processing) | CNN → ViT (inductive biases relaxed) |
| tf-idf / BM25 (classical IR) | Dense retrieval → RAG |
| PCA (Pearson, 1901) | Autoencoders → VAEs → representation learning |
| Expectation-Maximization | Variational inference → VAEs → diffusion training |

This is not decorative. It is the primary pedagogical mechanism.

## 7. Platform design

### 7.A — Repository layout

```
road-to-ai/                           # monorepo root (public)
├── README.md                         # project overview, fork instructions, demo link
├── LICENSE                           # MIT (repository root)
├── LICENSE-CONTENT                   # CC-BY-SA 4.0 (covers curriculum/)
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── CHANGELOG.md
├── .gitignore                        # includes progress.json at root + in forks
├── .github/
│   ├── workflows/
│   │   └── pages.yml                 # GitHub Actions: build platform, deploy to Pages
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       ├── curriculum_correction.md
│       └── feature_request.md
│
├── platform/                         # MIT-licensed React app (domain-agnostic)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── index.html
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── SkillTree.tsx         # Cytoscape wrapper
│   │   │   ├── LevelPane.tsx         # renders a level markdown with remark
│   │   │   ├── XpBar.tsx
│   │   │   ├── TierBadge.tsx
│   │   │   ├── AchievementShelf.tsx
│   │   │   └── ProgressDashboard.tsx
│   │   ├── lib/
│   │   │   ├── curriculum.ts         # loads all level .md files, parses frontmatter
│   │   │   ├── progress.ts           # reads/writes progress.json
│   │   │   ├── graph.ts              # builds Cytoscape elements from levels
│   │   │   └── achievements.ts
│   │   ├── hooks/
│   │   └── styles/
│   └── README.md                     # platform-specific docs for forkers
│
├── curriculum/                       # CC-BY-SA 4.0 AI content (flagship)
│   ├── README.md                     # curriculum overview, tier map
│   ├── meta.json                     # tier names, achievement definitions, tier-band thresholds
│   ├── levels/
│   │   ├── track-a/
│   │   │   ├── F00_welcome.md
│   │   │   ├── F01_dev_environment.md
│   │   │   └── ...
│   │   └── track-b/
│   │       ├── P01_karpathy_software2.md
│   │       └── ...
│   └── achievements/
│       └── definitions.md            # human-readable list of all achievements
│
├── progress.json                     # PER-USER, gitignored in all forks
│                                     # schema: completed level IDs, xp, achievements, timestamps
│
├── notes/                            # learner's explainer notes (gitignored in forks)
├── notebooks/                        # learner's Jupyter work (gitignored in forks)
├── papers/                           # downloaded papers for Track B (gitignored)
│
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-04-15-road-to-ai-curriculum-and-platform-design.md   # this file
│
├── CLAUDE.md                         # project-root — tells future Claude sessions how to behave here
├── .claude/
│   └── commands/
│       ├── status.md
│       ├── lesson.md
│       ├── level-up.md
│       ├── paper-week.md
│       ├── review.md
│       ├── tree.md
│       └── new-level.md
```

### 7.B — Tech stack

| Concern | Choice | Rationale |
|---|---|---|
| Build | Vite | Fast, zero-config, modern default |
| Language | TypeScript (strict) | Catches bugs; expected for OSS contribution in 2026 |
| Framework | React 19 | Largest contributor pool; `<ViewTransition>` enables elegant node transitions |
| Styling | Tailwind CSS v4 | Fast UI iteration; no bespoke CSS |
| Graph viz | Cytoscape.js | Battle-tested, handles 200+ nodes, pan/zoom/select built in |
| Markdown | remark + remark-gfm + gray-matter | Frontmatter parsing + GFM support |
| State | Zustand | Minimal, zero-boilerplate, suits single-user local state |
| Testing | Vitest + React Testing Library + Playwright | Standard stack for Vite+React |
| Hosting | GitHub Pages | Free, static, auto-deploy from `main` via GitHub Actions |
| Package mgr | pnpm | Fast, efficient, widely adopted |
| CI | GitHub Actions | Lint + test + build + deploy on push to `main` |

### 7.C — Claude Code integration

The repository ships a `.claude/CLAUDE.md` and `.claude/commands/` so that any Claude Code session opened in this directory becomes a capable study companion. Forkers who don't use Claude lose nothing — the platform works standalone via its web UI.

**Slash commands** (each implemented as a markdown file in `.claude/commands/`):

- `/status` — summarize current Track A level, Track B level, XP, tier, recent achievements, and suggest the next session's focus.
- `/lesson` — open the current in-progress level (or the next unlocked one), guide the learner through it, and answer questions scoped to that level's resources.
- `/level-up <id>` — mark a level as `done`, update `progress.json` with timestamp + XP delta, flip newly unlockable levels to `pending`, check achievement triggers, and report XP/tier changes.
- `/paper-week` — alias for `/lesson` targeted at the current Track B level.
- `/review` — pick a random completed level and quiz the learner on its done criteria (lightweight spaced repetition).
- `/tree` — print the skill tree with completion state (web app shows it visually; this is the terminal fallback).
- `/new-level <id>` — scaffold a new level file from the template, wire prereqs/unlocks, update `meta.json`.

**`CLAUDE.md`** (at project root) enforces:

- Project purpose and the Shape 3 dual-track model
- The cold-start learner's tone requirement (ground jargon, explain notation)
- The classical → modern lineage rule (every teaching response names both)
- No time-pressure mechanics (never suggest streaks or quotas)
- The read/write contract: app reads, Claude writes via commands
- File layout conventions

### 7.D — progress.json schema

```json
{
  "version": 1,
  "user": "xavier",
  "xp_total": 0,
  "tier": "Novice",
  "started_at": "2026-04-15",
  "last_session_at": null,
  "levels": {
    "F00": { "status": "done",        "completed_at": "2026-04-16" },
    "F01": { "status": "in-progress", "started_at":   "2026-04-17" },
    "F02": { "status": "pending" }
  },
  "achievements": [
    { "id": "first-level",   "earned_at": "2026-04-16" }
  ],
  "stats": {
    "sessions":   0,
    "hours_logged": 0,
    "levels_done": 0
  }
}
```

`progress.json` is gitignored. The platform's `progress.ts` module handles atomic read-modify-write.

## 8. Build milestones

Four milestones; each ends with a push to `main` that triggers a GitHub Pages redeploy.

### M1 — Scaffold & live site (1 session)

- `jvloo/road-to-ai` public monorepo initialized
- Root `README.md`, `LICENSE`, `LICENSE-CONTENT`, `CONTRIBUTING.md`, `.gitignore`
- Vite + React 19 + TS + Tailwind v4 + pnpm scaffold under `platform/`
- GitHub Actions workflow: lint, test, build, deploy to Pages
- Placeholder landing page live at `https://jvloo.github.io/road-to-ai/`
- **Deliverable:** a public URL that renders a "Road to AI" placeholder

### M2 — Level loader & skill tree (1–2 sessions)

- `curriculum/meta.json` + `curriculum/levels/track-a/` with ~3 example levels
- `platform/src/lib/curriculum.ts` fetches and parses levels with frontmatter
- `SkillTree.tsx` renders Cytoscape graph with node styling: locked / unlocked / in-progress / done
- `LevelPane.tsx` opens on click; renders objectives/tasks/resources
- Basic responsive layout
- **Deliverable:** click a node, see its level; see the graph grow as levels are added

### M3 — Gamification core (1–2 sessions)

- `progress.ts` — atomic read/write of `progress.json`
- `XpBar.tsx` + `TierBadge.tsx` + `AchievementShelf.tsx`
- "Mark done" action in `LevelPane` updates `progress.json` and re-renders graph
- Achievements engine with ~6 starter achievements
- `ProgressDashboard.tsx` summary screen (home)
- **Deliverable:** complete a level in the UI, see XP go up, achievements fire

### M4 — Flagship content + polish (1 session)

- First 15 Track A levels authored end-to-end
- Mobile-responsive refinements
- Dark mode (default: match system)
- Landing page with "Fork me and make your own curriculum" section
- `CONTRIBUTING.md` describes how to add a curriculum of any subject
- `CLAUDE.md` + all 7 slash commands authored
- **Deliverable:** the learner can start Tier 0 today

Total: ~5–7 focused Claude sessions (~10–20 working hours).

## 9. Publishing & maintenance

- **Versioning:** Semantic versioning. Platform and curriculum versioned independently via git tags: `platform-v0.1.0`, `curriculum-v0.1.0`.
- **Release cadence:** push-to-main deploys immediately; version tags cut monthly at most.
- **Issue templates:** bug report, curriculum correction, feature request.
- **Contributing guide:** describes how to propose curriculum corrections, add a new side quest, or propose platform features.
- **Credit:** every curriculum level cites primary sources; every external explainer/video is linked rather than reproduced.
- **Legal:** MIT covers `platform/`; CC-BY-SA 4.0 covers `curriculum/`. Third-party resources are linked, not redistributed.

## 10. Success criteria

- **M1–M4 shipped.** Public URL live, first 15 levels available, first learner (Xavier) able to begin Tier 0.
- **First 6 months of learner use:** Xavier reaches Apprentice tier (100+ XP), completes at least one Track B "Annotated Companion" level, and uses the app weekly on average.
- **Platform reusability test:** a second fork exists with a different subject (even a toy one) and renders correctly.
- **No time-pressure mechanics** have been introduced by contributor PRs (or if proposed, rejected with reference to this spec).
- **Lineage rule holds:** every authored level has a populated "Why this level matters (lineage)" section.

## 11. Risks & open questions

- **XP calibration will drift.** Initial estimates of hours-per-level will be wrong. Plan a retrospective after the first 10 levels are completed and recalibrate.
- **Runtime markdown parsing at 200+ levels.** Benchmark during M2; if load time exceeds 1s on a mid-range laptop, introduce build-time pre-parsing with a lightweight JSON index (keeping markdown as source of truth).
- **Cold-start frustration on Track B.** If P01–P05 prove too difficult even with the annotated-companion scaffolding, insert a "P00 — How to read a paper: Keshav's three-pass method" level and loop through Karpathy + 3Blue1Brown videos before engaging with any paper.
- **Scope creep via side quests.** The 10 optional branches are real commitments. If Xavier wants to pause or drop one mid-curriculum, the modular design permits it; we do not re-plan the whole curriculum to account for drops.
- **Domain-agnosticism slippage.** Platform contributors may unintentionally hardcode AI terms. Enforce with a CI grep check that flags forbidden strings (e.g., "transformer", "LLM", "neural") in `platform/src/`.
- **Obsidian compatibility.** The markdown + YAML frontmatter format is Obsidian-compatible by accident. This is a feature; we should not break it.

## 12. Next steps

After spec approval:

1. Invoke `superpowers:writing-plans` to produce a detailed implementation plan for **M1–M4** plus scaffolding of the first 15 Track A levels.
2. Execute M1 (scaffold + live placeholder site).
3. Iterate M2 → M3 → M4 with review checkpoints between each.
4. Learner begins Tier 0 Prelude.

---

*End of design document.*
