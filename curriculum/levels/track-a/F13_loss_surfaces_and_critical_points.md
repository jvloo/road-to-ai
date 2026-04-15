---
id: F13
title: Loss Surfaces, Critical Points, and the Shape of Optimization
track: A
tier: 1
xp: 4
prereqs: [F12]
unlocks: [F14]
status: pending
completed_at: null
tags: [math, calculus, optimization]
---

## Why this level matters (lineage)

**Classical root:** **Euler** and **Lagrange** in the 1750s laid down the first-order condition for extrema: $\nabla f = \mathbf{0}$. The second-order classification via the **Hessian matrix** $H$ — minimum if $H \succ 0$, maximum if $H \prec 0$, saddle otherwise — was made rigorous by 19th-century analysts and codified in the 20th century in the theory of **convex optimization** (Boyd & Vandenberghe, 2004), whose elegance rests on the fact that convex problems have *no* bad local minima.
**Modern descendant:** Deep-net loss surfaces are **non-convex**, with astronomical numbers of parameters and critical points. For a long time this was considered fatal. Then came **Choromanska et al. (2014)**, *The Loss Surfaces of Multilayer Networks*, which argued that in high dimensions most critical points are saddle points, and the *minima* that gradient descent finds are clustered close in value to the global minimum. **Li, Xu, Taylor et al. (2018)**, *Visualizing the Loss Landscape of Neural Nets*, produced the now-iconic 3D renderings showing how wide, flat, "benign" basins dominate well-trained networks — a visual vindication of the 18th-century machinery, one dimension at a time.

## Objectives

- Identify **critical points** by the condition $\nabla f = \mathbf{0}$ and classify them using the **Hessian**.
- Recognise a convex quadratic and its unique global minimum.
- Visualise a 2D loss surface with matplotlib and mark its critical point.

## Resources

- Deisenroth et al., *MML* **§7.1** (optimization using gradient descent) — preview for F14.
- Boyd & Vandenberghe, *Convex Optimization*, §3.1 (convex sets) and §4.2 (convex optimization problems).
- Li, Xu, Taylor et al. (2018), *Visualizing the Loss Landscape of Neural Nets* — skim the figures; the paper's technique (filter normalisation) is itself a nice little trick.

## Tasks

- [ ] Write the **first-order condition** for a critical point. For $f : \mathbb{R}^n \to \mathbb{R}$,

  $$ \mathbf{x}^{\star} \text{ is a critical point } \iff \nabla f(\mathbf{x}^{\star}) = \mathbf{0}. $$

- [ ] Write the **second-order (Hessian) classification.** Let $H = \nabla^2 f(\mathbf{x}^{\star})$ be the matrix of second partials. Then

  | $H$ eigenvalues | classification |
  | --- | --- |
  | all $> 0$ (positive definite) | strict local **minimum** |
  | all $< 0$ (negative definite) | strict local **maximum** |
  | mixed signs | **saddle point** |
  | some zero | inconclusive (degenerate) |

- [ ] **By hand.** For $f(x, y) = x^2 + 10y^2$,

  $$ \nabla f = \begin{bmatrix} 2x \\ 20y \end{bmatrix}, \qquad H = \begin{bmatrix} 2 & 0 \\ 0 & 20 \end{bmatrix}. $$

  Set the gradient to zero to find the unique critical point at the origin. The Hessian is positive definite (eigenvalues $2$ and $20$), so $(0, 0)$ is a **strict minimum**. The mismatch in curvature ($20 \gg 2$) foreshadows the "narrow ravine" we will descend in F14.

- [ ] **Plot it.** Use `matplotlib` to draw a contour plot and mark the minimum:

  ```python
  import numpy as np
  import matplotlib.pyplot as plt

  xs = np.linspace(-5, 5, 200)
  ys = np.linspace(-2, 2, 200)
  X, Y = np.meshgrid(xs, ys)
  Z = X ** 2 + 10 * Y ** 2

  plt.contour(X, Y, Z, levels=20)
  plt.plot(0, 0, marker="*", markersize=14)      # the unique minimum
  plt.title("Contours of f(x,y) = x^2 + 10y^2")
  plt.xlabel("x"); plt.ylabel("y")
  plt.gca().set_aspect("equal")
  plt.show()
  ```

  You should see elongated ellipses — the level sets — with a star at the origin. The elongation is the same asymmetry that makes a single learning rate awkward in F14.

- [ ] One paragraph in `notes/F13.md`: *restate Choromanska's observation in your own words — why is non-convex optimization in high dimensions less scary in practice than convex theory would suggest?*

## Done criteria

You can state the first-order and Hessian-based second-order conditions, classify the critical point of $x^2 + 10y^2$ by hand, and produce the contour plot.

## Bridge to modern

```mermaid
flowchart LR
  euler["Euler–Lagrange<br/>1750s: ∇f = 0"] --> hessian["Hessian classification<br/>min / max / saddle"]
  hessian --> convex["Boyd &amp; Vandenberghe<br/>convex optimization"]
  convex --> nonconvex["deep-net loss surfaces<br/>non-convex but benign"]
  nonconvex --> viz["Li et al. 2018<br/>Visualizing the Loss Landscape"]
  viz --> trainers["modern training:<br/>wide flat minima generalize better"]
```

The shape of $\mathcal{L}(\boldsymbol{\theta})$ is what an optimiser navigates. In F14 we will drop a ball on this bowl and watch it roll.
