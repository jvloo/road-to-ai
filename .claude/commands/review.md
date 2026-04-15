---
description: Spaced-repetition quiz on a random completed level
---

1. From `progress.levels` pick a random id whose status is "done".
2. Open its markdown file and extract the "Done criteria" section.
3. Without revealing the criteria verbatim, ask 2–3 questions that probe whether the learner still meets them.
4. After the learner answers, reveal the criteria, and give them a self-attest yes/no.
5. If yes, do nothing. If no, reset the level's status to "in-progress" in progress.json.
