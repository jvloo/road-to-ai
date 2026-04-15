# Road to AI — Curriculum & Platform Design

**Status:** Draft for review
**Author:** Xavier Loo (<ping@xavierloo.com>)
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
luminary: "Augustin-Louis Cauchy"  # optional; null if no spotlight for this level
glossary_terms: [SGD, loss-surface, learning-rate]   # auto-linked terms from curriculum/glossary.md
recall_of: [F10, F12, F13]         # optional; overrides auto-pick for the recall header
quiz:                               # optional inline recall quiz rendered at end of level
  - q: "What happens if the learning rate is too high?"
    type: self-attest
  - q: "Which optimizer introduces per-parameter adaptive rates?"
    type: multiple-choice
    choices: [SGD, Adam, Momentum, RMSProp]
    answer: 1
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

## Luminary spotlight — Augustin-Louis Cauchy (1789–1857)

French mathematician who in 1847 published the method of steepest descent, the direct ancestor of every optimizer you will ever use. Cauchy invented it to solve astronomical orbit equations — the problem that set him up to also formalize modern rigorous calculus (ε-δ limits) and complex analysis. The entire Deep Learning stack rests on machinery he built two centuries before there was anything to optimize. *Worth remembering:* he published over 800 papers, more than anyone else in the 19th century.
```

**Authoring rules:**

- Every level must include a **"Why this level matters (lineage)"** section naming at least one classical root and at least one modern descendant (or vice versa for Track B).
- `xp` is honest effort estimate in hours; the platform assumes 1 XP = 1 hour of focused work.
- `prereqs` and `unlocks` should be kept consistent (if A lists B as a prereq, B should list A in unlocks).
- `luminary` is optional. When set, the level body must include a **"Luminary spotlight"** section of 3–5 sentences (see Section 6.F for format).
- `glossary_terms` is optional. When set, every mention of a listed term in the body becomes a hoverable chip linked to the global glossary (see Section 6.G).
- Lesson-specific clarifications use inline markdown footnotes (`[^1]`) rather than glossary entries (see Section 6.G).
- `recall_of` is optional; if omitted, the platform auto-selects 3 recently-completed levels for the recall header (see Section 6.I).
- `quiz` is optional; when present, it renders an inline recall quiz at the bottom of the level pane (see Section 6.I).

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

### 6.F — Luminary Spotlights

Some lessons (not all) introduce a **luminary** — a researcher, mathematician, pioneer, or thinker whose work is central to that lesson. Mixing classical pioneers (Turing, Shannon, Cauchy, McCarthy, Minsky, Pearl, Boltzmann) with modern torchbearers (Hinton, LeCun, Bengio, Sutton, Schmidhuber, Karpathy, Hassabis, Sutskever, Silver, Goodfellow, Kingma, Chollet, Ng, Fei-Fei Li) gives the curriculum a human spine alongside its conceptual one.

**Why this feature matters:**

- Ideas are remembered better when tied to a person with a story.
- A lot of "lineage" in AI is literally **teacher→student chains** — Hinton trained Sutskever; Sutton trained Silver; LeCun trained Bengio's collaborators. Surfacing these chains makes the research world feel connected rather than random.
- Reading papers is easier once you recognize author names and know what each person tends to work on. Building this recognition early compounds for years.

**Mechanics:**

- Optional per level; target frequency is ~1 in 3 levels (no quota enforced — some levels don't have an obvious primary figure).
- Controlled by the `luminary: <name> | null` frontmatter field on the level file.
- When set, the level body includes a **"Luminary spotlight"** section of 3–5 sentences covering:
  1. Who they are / were (with life dates)
  2. The specific contribution relevant to this lesson
  3. One iconic work, paper, or moment
  4. A human detail worth remembering (famous quote, career turn, surprising affiliation, known controversy)
- The same luminary may recur across multiple levels when their work spans tiers (e.g., Hinton appears in backprop, Boltzmann machines, capsule networks, and distillation).

**Selection rules (to avoid hagiography):**

- Prefer the person most directly tied to the lesson's central idea, not just the most famous name in the area.
- Mix eras. Don't skew to only 20th-century pioneers or only 2020s researchers.
- When multiple people co-discovered something (e.g., backprop: Rumelhart, Hinton, Williams — but also Linnainmaa, Werbos), name the most-cited and note the shared discovery honestly.
- Acknowledge controversies or failures briefly where they shaped the field (Minsky's 1969 *Perceptrons* critique delaying neural nets; the 1980s expert-systems bubble; ongoing safety debates).
- Do not reproduce copyrighted photos. Link to Wikimedia Commons or the researcher's personal/institutional page for imagery; render captions locally.

**Platform rendering:**

- `LuminarySpotlight.tsx` component displays a small card within `LevelPane` when `luminary` is non-null.
- A dedicated **Luminaries index page** (`/luminaries`) aggregates all spotlights so learners can browse by era, field, or alphabetically — and see how often each figure recurs across the curriculum.
- Click a luminary on one level → see every other level they appear in.

**Spotlight-triggered achievements** (examples, finalized in M3):

- `met-10-luminaries` — "You've been introduced to 10 researchers."
- `met-25-luminaries` — "25 faces, 25 stories."
- `turing-award-trio` — Met Hinton, LeCun, and Bengio (2018 Turing Award co-recipients).
- `classical-hall` — Met 10 pre-1990 pioneers.
- `modern-torchbearers` — Met 10 post-2010 researchers.
- `teacher-student-chain` — Met at least one full teacher→student chain (e.g., Hinton → Sutskever, or Sutton → Silver).

### 6.G — Glossary & Footnotes

Cold-start learners meet a lot of jargon. The curriculum provides three complementary tools so that a term can be learned in-context without derailing the reading flow.

**Tool 1 — Global glossary** (`curriculum/glossary.md`)

Single-file glossary where each `##` heading is a term (an acronym, jargon phrase, or concept). Shared across every level. Entries are short: 1–3 sentences plus optional "see also" links to other glossary terms and level IDs.

