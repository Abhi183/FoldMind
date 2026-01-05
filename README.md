# FoldMind — FreeAI Protein Insight Studio

A production-ready, browser-first protein workbench:

- Upload datasets (FASTA / JSON)
- Edit & mutate sequences interactively
- Explore a fast fold proxy (D3 network)
- Compute richer stats (MW, GRAVY, charge, motifs, etc.)
- Run **REAL AI for free** using **WebLLM** (on-device via WebGPU)

## Run locally
```bash
npm install
npm run dev
```

## Deploy to Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`
- No environment variables required

## Free AI requirements (WebGPU)
FoldMind uses WebLLM, which requires WebGPU. Use Chrome or Edge on desktop for best results.

There is **no mock mode**: if WebGPU is unavailable, AI features will show a clear error message.
