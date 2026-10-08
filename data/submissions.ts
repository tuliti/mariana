export type InputType = "i2v" | "t2v" | "v2v";
export type Availability = "Proprietary" | "Open source" | "Not yet available" | "Access unknown";
export type LlmSupport = "Yes" | "Likely" | "No" | "Unknown";

export type MetricScore = {
  mean: number;
  std?: number;
};

export type MetricComponent = {
  mean: number;
  std?: number;
};

export type Submission = {
  id: string;
  /** "leaderboard" entries have benchmark scores; "all" is for catalog-only models. */
  listing: "leaderboard" | "all";
  model: string;
  modelIdentifier?: string;
  sourceUrl?: string;
  outputFps?: number;
  inputType: InputType;
  protocol: string;
  promptDetails?: string;
  sampling?: {
    candidatesPerPrompt: number;
    selector: string;
  };
  dateAdded: string;
  company: string;
  availability: Availability;
  llmSupported: LlmSupport;
  runs?: number[];
  metrics: {
    physIq?: MetricScore;
    sp?: MetricComponent;
    st?: MetricComponent;
    ws?: MetricComponent;
    mse?: MetricComponent;
  };
};

export const metricLabels = {
  physIq: "Phys-IQ verified",
  sp: "SP verified",
  st: "ST verified",
  ws: "WS verified",
  mse: "MSE verified"
} as const;