Example entry:

```markdown
## RLHF

**Reinforcement Learning from Human Feedback.** A post-training technique that uses human preference data to shape a language model's behavior after pretraining. Introduced at scale by OpenAI (InstructGPT, 2022); now commonly replaced or complemented by DPO and GRPO.

*See also:* [DPO], [GRPO], [F98-post-training], [P18-InstructGPT].
```

**Tool 2 — Per-level glossary opt-in** (frontmatter `glossary_terms`)

The level's frontmatter declares which glossary terms are used in the body. The platform auto-wraps every mention in the rendered body with a hoverable chip linked to the global glossary. Hovering shows the definition in a tooltip; clicking opens the full entry in a slide-over panel.

This is opt-in per level (not automatic full-text scan) so authors control where chips appear — otherwise a glossary-heavy level would become a wall of blue underlines.

**Tool 3 — Inline footnotes** (standard markdown footnotes)

For lesson-specific clarifications and caveats that don't generalize — a one-off historical note, a warning, a linked resource. Uses GitHub-flavored markdown footnote syntax (`[^1]`), rendered as superscript in-line and listed at the bottom of the level pane.

Example:

```markdown
Adam's default β₂ is 0.999[^1], which means the second-moment estimate
effectively averages over ~1000 steps.

[^1]: This default comes from Kingma & Ba 2014; some recent work argues
      β₂ = 0.95 is better for LLM training. See Chinchilla footnote 3.
```

**When to use which:**

| Situation | Tool |
|---|---|
| Recurring acronym or jargon | Global glossary + `glossary_terms` |
| One-off clarification, caveat, or aside | Inline footnote |
| Named person | Luminary spotlight (6.F) |
| Classical ↔ modern conceptual link | Lineage section (6.E) |

**Authoring rules:**

- Glossary entries stay short (3 sentences max). Depth belongs in levels.
- "See also" links use `[term]` for other glossary entries and `[Lxx-slug]` for level references.
- Footnotes should be rare — more than 3 per level usually means those items want to be glossary entries instead.
- Every glossary term must list the first level where a learner is expected to meet it (the "first-seen" level), to help pacing reviews.

