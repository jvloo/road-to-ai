---
description: Mark a level done, update progress, award XP, check achievements
arguments: "<level-id>"
---

Given a level id (e.g. `F14`):

1. Find the level in `curriculum/levels/track-a/` or `track-b/`.
2. Read `progress.json` (or create default shape if missing).
3. If level already done, stop and report.
4. Update `progress.levels[id] = { status: "done", completed_at: <today> }`.
5. Add `level.xp` to `progress.xp_total`.
6. Recompute `progress.tier` from tier-bands in `curriculum/meta.json`.
7. Run achievement rules; append any new awards.
8. Write `progress.json`.
9. Report: XP gained, new tier (if changed), achievements earned, newly-unlocked level IDs.

Never use `git add -A` — add only `progress.json`.
