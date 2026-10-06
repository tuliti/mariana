export type CostView = "normalized" | "fps" | "raw";

export type CostProfile = {
  submissionId: string;
  label: string;
  text: boolean;
  v2v: boolean;
  i2v: boolean;
  size: string;
  fps: number | null;
  resolution: string;
  seedControl?: boolean;
  price: number;
  llmCost?: number;
  costBasis?: string;
  computeGpuSeconds?: number;
};

export const costProfiles: CostProfile[] = [
  { submissionId: "grok-imagine-video", label: "Grok Imagine Video", text: true, v2v: false, i2v: true, size: "n.d.", fps: 24, resolution: "1280x720", seedControl: false, price: 0.352 },
  { submissionId: "hunyuan-video-15", label: "HunyuanV-1.5", text: true, v2v: false, i2v: true, size: "8.3B", fps: 24, resolution: "848x480", seedControl: true, price: 0.4 },
  { submissionId: "p-video", label: "P-Video", text: true, v2v: false, i2v: true, size: "n.d.", fps: 24, resolution: "1280x704", seedControl: true, price: 0.1 },
  { submissionId: "sora-2", label: "Sora-2", text: true, v2v: false, i2v: true, size: "n.d.", fps: 30, resolution: "1280x720", seedControl: false, price: 0.8 },
  { submissionId: "wan-22", label: "Wan 2.2 14B", text: true, v2v: false, i2v: true, size: "14B", fps: 16, resolution: "1280x720", seedControl: true, price: 0.11 },
  { submissionId: "wan-22-5b", label: "Wan 2.2 5B", text: true, v2v: false, i2v: true, size: "5B", fps: 24, resolution: "1248x704", seedControl: true, price: 0.0874666667, costBasis: "$0.60/RTX 4090-hour; official 524.8 s single-GPU I2V-5B reference benchmark", computeGpuSeconds: 524.8 },
  { submissionId: "cogvideox-5b-i2v-bpp", label: "CogVideoX-5B-I2V", text: true, v2v: false, i2v: true, size: "5B", fps: 8, resolution: "720x480", seedControl: true, price: 0.2354403409, costBasis: "$1.625/A100-hour; measured 114.75 GPU-hours across 792 videos (521.59 s/video)", computeGpuSeconds: 521.59 },
  { submissionId: "minimax-h3-fl2va-bpp-opus", label: "MiniMax H3", text: true, v2v: false, i2v: true, size: "33B", fps: 24, resolution: "1344x768", seedControl: true, price: 0.3538888889, llmCost: 0.101, costBasis: "$3.25/H100-hour; measured 4 H100 GPUs × 98 s per generation; $0.101 Claude Opus prompt cost assumed equal to Cosmos3 Super", computeGpuSeconds: 392 },
  { submissionId: "minimax-h3-max-i2v-bpp-opus-balanced", label: "MiniMax H3 Max", text: true, v2v: false, i2v: true, size: "33B", fps: 24, resolution: "1344x768", seedControl: true, price: 0.4, llmCost: 0.101, costBasis: "$0.08/second fal.ai API price × 5 seconds; $0.101 prompt cost assumed equal to MiniMax H3 FL2VA and Cosmos3 Super" },
  { submissionId: "kandinsky-wm-10-general-physics", label: "Kandinsky-WM 1.0", text: true, v2v: false, i2v: true, size: "2B", fps: 24, resolution: "768x512", seedControl: false, price: 0.1286868687, llmCost: 0.0072632576, costBasis: "$3.25/H100-hour; measured 7.84 generation + 0.4425 prompt H100 GPU-hours across 198 videos", computeGpuSeconds: 142.55 },
  { submissionId: "cosmos3-nano-bpp-opus", label: "Cosmos3-Nano", text: true, v2v: false, i2v: true, size: "16B", fps: 24, resolution: "1280x720", seedControl: true, price: 0.333, llmCost: 0.101, costBasis: "$4/H200-hour at 5 min per generation", computeGpuSeconds: 300 },
  { submissionId: "cosmos3-super-image2video", label: "Cosmos3-Super-Image2Video", text: true, v2v: false, i2v: true, size: "n.d.", fps: 24, resolution: "1280x720", seedControl: true, price: 0.722, llmCost: 0.101, costBasis: "$3.25/GPU-hour, 4 GPUs, 3 min 20 sec per generation", computeGpuSeconds: 800 },
  { submissionId: "gemini-omni-flash-preview-i2v-bpp", label: "Gemini Omni Flash Preview", text: true, v2v: false, i2v: true, size: "n.d.", fps: 24, resolution: "1280x720", seedControl: false, price: 0.60816, llmCost: 0.000506, costBasis: "$17.50/M output tokens; $1.50/M input tokens; measured token accounting" },
  { submissionId: "gemini-omni-11-flash-i2v-bpp", label: "Gemini Omni 1.1 Flash", text: true, v2v: false, i2v: true, size: "n.d.", fps: 24, resolution: "1280x720", seedControl: false, price: 0.60816, llmCost: 0.000506, costBasis: "$17.50/M output tokens; $1.50/M input tokens; measured token accounting" },
  { submissionId: "veo-31-fast-i2v-bpp", label: "Veo 3.1 Fast", text: true, v2v: false, i2v: true, size: "n.d.", fps: 24, resolution: "1280x720", seedControl: false, price: 0.60, costBasis: "$0.60/video reported benchmark cost; GPU/provider runtime inputs not supplied" },
  { submissionId: "veo-31-lite-i2v-bpp", label: "Veo 3.1 Lite", text: true, v2v: false, i2v: true, size: "n.d.", fps: 24, resolution: "1280x720", seedControl: false, price: 0.30, costBasis: "$0.30/video reported benchmark cost; GPU/provider runtime inputs not supplied" },
  { submissionId: "seedance-25-i2v-bpp", label: "Seedance 2.5", text: true, v2v: false, i2v: true, size: "n.d.", fps: 24, resolution: "n.d.", seedControl: false, price: 2.838, costBasis: "≈$2.838/video reported benchmark cost for 5 s; GPU/provider runtime inputs not supplied" },
  { submissionId: "cosmos3-super-v2v-bpp", label: "Cosmos3 Super V2V", text: false, v2v: true, i2v: false, size: "32B", fps: 24, resolution: "1280x720", seedControl: true, price: 0.722, llmCost: 0.101, costBasis: "Assigned same cost as Cosmos3 Super I2V per user instruction: $0.722 generation + $0.101 separate prompt cost; prior V2V compute-derived raw generation estimate of $0.631340 is not used for website comparison", computeGpuSeconds: 4545.648282 },
  { submissionId: "cosmos3-nano-v2v-bpp", label: "Cosmos3 Nano V2V", text: false, v2v: true, i2v: false, size: "8B", fps: 24, resolution: "1280x720", seedControl: true, price: 0.722, llmCost: 0.101, costBasis: "Assigned same cost as Cosmos3 Super I2V per user instruction: $0.722 generation + $0.101 separate prompt cost; prior V2V compute-derived raw generation estimate of $0.081763 is not used for website comparison", computeGpuSeconds: 294.347948 },
  { submissionId: "physis-lang-cosmos3-nano-i2v-custom", label: "Physis-Lang (Cosmos3 Nano)", text: true, v2v: false, i2v: true, size: "n.d.", fps: 24, resolution: "1280x720", seedControl: false, price: 0.722, llmCost: 0.101, costBasis: "Assigned same cost as Cosmos3 Super I2V per user instruction: $0.722 generation + $0.101 separate prompt cost; the card-derived Physis-Lang Nano generation estimate of $0.388515 and GPT-5.5 prompt cost (unknown) are not used for website comparison", computeGpuSeconds: 860.71 },
  { submissionId: "physis-lang-cosmos3-super-i2v-custom", label: "Physis-Lang (Cosmos3 Super)", text: true, v2v: false, i2v: true, size: "n.d.", fps: 24, resolution: "1280x720", price: 0.722, llmCost: 0.101, costBasis: "Assigned same cost as Cosmos3 Super I2V per user instruction: $0.722 generation + $0.101 separate prompt cost; Physis-Lang-specific GPU/runtime pricing is not independently established" },
  { submissionId: "bfl__flux3-large-i2v-bpp-bon1__2026-10-04", label: "FLUX 3 [large] I2V", text: true, v2v: false, i2v: true, size: "n.d.", fps: 24, resolution: "n.d.", price: 0.85, llmCost: 0.018, costBasis: "$0.17/s × 5 s generation; measured LLM prompt cost ≈$0.018 per prompt, included once; output resolution not provided, so no width normalization" },
  { submissionId: "bfl__flux3-large-v2v-bpp-bon1__2026-10-04", label: "FLUX 3 [large] V2V", text: false, v2v: true, i2v: false, size: "n.d.", fps: 24, resolution: "n.d.", price: 2.05, llmCost: 0.030, costBasis: "$0.41/s × 5 s generation; measured LLM prompt cost ≈$0.030 per prompt, included once; output resolution not provided, so no width normalization" },
  { submissionId: "bfl__flux3-large-i2v-bpp-bon8__2026-10-04", label: "FLUX 3 [large] I2V BoN×8", text: true, v2v: false, i2v: true, size: "n.d.", fps: 24, resolution: "n.d.", price: 6.80, llmCost: 0.018, costBasis: "8 × ($0.17/s × 5 s) generation; measured LLM prompt cost ≈$0.018 per prompt, shared across candidates and included once; output resolution not provided, so no width normalization" },
  { submissionId: "bfl__flux3-large-v2v-bpp-bon8__2026-10-04", label: "FLUX 3 [large] V2V BoN×8", text: false, v2v: true, i2v: false, size: "n.d.", fps: 24, resolution: "n.d.", price: 16.40, llmCost: 0.030, costBasis: "8 × ($0.41/s × 5 s) generation; measured LLM prompt cost ≈$0.030 per prompt, shared across candidates and included once; output resolution not provided, so no width normalization" },
  { submissionId: "odyssey-3-v2v-bpp", label: "Odyssey 3 V2V · BPP", text: false, v2v: true, i2v: false, size: "n.d.", fps: 16, resolution: "n.d.", price: 0.118, costBasis: "Reported generation cost $0.118/video at 16 FPS and 426 GPU-s/video; GPU model/rate and resolution not supplied; FPS-normalized views apply 24/16, with no width adjustment; separate prompt cost not supplied and excluded", computeGpuSeconds: 426 },
  { submissionId: "odyssey-3-v2v-prompt-enhanced", label: "Odyssey 3 V2V · Prompt-enhanced", text: false, v2v: true, i2v: false, size: "n.d.", fps: 16, resolution: "n.d.", price: 0.118, costBasis: "Reported generation cost $0.118/video at 16 FPS and 426 GPU-s/video; GPU model/rate and resolution not supplied; FPS-normalized views apply 24/16, with no width adjustment; separate prompt cost not supplied and excluded", computeGpuSeconds: 426 },
  { submissionId: "odyssey-3-v2v-bon8-rank-sum", label: "Odyssey 3 V2V · BoN×8 rank-sum", text: false, v2v: true, i2v: false, size: "n.d.", fps: 16, resolution: "n.d.", price: 0.947, costBasis: "Reported generation cost $0.947/video at 16 FPS and 3,408 GPU-s/video for BoN×8; GPU model/rate and resolution not supplied; FPS-normalized views apply 24/16, with no width adjustment; separate prompt cost not supplied and excluded", computeGpuSeconds: 3408 },
  { submissionId: "odyssey-3-i2v-bpp", label: "Odyssey 3 I2V · BPP", text: true, v2v: false, i2v: true, size: "n.d.", fps: 16, resolution: "n.d.", price: 0.086, costBasis: "Reported generation cost $0.086/video at 16 FPS and 308 GPU-s/video; GPU model/rate and resolution not supplied; FPS-normalized views apply 24/16, with no width adjustment; separate prompt cost not supplied and excluded", computeGpuSeconds: 308 },
  { submissionId: "odyssey-3-i2v-prompt-enhanced", label: "Odyssey 3 I2V · Prompt-enhanced", text: true, v2v: false, i2v: true, size: "n.d.", fps: 16, resolution: "n.d.", price: 0.086, costBasis: "Reported generation cost $0.086/video at 16 FPS and 308 GPU-s/video; GPU model/rate and resolution not supplied; FPS-normalized views apply 24/16, with no width adjustment; separate prompt cost not supplied and excluded", computeGpuSeconds: 308 },
  { submissionId: "odyssey-3-i2v-bon8-rank-sum", label: "Odyssey 3 I2V · BoN×8 rank-sum", text: true, v2v: false, i2v: true, size: "n.d.", fps: 16, resolution: "n.d.", price: 0.684, costBasis: "Reported generation cost $0.684/video at 16 FPS and 2,464 GPU-s/video for BoN×8; GPU model/rate and resolution not supplied; FPS-normalized views apply 24/16, with no width adjustment; separate prompt cost not supplied and excluded", computeGpuSeconds: 2464 }
];