**Platform rendering:**

- `Glossary.tsx` — renders `/glossary` as a searchable, alphabetical, filter-by-tier page.
- `GlossaryChip.tsx` — inline hoverable chip used inside `LevelPane`.
- `FootnoteList.tsx` — renders footnote list at the bottom of a level; scroll-syncs with inline superscripts.
- A term's glossary page shows every level it appears in (reverse index) so learners can jump to an earlier context.

**Glossary-related achievements:**

- `glossary-trailblazer` — encountered 25 glossary terms in context
- `footnote-spelunker` — opened 50 footnotes (fun counter, no real gate)

### 6.H — Visual & Interaction Design

Text-heavy learning material burns out cold-start learners fast. Both the platform and the curriculum treat **visual variety and gentle playfulness** as first-class features — not decoration added at the end.

**Content-level visuals (authored directly in level markdown):**

| Feature | Tool | Use case |
|---|---|---|
| Diagrams | **Mermaid** (flow, sequence, state, class, gantt) | Architecture, algorithms, training loops |
| Math | **KaTeX** (inline `$...$` and block `$$...$$`) | Every non-trivial derivation |
| Static images | PNG/SVG under `curriculum/assets/<level-id>/` | Handwritten diagrams, matplotlib output |
| Code highlighting | **Shiki** with VS Code themes (light + dark) | All code blocks |
| Interactive widgets | Iframed React islands (optional, lesson-specific) | e.g., a gradient descent visualizer for F14 — ship when the lesson *really* benefits |

**Platform-level visual identity — inherits from `xavierloo.com`.**

The app's theme, palette, and typography follow the author's personal site at <https://xavierloo.com>. Exact tokens (hex codes, font stack, spacing scale) are extracted from the site's CSS during M2 and committed to `platform/src/styles/tokens.css`. This section defines the **principles**; the precise values are an implementation detail.

- **Palette philosophy — monochrome + one bright accent.**
  - Base: near-black text on near-white background in light mode (the xavierloo.com default); inverted for dark mode.
  - Accent: a single vibrant color (sampled from xavierloo.com — appears to be lime/neon or cyan) reserved for **state**, not decoration: in-progress level nodes, the "LIVE" dot, the XP increment flash, the currently-selected item.
  - Tier differentiation is **typographic and structural** (weight, border treatment, whitespace), not chromatic. Each tier may take a *tint* of the accent or a grayscale weight, never a fully different hue family. This is deliberate — the source site's restraint is part of what we're matching.
- **Typography stack** — extracted from xavierloo.com during M2:
  - UI sans: whatever the source site uses (likely a system stack or Inter-adjacent)
  - Monospace: whatever the source site uses (mono is a first-class element there — used for code-comment section headings, timestamps, technical markers)
  - Display serif: **only** if the source site uses one; otherwise omitted (the earlier spec draft recommended Fraunces/Newsreader — replaced by whatever the site actually uses, which appears cleaner and more sans-dominant)
  - Loaded via `@fontsource/*` packages where the site's fonts have open licenses; otherwise via the same system fallback the site uses.
- **Signature pattern — code-comment section dividers** (adopted from xavierloo.com):
  - Major sections of the app use markers styled as developer comments: `// foundations`, `// frontier`, `// luminaries`, `// glossary`, `// progress`
  - Inside level panes: sub-section markers like `// objectives`, `// tasks`, `// lineage`, `// recall`, `// quiz`
  - This is the app's strongest visual tie to the source site and becomes its authorial fingerprint.
- **Motion:**
  - React 19 `<ViewTransition>` for graph and page transitions (direction-aware: forward/back)
  - Framer Motion for small accent animations (XP bar fill, achievement pop, level-card hover)
  - All under 300ms; `prefers-reduced-motion` fully honored
  - No hero parallax, no scroll-jacking — matching the source site's calm tone.
