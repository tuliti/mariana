export type InputType = "i2v" | "t2v" | "v2v";
export type Availability = "Proprietary" | "Open source";
export type LlmSupport = "Yes" | "Likely" | "No";

export type MetricScore = {
  mean: number;
  std: number;
};

export type Submission = {
  id: string;
  model: string;
  inputType: InputType;
  protocol: string;
  dateAdded: string;
  company: string;
  availability: Availability;
  llmSupported: LlmSupport;
  runs?: number[];
  metrics: {
    physIq: MetricScore;
    sp?: MetricScore;
    st?: MetricScore;
    ws?: MetricScore;
    mse?: MetricScore;
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
    id: "magi-1-24b-geophys-bon-op-v2v",
    model: "Magi-1 24B + GeoPhys (BoN) (op)",
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
    model: "Kandinsky-WM 1.0 General Physics",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-08-07",
    company: "Kandinsky Lab",
    availability: "Open source",
    llmSupported: "Yes",
    metrics: {
      physIq: { mean: 30.8, std: 0.9 }
    }
  },
  {
    id: "grok-imagine-video",
    model: "Grok Imagine Video",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-06-17",
    company: "xAI",
    availability: "Proprietary",
    llmSupported: "Likely",
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
    id: "wan-22",
    model: "Wan 2.2",
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
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-06-17",
    company: "OpenAI",
    availability: "Proprietary",
    llmSupported: "Likely",
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
    model: "Cosmos3-Nano",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-06-18",
    company: "NVIDIA",
    availability: "Open source",
    llmSupported: "Yes",
    runs: [30.22, 30.07, 29.55, 31.24],
    metrics: {
      physIq: { mean: 30.27, std: 0.61 },
      sp: { mean: 44.48, std: 0.66 },
      st: { mean: 20.87, std: 0.9 },
      ws: { mean: 28.96, std: 0.76 },
      mse: { mean: 26.76, std: 0.82 }
    }
  },
  {
    id: "cosmos3-super-image2video",
    model: "Cosmos3-Super-Image2Video",
    inputType: "i2v",
    protocol: "BPP",
    dateAdded: "2026-06-18",
    company: "NVIDIA",
    availability: "Open source",
    llmSupported: "Yes",
    metrics: {
      physIq: { mean: 39.49, std: 0.82 },
      sp: { mean: 53.56, std: 1.45 },
      st: { mean: 29.96, std: 1.82 },
      ws: { mean: 38.58, std: 1.41 },
      mse: { mean: 35.85, std: 0.58 }
    }
  }
];
