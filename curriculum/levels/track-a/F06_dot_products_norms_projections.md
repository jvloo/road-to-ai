---
id: F06
title: Dot Products, Norms, and Projections
track: A
tier: 1
xp: 5
prereqs: [F04]
unlocks: [F07]
status: pending
completed_at: null
tags: [math, linear-algebra]
luminary: "William Rowan Hamilton"
---

## Why this level matters (lineage)

**Classical root:** **William Rowan Hamilton**'s work in the 1840s on quaternions and inner products, together with **Cauchy** and **Schwarz**'s inequality, established the geometry of angles and lengths in arbitrary-dimensional spaces.
**Modern descendant:** **Cosine similarity** — the workhorse of embedding search, semantic retrieval (RAG), and recommendation systems — is nothing but the dot product of two unit-norm vectors. When your LLM app "finds the nearest chunk in a vector DB", it is ranking by $\cos\theta = \mathbf{u} \cdot \mathbf{v} / (\|\mathbf{u}\|\,\|\mathbf{v}\|)$. Hamilton invented the arithmetic; FAISS, Pinecone, and pgvector ship it at scale.

## Luminary spotlight — William Rowan Hamilton (1805–1865)

Hamilton was a child prodigy — reportedly fluent in a dozen languages by age thirteen — who became Astronomer Royal of Ireland at twenty-two. On 16 October 1843, walking along the Royal Canal in Dublin, he had the insight that the algebra of 3D rotation needed **four** components, not three; he famously carved the defining equation $i^2 = j^2 = k^2 = ijk = -1$ into the stone of Brougham Bridge. The inner-product and norm machinery he helped formalise is now the geometric substrate of every embedding model. He was also, by his own letters, a deeply unhappy man — obsessive, lonely, and increasingly dependent on alcohol — a reminder that the history of mathematics is not an inventory of cheerful geniuses.

## Objectives

- Compute dot products, Euclidean ($L_2$) norms, and the angle between two vectors.
- State the **Cauchy–Schwarz inequality** and understand what it guarantees.
- Project one vector onto another and relate projection to the attention mechanism's "score".

## Resources

- 3Blue1Brown, *Essence of Linear Algebra* — episode **E9 (Dot products and duality)**.
- Deisenroth et al., *MML* **§3.1–3.3** (inner products, norms, orthogonal projections).
- Strang, *Introduction to Linear Algebra*, §1.2 and §4.2.

## Tasks

- [ ] By hand: compute $\mathbf{u} \cdot \mathbf{v}$ for $\mathbf{u} = (1, 2, 2)$, $\mathbf{v} = (2, 0, -1)$. Then compute $\|\mathbf{u}\|$ and $\|\mathbf{v}\|$. What is the angle?
- [ ] Verify in NumPy:
  ```python
  import numpy as np
  u = np.array([1.0, 2.0, 2.0])
  v = np.array([2.0, 0.0, -1.0])
  dot = u @ v
  cos_theta = dot / (np.linalg.norm(u) * np.linalg.norm(v))
  angle_rad = np.arccos(cos_theta)
  ```
- [ ] Compute the projection of $\mathbf{u}$ onto $\mathbf{v}$:
  $$ \mathrm{proj}_{\mathbf{v}}(\mathbf{u}) \;=\; \frac{\mathbf{u} \cdot \mathbf{v}}{\mathbf{v} \cdot \mathbf{v}}\,\mathbf{v} $$
- [ ] Write one paragraph in `notes/F06.md` explaining why two embeddings with cosine similarity 0.9 are considered "close" even when their raw dot product is large.

## Done criteria

You can compute dot products and norms by hand for small vectors, state the Cauchy–Schwarz inequality, and explain in your own words why cosine similarity is invariant to vector magnitude.

## Bridge to modern

The foundational identities:

$$ \mathbf{u} \cdot \mathbf{v} \;=\; \|\mathbf{u}\|\,\|\mathbf{v}\|\,\cos\theta $$

$$ |\,\mathbf{u} \cdot \mathbf{v}\,| \;\le\; \|\mathbf{u}\|\,\|\mathbf{v}\| \qquad \text{(Cauchy–Schwarz)} $$

$$ \mathrm{cosine\_sim}(\mathbf{u}, \mathbf{v}) \;=\; \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|\,\|\mathbf{v}\|} \;\in\; [-1, 1] $$

When attention computes $QK^{\top}/\sqrt{d}$, every entry of the resulting matrix is (up to a scale factor) a dot product between a query vector and a key vector — a similarity score. Hamilton's inner-product geometry, now wearing a GPU.
