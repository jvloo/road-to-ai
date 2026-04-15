---
description: Show current curriculum progress
---

Read `progress.json` at repo root (or report if missing) and report:

1. **Track A current:** ID + title of the lowest-ID level whose `status == "in-progress"`, or the next unlocked `"pending"` level.
2. **Track B current:** same, but filtered to `track: B`.
3. **XP:** `progress.xp_total`.
4. **Tier:** `progress.tier`.
5. **Recent achievements:** up to 3 most recent from `progress.achievements`.
6. **Suggested next session:** 1 sentence recommending A or B based on which is further behind.

Render in a compact block using `//` dividers.
