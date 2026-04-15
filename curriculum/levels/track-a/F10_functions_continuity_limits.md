---
id: F10
title: Functions, Continuity, and the ε-δ Definition of a Limit
track: A
tier: 1
xp: 4
prereqs: [F06]
unlocks: [F11]
status: pending
completed_at: null
tags: [math, calculus]
luminary: "Karl Weierstrass"
---

## Why this level matters (lineage)

**Classical root:** **Karl Weierstrass** replaced the loose "infinitesimal" language of Newton and Leibniz with the precise **ε-δ definition** of a limit in his Berlin lectures of the 1850s–60s. This is the moment calculus stopped being controversial and became rigorous. Combined with the **Stone–Weierstrass theorem**, his framework provides the formal skeleton on which all later analysis rests.
**Modern descendant:** Every "derivative", "gradient", or "chain rule" you will invoke in machine learning is licensed by Weierstrass's ε-δ foundation. **Backpropagation** is just repeated application of the chain rule on compositions of *continuous* (and almost-everywhere differentiable) functions; that phrase "almost everywhere" is an analysis concept that only makes sense in his framework. More strikingly, the **universal approximation theorem** (Cybenko 1989; Hornik 1991) — the result that one-hidden-layer neural networks can approximate any continuous function on a compact set — is *proven using Stone–Weierstrass*. The theoretical justification for why deep learning should work at all traces straight back to a provincial high-school teacher in 1860s Prussia.

## Luminary spotlight — Karl Weierstrass (1815–1897)

Weierstrass spent fifteen years as an obscure high-school teacher in the small towns of Deutsch-Krone and Braunsberg, grading schoolboy Latin by day and working out the foundations of complex analysis by lamplight at night. A single 1854 paper on Abelian functions, published in *Crelle's Journal*, revealed the scope of his work and earned him an honorary doctorate and, within two years, a professorship in Berlin. He published comparatively little — most of the famous "Weierstrass theorems" reached the world through the painstaking lecture notes of his students — and he was legendary for the glacial clarity and ruthless rigour of those lectures. He is sometimes called the "father of modern analysis", a title that obscures how ordinary his circumstances were until he was almost forty, and how much of his reputation depends on students like Sofia Kovalevskaya who recorded and disseminated what he refused to rush into print.

## Objectives

- State the ε-δ definition of a limit and of continuity, and apply it to a simple function by hand.
- Identify where a function is continuous and where it is not, using the textbook catalogue (removable, jump, infinite discontinuities).
- See how the **Stone–Weierstrass theorem** is the formal ancestor of the **universal approximation theorem** for neural networks.

## Resources

- Spivak, *Calculus*, Chapter 5 (limits) and Chapter 6 (continuity).
- 3Blue1Brown, *Essence of Calculus*, episode **E1 (The essence of calculus)** and **E7 (Limits)**.
- Cybenko (1989), *Approximation by superpositions of a sigmoidal function* — a classic two-page proof that uses Weierstrass-type density arguments; skim it, don't try to follow every step yet.

## Tasks

- [ ] Write down the formal definition. A function $f$ is **continuous at $a$** iff for every $\varepsilon > 0$ there exists $\delta > 0$ such that

  $$ |x - a| < \delta \;\Longrightarrow\; |f(x) - f(a)| < \varepsilon. $$

  Translate into plain English: *given any target tolerance on the output, I can find a tolerance on the input that guarantees it.*
- [ ] By hand, prove $\lim_{x \to 2} (3x + 1) = 7$ from the definition. Given $\varepsilon > 0$, pick $\delta = \varepsilon / 3$ and show the implication holds.
- [ ] Identify the discontinuity. Sketch

  $$ f(x) \;=\; \begin{cases} x + 1 & x < 0 \\ 2 & x = 0 \\ x^2 & x > 0 \end{cases} $$

  ```text
   y
   |
   |      .  .  .       * (the isolated point at x=0, y=2)
   |    .
   |  .                 .
  -+----o---------.-------  x
   |  .           . .
   |.                       o = open (limit from the left: y -> 1)
   |                        * = filled point (f(0) = 2)
  ```

  At $x = 0$: the left limit is $1$, the right limit is $0$, and $f(0) = 2$. All three disagree — a **jump** discontinuity (with a redefined value on top).
- [ ] One paragraph in `notes/F10.md`: *state the universal approximation theorem in your own words, and say which property of neural networks it does — and does not — promise.* (Hint: it promises *existence* of a good approximation, not that gradient descent will *find* it.)

## Done criteria

You can write the ε-δ definitions from memory, produce a simple ε-δ proof for a linear function, classify discontinuities in a piecewise definition, and state in one sentence the link between Weierstrass and Cybenko's universal approximation theorem.

## Bridge to modern

A deep neural network with activation $\sigma$ is a composition

$$ f(\mathbf{x}) \;=\; W_L\,\sigma(W_{L-1}\,\sigma(\cdots\sigma(W_1\,\mathbf{x} + \mathbf{b}_1)\cdots) + \mathbf{b}_{L-1}) + \mathbf{b}_L. $$

The universal approximation theorem says: for any continuous target $g$ on a compact domain and any $\varepsilon > 0$, there exist weights $W_i, \mathbf{b}_i$ such that $\sup_{\mathbf{x}} |f(\mathbf{x}) - g(\mathbf{x})| < \varepsilon$. That is Weierstrass's ε, a century and a half later, scaled up to arbitrary function classes. **Continuity** is the hypothesis on $g$; **approximation in the sup-norm** is the conclusion; and the proof is a descendant of Stone–Weierstrass. Get the definition under your belt here — you will use it every time you take a derivative in F11–F14.
