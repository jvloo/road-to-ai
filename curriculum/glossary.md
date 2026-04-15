# Road to AI Glossary

## XP
**Experience Points.** Awarded on level completion; 1 XP ≈ 1 hour of focused work.

## Track A
**Foundations track.** Textbook + problem-set levels starting from math foundations.

## Track B
**Frontier track.** Paper-reading and reproduction levels, scaffolded for cold-start.

## REPL
**Read-Eval-Print Loop.** Interactive programming environment; Lisp (1958) is the ancestor; Jupyter notebooks are modern descendants.

## SGD
**Stochastic Gradient Descent.** Optimizer that updates parameters using gradients of a mini-batch; the workhorse of deep learning.

## Tier
A grouping of levels sharing a subject (e.g., Tier 1 Math Foundations, Tier 4 Deep Learning). Distinct from XP **tier bands** (Novice, Apprentice, ...).

## Prereq
A level that must be completed before another unlocks. Declared in frontmatter as `prereqs: [F10]`.

## Boss level
A mandatory capstone at the end of each tier that produces a concrete artifact (a trained model, a from-scratch implementation, a reproduction).

## learning-rate
**Learning rate (η).** The step size in gradient descent; too high causes oscillation, too low stalls progress. In modern deep learning, *schedulers* vary η across training (warmup, cosine decay).

## loss-surface
**Loss surface.** The multi-dimensional graph of the loss function over all parameters of a model. Training is a walk on this surface, seeking low-loss regions. Deep-net loss surfaces are non-convex but (surprisingly) "benign" — local minima tend to be close in quality to global minima (Choromanska 2014).
