---
id: F08
title: Solving Linear Systems — Gaussian Elimination and Least Squares
track: A
tier: 1
xp: 5
prereqs: [F07]
unlocks: [F09, F11]
status: pending
completed_at: null
tags: [math, linear-algebra]
luminary: "Carl Friedrich Gauss"
---

## Why this level matters (lineage)

**Classical root:** **Carl Friedrich Gauss** published his elimination procedure in *Theoria Motus* (1809) and used it to compute the orbit of the newly-discovered asteroid **Ceres** from only three telescope observations — a dramatic demonstration that the right algebra could reveal structure buried in noisy data. He also gave us the **method of least squares** (in a priority dispute with Legendre), which recasts "no exact solution" as "closest solution" via the **normal equations** $A^{\top} A \mathbf{x} = A^{\top} \mathbf{b}$.
**Modern descendant:** Every linear regression you will ever fit — in scikit-learn's `LinearRegression`, statsmodels' `OLS`, TensorFlow's `tf.linalg.lstsq` — ultimately calls a LAPACK routine that is doing some carefully stabilised descendant of Gaussian elimination on the normal equations (or, for numerical reasons, a QR or SVD factorisation that solves the same system). The `solve` and `lstsq` subroutines sit under recommender systems, Kalman filters, PDE solvers, and the closed-form step of Gauss–Newton optimisation for nonlinear least squares. Two hundred years later, the astronomer's trick is industrial infrastructure.

## Luminary spotlight — Carl Friedrich Gauss (1777–1855)

Gauss was the stereotypical boy prodigy — the schoolroom legend of summing $1 + 2 + \cdots + 100$ in seconds by pairing terms appears to be, for once, roughly true — and by eighteen he had rediscovered the method of least squares. He kept a mathematical diary in which he recorded breakthroughs (non-Euclidean geometry, elliptic functions, complex analysis, the fundamental theorem of algebra) that he often declined to publish for fear of the "clamour of the Boeotians"; a generation of mathematicians later rediscovered his ideas and credited them back to his diary. In 1801 he used his least-squares machinery to predict where the lost asteroid Ceres would reappear, and was correct to within a fraction of a degree — an early, spectacular win for *data-driven inference*. He was also, by all accounts, a difficult colleague and a conservative academic politician who discouraged his own son from a career in mathematics, saying he did not want a second-rate name attached to his. Brilliance and decency are, unfortunately, independent variables.

## Objectives

- Solve a $3 \times 3$ system $A\mathbf{x} = \mathbf{b}$ by **Gaussian elimination** (forward elimination, back substitution).
- State the **normal equations** for the least-squares problem and derive them from $\min \|A\mathbf{x} - \mathbf{b}\|^2$.
- Use `np.linalg.solve` for square systems and `np.linalg.lstsq` for overdetermined systems, and know when each is appropriate.

## Resources

- Deisenroth et al., *MML* **§2.3** (solving systems of linear equations).
- Strang, *Introduction to Linear Algebra*, §1.3 and §4.3 (least squares).
- 3Blue1Brown, *Essence of Linear Algebra*, episode **E7** (inverse matrices and column space).

## Tasks

- [ ] By hand, solve

  $$ A\mathbf{x} \;=\; \mathbf{b}, \qquad A = \begin{bmatrix} 2 & 1 & -1 \\ -3 & -1 & 2 \\ -2 & 1 & 2 \end{bmatrix}, \quad \mathbf{b} = \begin{bmatrix} 8 \\ -11 \\ -3 \end{bmatrix}. $$

  Use row operations to reach upper-triangular form, then back-substitute. (Answer: $\mathbf{x} = (2, 3, -1)$.)
- [ ] Verify in NumPy and fit a straight line through three non-collinear points using least squares:

  ```python
  import numpy as np

  # square system: exact solution
  A = np.array([[ 2.0,  1.0, -1.0],
                [-3.0, -1.0,  2.0],
                [-2.0,  1.0,  2.0]])
  b = np.array([8.0, -11.0, -3.0])
  x = np.linalg.solve(A, b)
  print(x)                              # [ 2.  3. -1.]

  # overdetermined: best fit by least squares
  # fit y = m*t + c through three points that are NOT collinear
  t = np.array([0.0, 1.0, 2.0])
  y = np.array([1.0, 2.1, 3.9])
  M = np.vstack([t, np.ones_like(t)]).T  # design matrix, shape (3, 2)
  (m, c), residuals, rank, sv = np.linalg.lstsq(M, y, rcond=None)
  print(m, c)                            # slope and intercept
  ```

- [ ] Derive the normal equations. Starting from $\mathcal{L}(\mathbf{x}) = \|A\mathbf{x} - \mathbf{b}\|^2$, set $\nabla_{\mathbf{x}} \mathcal{L} = \mathbf{0}$ and show

  $$ A^{\top} A\,\mathbf{x} \;=\; A^{\top} \mathbf{b}. $$

- [ ] Short note in `notes/F08.md`: *why, numerically, do most libraries prefer QR or SVD over solving the normal equations directly?* (Hint: condition number of $A^{\top} A$.)

## Done criteria

You can solve a $3 \times 3$ system by Gaussian elimination on paper, you can write down the normal equations from the least-squares objective, and you can pick the right NumPy function (`solve` vs. `lstsq`) given the shape of $A$.

## Bridge to modern

Closed-form linear regression **is** the least-squares solution:

$$ \hat{\boldsymbol{\beta}} \;=\; (X^{\top} X)^{-1} X^{\top} \mathbf{y}. $$

When a statistics textbook writes this formula and when `sklearn.linear_model.LinearRegression().fit(X, y)` executes, both are invoking Gauss's idea — framed in 1809, still the default hammer two centuries later. Every "analytical solution" you will meet in classical ML — ridge regression, linear Gaussian Kalman filters, the **linear** approximation inside Gauss–Newton — is this same machinery with a regulariser or a weighting bolted on.