export function formatPrice(value: number) {
  return `$${value.toFixed(3)}`;
}

function getResolutionWidth(resolution: string) {
  const width = Number(resolution.toLowerCase().split("x")[0]);
  return Number.isFinite(width) && width > 0 ? width : 1280;
}

export function getComparisonCost(profile: CostProfile, costView: CostView) {
  const promptCost = profile.llmCost ?? 0;
  const baseCost = profile.price + promptCost;
  const fpsFactor = costView === "raw" || profile.fps === null ? 1 : 24 / profile.fps;
  const resolutionFactor = costView === "normalized" ? 1280 / getResolutionWidth(profile.resolution) : 1;
  return {
    baseCost,
    fpsFactor,
    resolutionFactor,
    effectiveCost: profile.price * fpsFactor * resolutionFactor + promptCost
  };
}

export function getCostViewLabel(costView: CostView) {
  if (costView === "raw") return "Raw cost";
  if (costView === "fps") return "FPS-normalized cost";
  return "Normalized cost";
}

export function getCostViewNote(costView: CostView) {
  if (costView === "raw") return "Raw cost uses the reported native generation settings.";
  if (costView === "fps") return "Generation cost is normalized to 24 FPS where FPS is reported; otherwise the reported cost is retained. Resolution is unchanged.";
  return "Generation cost is normalized to 24 FPS and 1280-wide output where those inputs are reported; otherwise the reported cost is retained.";
}
