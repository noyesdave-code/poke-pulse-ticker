---
name: Set & Sealed Box Heatmaps
description: Two S&P-style treemaps on landing — SetHeatmap (per-set card aggregates) + SealedBoxHeatmap (booster boxes/ETBs/packs). Filter chips, ARIA, click drill-down.
type: feature
---
- **SetHeatmap** (`src/components/SetHeatmap.tsx`): aggregates `displayCards` by set. Filter chips: All / Gainers / Losers / Volatile. Detail panel links to `/set-browser?set=<slug>`.
- **SealedBoxHeatmap** (`src/components/SealedBoxHeatmap.tsx`): groups `displaySealed` by era+type. Filter chips: All / Boxes / ETBs / Packs (default = Boxes). Detail panel shows market/Δ/floor/spread + InfoDialog on the title row.
- **A11y**: `role="grid"`, `role="toolbar"`, `aria-pressed`, `aria-label` per tile, `focus-visible:ring-2 ring-primary` everywhere.
- **Mounted in `Index.tsx`** directly under SetHeatmap, both lazy-loaded via `LazySection`.
