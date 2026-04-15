---
id: F01
title: Dev Environment — Python, uv, Jupyter, Git
track: A
tier: 0
xp: 3
prereqs: [F00]
unlocks: [F02]
status: pending
completed_at: null
tags: [setup]
---

## Why this level matters (lineage)

**Classical root:** the REPL, born in Lisp (McCarthy, late 1950s) — an interactive loop for thinking in code.
**Modern descendant:** Jupyter notebooks, VS Code interactive Python, Colab, and Cursor — all direct descendants of the REPL idea. The workflow you set up here you'll use for every single subsequent level.

## Objectives

- Install a modern Python toolchain that you can reuse without version fights.
- Run a notebook locally and commit it to git.
- Confirm you can import numpy, matplotlib, and torch without errors.

## Resources

- [uv documentation](https://docs.astral.sh/uv/) — the fast Python package manager from Astral
- [Jupyter Lab quickstart](https://jupyterlab.readthedocs.io/en/stable/getting_started/starting.html)

## Tasks

- [ ] Install `uv`: `curl -LsSf https://astral.sh/uv/install.sh | sh` (macOS/Linux) or `irm https://astral.sh/uv/install.ps1 | iex` (Windows PowerShell).
- [ ] Create a project: `uv init rtai-scratch && cd rtai-scratch && uv add numpy matplotlib torch jupyterlab`
- [ ] Run `uv run jupyter lab` and open a notebook.
- [ ] In a cell, run `import torch; print(torch.__version__)`. If it prints a version, you're done.
- [ ] `git init`, commit the notebook.

## Done criteria

You can create a new Python project with one command, import torch in a notebook, and commit the result.

## Bridge to modern

Unlocks **F02 — How to Read a Paper**, which will rely on this environment for every reproduction exercise.
