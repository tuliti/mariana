export type InputType = "i2v" | "t2v" | "v2v";
export type Availability = "Proprietary" | "Open source";
export type LlmSupport = "Yes" | "Likely" | "No";

export type MetricScore = {
  mean: number;
  std: number;
};

export type MetricComponent = {
  mean: number;
  std?: number;
};

export type Submission = {
  id: string;
  model: string;
  modelIdentifier?: string;
  sourceUrl?: string;
  inputType: InputType;
  protocol: string;
  dateAdded: string;
  company: string;
  availability: Availability;
  llmSupported: LlmSupport;
  runs?: number[];
  metrics: {
    physIq: MetricScore;
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
    model: "MiniMax H3 Max",
    modelIdentifier: "minimax/h3-max/image-to-video",
    sourceUrl: "https://fal.ai/models/minimax/h3-max/image-to-video",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-08-27",
    company: "fal.ai",
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
    model: "Magi-1 24B + GeoPhys (BoN) (op)",
    modelIdentifier: "Magi-1 24B",
    sourceUrl: "https://github.com/SandAI-org/MAGI-1",
    inputType: "v2v",
    protocol: "BoN",
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
    model: "Magi-1 24B + GeoPhys (BoN) (op)",
    modelIdentifier: "Magi-1 24B",
    sourceUrl: "https://github.com/SandAI-org/MAGI-1",
    inputType: "i2v",
    protocol: "BoN",
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
    model: "Hunyuan Video 1.5",
    modelIdentifier: "HunyuanVideo-1.5",
    sourceUrl: "https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-06-17",
    company: "Tencent",
    availability: "Open source",
    llmSupported: "No",
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
    model: "Cosmos3 Nano",
    modelIdentifier: "Cosmos3-Nano",
    sourceUrl: "https://huggingface.co/nvidia/Cosmos3-Nano",
    inputType: "i2v",
    protocol: "BPP",
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
    model: "Cosmos3 Super",
    modelIdentifier: "Cosmos3-Super-Image2Video",
    sourceUrl: "https://huggingface.co/nvidia/Cosmos3-Super-Image2Video",
    inputType: "i2v",
    protocol: "BPP",
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
    model: "Cosmos3 Edge",
    modelIdentifier: "Cosmos3-Edge",
    sourceUrl: "https://huggingface.co/nvidia/Cosmos3-Edge",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-08-31",
    company: "NVIDIA",
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
    model: "Gemini Omni 1.1 Flash",
    modelIdentifier: "Gemini Omni 1.1 Flash",
    sourceUrl: "https://ai.google.dev/gemini-api/docs",
    inputType: "i2v", protocol: "BPP", dateAdded: "2026-09-28", company: "Google", availability: "Proprietary", llmSupported: "Yes",
    metrics: { physIq: { mean: 35.34, std: 0.44 }, sp: { mean: 56.14, std: 0.69 }, st: { mean: 18.41, std: 0.46 }, ws: { mean: 36.66, std: 0.85 }, mse: { mean: 30.14, std: 0.27 } }
  },
  {
    id: "gemini-omni-flash-preview-i2v-bpp",
    model: "Gemini Omni Flash",
    modelIdentifier: "Gemini Omni Flash Preview",
    sourceUrl: "https://ai.google.dev/gemini-api/docs",
    inputType: "i2v", protocol: "BPP", dateAdded: "2026-09-28", company: "Google", availability: "Proprietary", llmSupported: "Yes",
    runs: [33.29, 33.13, 33.49, 33.54],
    metrics: { physIq: { mean: 33.36, std: 0.19 }, sp: { mean: 53.85, std: 0.59 }, st: { mean: 18.06, std: 1.34 }, ws: { mean: 33.34, std: 0.22 }, mse: { mean: 28.20, std: 0.37 } }
  },
  {
    id: "veo-31-lite-i2v-bpp",
    model: "Veo 3.1 Lite",
    modelIdentifier: "Veo 3.1 Lite",
    sourceUrl: "https://deepmind.google/models/veo/",
    inputType: "i2v", protocol: "BPP", dateAdded: "2026-09-28", company: "Google", availability: "Proprietary", llmSupported: "Yes",
    metrics: { physIq: { mean: 31.83, std: 0.32 }, sp: { mean: 49.14, std: 0.50 }, st: { mean: 16.13, std: 0.56 }, ws: { mean: 31.89, std: 0.26 }, mse: { mean: 30.15, std: 0.40 } }
  },
  {
    id: "veo-31-fast-i2v-bpp",
    model: "Veo 3.1 Fast",
    modelIdentifier: "Veo 3.1 Fast",
    sourceUrl: "https://deepmind.google/models/veo/",
    inputType: "i2v", protocol: "BPP", dateAdded: "2026-09-28", company: "Google", availability: "Proprietary", llmSupported: "Yes",
    runs: [29.90, 29.38, 29.88, 30.67],
    metrics: { physIq: { mean: 29.96, std: 0.53 }, sp: { mean: 46.70, std: 0.81 }, st: { mean: 15.95, std: 0.80 }, ws: { mean: 29.37, std: 0.48 }, mse: { mean: 27.83, std: 0.50 } }
  },
  {
    id: "cosmos3-super-v2v-bpp",
    model: "Cosmos3 Super V2V",
    modelIdentifier: "cosmos3_32b",
    sourceUrl: "https://www.nvidia.com/en-us/ai/cosmos/",
    inputType: "v2v",
    protocol: "BPP",
    dateAdded: "2026-09-18",
    company: "NVIDIA",
    availability: "Open source",
    llmSupported: "No",
    runs: [49.4386, 49.8991, 49.7743, 54.1509],
    metrics: { physIq: { mean: 50.8, std: 2.2 }, sp: { mean: 61.1, std: 1.9 }, st: { mean: 48.0, std: 4.1 }, ws: { mean: 49.8, std: 2.4 }, mse: { mean: 44.4, std: 1.9 } }
  },
  {
    id: "cosmos3-nano-v2v-bpp",
    model: "Cosmos3 Nano V2V",
    modelIdentifier: "cosmos3_8b",
    sourceUrl: "https://www.nvidia.com/en-us/ai/cosmos/",
    inputType: "v2v",
    protocol: "BPP",
    dateAdded: "2026-09-18",
    company: "NVIDIA",
    availability: "Open source",
    llmSupported: "No",
    runs: [42.4169, 41.6556, 41.9558, 45.9908],
    metrics: { physIq: { mean: 43.0, std: 2.0 }, sp: { mean: 54.2, std: 1.1 }, st: { mean: 36.5, std: 3.7 }, ws: { mean: 41.5, std: 1.9 }, mse: { mean: 39.8, std: 1.7 } }
  }
];
