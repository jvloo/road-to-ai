# Road to AI — UI/UX v2 Redesign Plan

> Author: Prof. Claude · Co-author: Xavier Loo (first learner)
> Date: 2026-04-15 · Status: draft, pending approval
> Supersedes the visual execution (not the curriculum design) of `2026-04-15-road-to-ai-curriculum-and-platform-design.md`.

## 0 · Thesis

**The v1 UI is a dashboard of widgets. It needs to be a trail.**

v1 arranges skill-tree, progress, achievements, stats, and "start here" as five disconnected vertical sections. It has no point of view. A learner landing on it sees a set of controls, not a journey, and has to manually reason about "where am I / what do I do next." That's what's making it feel lifeless despite the correct palette and typography.

A good learning product has one governing metaphor and lets it eat the page. For Road to AI, that metaphor is the **trail from the classical world to the frontier**. Every design decision in v2 should serve it.

## 1 · What's actually wrong with v1 (audit)

The skill tree, typography, and curriculum-load bugs are now fixed (commits `fa4e8fc`, `fe10acd`). What remains is the *design*:

| Symptom | Root cause |
|---|---|
| Home page is a vertical list of widgets with huge whitespace canyons | No hero, no hierarchy, no single focal point |
| Skill tree is rendered last, below the fold, in a plain bordered rectangle | The thing that should be the hero is treated as one widget among five |
| Progress / achievements / stats feel clinical and disconnected from the curriculum | They're dl/grid layouts, not part of the journey narrative |
| Level view is a narrow floating modal that closes with a tiny `[close]` text | A level is a *destination*, not an ephemeral dialog |
| No "continue where you left off" affordance anywhere | Returning visitors have to remember what they were doing |
| Luminaries, glossary, settings are in a tiny top nav with no teasing | Discovery relies on the learner noticing a 12px link |
| Track B (Frontier) is invisible in the home UI | Spec says dual-track; v1 only shows Track A |
| Dark mode is austere to the point of lifeless — three near-black surfaces with no depth | One surface level, no elevation, no glow, no texture |
| No "you are here" indicator anywhere | No avatar, no position marker, no path highlight |
| Lineage (classical → modern) is in the markdown but never in the chrome | The thing that makes Road to AI *different* is buried in content |

v1 succeeded at the engineering contract (file-based, tests passing, accessible, deployed). It failed at the product contract (*feels like a journey*).

## 2 · Design north star

### 2.1 The metaphor: a trail map

A trail has:
- A starting point
- A path you walk along
- Waystations (tier bands) with names (Novice · Apprentice · …)
- A current position marker ("you are here")
- Parallel routes (Track A Foundations + Track B Frontier)
- Side paths for optional branches (Symbolic AI, RL threads)
- Roadside plaques (luminaries) at their chronological place on the path
- Summit cairns (papers, boss levels)
- A visible destination (world models)

Every v2 layout decision should ask: *does this serve the trail metaphor?*

### 2.2 Principles (rules, not wishes)

1. **One hero per page.** Home = trail. Level = content. Never both-plus-four-other-sections on the same screen.
2. **Progress is always visible, never loud.** Small strip in the header, not a full-width section below the fold.
3. **Context beats features.** Every level page shows prev/next, trail position, luminary, lineage hint — not a floating modal cut off from the journey.
4. **Classical ⟷ modern is structural, not just content.** Every level pill shows a classical-root tag and a modern-descendant tag. Visible from the trail at a glance.
5. **Typography is a layout element.** Use the full scale (display / title / section / body / meta-mono) as structure, not just "bigger = more important."
6. **Dark by default, but with depth.** Four surface elevations, subtle accent glows, soft inner borders. No dead flat voids.
7. **Motion has meaning.** Hover reveals info. Transitions signal page shifts. Nothing animates just to be cute. Zero streak / countdown / pulse animations.
8. **Zero dopamine hacks.** No streaks, no daily goals, no pulsing notifications, no "3 days in a row!" banners. XP is a receipt. (Reconfirming the core spec rule.)