- **Layout:**
  - Skill tree = "world map" feeling (ample whitespace, pan/zoom, node placement uses tier ordering rather than tier color)
  - Level pane = readable long-form (generous line-height, max-width ~72ch, near-white / near-black background per theme)
  - `/luminaries` = portrait-card grid with era tabs, but still monochrome with accent for "met/unmet" state
  - `/glossary` = tight list with sticky A–Z jump bar; terms rendered in the monospace face to fit the source site's feel
- **Dark mode:** xavierloo.com currently has no dark mode. Road to AI ships dark mode anyway (learners read at night), designed as a faithful inversion of the light theme rather than a separate palette.

**Playfulness rules (the "reasonably" boundary):**

- Playfulness comes from **typographic wit** (the code-comment dividers, mono-set level IDs, deliberate copy tone) and **gentle motion**, not from cartoon illustrations, confetti, gradients, or mascots.
- One soft optional chime on level-up (default off, toggled in Settings). No loud sound effects.
- XP bump is a quiet pulse + number count-up; an achievement unlock gets a single accent flash on its badge, not a banner.
- No tier-rainbow — the palette stays disciplined. If a learner wants to know which tier they're in, the typography and section markers tell them.

**Authoring guidance (for curriculum authors):**

- A level without at least one diagram, equation, image, or code block is probably too abstract for a cold-start learner. Aim for **≥1 visual element per level**, ideally 2–3.
- Diagrams beat walls of prose. For anything sequential or spatial, write a Mermaid diagram first and write prose to fill the gaps.
- Every boss-level deliverable should itself produce a visual artifact (plot, diagram, animation) — this keeps the proof-of-learning tangible.

**Accessibility (non-negotiable):**

- All interactive elements keyboard-navigable
- Tier colors pass WCAG AA contrast in both light and dark modes
- KaTeX emits MathML fallback for screen readers
- `prefers-reduced-motion` honored on every animation path
- Skill tree has a keyboard-navigable list-view fallback for users who find graph interaction hard

### 6.I — Recall & Spaced Reinforcement

Learning without recall leaks. Three reinforcement tools work alongside the existing `/review` slash command to keep prior material fresh:

**Tool 1 — Auto-recall header (passive).**
Every level pane shows a small "Previously on your path…" strip above the main content with 3 bullets auto-generated from the 3 most recently completed levels' *done criteria*. It's passive (you read it without acting) but it nudges the ideas back into working memory before the new lesson starts. Authors can override the auto-pick with a `recall_of: [F10, F12, F13]` frontmatter field when specific previous levels are more relevant than the most-recent-three.

**Tool 2 — Recall Challenges (periodic).**
After every ~5 completed levels on a track, the platform inserts a **Recall Challenge** card — 3–5 questions drawn from recent levels' done criteria and quiz fields. Optional and dismissible; if attempted, awards a small XP reward (spaced reinforcement is its own reward — we don't over-incentivize this).

**Tool 3 — Level-authored quiz (lesson-specific).**
Levels may include an optional `quiz:` frontmatter field with 2–4 questions. Three question types are supported:

| Type | Use for | Grading |
|---|---|---|
| `self-attest` | "Can you explain X?" conceptual checks | Learner clicks yes/no; honest self-grade |
| `multiple-choice` | Discrete answer with unambiguous options | Platform-graded |
| `free-text` | Short reflective answers | Learner self-grades after revealing a model answer |

Rendered at the bottom of the level pane above the "Mark as done" action. No quiz blocks the `done` transition — even if the learner skips it, they can still mark the level complete (all grading is honor-system by design).

**Frequency summary:**

| Mechanic | Frequency | Interaction |
|---|---|---|
| Auto-recall header | Every level | Passive |
| Level quiz | When authored | Optional, inline |
| Recall Challenge | Every ~5 levels | Optional, modal card |
| `/review` slash command | On-demand | Active, via Claude |

**Recall-related achievements:**

- `recall-champion` — completed 10 Recall Challenges
- `no-shortcuts` — completed the inline quiz on 25 levels
- `memory-palace` — completed every Recall Challenge for one full tier

### 6.J — Highlight & Translate

Cold-start learners sometimes need to translate a passage to their native language to fully absorb nuance. The platform supports in-place translation without sending text off-device by default.

**Mechanics:**

