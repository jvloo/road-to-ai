---
id: F09
title: Eigenvalues, Eigenvectors, and Spectral Decomposition
track: A
tier: 1
xp: 6
prereqs: [F07, F08]
unlocks: [F11, F12]
status: pending
completed_at: null
tags: [math, linear-algebra]
---

## Why this level matters (lineage)

**Classical root:** **Augustin-Louis Cauchy** introduced the characteristic polynomial and proved (1829) that every real symmetric matrix has real eigenvalues — a result that underpins the **spectral theorem**. **James Joseph Sylvester**'s *law of inertia* (1852) sharpened the picture, classifying quadratic forms by the signs of their eigenvalues.
**Modern descendant:** The eigen-structure of a matrix is how we extract its *principal directions*. **PCA** is the eigendecomposition of a covariance matrix. **Power iteration** — the simplest eigenvalue algorithm — is, almost verbatim, the algorithm **Google's PageRank** (Brin & Page, 1998) uses to rank the web: the stationary distribution of a stochastic matrix is its dominant eigenvector. **Spectral clustering** uses the eigenvectors of a graph Laplacian to find community structure, and a current line of research applies PageRank-style spectral analysis to the attention matrices of transformers to find "important" tokens.

## Objectives

- State the eigenvalue equation $A\mathbf{v} = \lambda\mathbf{v}$ and explain what it says geometrically.
- Compute the eigenvalues of a $2 \times 2$ matrix by solving the characteristic polynomial $\det(A - \lambda I) = 0$.
- Use `np.linalg.eig` and interpret the output; recognise when a matrix is diagonalisable.

## Resources

- 3Blue1Brown, *Essence of Linear Algebra* — episode **E14 (Eigenvectors and eigenvalues)**.
- Deisenroth et al., *MML* **§4.1–4.4** (determinant, eigenvalues, eigendecomposition).
- Strang, *Introduction to Linear Algebra*, §6.1–6.2.

## Tasks

- [ ] By hand. Let $A = \begin{bmatrix} 2 & 1 \\ 0 & 3 \end{bmatrix}$. Find the eigenvalues from $\det(A - \lambda I) = 0$, i.e., $(2 - \lambda)(3 - \lambda) = 0$. Find an eigenvector for each eigenvalue.
- [ ] Geometric intuition. A shear matrix $S = \begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}$ has a double eigenvalue $\lambda = 1$ but only **one** linearly independent eigenvector. Convince yourself (by solving $(S - I)\mathbf{v} = \mathbf{0}$) that this is true. Such a matrix is **defective** — it cannot be diagonalised.
- [ ] In NumPy:

  ```python
  import numpy as np

  A = np.array([[2.0, 1.0],
                [0.0, 3.0]])

  eigvals, eigvecs = np.linalg.eig(A)
  print("eigenvalues:", eigvals)        # [2. 3.]
  print("eigenvectors (columns):\n", eigvecs)

  # sanity check: A @ v = lambda * v for each column
  for i, lam in enumerate(eigvals):
      v = eigvecs[:, i]
      assert np.allclose(A @ v, lam * v)
  ```

- [ ] Eigendecomposition. For a diagonalisable $A$, write $A = V\Lambda V^{-1}$ where columns of $V$ are eigenvectors and $\Lambda$ is diagonal with eigenvalues. What does $A^{10}$ become? (Answer: $V\Lambda^{10}V^{-1}$ — powers are cheap in the eigenbasis.)
- [ ] Short note in `notes/F09.md`: *in one paragraph, how does power iteration find the dominant eigenvector, and why is that the same thing as PageRank's "authority" score on the web?*

## Done criteria

You can write the eigenvalue equation, solve a $2 \times 2$ characteristic polynomial by hand, use `np.linalg.eig`, and explain in one sentence why eigenvectors are the "directions the matrix does not rotate".

## Bridge to modern

```mermaid
flowchart LR
  cauchy["Cauchy 1829<br/>char. polynomial"] --> spectral["spectral theorem<br/>symmetric ⇒ real eigenvalues"]
  spectral --> pca["PCA<br/>Pearson 1901"]
  spectral --> pagerank["PageRank 1998<br/>dominant eigenvector of<br/>link-stochastic matrix"]
  pca --> repr["modern<br/>representation learning"]
  pagerank --> graph["spectral clustering,<br/>graph neural nets"]
```

The eigenvalue equation:

$$ A\mathbf{v} \;=\; \lambda\mathbf{v}. $$

Whenever you read "**dominant mode**", "**top-k singular vectors**", "**Fiedler vector**", or "**principal component**", you are looking at an eigenvector. PageRank, PCA, and the spectral analysis of transformer attention matrices all share this one equation as their substrate.