## 3 · Information architecture

**Routes** (hash-based, as today):

| Route | Purpose |
|---|---|
| `#/` | Home — trail + continue |
| `#/level/<id>` | Full-page level view (was a modal in v1) |
| `#/library` | Tabbed page: Luminaries · Glossary · Settings |

**Slide-in drawers** (not routes — in-context):

- Recall challenge (opens from level page when triggered by recall rules)
- Translate popover (already implemented, keep)
- Achievement toast (top-right, auto-dismissing)

**Removed from v1:**
- `#/luminaries`, `#/glossary`, `#/settings` as separate top-level routes (now tabs inside `#/library`)
- Modal-based LevelPage overlay
- Separate ProgressDashboard / AchievementShelf / XpBar as distinct home sections

## 4 · Page designs (wireframes)

### 4.1 Home — first visit (XP = 0)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  // ROAD-TO-AI                       TRAIL   LIBRARY   [⚙]   ☾ ▸ ☀        │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│    ROAD TO AI                                                              │
│    ═════════════════════════════════════════════                           │
│                                                                            │
│    A journey from Euclid to GPT. Classical math to frontier models,       │
│    self-paced, no streaks, no shortcuts, no pretending to understand.     │
│                                                                            │
│    ╭──────────────────────────────────────────────────────────────────╮   │
│    │  ▸ BEGIN HERE                                                    │   │
│    │                                                                  │   │
│    │     F00 · Welcome to Road to AI                                  │   │
│    │     1 XP · 10 minutes · meta tier                                │   │
│    │                                                                  │   │
│    │     [ Start F00  → ]                                             │   │
│    │                                                                  │   │
│    ╰──────────────────────────────────────────────────────────────────╯   │
│                                                                            │
│                                                                            │
│    // THE ROAD AHEAD                                                       │
│    ─────────────────                                                       │
│                                                                            │
│    ╭── TIER 0 · NOVICE ─────────────────────────────── 0 / 15 · 0 / 87 XP ╮│
│    │                                                                      ││
│    │  ○ F00 ○ F01 ○ F02 ○ F03 ○ F04 ○ F05 ○ F06 ○ F07 ○ F08 ○ F09       ││
│    │  ○ F10 ○ F11 ○ F12 ○ F13 ○ F14                                      ││
│    │                                                                      ││
│    │  luminaries: Ericsson · Van Rossum · Keshav · Gauss · Cauchy …       ││
│    ╰──────────────────────────────────────────────────────────────────────╯│
│                                                                            │
│    ╭── TIER 1 · APPRENTICE ─────────────────────────── locked · 100 XP   ╮ │
│    │  previewing: probability · classical ML · first paper week          │ │
│    ╰──────────────────────────────────────────────────────────────────────╯│
│                                                                            │
│    ...all 9 tiers, locked ones collapsed to a one-line preview...         │
│                                                                            │
│    // fork me: github.com/jvloo/road-to-ai · MIT + CC-BY-SA 4.0           │
└────────────────────────────────────────────────────────────────────────────┘
```

**What's doing work here:**
- A real display-size logotype as the hero — not `text-3xl`
- **One primary action** (start F00) in a card that's unmissable
- Trail immediately visible below with all tiers scoped, not as a separate widget
- Pills are small (~60px) so a whole tier fits on one or two rows
- Locked tiers are still visible but collapsed — preserving the "see the scope of the road" feeling
- No Progress / Achievements / Stats section at all when XP = 0 — there's nothing to show

### 4.2 Home — returning visitor (XP > 0)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  // ROAD-TO-AI              TRAIL   LIBRARY   [⚙]      14 XP · NOVICE ▸  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│    ROAD TO AI                                                              │
│    ═════════════                                                           │
│                                                                            │
│    ╭──────────────────────────────────────────────────────────────────╮   │
│    │  ▸ CONTINUE                                                      │   │
│    │                                                                  │   │
│    │     F02 · How to Read a Paper                                    │   │
│    │     Tier 0 Novice · 3 XP · 5–10 min · featuring S. Keshav        │   │
│    │                                                                  │   │
│    │     [ Open F02 → ]    skip to trail ↓                            │   │
│    ╰──────────────────────────────────────────────────────────────────╯   │
│                                                                            │
│    14 XP · 2 levels done · 1 luminary met · 3 glossary terms       →     │
│    ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  14 / 100  │
│                                                                            │
│    // THE ROAD AHEAD                                                       │
│    ─────────────────                                                       │
│                                                                            │
│    ╭── TIER 0 · NOVICE ────────────────────────────── 2 / 15 · 4 / 87 XP ╮│
│    │                                                                      ││
│    │  ● F00 ● F01 ▸ F02 ○ F03 ○ F04 ...                                  ││
│    │  ▲                                                                   ││
│    │  done  done  you here                                               ││
│    ╰──────────────────────────────────────────────────────────────────────╯│
│                                                                            │
│    ...rest of tiers below...                                              │
└────────────────────────────────────────────────────────────────────────────┘
```