- Select any text in a level pane → a floating popover (`SelectionPopover.tsx`) appears with four actions: **Translate**, **Copy**, **Save as note**, **Dismiss**.
- Translation target language is set in Settings (defaults to `navigator.language`, so "zh-CN", "ja", "es", etc.).
- The popover also exposes a **Save as note** action that drops the selection into `notes/<level-id>.md` with a timestamp and backlink — useful for building personal study notes without leaving the reader.

**Translation provider chain (priority order):**

1. **Browser Translation API** *(primary)* — Chrome 131+, Edge, Safari 18+. On-device, free, private. No text leaves the user's machine. Used automatically when available.
2. **External fallback** — a one-click link that opens Google Translate with the selected text pre-filled in the URL (opens a new tab). No API key; no egress from our app itself.
3. **Optional power user path** — user supplies a DeepL or OpenAI API key in Settings for higher-quality in-line translation with no tab-switching. Stored in `localStorage`, never committed.

**Settings page (`Settings.tsx`, new) — consolidates all user preferences:**

- Preferred translation language (dropdown, ~20 common options + custom)
- Translation provider preference (Auto / Browser-only / External link / API key)
- API key field (optional; obfuscated input; `localStorage` only)
- Theme (light / dark / system)
- Sound toggle (default off; see 6.H)
- Reduced motion (inherits OS default; can override)
- Font stack switcher (e.g., dyslexia-friendly mode)

**Privacy guarantees:**

