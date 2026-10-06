# Internal cost assumptions

This document is an internal maintenance reference. It is not website copy.

## GPU reference rates

Reference period: May 2026 GPU market rates.

| GPU | Reference rate |
| --- | ---: |
| NVIDIA A100 | $1.625 per GPU-hour |
| NVIDIA GeForce RTX 4090 | $0.60 per GPU-hour |
| NVIDIA H100 80GB | $3.25 per GPU-hour |
| NVIDIA H200 | $4.00 per GPU-hour |

## Stored cost calculation

```text
generation cost = GPU hourly rate × GPU count × generation time in seconds / 3600
normalized generation cost = generation cost or API price × (24 / FPS) × (1280 / output width)
effective cost = normalized generation cost + known LLM/prompt-upsampling cost
```

LLM and prompt-upsampling costs are independent of the generated video's FPS and resolution. Add
them after normalization; never multiply them by the video normalization factors.

## Website comparison modes

- **Normalized:** generation cost × FPS factor × width factor, plus prompt cost.
- **FPS only:** generation cost × FPS factor, plus prompt cost; native resolution is retained.
- **Unnormalized:** raw generation cost plus prompt cost at the model's native settings.

Store the GPU model, GPU count, hourly rate, runtime per generation, and whether prompt-upsampling cost is included in `costBasis`.

If an input is not established, keep it explicitly unknown. Estimates must be labelled as estimates. Do not treat an omitted LLM or prompt-upsampling cost as zero without noting that it is excluded.

## Existing assumptions

- Wan 2.2 5B: one NVIDIA GeForce RTX 4090; official I2V-5B reference benchmark is 524.8 seconds per generation. At $0.60/RTX 4090-hour, raw generation cost is $0.087467 per video. No prompt-upsampling cost is applied.
- CogVideoX-5B-I2V: one NVIDIA A100 per shard job; measured allocation was 114.75 A100 GPU-hours across 792 videos. At $1.625/A100-hour, raw generation cost is $0.235440 per video. No prompt-upsampling cost is applied.
- MiniMax H3 FL2VA: four NVIDIA H100 80GB GPUs; measured mean generation time is 98 seconds per video. At $3.25/H100-hour, raw generation cost is $0.353889 per video. Claude Opus 4.8 prompt upsampling is assigned the same separate $0.101 per-video cost used for Cosmos3 Super, by explicit shared-assumption decision.
- MiniMax H3 Max: fal.ai API price is $0.08 per generated second, or $0.40 for the five-second benchmark video. Balanced prompt expansion is assigned the same separate $0.101 per-video cost used for MiniMax H3 FL2VA and Cosmos3 Super, by explicit shared-assumption decision.
- Cosmos3-Nano: $4.00/H200-hour, one H200, five minutes per generation; separate LLM cost recorded.
- Cosmos3-Super-Image2Video: $3.25/GPU-hour, four GPUs, three minutes twenty seconds per generation; separate LLM cost recorded.
- Kandinsky-WM 1.0: eight NVIDIA H100 80GB GPUs; measured allocation across 198 videos was 7.84 H100 GPU-hours for generation and 0.4425 H100 GPU-hours for Qwen3-VL prompt upsampling. At $3.25/H100-hour, raw costs are $0.128687 generation and $0.007263 prompt upsampling per video.
- Gemini Omni Flash Preview and Gemini Omni 1.1 Flash: reported four-run cost is $482.063616 across 792 videos, or $0.608666/video. This consists of $481.662720 output-token cost ($17.50/M; 5,792 tokens/s × 6 s) and $0.400896 input-token cost ($1.50/M; measured 337.45 tokens/video). No external prompt expansion was used.
- Veo 3.1 Fast: reported cost is $0.60/video for a six-second generation; GPU/provider runtime inputs were not supplied.
- Veo 3.1 Lite: reported cost is $0.30/video for a six-second generation; GPU/provider runtime inputs were not supplied.
- Seedance 2.5: reported cost is approximately $2.838/video for a five-second generation; GPU/provider runtime inputs were not supplied.
- Cosmos3 Super V2V: assigned the same I2V cost per user instruction: $0.722 generation + $0.101 separate prompt cost ($0.823 effective/video). The earlier compute-derived V2V generation estimate was $0.631340/video (2 H200 GPUs × 2,272.824141 GPU-seconds at the $1.00/H200-hour assumption); it is not used for website comparison.
- Cosmos3 Nano V2V: assigned the same cost as Cosmos3 Super I2V per user instruction: $0.722 generation + $0.101 separate prompt cost ($0.823 effective/video). The earlier compute-derived V2V generation estimate was $0.081763/video (1 H200 × 294.347948 seconds at the $1.00/H200-hour assumption); it is not used for website comparison.
- Physis-Lang (Cosmos3 Nano): assigned the same cost as Cosmos3 Super I2V per user instruction: $0.722 generation + $0.101 separate prompt cost ($0.823 effective/video). The card-derived Nano generation estimate was $0.388515/video; GPT-5.5 API prompt-upsampling cost is unknown. These Physis-Lang-specific figures are not used for website comparison.
- Physis-Lang (Cosmos3 Super): assigned the same I2V cost as Cosmos3 Super by explicit instruction: $0.722 generation + $0.101 separate prompt cost per video. Physis-Lang-specific GPU/runtime pricing is not independently established.
- FLUX 3 [large]: generation is $0.17/second for I2V and $0.41/second for V2V, for five-second videos ($0.85 and $2.05/video); BoN=8 generation totals are $6.80 I2V and $16.40 V2V. Measured LLM prompt-upsampling costs are approximately $0.018 per I2V prompt and $0.030 per V2V prompt. The prompt is shared across BoN=8 candidates, so the LLM cost is added once, not multiplied by eight. The reported aggregate is approximately $9.44 for 396 prompts; rounded per-prompt amounts imply $9.504 (198 prompts per modality), a small rounding discrepancy. Output resolution was not supplied, so no width normalization is applied. Prompt costs are added after video-generation normalization.