**What changed on return:**
- Header shows XP + tier badge on the right (always visible in context)
- Hero is the **continue card**, not a generic landing hero
- One compact progress strip under the card — not three separate sections
- Trail highlights "you are here" with a clear position marker
- Luminaries / glossary / papers counts are a subtle one-liner, not a grid

### 4.3 Level page (replaces modal)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  // ROAD-TO-AI              TRAIL   LIBRARY   [⚙]      14 XP · NOVICE ▸  │
├────────────────────────────────────────────────────────────────────────────┤
│    ← trail                                                                 │
│                                                                            │
│    ← F01  Dev Environment                           F03  Numerical Stack →│
│                                                                            │
│    // FOUNDATIONS · TIER 0                                                 │
│                                                                            │
│    F02                                                                     │
│    How to Read a Paper                                                     │
│    ═════════════════════                                                   │
│                                                                            │
│    3 XP · 5–10 min · featuring Srinivas Keshav      [ ✓ mark done · +3 ]  │
│                                                                            │
│    ╭── LUMINARY ───────────────────────────────────────────────────╮      │
│    │  [SK]  Srinivas Keshav · computer scientist, U. Waterloo      │      │
│    │        Published the three-pass paper-reading method in 2007, │      │
│    │        now de facto standard in CS grad programs worldwide.   │      │
│    ╰───────────────────────────────────────────────────────────────╯      │
│                                                                            │
│    // PREVIOUSLY ON YOUR PATH                                              │
│    ─────────────────────────                                               │
│    ✓ F00 Welcome · ✓ F01 Dev Environment                                   │
│                                                                            │
│    // WHY THIS LEVEL MATTERS (LINEAGE)                                     │
│    ──────────────────────────────────                                      │
│    [properly-typeset content from markdown]                                │
│                                                                            │
│    // OBJECTIVES                                                           │
│    ─────────────                                                           │
│    [properly-typeset list]                                                 │
│                                                                            │
│    // QUIZ                                                                 │
│    ───────                                                                 │
│    [inline quiz]                                                           │
│                                                                            │
│    ╭──────────────────────────────────────────────────────────────╮       │
│    │   [ ✓ Mark done · +3 XP ]          skip for now               │       │
│    ╰──────────────────────────────────────────────────────────────╯       │
│                                                                            │
│    up next ─→  F03 · The Python Numerical Stack                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Key changes from the v1 modal:**
- **Full page**, not a floating overlay. You walked *into* this level; you're here now.
- **Prev / next in the top bar** — unlimited sequential navigation without bouncing back to the trail.
- **Luminary chip above the content**, not buried deep in the markdown.
- **"Previously on your path"** integrated into the chrome, not a markdown section.
- **Mark-done CTA appears twice** — once next to the title (sticky), once at the bottom. The one at the bottom is the "I finished reading" ritual button.
- **"Up next"** footer as the natural exit, not a close button.

