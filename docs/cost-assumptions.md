# Internal cost assumptions

This document is an internal maintenance reference. It is not website copy.

## GPU reference rates

Reference period: May 2026 GPU market rates.

| GPU | Reference rate |
| --- | ---: |
| NVIDIA H100 80GB | $3.25 per GPU-hour |
| NVIDIA H200 | $4.00 per GPU-hour |

## Stored cost calculation

```text
generation cost = GPU hourly rate × GPU count × generation time in seconds / 3600
base cost = generation cost or API price + known LLM/prompt-upsampling cost
effective cost = base cost × (24 / FPS) × (1280 / output width)
```

Store the GPU model, GPU count, hourly rate, runtime per generation, and whether prompt-upsampling cost is included in `costBasis`.

If an input is not established, keep it explicitly unknown. Estimates must be labelled as estimates. Do not treat an omitted LLM or prompt-upsampling cost as zero without noting that it is excluded.

## Existing assumptions

- Cosmos3-Nano: $4.00/H200-hour, one H200, five minutes per generation; separate LLM cost recorded.
- Cosmos3-Super-Image2Video: $3.25/GPU-hour, four GPUs, three minutes twenty seconds per generation; separate LLM cost recorded.
- Kandinsky-WM 1.0: eight NVIDIA H100 80GB GPUs; measured allocation across 198 videos was 7.84 H100 GPU-hours for generation and 0.4425 H100 GPU-hours for Qwen3-VL prompt upsampling. At $3.25/H100-hour, raw costs are $0.128687 generation and $0.007263 prompt upsampling per video.