- On-device translation is the default path when the browser supports it.
- External fallback requires an explicit user click (it's a link, not an automatic request).
- No user text is sent to any server by the platform itself — user-initiated external links are the only egress path unless the user configures an API key.
- `CLAUDE.md` prohibits Claude sessions from silently translating highlighted text; it must be invoked explicitly.

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
│   │   │   ├── LuminarySpotlight.tsx # renders the luminary card inside LevelPane
│   │   │   ├── LuminariesIndex.tsx   # aggregated /luminaries page
│   │   │   ├── Glossary.tsx          # /glossary page (searchable, alphabetical)
│   │   │   ├── GlossaryChip.tsx      # inline hoverable chip with tooltip+slide-over
│   │   │   ├── FootnoteList.tsx      # rendered at bottom of LevelPane, scroll-synced
│   │   │   ├── RecallHeader.tsx      # auto-recall strip at top of LevelPane
│   │   │   ├── RecallChallenge.tsx   # modal card every ~5 levels
│   │   │   ├── LevelQuiz.tsx         # inline quiz at bottom of LevelPane
│   │   │   ├── SelectionPopover.tsx  # floating translate/copy/save-note popover
│   │   │   ├── Settings.tsx          # settings page (translation, theme, motion, fonts)
│   │   │   ├── XpBar.tsx
│   │   │   ├── TierBadge.tsx
│   │   │   ├── AchievementShelf.tsx
│   │   │   └── ProgressDashboard.tsx
│   │   ├── lib/
│   │   │   ├── curriculum.ts         # loads all level .md files, parses frontmatter
│   │   │   ├── glossary.ts           # loads curriculum/glossary.md, builds term index
│   │   │   ├── progress.ts           # reads/writes progress.json
│   │   │   ├── graph.ts              # builds Cytoscape elements from levels
│   │   │   ├── recall.ts             # auto-picks recall items + drives RecallChallenge
│   │   │   ├── translate.ts          # provider abstraction + fallback chain
│   │   │   └── achievements.ts
│   │   ├── hooks/
│   │   └── styles/
│   └── README.md                     # platform-specific docs for forkers
│
├── curriculum/                       # CC-BY-SA 4.0 AI content (flagship)
│   ├── README.md                     # curriculum overview, tier map
│   ├── meta.json                     # tier names, achievement definitions, tier-band thresholds
│   ├── glossary.md                   # shared glossary — one ## heading per term
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
| Markdown | remark + remark-gfm + remark-math + gray-matter | Frontmatter + GFM + math syntax |
| Diagrams | Mermaid | In-level architecture and flow diagrams |
| Math | KaTeX (via `rehype-katex`) | Inline + block math rendering with MathML fallback |
| Code highlight | Shiki | VS Code themes, light + dark |
| Motion | Framer Motion + React 19 `<ViewTransition>` | Subtle accent animations, direction-aware page transitions |
| Icons | Lucide React | Clean, consistent, tree-shakeable |
| Fonts | `@fontsource/*` (Inter, Fraunces, JetBrains Mono) | Offline-capable, no CDN dependency |
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
- **Extract design tokens from <https://xavierloo.com>** — fonts, palette (including the accent color), spacing scale — and commit to `platform/src/styles/tokens.css` + Tailwind theme config
- Placeholder landing page live at `https://jvloo.github.io/road-to-ai/` using the extracted tokens, code-comment section dividers visible
- **Deliverable:** a public URL that renders a "Road to AI" placeholder in the xavierloo.com visual idiom

### M2 — Level loader & skill tree (1–2 sessions)

- `curriculum/meta.json` + `curriculum/levels/track-a/` with ~3 example levels
- `platform/src/lib/curriculum.ts` fetches and parses levels with frontmatter
- `SkillTree.tsx` renders Cytoscape graph with node styling: locked / unlocked / in-progress / done, tier-color accents
- `LevelPane.tsx` opens on click; renders objectives/tasks/resources with **Mermaid diagrams, KaTeX math, and Shiki code highlighting** working end-to-end
- Typography stack loaded via `@fontsource`; light + dark themes
- Basic responsive layout
- **Deliverable:** click a node, see its level; see diagrams, equations, and code render correctly

### M3 — Gamification core (1–2 sessions)

- `progress.ts` — atomic read/write of `progress.json`
- `XpBar.tsx` + `TierBadge.tsx` + `AchievementShelf.tsx`
- "Mark done" action in `LevelPane` updates `progress.json` and re-renders graph
- Achievements engine with ~6 starter achievements (including the first luminary-breadth achievement)
- `LuminarySpotlight.tsx` — renders the in-level luminary card
- `LuminariesIndex.tsx` — aggregated `/luminaries` page with browse-by-era and cross-references
- `glossary.ts` + `Glossary.tsx` + `GlossaryChip.tsx` + `FootnoteList.tsx`
- Sample `curriculum/glossary.md` with ~15 starter entries used by the M4 levels
- `recall.ts` + `RecallHeader.tsx` + `RecallChallenge.tsx` + `LevelQuiz.tsx`
- `SelectionPopover.tsx` + `translate.ts` + `Settings.tsx`
- `ProgressDashboard.tsx` summary screen (home)
- **Deliverable:** complete a level in the UI, see XP go up, achievements fire, meet a luminary, hover a jargon chip, read a recall header, highlight a line and translate it to your chosen language

### M4 — Flagship content + polish (1 session)

- First 15 Track A levels authored end-to-end (of which ~5 carry luminary spotlights, and every level has ≥1 visual element per 6.H)
- Code-comment section dividers applied consistently across skill tree, level pane, and sidebar
- Tier differentiation via typographic treatment (not distinct hues) per 6.H — verified in both light and dark modes
- `<ViewTransition>` + Framer Motion accents wired on level-up, navigation, achievement pops (all ≤300ms, reduced-motion honored)
- Mobile-responsive refinements
- Landing page with "Fork me and make your own curriculum" section, styled in the xavierloo.com idiom
- `CONTRIBUTING.md` describes how to add a curriculum of any subject, including luminary-spotlight and visual-authoring guidance
- `CLAUDE.md` + all 7 slash commands authored
- Side-by-side visual check against <https://xavierloo.com> — heading sizes, spacing scale, mono usage, accent treatment all feel consistent
- **Deliverable:** the learner can start Tier 0 today — and the app feels like it belongs in the xavierloo.com family

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
- **Luminary presence:** roughly 1 in 3 authored levels carries a luminary spotlight, and the `/luminaries` page aggregates at least 10 distinct figures by the end of M4.
- **Glossary presence:** the global glossary has ≥15 entries by M4 end, every authored level with jargon declares its `glossary_terms`, and chips render correctly in the body.
- **Visual density:** every M4 level contains ≥1 visual element (Mermaid diagram, equation, image, or code block). Per-tier accent colors visible and accessible (WCAG AA) in both themes.
- **Recall working end-to-end:** auto-recall header renders, at least one level has an authored quiz, one Recall Challenge fires after completing 5 levels in testing.
- **Translation working end-to-end:** text selection triggers the popover; on-device translation works on a supported browser; external fallback works on other browsers; language preference persists in Settings.

## 11. Risks & open questions

- **XP calibration will drift.** Initial estimates of hours-per-level will be wrong. Plan a retrospective after the first 10 levels are completed and recalibrate.
- **Runtime markdown parsing at 200+ levels.** Benchmark during M2; if load time exceeds 1s on a mid-range laptop, introduce build-time pre-parsing with a lightweight JSON index (keeping markdown as source of truth).
- **Cold-start frustration on Track B.** If P01–P05 prove too difficult even with the annotated-companion scaffolding, insert a "P00 — How to read a paper: Keshav's three-pass method" level and loop through Karpathy + 3Blue1Brown videos before engaging with any paper.
- **Scope creep via side quests.** The 10 optional branches are real commitments. If Xavier wants to pause or drop one mid-curriculum, the modular design permits it; we do not re-plan the whole curriculum to account for drops.
- **Domain-agnosticism slippage.** Platform contributors may unintentionally hardcode AI terms. Enforce with a CI grep check that flags forbidden strings (e.g., "transformer", "LLM", "neural") in `platform/src/`.
- **Glossary chip noise.** If too many terms are chipped in a single level, the body becomes visually noisy. Mitigation: `glossary_terms` is opt-in per level (not automatic), and authoring rule recommends chipping only on first/key occurrences.
- **Luminary photo licensing.** Reproducing photos is a copyright risk. Mitigation: photos are linked (not self-hosted) from Wikimedia Commons; if a figure has no free-use photo, the spotlight shows an initials avatar or a styled monogram instead.
- **Bundle size creep.** Mermaid + KaTeX + Shiki + Framer Motion are all non-trivial dependencies. Mitigation: dynamic-import per-level-pane for Mermaid/KaTeX (only loaded when a level actually uses them); Shiki themes lazy-loaded; bundle budget tracked in CI.
- **Visual-design bikeshedding.** Color palettes and font choices are infinitely tweakable. Mitigation: palette and type are **sourced from xavierloo.com**, not invented in this repo; changes require a one-line design-log entry in `docs/design-decisions.md` to avoid thrashing. If the source site changes significantly, we re-extract rather than drift independently.
- **Source site drift.** If xavierloo.com's design changes, the app can become stale relative to its source. Mitigation: the extracted tokens are versioned in `platform/src/styles/tokens.css` with a header comment noting the extraction date and source-site commit/snapshot. Periodic re-extraction can happen as a minor release.
- **Recall fatigue.** Too many Recall Challenges will annoy the learner. Mitigation: cadence is "after ~5 completed levels on a track," not every 5 calendar days; all challenges are dismissible; no punishment for skipping.
- **Translation API fragmentation.** The browser Translation API ships unevenly across browsers in 2026. Mitigation: external fallback is always present; user can opt into API key path; graceful degradation is designed in, not added later.
- **Spec scope expansion.** This document has grown significantly during brainstorming (recall, translate, visuals, luminaries, glossary, footnotes all added after initial design). Mitigation: all of these are now M3/M4 scope; any *further* additions from here will go into a "v2 features" list rather than expanding M1–M4.
- **Obsidian compatibility.** The markdown + YAML frontmatter format is Obsidian-compatible by accident. This is a feature; we should not break it.

## 12. Next steps

After spec approval:

1. Invoke `superpowers:writing-plans` to produce a detailed implementation plan for **M1–M4** plus scaffolding of the first 15 Track A levels.
2. Execute M1 (scaffold + live placeholder site).
3. Iterate M2 → M3 → M4 with review checkpoints between each.
4. Learner begins Tier 0 Prelude.

---

*End of design document.*