### 4.4 Library page (tabbed — replaces 3 separate routes)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  // ROAD-TO-AI              TRAIL   LIBRARY   [⚙]      14 XP · NOVICE ▸  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│    LIBRARY                                                                 │
│                                                                            │
│    [ luminaries ]  [ glossary ]  [ settings ]                              │
│    ─────────────                                                           │
│                                                                            │
│    (tab content)                                                           │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

Luminaries tab is a grid of cards (portrait monogram / era / 1-line bio / "met on F02" badge). Glossary is a search-filterable list of term cards. Settings is a single-column form. Nothing fancy — just cohesive.

## 5 · Visual tokens (additions)

v1 has only one surface level and no fg hierarchy. v2 adds:

```css
/* elevation — four stacked surfaces, each 2–3% lighter than the last */
--color-surface-0: #060610;   /* page bg (today's --color-bg) */
--color-surface-1: #0c0c1a;   /* cards (today's --color-surface) */
--color-surface-2: #14142a;   /* hovered cards */
--color-surface-3: #1c1c3a;   /* active / pressed */

/* text hierarchy */
--color-fg-strong: #ffffff;   /* display type only */
--color-fg: #e4e4f0;          /* body */
--color-fg-muted: #8888aa;    /* meta */
--color-fg-faint: #4a4a6a;    /* locked, disabled */

/* accent with alpha for glows */
--color-accent: #22d3ee;
--color-accent-glow: rgba(34, 211, 238, 0.18);
--color-accent-glow-strong: rgba(34, 211, 238, 0.35);

/* shadows — used sparingly for elevation cues */
--shadow-card: 0 1px 0 0 rgba(255, 255, 255, 0.03) inset,
               0 12px 32px -16px rgba(0, 0, 0, 0.6);
--shadow-accent: 0 0 24px var(--color-accent-glow);

/* typography scale */
--text-display: clamp(2.5rem, 5vw, 4.5rem);  /* hero logotype */
--text-title: 2rem;                          /* page titles */
--text-section: 1.125rem;                    /* section headings */
--text-body: 1rem;                           /* content */
--text-meta: 0.75rem;                        /* monospace metadata */
```

Background gets a **very subtle grid grain** — a 1px dotted SVG pattern at ~2% opacity. Just enough to prevent the flat-void feeling.

## 6 · Component inventory

### Keep
- `Divider` (but use sparingly — not between every section)
- `LuminarySpotlight` → rename to `LuminaryChip`, add portrait slot (monogram fallback)
- `LevelQuiz`
- `RecallHeader` → becomes `RecallStrip` in the level chrome
- `SelectionPopover` (translate, unchanged)
- `Glossary`, `Settings` component bodies (reusable inside Library tabs)

### Replace
| v1 | v2 |
|---|---|
| `SkillTree` (Cytoscape) | `Trail` (tier-banded pill rows, HTML/CSS only) |
| `HomePage` | `HomePage` with `AppShell` + `Landing` or `ContinueCard` + `Trail` |
| `LevelPage` (modal overlay) | Full-page route `LevelView` with nav rail |
| `ProgressDashboard` | `ProgressStrip` (inline, one row) + `HeaderBadge` (XP + tier in header) |
| `AchievementShelf` (big box) | Compact pill cluster inside `ProgressStrip` + `AchievementToast` on unlock |
| `XpBar` (full-width card) | `ProgressStrip`'s embedded thin bar |

