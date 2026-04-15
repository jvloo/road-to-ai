---
description: Scaffold a new level file from the template
arguments: "<id> <slug>"
---

Create `curriculum/levels/track-a/<ID>_<slug>.md` (or track-b/ if id starts with "P"):

Use this template, replacing `<...>` placeholders:

    ---
    id: <ID>
    title: <Title>
    track: <A|B>
    tier: <0-8>
    xp: <estimated hours>
    prereqs: []
    unlocks: []
    status: pending
    completed_at: null
    tags: []
    luminary: null
    glossary_terms: []
    ---

    ## Why this level matters (lineage)
    Classical root: <...>
    Modern descendants: <...>

    ## Objectives
    - <...>

    ## Resources
    - <...>

    ## Tasks
    - [ ] <...>

    ## Done criteria
    <...>

    ## Bridge to modern
    <...>

After creating the file, remind the user to update the prereq level's `unlocks: []` field to include this new level's id.
