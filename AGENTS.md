# Repository instructions

## Cost entries

Before adding or changing a model cost, read [`docs/cost-assumptions.md`](docs/cost-assumptions.md).
Use the documented reference rates consistently and retain the calculation inputs in `costBasis`.
Do not silently invent missing GPU counts, runtimes, provider prices, or LLM costs.

Normalize only the video-generation cost. Add any separate LLM or prompt-upsampling cost after
normalization:

```text
effective cost = generation cost × (24 / FPS) × (1280 / output width) + LLM/prompt cost
```

Never multiply a separate LLM or prompt-upsampling cost by the video FPS or resolution factors.