### New
- `AppShell` — header + main + toast region, one route-level wrapper
- `Header` — logotype on left, nav in middle, XP/tier badge on right
- `Landing` — hero + logotype + tagline + begin-here card (first visit)
- `ContinueCard` — hero card showing last-in-progress level (returning visit)
- `ProgressStrip` — one-row compact progress (XP / tier progress bar / counts)
- `Trail` — vertical stack of `TrailTierBand`s
- `TrailTierBand` — one tier: header (name · progress · xp) + level pill row + optional luminary line
- `LevelPill` — the small unit: 60–80px wide pill showing F-id + status dot, hover tooltip
- `LevelView` — full-page level page (replaces modal LevelPage)
- `LevelNavBar` — top-of-page prev / title / next
- `LevelHeader` — id + title + metadata + sticky mark-done button
- `LevelFooter` — mark-done CTA + up-next link
- `LibraryPage` — tabbed shell for luminaries / glossary / settings
- `LuminaryGrid` — grid of luminary cards with monogram placeholders
- `AchievementToast` — top-right slide-in notification on unlock

### Remove
- Modal overlay behavior of LevelPage
- Separate skill-tree viewport styling and Cytoscape dependency (unless retained for a future "advanced view" toggle — see §9)

## 7 · Phased implementation

Each phase is a self-contained, shippable improvement. Ship each phase on its own commit so we can bail or iterate without a big-bang rewrite.

### Phase R1 — Shell + tokens + landing (biggest visual win, smallest scope)
1. Add new tokens to `tokens.css` (elevation, fg hierarchy, glow, shadows, type scale)
2. Subtle background grid/grain in `globals.css`
3. Create `AppShell` + `Header` components
4. Create `Landing` (first visit) and `ContinueCard` (returning) components
5. Create `ProgressStrip` (compact one-row)
6. Update `HomePage` to use `AppShell` + conditional `Landing`/`ContinueCard` + `ProgressStrip`
7. **Do not touch the skill tree yet** — keep Cytoscape in place, just below the new hero section
8. Acceptance: home page has a dominant hero, clear primary action, no vertical widget canyons

*Estimated impact: **80% of the "feels alive" win**, because the above-the-fold experience is what users judge first.*