export const submissions: Submission[] = [
  {
    id: "minimax-h3-max-i2v-bpp-opus-balanced",
    listing: "leaderboard",
    model: "MiniMax H3 Max",
    modelIdentifier: "minimax/h3-max/image-to-video",
    sourceUrl: "https://fal.ai/models/minimax/h3-max/image-to-video",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-08-27",
    company: "fal",
    availability: "Proprietary",
    llmSupported: "Yes",
    runs: [35.4, 36.91, 36.57, 35.94],
    metrics: {
      physIq: { mean: 36.21, std: 0.67 },
      sp: { mean: 54.9 },
      st: { mean: 24.5 },
      ws: { mean: 38.19 },
      mse: { mean: 27.23 }
    }
  },
  {
    id: "minimax-h3-fl2va-bpp-opus",
    listing: "leaderboard",
    model: "MiniMax H3",
    modelIdentifier: "MiniMax H3 FL2VA",
    sourceUrl: "https://huggingface.co/MiniMaxAI/MiniMax-H3",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-08-24",
    company: "MiniMax",
    availability: "Open source",
    llmSupported: "Yes",
    runs: [39.95, 39.95, 39.99, 39.26],
    metrics: {
      physIq: { mean: 39.79, std: 0.35 },
      sp: { mean: 58.9, std: 0.78 },
      st: { mean: 22.8, std: 0.55 },
      ws: { mean: 40.47, std: 0.78 },
      mse: { mean: 36.98, std: 0.7 }
    }
  },
  {
    id: "cogvideox-5b-i2v-bpp",
    listing: "leaderboard",
    model: "CogVideoX-5B",
    modelIdentifier: "zai-org/CogVideoX-5b-I2V",
    sourceUrl: "https://huggingface.co/zai-org/CogVideoX-5b-I2V",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-08-18",
    company: "Z.ai",
    availability: "Open source",
    llmSupported: "No",
    runs: [33.08, 30.34, 32.97, 30.61],
    metrics: {
      physIq: { mean: 31.75, std: 1.47 },
      sp: { mean: 37.77, std: 4.6 },
      st: { mean: 35.45, std: 4.91 },
      ws: { mean: 21.81, std: 1.89 },
      mse: { mean: 31.97, std: 1.71 }
    }
  },
  {
    id: "magi-1-24b-geophys-bon-op-v2v",
    listing: "leaderboard",
    model: "Magi-1 24B + GeoPhys (BoN) (op)",
    modelIdentifier: "Magi-1 24B",
    sourceUrl: "https://github.com/SandAI-org/MAGI-1",
    inputType: "v2v",
    protocol: "BoN",
    sampling: { candidatesPerPrompt: 16, selector: "GeoPhys" },
    dateAdded: "2026-06-19",
    company: "Sand AI",
    availability: "Open source",
    llmSupported: "Yes",
    metrics: {
      physIq: { mean: 58.2, std: 1.8 }
    }
  },
  {
    id: "magi-1-24b-op-v2v",
    listing: "leaderboard",
    model: "Magi-1 24B (op)",
    modelIdentifier: "Magi-1 24B",
    sourceUrl: "https://github.com/SandAI-org/MAGI-1",
    inputType: "v2v",
    protocol: "V2V",
    dateAdded: "2026-06-19",
    company: "Sand AI",
    availability: "Open source",
    llmSupported: "Yes",
    metrics: {
      physIq: { mean: 48.4, std: 1.1 }
    }
  },
  {
    id: "magi-1-24b-geophys-bon-op",
    listing: "leaderboard",
    model: "Magi-1 24B + GeoPhys (BoN) (op)",
    modelIdentifier: "Magi-1 24B",
    sourceUrl: "https://github.com/SandAI-org/MAGI-1",
    inputType: "i2v",
    protocol: "BoN",
    sampling: { candidatesPerPrompt: 16, selector: "GeoPhys" },
    dateAdded: "2026-06-19",
    company: "Sand AI",
    availability: "Open source",
    llmSupported: "Yes",
    metrics: {
      physIq: { mean: 33.7, std: 1.4 }
    }
  },
  {
    id: "kandinsky-wm-10-general-physics",
    listing: "leaderboard",
    model: "Kandinsky-WM 1.0",
    modelIdentifier: "Kandinsky-WM-1.0-I2V-5s-PH",
    sourceUrl: "https://github.com/kandinskylab/kandinsky-wm",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-08-07",
    company: "Kandinsky Lab",
    availability: "Open source",
    llmSupported: "Yes",
    metrics: {
      physIq: { mean: 30.82666741, std: 0.86452545 },
      sp: { mean: 38.77262595, std: 2.57608967 },
      st: { mean: 29.99809951, std: 2.67306074 },
      ws: { mean: 27.40359302, std: 2.04300924 },
      mse: { mean: 27.13235114, std: 1.48433183 }
    }
  },
  {
    id: "grok-imagine-video",
    listing: "leaderboard",
    model: "Grok Imagine Video",
    modelIdentifier: "Grok Imagine Video",
    sourceUrl: "https://grok.com/imagine",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-06-17",
    company: "xAI",
    availability: "Proprietary",
    llmSupported: "Yes",
    metrics: {
      physIq: { mean: 34.8, std: 0.6 },
      sp: { mean: 52.7, std: 0.9 },
      st: { mean: 21.4, std: 0.6 },
      ws: { mean: 35.7, std: 1.0 },
      mse: { mean: 29.6, std: 0.4 }
    }
  },
  {
    id: "hunyuan-video-15",
    listing: "leaderboard",
    model: "Hunyuan Video 1.5",
    modelIdentifier: "HunyuanVideo-1.5",
    sourceUrl: "https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-06-17",
    company: "Tencent",
    availability: "Open source",
    llmSupported: "Yes",
    metrics: {
      physIq: { mean: 33.4, std: 0.8 },
      sp: { mean: 47.1, std: 1.2 },
      st: { mean: 26.9, std: 1.0 },
      ws: { mean: 29.7, std: 0.6 },
      mse: { mean: 30.0, std: 1.0 }
    }
  },
  {
    id: "wan-22-5b",
    listing: "leaderboard",
    model: "Wan 2.2 5B",
    modelIdentifier: "Wan2.2-TI2V-5B",
    sourceUrl: "https://huggingface.co/Wan-AI/Wan2.2-TI2V-5B",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-08-18",
    company: "Alibaba",
    availability: "Open source",
    llmSupported: "No",
    metrics: {
      physIq: { mean: 27.71, std: 0.91 },
      sp: { mean: 35.89, std: 1.08 },
      st: { mean: 26.44, std: 1.24 },
      ws: { mean: 22.96, std: 1.74 },
      mse: { mean: 25.54, std: 0.29 }
    }
  },
  {
    id: "wan-22",
    listing: "leaderboard",
    model: "Wan 2.2 14B",
    modelIdentifier: "Wan2.2-I2V-A14B",
    sourceUrl: "https://github.com/Wan-Video/Wan2.2",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-06-17",
    company: "Alibaba",
    availability: "Open source",
    llmSupported: "No",
    metrics: {
      physIq: { mean: 32.2, std: 0.6 },
      sp: { mean: 51.1, std: 1.0 },
      st: { mean: 20.5, std: 0.7 },
      ws: { mean: 28.5, std: 0.7 },
      mse: { mean: 28.9, std: 0.4 }
    }
  },
  {
    id: "sora-2",
    listing: "leaderboard",
    model: "Sora 2",
    modelIdentifier: "Sora 2",
    sourceUrl: "https://openai.com/index/sora-2/",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-06-17",
    company: "OpenAI",
    availability: "Proprietary",
    llmSupported: "Yes",
    metrics: {
      physIq: { mean: 26.5, std: 0.8 },
      sp: { mean: 37.3, std: 0.6 },
      st: { mean: 27.0, std: 2.2 },
      ws: { mean: 26.9, std: 0.7 },
      mse: { mean: 14.8, std: 0.6 }
    }
  },
  {
    id: "p-video",
    listing: "leaderboard",
    model: "P-Video",
    modelIdentifier: "P-Video",
    sourceUrl: "https://www.pruna.ai/p-video",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-06-17",
    company: "Pruna AI",
    availability: "Proprietary",
    llmSupported: "No",
    metrics: {
      physIq: { mean: 25.3, std: 1.8 },
      sp: { mean: 38.6, std: 2.2 },
      st: { mean: 16.4, std: 2.4 },
      ws: { mean: 22.9, std: 1.8 },
      mse: { mean: 23.3, std: 1.1 }
    }
  },
  {
    id: "cosmos3-nano-bpp-opus",
    listing: "leaderboard",
    model: "Cosmos3 Nano",
    modelIdentifier: "Cosmos3-Nano",
    sourceUrl: "https://huggingface.co/nvidia/Cosmos3-Nano",
    inputType: "i2v",
    protocol: "Custom",
    dateAdded: "2026-09-04",
    company: "NVIDIA",
    availability: "Open source",
    llmSupported: "Yes",
    runs: [36.57, 37.74, 36.43, 38.24],
    metrics: {
      physIq: { mean: 37.25, std: 0.89 },
      sp: { mean: 51.91, std: 2.26 },
      st: { mean: 25.21, std: 1.33 },
      ws: { mean: 36.3, std: 1.13 },
      mse: { mean: 35.56, std: 0.78 }
    }
  },
  {
    id: "cosmos3-super-image2video",
    listing: "leaderboard",
    model: "Cosmos3 Super",
    modelIdentifier: "Cosmos3-Super-Image2Video",
    sourceUrl: "https://huggingface.co/nvidia/Cosmos3-Super-Image2Video",
    inputType: "i2v",
    protocol: "Custom",
    dateAdded: "2026-09-04",
    company: "NVIDIA",
    availability: "Open source",
    llmSupported: "Yes",
    metrics: {
      physIq: { mean: 42.68, std: 0.76 },
      sp: { mean: 57.41, std: 1.51 },
      st: { mean: 32.48, std: 0.97 },
      ws: { mean: 42.98, std: 1.47 },
      mse: { mean: 37.84, std: 0.41 }
    }
  },
  {
    id: "cosmos3-edge-bpp",
    listing: "leaderboard",
    model: "Cosmos3 Edge",
    modelIdentifier: "Cosmos3-Edge",
    sourceUrl: "https://huggingface.co/nvidia/Cosmos3-Edge",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-08-31",
    company: "NVIDIA",
    outputFps: 24,
    availability: "Open source",
    llmSupported: "Yes",
    runs: [33.42, 31.78, 33.85, 31.9],
    metrics: {
      physIq: { mean: 32.74, std: 1.05 },
      sp: { mean: 46.85, std: 1.66 },
      st: { mean: 29.89, std: 2.16 },
      ws: { mean: 31.91, std: 1.63 },
      mse: { mean: 22.29, std: 0.54 }
    }
  },
  {
    id: "seedance-25-i2v-bpp",
    listing: "leaderboard",
    model: "Seedance 2.5",
    modelIdentifier: "bytedance/seedance-2.5/us/image-to-video",
    sourceUrl: "https://fal.ai/models/bytedance/seedance-2.5/us/image-to-video",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-09-28",
    company: "Seedance",
    availability: "Proprietary",
    llmSupported: "Yes",
    runs: [42.35, 42.92, 43.05, 41.38],
    metrics: { physIq: { mean: 42.43, std: 0.76 }, sp: { mean: 57.16, std: 0.70 }, st: { mean: 28.50, std: 1.26 }, ws: { mean: 42.69, std: 0.90 }, mse: { mean: 41.34, std: 1.01 } }
  },
  {
    id: "gemini-omni-11-flash-i2v-bpp",
    listing: "leaderboard",
    model: "Gemini Omni 1.1 Flash",
    modelIdentifier: "Gemini Omni 1.1 Flash",
    sourceUrl: "https://ai.google.dev/gemini-api/docs",
    inputType: "i2v", protocol: "BPP", dateAdded: "2026-09-28", company: "Google", availability: "Proprietary", llmSupported: "Yes",
    metrics: { physIq: { mean: 35.34, std: 0.44 }, sp: { mean: 56.14, std: 0.69 }, st: { mean: 18.41, std: 0.46 }, ws: { mean: 36.66, std: 0.85 }, mse: { mean: 30.14, std: 0.27 } }
  },
  {
    id: "gemini-omni-flash-preview-i2v-bpp",
    listing: "leaderboard",
    model: "Gemini Omni Flash",
    modelIdentifier: "Gemini Omni Flash Preview",
    sourceUrl: "https://ai.google.dev/gemini-api/docs",
    inputType: "i2v", protocol: "BPP", dateAdded: "2026-09-28", company: "Google", availability: "Proprietary", llmSupported: "Yes",
    runs: [33.29, 33.13, 33.49, 33.54],
    metrics: { physIq: { mean: 33.36, std: 0.19 }, sp: { mean: 53.85, std: 0.59 }, st: { mean: 18.06, std: 1.34 }, ws: { mean: 33.34, std: 0.22 }, mse: { mean: 28.20, std: 0.37 } }
  },
  {
    id: "veo-31-lite-i2v-bpp",
    listing: "leaderboard",
    model: "Veo 3.1 Lite",
    modelIdentifier: "Veo 3.1 Lite",
    sourceUrl: "https://deepmind.google/models/veo/",
    inputType: "i2v", protocol: "BPP", dateAdded: "2026-09-28", company: "Google", availability: "Proprietary", llmSupported: "Yes",
    metrics: { physIq: { mean: 31.83, std: 0.32 }, sp: { mean: 49.14, std: 0.50 }, st: { mean: 16.13, std: 0.56 }, ws: { mean: 31.89, std: 0.26 }, mse: { mean: 30.15, std: 0.40 } }
  },
  {
    id: "veo-31-fast-i2v-bpp",
    listing: "leaderboard",
    model: "Veo 3.1 Fast",
    modelIdentifier: "Veo 3.1 Fast",
    sourceUrl: "https://deepmind.google/models/veo/",
    inputType: "i2v", protocol: "BPP", dateAdded: "2026-09-28", company: "Google", availability: "Proprietary", llmSupported: "Yes",
    runs: [29.90, 29.38, 29.88, 30.67],
    metrics: { physIq: { mean: 29.96, std: 0.53 }, sp: { mean: 46.70, std: 0.81 }, st: { mean: 15.95, std: 0.80 }, ws: { mean: 29.37, std: 0.48 }, mse: { mean: 27.83, std: 0.50 } }
  },
  {
    id: "cosmos3-super-v2v-bpp",
    listing: "leaderboard",
    model: "Cosmos3 Super",
    modelIdentifier: "cosmos3_32b",
    sourceUrl: "https://www.nvidia.com/en-us/ai/cosmos/",
    inputType: "v2v",
    protocol: "Custom",
    dateAdded: "2026-09-18",
    company: "NVIDIA",
    availability: "Open source",
    llmSupported: "Yes",
    runs: [49.4386, 49.8991, 49.7743, 54.1509],
    metrics: { physIq: { mean: 50.8, std: 2.2 }, sp: { mean: 61.1, std: 1.9 }, st: { mean: 48.0, std: 4.1 }, ws: { mean: 49.8, std: 2.4 }, mse: { mean: 44.4, std: 1.9 } }
  },
  {
    id: "cosmos3-nano-v2v-bpp",
    listing: "leaderboard",
    model: "Cosmos3 Nano",
    modelIdentifier: "cosmos3_8b",
    sourceUrl: "https://www.nvidia.com/en-us/ai/cosmos/",
    inputType: "v2v",
    protocol: "Custom",
    dateAdded: "2026-09-18",
    company: "NVIDIA",
    availability: "Open source",
    llmSupported: "Yes",
    metrics: { physIq: { mean: 43.0, std: 2.0 }, sp: { mean: 54.2, std: 1.1 }, st: { mean: 36.5, std: 3.7 }, ws: { mean: 41.5, std: 1.9 }, mse: { mean: 39.8, std: 1.7 } }
  },
  {
    id: "physis-lang-cosmos3-nano-i2v-custom",
    listing: "leaderboard",
    model: "Physis-Lang (Cosmos3 Nano)",
    modelIdentifier: "physics-iq-verified-20260925",
    sourceUrl: "https://github.com/Physis-Intelligence/Physis-Lang",
    inputType: "i2v",
    protocol: "Custom",
    dateAdded: "2026-09-25",
    company: "NVIDIA",
    outputFps: 24,
    availability: "Open source",
    llmSupported: "Yes",
    runs: [42.4169, 41.6556, 41.9558, 45.9908],
    metrics: { physIq: { mean: 43.29, std: 1.52 }, sp: { mean: 56.17, std: 1.76 }, st: { mean: 31.01, std: 2.16 }, ws: { mean: 43.39, std: 2.16 }, mse: { mean: 42.58, std: 0.85 } }
  },
  {
    id: "physis-lang-cosmos3-super-i2v-custom",
    listing: "leaderboard",
    model: "Physis-Lang (Cosmos3 Super)",
    modelIdentifier: "physics-iq-verified-20260925",
    sourceUrl: "https://github.com/Physis-Intelligence/Physis-Lang",
    inputType: "i2v",
    protocol: "Custom",
    dateAdded: "2026-09-25",
    company: "NVIDIA",
    outputFps: 24,
    availability: "Open source",
    llmSupported: "Yes",
    metrics: { physIq: { mean: 48.23, std: 1.43 }, sp: { mean: 59.87, std: 1.43 }, st: { mean: 41.57, std: 3.11 }, ws: { mean: 48.53, std: 1.06 }, mse: { mean: 42.96, std: 1.29 } }
  },
  {
    id: "strucphysvideo-ti2v-bpp",
    listing: "all",
    model: "StrucPhysVideo-TI2V",
    modelIdentifier: "strucphysvideo-ti2v-bpp",
    inputType: "i2v",
    protocol: "BPP",
    promptDetails: "BPP with a static-camera constraint; temporal prompt expansion with Qwen3.5-27B.",
    dateAdded: "2026-10-05",
    company: "Awomo",
    availability: "Not yet available",
    llmSupported: "Yes",
    outputFps: 15,
    runs: [45.44, 45.17, 45.30, 46.17],
    metrics: { physIq: { mean: 45.5, std: 0.4 } }
  },
  {
    id: "bfl__flux3-large-v2v-bpp-bon1__2026-10-04",
    listing: "leaderboard",
    model: "FLUX 3 [large]",
    modelIdentifier: "FLUX.3 [large]",
    sourceUrl: "https://bfl.ai/models/flux-3-video",
    inputType: "v2v",
    protocol: "Custom",
    promptDetails: "Custom prompt rewrite.",
    dateAdded: "2026-10-04",
    company: "Black Forest Labs",
    outputFps: 24,
    availability: "Proprietary",
    llmSupported: "Yes",
    metrics: { physIq: { mean: 61.11, std: 0.55 }, sp: { mean: 67.97, std: 0.65 }, ws: { mean: 60.17, std: 0.71 }, st: { mean: 61.64, std: 1.06 }, mse: { mean: 54.66, std: 0.55 } }
  },
  {
    id: "bfl__flux3-large-i2v-bpp-bon1__2026-10-04",
    listing: "leaderboard",
    model: "FLUX 3 [large]",
    modelIdentifier: "FLUX.3 [large]",
    sourceUrl: "https://bfl.ai/models/flux-3-video",
    inputType: "i2v",
    protocol: "Custom",
    promptDetails: "Custom prompt rewrite.",
    dateAdded: "2026-10-04",
    company: "Black Forest Labs",
    outputFps: 24,
    availability: "Proprietary",
    llmSupported: "Yes",
    metrics: { physIq: { mean: 51.11, std: 0.44 }, sp: { mean: 64.36, std: 0.59 }, ws: { mean: 53.25, std: 0.91 }, st: { mean: 41.27, std: 0.99 }, mse: { mean: 45.55, std: 0.55 } }
  },
  {
    id: "bfl__flux3-large-v2v-bpp-bon8__2026-10-04",
    listing: "leaderboard",
    model: "FLUX 3 [large]",
    modelIdentifier: "FLUX.3 [large]",
    sourceUrl: "https://bfl.ai/models/flux-3-video",
    inputType: "v2v",
    protocol: "Custom",
    promptDetails: "Custom prompt rewrite.",
    dateAdded: "2026-10-04",
    company: "Black Forest Labs",
    outputFps: 24,
    availability: "Proprietary",
    llmSupported: "Yes",
    sampling: { candidatesPerPrompt: 8, selector: "WMReward + consensus" },
    metrics: { physIq: { mean: 64.35, std: 0.22 }, sp: { mean: 70.60, std: 0.59 }, ws: { mean: 63.30, std: 0.58 }, st: { mean: 66.12, std: 0.69 }, mse: { mean: 57.39, std: 0.48 } }
  },
  {
    id: "bfl__flux3-large-i2v-bpp-bon8__2026-10-04",
    listing: "leaderboard",
    model: "FLUX 3 [large]",
    modelIdentifier: "FLUX.3 [large]",
    sourceUrl: "https://bfl.ai/models/flux-3-video",
    inputType: "i2v",
    protocol: "Custom",
    promptDetails: "Custom prompt rewrite.",
    dateAdded: "2026-10-04",
    company: "Black Forest Labs",
    outputFps: 24,
    availability: "Proprietary",
    llmSupported: "Yes",
    sampling: { candidatesPerPrompt: 8, selector: "WMReward + consensus" },
    metrics: { physIq: { mean: 54.70, std: 0.41 }, sp: { mean: 67.33, std: 0.62 }, ws: { mean: 56.37, std: 0.74 }, st: { mean: 47.43, std: 0.85 }, mse: { mean: 47.65, std: 0.35 } }
  },
  {
    id: "odyssey-3-v2v-bpp",
    listing: "leaderboard",
    model: "Odyssey-3",
    sourceUrl: "https://odyssey.systems/",
    inputType: "v2v",
    protocol: "BPP",
    dateAdded: "2026-10-06",
    company: "Odyssey",
    outputFps: 16,
    availability: "Proprietary",
    llmSupported: "No",
    metrics: { physIq: { mean: 51.76, std: 0.69 }, sp: { mean: 58.45, std: 0.43 }, ws: { mean: 49.17, std: 0.85 }, st: { mean: 51.16, std: 2.08 }, mse: { mean: 48.24, std: 0.35 } }
  },
  {
    id: "odyssey-3-v2v-prompt-enhanced",
    listing: "leaderboard",
    model: "Odyssey-3",
    sourceUrl: "https://odyssey.systems/",
    inputType: "v2v",
    protocol: "Custom",
    promptDetails: "Custom prompts with LLM assistance.",
    dateAdded: "2026-10-06",
    company: "Odyssey",
    outputFps: 16,
    availability: "Proprietary",
    llmSupported: "Yes",
    metrics: { physIq: { mean: 61.56, std: 1.20 }, sp: { mean: 68.15, std: 0.84 }, ws: { mean: 60.16, std: 1.38 }, st: { mean: 64.15, std: 2.57 }, mse: { mean: 53.76, std: 0.62 } }
  },
  {
    id: "odyssey-3-v2v-bon8-rank-sum",
    listing: "leaderboard",
    model: "Odyssey-3",
    sourceUrl: "https://odyssey.systems/",
    inputType: "v2v",
    protocol: "Custom",
    promptDetails: "Custom prompts; rank-sum selection.",
    sampling: { candidatesPerPrompt: 8, selector: "Rank-sum" },
    dateAdded: "2026-10-06",
    company: "Odyssey",
    outputFps: 16,
    availability: "Proprietary",
    llmSupported: "Yes",
    metrics: { physIq: { mean: 64.43 }, sp: { mean: 70.23 }, ws: { mean: 62.20 }, st: { mean: 70.44 }, mse: { mean: 54.83 } }
  },
  {
    id: "odyssey-3-i2v-bpp",
    listing: "leaderboard",
    model: "Odyssey-3",
    sourceUrl: "https://odyssey.systems/",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-10-06",
    company: "Odyssey",
    outputFps: 16,
    availability: "Proprietary",
    llmSupported: "No",
    metrics: { physIq: { mean: 40.99, std: 0.84 }, sp: { mean: 49.17, std: 1.11 }, ws: { mean: 37.81, std: 1.29 }, st: { mean: 37.40, std: 1.25 }, mse: { mean: 39.59, std: 0.78 } }
  },
  {
    id: "odyssey-3-i2v-prompt-enhanced",
    listing: "leaderboard",
    model: "Odyssey-3",
    sourceUrl: "https://odyssey.systems/",
    inputType: "i2v",
    protocol: "Custom",
    promptDetails: "Custom prompts with LLM assistance.",
    dateAdded: "2026-10-06",
    company: "Odyssey",
    outputFps: 16,
    availability: "Proprietary",
    llmSupported: "Yes",
    metrics: { physIq: { mean: 48.83, std: 0.78 }, sp: { mean: 59.17, std: 1.01 }, ws: { mean: 48.20, std: 1.30 }, st: { mean: 44.70, std: 1.86 }, mse: { mean: 43.24, std: 0.57 } }
  },
  {
    id: "odyssey-3-i2v-bon8-rank-sum",
    listing: "leaderboard",
    model: "Odyssey-3",
    sourceUrl: "https://odyssey.systems/",
    inputType: "i2v",
    protocol: "Custom",
    promptDetails: "Custom prompts; rank-sum selection.",
    sampling: { candidatesPerPrompt: 8, selector: "Rank-sum" },
    dateAdded: "2026-10-06",
    company: "Odyssey",
    outputFps: 16,
    availability: "Proprietary",
    llmSupported: "Yes",
    metrics: { physIq: { mean: 52.83 }, sp: { mean: 60.87 }, ws: { mean: 51.25 }, st: { mean: 54.12 }, mse: { mean: 45.09 } }
  },
  {
    id: "odyssey-3-pro-v2v-prompt-enhanced",
    listing: "leaderboard",
    model: "Odyssey-3 Pro",
    sourceUrl: "https://odyssey.systems/",
    inputType: "v2v",
    protocol: "Custom",
    promptDetails: "Custom prompts with LLM assistance.",
    dateAdded: "2026-10-07",
    company: "Odyssey",
    outputFps: 16,
    availability: "Proprietary",
    llmSupported: "Yes",
    metrics: { physIq: { mean: 63.37, std: 0.63 }, sp: { mean: 70.72, std: 0.45 }, ws: { mean: 63.19, std: 0.94 }, st: { mean: 64.17, std: 0.91 }, mse: { mean: 55.40, std: 0.85 } }
  },
  {
    id: "odyssey-3-pro-v2v-bon8-rank-sum",
    listing: "leaderboard",
    model: "Odyssey-3 Pro",
    sourceUrl: "https://odyssey.systems/",
    inputType: "v2v",
    protocol: "Custom",
    promptDetails: "Custom prompts; rank-sum selection.",
    sampling: { candidatesPerPrompt: 8, selector: "Rank-sum" },
    dateAdded: "2026-10-07",
    company: "Odyssey",
    outputFps: 16,
    availability: "Proprietary",
    llmSupported: "Yes",
    metrics: { physIq: { mean: 66.10 }, sp: { mean: 73.19 }, ws: { mean: 65.07 }, st: { mean: 70.33 }, mse: { mean: 55.81 } }
  },
  {
    id: "odyssey-3-pro-i2v-prompt-enhanced",
    listing: "leaderboard",
    model: "Odyssey-3 Pro",
    sourceUrl: "https://odyssey.systems/",
    inputType: "i2v",
    protocol: "Custom",
    promptDetails: "Custom prompts with LLM assistance.",
    dateAdded: "2026-10-07",
    company: "Odyssey",
    outputFps: 16,
    availability: "Proprietary",
    llmSupported: "Yes",
    metrics: { physIq: { mean: 49.99, std: 0.42 }, sp: { mean: 61.78, std: 0.40 }, ws: { mean: 51.26, std: 0.36 }, st: { mean: 42.97, std: 1.78 }, mse: { mean: 43.96, std: 0.91 } }
  },
  {
    id: "odyssey-3-pro-i2v-bon8-rank-sum",
    listing: "leaderboard",
    model: "Odyssey-3 Pro",
    sourceUrl: "https://odyssey.systems/",
    inputType: "i2v",
    protocol: "Custom",
    promptDetails: "Custom prompts; rank-sum selection.",
    sampling: { candidatesPerPrompt: 8, selector: "Rank-sum" },
    dateAdded: "2026-10-07",
    company: "Odyssey",
    outputFps: 16,
    availability: "Proprietary",
    llmSupported: "Yes",
    metrics: { physIq: { mean: 54.69 }, sp: { mean: 64.71 }, ws: { mean: 55.59 }, st: { mean: 52.54 }, mse: { mean: 45.93 } }
  },
  {
    id: "microsoft-research-asia__physical-registry-i2v__2026-10-05",
    listing: "all",
    model: "Physical Registry",
    modelIdentifier: "Physical Registry",
    inputType: "i2v",
    protocol: "n.d.",
    dateAdded: "2026-10-05",
    company: "Microsoft Research Asia",
    availability: "Not yet available",
    llmSupported: "Yes",
    outputFps: 24,
    metrics: { physIq: { mean: 44.00, std: 0.60 } }
  },
  {
    id: "microsoft-research-asia__physical-registry-v2v__2026-10-05",
    listing: "all",
    model: "Physical Registry",
    modelIdentifier: "Physical Registry",
    inputType: "v2v",
    protocol: "n.d.",
    dateAdded: "2026-10-05",
    company: "Microsoft Research Asia",
    availability: "Not yet available",
    llmSupported: "Yes",
    outputFps: 24,
    metrics: { physIq: { mean: 50.17, std: 0.72 } }
  },
  {
    id: "microsoft-research-asia__physical-registry-prs-bon4-i2v__2026-10-05",
    listing: "all",
    model: "Physical Registry + PRS",
    modelIdentifier: "Physical Registry + PRS",
    inputType: "i2v",
    protocol: "n.d.",
    dateAdded: "2026-10-05",
    company: "Microsoft Research Asia",
    availability: "Not yet available",
    llmSupported: "Yes",
    outputFps: 24,
    sampling: { candidatesPerPrompt: 4, selector: "PRS" },
    metrics: { physIq: { mean: 46.08 } }
  },
  {
    id: "microsoft-research-asia__physical-registry-prs-bon4-v2v__2026-10-05",
    listing: "all",
    model: "Physical Registry + PRS",
    modelIdentifier: "Physical Registry + PRS",
    inputType: "v2v",
    protocol: "n.d.",
    dateAdded: "2026-10-05",
    company: "Microsoft Research Asia",
    availability: "Not yet available",
    llmSupported: "Yes",
    outputFps: 24,
    sampling: { candidatesPerPrompt: 4, selector: "PRS" },
    metrics: { physIq: { mean: 52.61 } }
  }
];
