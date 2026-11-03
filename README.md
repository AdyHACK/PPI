# INTERACTOMEX
### AI-Powered Protein–Protein Interaction Prediction Platform
> *"Decoding the Hidden Connections of Life."*

InteractomeX is an academic AI and Data Science research platform designed to investigate and predict Protein–Protein Interactions (PPIs) using multimodal deep learning. The platform couples evolutionary protein language models (ESM-2 650M) with topological Gene Ontology graph representations (Node2Vec), unified through a Siamese Transformer Encoder with Sparse Mixture of Experts (MoE) and permutation-symmetric pair feature fusion.

---

## 🔬 Core Scientific Architecture

1. **Sequence Modality (ESM-2 650M):**
   - Canonical amino acid sequence validated and truncated to $\le 1,024$ residues.
   - ESM-2 33-layer Transformer extracts a $1,280$-dimensional residue representation.
   - Linear projection (1,280d $\to$ 64d) reshapes the sequence into a $20 \times 64$ tensor.

2. **Ontology Modality (Node2Vec Gene Ontology):**
   - Traverses the Gene Ontology Directed Acyclic Graph (DAG) across Biological Process (BP), Molecular Function (MF), and Cellular Component (CC).
   - Biased second-order random walks ($p=1.0, q=0.5$) generate $64$-dimensional GO term representations.
   - Padded to a uniform $20 \times 64$ tensor.

3. **Multimodal Siamese Transformer Encoder:**
   - Unified multimodal tokens processed by multi-head self-attention:
     $$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$
   - Shared Siamese encoder for Protein A and Protein B ensures identical parameter representation.

4. **Sparse Mixture of Experts (MoE):**
   - Dense feed-forward layers are replaced by **32 specialized expert networks**.
   - Gating network with Top-K = 1 routing achieves conditional computation with only $+3.5\%$ latency overhead for $>2\times$ model capacity scaling.

5. **Symmetric Hadamard Fusion:**
   - Element-wise multiplication guarantees permutation symmetry $f(A, B) \equiv f(B, A)$:
     $$Z = X_A \odot X_B$$
   - Weighted attention pooling and linear classification yield the final interaction probability $\hat{y} \in [0.0, 1.0]$.

---

## 🛠️ Technology Stack

- **Framework:** React 18, Vite 5, JavaScript (ES Modules)
- **Styling & Design System:** Tailwind CSS, Custom Scientific Glassmorphism
- **Animations & Interactivity:** Framer Motion, Tailwind keyframes, Lucide React icons
- **Data Visualizations:** Recharts (Histograms, Stacked Bar Charts, Dual-Axis Line Charts, Donut Charts)
- **Biological Network:** Interactive SVG Force-Directed Canvas (Pan, Zoom, Drag, Cluster Filtering)
- **Routing & Navigation:** React Router DOM (v6)

---

## 🚀 Getting Started

To run InteractomeX locally:

```bash
# Start development server
npm run dev

# Or build for production preview
npm run build
npm run preview
```

The application runs locally without requiring a backend and includes curated demonstration datasets across *Homo sapiens*, *Saccharomyces cerevisiae*, *Mus musculus*, and *Drosophila melanogaster*.