### Phase R2 — Trail component (replace skill tree)
1. Create `Trail`, `TrailTierBand`, `LevelPill` components
2. Compute tier grouping from `curriculum/meta.json` + loaded levels
3. Lock state per tier (based on XP gate from `meta.json` tier_bands)
4. Pill hover tooltip (level title, XP, lineage-root, lineage-modern, luminary name if any)
5. "You are here" marker (arrow above the next-pending level in the user's current tier)
6. Luminary inline line under the pill row
7. Replace `SkillTree` usage in `HomePage` with `Trail`
8. Remove `cytoscape` from `package.json` (save the advanced-view idea for post-v2)
9. Acceptance: every tier visible, all levels pill-visible, current position marked, locked tiers collapsed

*Estimated impact: the rest of the "feels alive" win. Trail is the defining artifact of the product.*

### Phase R3 — Level page as full route
1. Parse `#/level/<id>` in `App.tsx` routing
2. Create `LevelView` full-page component (use existing `LevelPane` content internals)
3. Create `LevelNavBar`, `LevelHeader`, `LevelFooter`
4. Wire prev/next to tier-ordered level sequence
5. Delete the modal overlay behavior from `LevelPage`
6. Update the continue card + pill click handlers to navigate via hash instead of `select()` state
7. Update the E2E smoke test to assert full-page nav works
8. Acceptance: clicking a pill or the continue card routes to `#/level/F02`, full page renders, prev/next works, close goes back to `#/`

### Phase R4 — Library page
1. Create `LibraryPage` with tab state (URL params: `#/library?tab=luminaries`)
2. Move `LuminariesIndex` content into a `LuminaryGrid` with monogram placeholders
3. Move `Glossary` body into the library glossary tab
4. Move `Settings` body into the library settings tab
5. Remove `#/luminaries`, `#/glossary`, `#/settings` routes from `App.tsx`
6. Acceptance: single library destination, tabs switch cleanly, deep-linkable

### Phase R5 — Motion + polish
1. Add `framer-motion` page transitions (crossfade between home ↔ level ↔ library)
2. Hover micro-animations on pills (scale 1.0 → 1.04, subtle glow)
3. `AchievementToast` component + wire to `markDone` flow
4. Keyboard nav: `←`/`→` on level view moves between levels; `esc` returns to trail; `j`/`k` on trail navigates pills
5. Focus rings everywhere they're missing
6. Audit all current warnings (cytoscape wheel sensitivity warning gone with R2, favicon.ico)
7. Acceptance: the app feels responsive and alive without being twitchy

### Phase R6 — Track B surfacing (stretch)
1. Extend `Trail` to show Track A and Track B side-by-side within each tier band (left half / right half)
2. Authors P01–P05 placeholder level files if none exist yet
3. Acceptance: Frontier track is visible in the UI, not just in the spec

## 8 · Effort + order

| Phase | Scope | Relative effort | Ship order |
|---|---|---|---|
| R1 Shell + landing | 6 components, 1 token file | M | **1st — biggest bang for buck** |
| R2 Trail | 3 new components, 1 removal | M | 2nd |
| R3 Level as route | 3 new components, 1 router change | M | 3rd |
| R4 Library tabs | 2 components, route cleanup | S | 4th |
| R5 Motion + a11y polish | small touches across many files | M | 5th |
| R6 Track B | extend Trail | S | stretch |

Total ≈ 6 working sessions. Each phase is one commit (or two if a review flags issues).

## 9 · Open questions (decide before R2)

1. **Keep Cytoscape at all?** Proposal: drop it. The Trail metaphor doesn't need a force-directed DAG. If a future "expert view" wants a DAG, we can add it as a `#/trail?view=graph` toggle — and at that point Cytoscape might not even be the right tool (d3-hierarchy or reaflow could be cleaner).

2. **Where do prereq edges live?** Proposal: don't draw them on the Trail. The left-to-right order within a tier is enough implicit structure; specific prereqs are listed in the level header text ("previously on your path: F10, F12"). Explicit edges add visual clutter for marginal info gain.

3. **Do tiers show pills for locked levels?** Proposal: yes, but dimmed to `--color-fg-faint`. Seeing the full scope of the road is part of the point. Hovering a locked pill shows "unlocks at 100 XP · tier Apprentice".

4. **Animation library buy-in?** `framer-motion` is already a dep. Use it in R5. Keep animations ≤ 300ms and respect `prefers-reduced-motion`.

5. **Header theme toggle?** Spec says dark-by-default, but the light mode already exists in tokens. Put a small sun/moon toggle in the header — zero cost, completes the theme story.

## 10 · Success criteria

At the end of R1 + R2, when the user loads the live app, they should feel:

- "This is a *journey*, not a control panel."
- "I know exactly what to do next without thinking."
- "I can see the whole road, and that's exciting, not overwhelming."
- "This looks like it was made by someone who cares, not someone who copy-pasted a skill-tree template."

At the end of R3 + R4, they should feel:
- "Navigating between levels feels like walking down a path, not opening and closing dialog boxes."
- "Everything has a home I can find."

At the end of R5 + R6, they should feel:
- "This moves beautifully."
- "I can see both tracks from day one."

## 11 · What's explicitly out of scope

These tempting ideas are deferred to a future redesign pass, not included in v2:

- Avatar / character / mascot on the trail
- Progress sound effects / chimes
- A literal winding-path SVG illustration (stretch for v3 if the tier-band layout feels too grid-like)
- Real luminary portraits (monograms are fine for v2)
- Interactive inline widgets inside levels (GD visualizer, eigenvalue playground, etc.)
- Community features, commenting, sharing
- Per-track separate trails on dedicated pages
- Dark/light mode transitions beyond a simple class toggle

## 12 · Next step

Stop. **Review this plan.** The biggest risk is not implementation — it's picking the wrong metaphor. If the trail-as-vertical-tier-bands doesn't feel right, the whole thing changes shape. Once we agree on §2 and §4, the rest is mechanical.

If approved, begin with **Phase R1** as its own commit, verify in the browser, review, then proceed to R2. Do not merge phases — each should be its own isolated, reviewable change.
