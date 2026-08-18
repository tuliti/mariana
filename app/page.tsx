"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Database,
  ExternalLink,
  FileText,
  Filter,
  Github,
  Search,
  SlidersHorizontal,
  X
} from "lucide-react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { submissions, type MetricScore, type Submission } from "../data/submissions";

type ViewMode = "models" | "companies";
type ScoreMode = "verified" | "net";
type BenchmarkTrack = "i2v" | "v2v";
type RankedRow = {
  id: string;
  rank: number;
  model: string;
  company: string;
  availability: string;
  inputType: string;
  protocol: string;
  dateAdded: string;
  llmSupported: string;
  metrics: Submission["metrics"];
  members: Submission[];
};
type CostProfile = {
  submissionId: string;
  label: string;
  text: boolean;
  v2v: boolean;
  i2v: boolean;
  size: string;
  fps: number;
  resolution: string;
  seedControl: boolean;
  price: number;
  llmCost?: number;
  costBasis?: string;
};

type FilterState = {
  query: string;
  companies: string[];
  availability: string[];
  llmSupported: "all" | "yes" | "no";
};

const initialFilters: FilterState = {
  query: "",
  companies: [],
  availability: [],
  llmSupported: "all"
};

const costProfiles: CostProfile[] = [
  {
    submissionId: "grok-imagine-video",
    label: "Grok Imagine Video",
    text: true,
    v2v: false,
    i2v: true,
    size: "n.d.",
    fps: 24,
    resolution: "1280x720",
    seedControl: false,
    price: 0.352
  },
  {
    submissionId: "hunyuan-video-15",
    label: "HunyuanV-1.5",
    text: true,
    v2v: false,
    i2v: true,
    size: "8.3B",
    fps: 24,
    resolution: "848x480",
    seedControl: true,
    price: 0.4
  },
  {
    submissionId: "p-video",
    label: "P-Video",
    text: true,
    v2v: false,
    i2v: true,
    size: "n.d.",
    fps: 24,
    resolution: "1280x704",
    seedControl: true,
    price: 0.1
  },
  {
    submissionId: "sora-2",
    label: "Sora-2",
    text: true,
    v2v: false,
    i2v: true,
    size: "n.d.",
    fps: 30,
    resolution: "1280x720",
    seedControl: false,
    price: 0.8
  },
  {
    submissionId: "wan-22",
    label: "Wan 2.2",
    text: true,
    v2v: false,
    i2v: true,
    size: "14B",
    fps: 16,
    resolution: "1280x720",
    seedControl: true,
    price: 0.11
  },
  {
    submissionId: "cogvideox-5b-i2v-bpp",
    label: "CogVideoX-5B-I2V",
    text: true,
    v2v: false,
    i2v: true,
    size: "5B",
    fps: 8,
    resolution: "720x480",
    seedControl: true,
    price: 0.2354403409,
    costBasis:
      "$1.625/A100-hour; measured 114.75 GPU-hours across 792 videos (521.59 s/video)"
  },
  {
    submissionId: "kandinsky-wm-10-general-physics",
    label: "Kandinsky-WM 1.0",
    text: true,
    v2v: false,
    i2v: true,
    size: "2B",
    fps: 24,
    resolution: "768x512",
    seedControl: false,
    price: 0.1286868687,
    llmCost: 0.0072632576,
    costBasis:
      "$3.25/H100-hour; measured 7.84 generation + 0.4425 prompt H100 GPU-hours across 198 videos"
  },
  {
    submissionId: "cosmos3-nano-bpp-opus",
    label: "Cosmos3-Nano",
    text: true,
    v2v: false,
    i2v: true,
    size: "16B",
    fps: 24,
    resolution: "1280x720",
    seedControl: true,
    price: 0.333,
    llmCost: 0.101,
    costBasis: "$4/H200-hour at 5 min per generation"
  },
  {
    submissionId: "cosmos3-super-image2video",
    label: "Cosmos3-Super-Image2Video",
    text: true,
    v2v: false,
    i2v: true,
    size: "n.d.",
    fps: 24,
    resolution: "1280x720",
    seedControl: true,
    price: 0.722,
    llmCost: 0.101,
    costBasis: "$3.25/GPU-hour, 4 GPUs, 3 min 20 sec per generation"
  }
];

function formatScore(value: number) {
  return value.toFixed(1);
}

function formatSignedScore(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}`;
}

function formatPrice(value: number) {
  return `$${value.toFixed(3)}`;
}

function getResolutionWidth(resolution: string) {
  const width = Number(resolution.toLowerCase().split("x")[0]);
  return Number.isFinite(width) && width > 0 ? width : 1280;
}

function getNormalizedCost(profile: CostProfile) {
  const promptCost = profile.llmCost ?? 0;
  const baseCost = profile.price + promptCost;
  const fpsFactor = 24 / profile.fps;
  const resolutionFactor = 1280 / getResolutionWidth(profile.resolution);
  return {
    baseCost,
    fpsFactor,
    resolutionFactor,
    effectiveCost: profile.price * fpsFactor * resolutionFactor + promptCost
  };
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values)).sort();
}

function optionMatch(selected: string[], value: string) {
  return selected.length === 0 || selected.includes(value);
}

function hasLlmSupport(value: string) {
  return value === "Yes" || value === "Likely";
}

function scoreSubmission(submission: Submission): RankedRow {
  return {
    id: submission.id,
    rank: 0,
    model: submission.model,
    company: submission.company,
    availability: submission.availability,
    inputType: submission.inputType,
    protocol: submission.protocol,
    dateAdded: submission.dateAdded,
    llmSupported: submission.llmSupported,
    metrics: submission.metrics,
    members: [submission]
  };
}

function passesFilters(row: RankedRow, filters: FilterState) {
  const query = filters.query.trim().toLowerCase();
  const searchable = [row.model, row.company, row.availability, row.inputType, row.protocol, row.dateAdded]
    .join(" ")
    .toLowerCase();

  return (
    (!query || searchable.includes(query)) &&
    optionMatch(filters.companies, row.company) &&
    optionMatch(filters.availability, row.availability) &&
    (filters.llmSupported === "all" ||
      (filters.llmSupported === "yes" ? hasLlmSupport(row.llmSupported) : !hasLlmSupport(row.llmSupported)))
  );
}

function makeRows(viewMode: ViewMode, filters: FilterState, benchmarkTrack: BenchmarkTrack) {
  const modelRows = submissions
    .filter((submission) => submission.inputType === benchmarkTrack)
    .map(scoreSubmission)
    .filter((row) => passesFilters(row, filters));

  if (viewMode === "models") {
    return modelRows
      .sort((a, b) => b.metrics.physIq.mean - a.metrics.physIq.mean)
      .map((row, index) => ({ ...row, rank: index + 1 }));
  }

  const byCompany = new Map<string, Submission[]>();
  modelRows.forEach((row) => {
    byCompany.set(row.company, [...(byCompany.get(row.company) ?? []), ...row.members]);
  });

  return Array.from(byCompany.entries())
    .map(([company, members]) => {
      const best = [...members].sort((a, b) => b.metrics.physIq.mean - a.metrics.physIq.mean)[0];
      return {
        id: `company-${company}`,
        rank: 0,
        model: company,
        company: best.model,
        availability: best.availability,
        inputType: best.inputType,
        protocol: best.protocol,
        dateAdded: best.dateAdded,
        llmSupported: best.llmSupported,
        metrics: best.metrics,
        members
      };
    })
    .sort((a, b) => b.metrics.physIq.mean - a.metrics.physIq.mean)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

export default function Home() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [viewMode, setViewMode] = useState<ViewMode>("models");
  const [scoreMode, setScoreMode] = useState<ScoreMode>("verified");
  const [benchmarkTrack, setBenchmarkTrack] = useState<BenchmarkTrack>("i2v");
  const [sorting, setSorting] = useState<SortingState>([{ id: "physIq", desc: true }]);
  const [selected, setSelected] = useState<RankedRow | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const readTrack = () => {
      const track = new URL(window.location.href).searchParams.get("track");
      setBenchmarkTrack(track === "v2v" ? "v2v" : "i2v");
    };
    readTrack();
    window.addEventListener("popstate", readTrack);
    return () => window.removeEventListener("popstate", readTrack);
  }, []);

  const changeBenchmarkTrack = (track: BenchmarkTrack) => {
    setBenchmarkTrack(track);
    setFilters(initialFilters);
    setSelected(null);
    const url = new URL(window.location.href);
    url.searchParams.set("track", track);
    window.history.replaceState({}, "", url);
  };

  const rows = useMemo(
    () => makeRows(viewMode, filters, benchmarkTrack),
    [benchmarkTrack, filters, viewMode]
  );
  const allModelRows = useMemo(
    () =>
      submissions
        .filter((submission) => submission.inputType === benchmarkTrack)
        .map(scoreSubmission),
    [benchmarkTrack]
  );
  const netBaseline = useMemo(
    () =>
      allModelRows.reduce((sum, row) => sum + row.metrics.physIq.mean, 0) /
      Math.max(1, allModelRows.length),
    [allModelRows]
  );
  const netDomain = useMemo(() => {
    const spreads = rows.flatMap((row) => {
      const net = row.metrics.physIq.mean - netBaseline;
      return [Math.abs(net - row.metrics.physIq.std), Math.abs(net + row.metrics.physIq.std)];
    });
    return Math.max(1, Math.ceil(Math.max(...spreads, 1)));
  }, [netBaseline, rows]);
  const activeFilterCount =
    filters.companies.length +
    filters.availability.length +
    (filters.llmSupported === "all" ? 0 : 1) +
    (filters.query.trim() ? 1 : 0);

  const columns = useMemo<ColumnDef<RankedRow>[]>(
    () => [
      {
        accessorKey: "rank",
        header: "Rank",
        cell: ({ row }) => <span className="rank-number">{row.original.rank}</span>,
        size: 68
      },
      {
        accessorKey: "model",
        header: viewMode === "models" ? "Model" : "Company",
        size: 330,
        cell: ({ row }) => (
          <button className="model-cell" onClick={() => setSelected(row.original)}>
            <CompanyMark company={viewMode === "models" ? row.original.company : row.original.model} />
            <span className="model-cell-text">
              <span>{row.original.model}</span>
              <small>
                {viewMode === "models"
                  ? `${row.original.company} · ${row.original.availability}`
                  : row.original.company}
              </small>
            </span>
          </button>
        )
      },
      {
        id: "physIq",
        accessorFn: (row) =>
          scoreMode === "net"
            ? row.metrics.physIq.mean - netBaseline
            : row.metrics.physIq.mean,
        header: () =>
          scoreMode === "net" ? (
            <>
              Net
              <br />
              Improvement
            </>
          ) : (
            <>
              Phys-IQ
              <br />
              Verified
            </>
          ),
        cell: ({ row }) => (
          <ScoreCell
            score={row.original.metrics.physIq}
            mode={scoreMode}
            baseline={netBaseline}
            netDomain={netDomain}
          />
        )
      },
      {
        accessorKey: "inputType",
        header: "Input",
        cell: ({ row }) => <span className="tag">{row.original.inputType}</span>
      },
      {
        accessorKey: "llmSupported",
        header: "LLM",
        cell: ({ row }) => (
          <span className={hasLlmSupport(row.original.llmSupported) ? "yes" : "muted-value"}>
            {row.original.llmSupported}
          </span>
        )
      },
      {
        accessorKey: "dateAdded",
        header: "Date",
        cell: ({ row }) => <span className="muted-value">{row.original.dateAdded}</span>
      }
    ],
    [netBaseline, netDomain, scoreMode, viewMode]
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <main className="page-shell">
      <BackgroundField />
      <header className="site-header">
        <a className="brand" href="https://anates.ai" aria-label="Anates Labs">
          <OrbitalMark />
          <span>Anates Labs</span>
        </a>
        <nav className="header-links" aria-label="Primary">
          <a href="https://arxiv.org/abs/2606.18943" target="_blank" rel="noreferrer">
            Paper <ExternalLink size={13} />
          </a>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="terminal-line">// measuring visual intelligence<span className="blink">_</span></p>
          <p className="benchmark-title">Physics-IQ Verified</p>
        </div>
      </section>

      <section className="notice-band">
        <a className="resource-card" href="https://github.com/google-deepmind/physics-IQ-benchmark" target="_blank" rel="noreferrer">
          <span>GitHub repo</span>
          <Github size={38} strokeWidth={1.5} aria-hidden="true" />
          <small>Code &amp; benchmark</small>
        </a>
        <a className="resource-card" href="https://arxiv.org/abs/2606.18943" target="_blank" rel="noreferrer">
          <span>Full paper</span>
          <FileText size={38} strokeWidth={1.5} aria-hidden="true" />
          <small>Methods &amp; results</small>
        </a>
        <a className="resource-card" href="/dataset-fixes/">
          <span>Dataset audit</span>
          <Database size={38} strokeWidth={1.5} aria-hidden="true" />
          <small>Fixes &amp; visual evidence</small>
        </a>
      </section>

      <section className="control-band" aria-label="Leaderboard controls">
        <div className="search-box">
          <Search size={16} />
          <input
            value={filters.query}
            onChange={(event) => setFilters({ ...filters, query: event.target.value })}
            placeholder="Search model or company"
            aria-label="Search leaderboard"
          />
        </div>
        <button className="filter-toggle" onClick={() => setMobileFiltersOpen(true)}>
          <SlidersHorizontal size={15} />
          Filters
          {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
        </button>
      </section>

      <div className="workspace" id="leaderboard">
        <aside className="filters-panel" aria-label="Filters">
          <Filters
            filters={filters}
            setFilters={setFilters}
            allRows={allModelRows}
            onReset={() => setFilters(initialFilters)}
          />
        </aside>

        <section className="leaderboard-panel">
          <div className="track-switch-row">
            <span>Benchmark track</span>
            <BenchmarkTrackControl value={benchmarkTrack} onChange={changeBenchmarkTrack} />
          </div>
          <div className="panel-header">
            <div>
              <p className="section-kicker">{benchmarkTrack.toUpperCase()} Verified Ranking</p>
              <h2>{viewMode === "models" ? "Model results" : "Company aggregate"}</h2>
            </div>
            <div className="panel-actions">
              <SegmentedControl value={viewMode} onChange={setViewMode} />
              <ScoreModeControl value={scoreMode} onChange={setScoreMode} />
            </div>
          </div>
          <div className="table-wrap">
            <table className="leaderboard-table">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} style={{ width: header.getSize() }}>
                        {header.isPlaceholder ? null : (
                          <button
                            className="sort-button"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <SortIcon direction={header.column.getIsSorted()} />
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <MetricBreakdown rows={rows} />

      <ParetoFrontier benchmarkTrack={benchmarkTrack} />

      {mobileFiltersOpen && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Filters">
          <button className="drawer-scrim" onClick={() => setMobileFiltersOpen(false)} />
          <div className="drawer-panel">
            <div className="drawer-header">
              <span>
                <Filter size={15} />
                Filters
              </span>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <X size={18} />
              </button>
            </div>
            <Filters
              filters={filters}
              setFilters={setFilters}
              allRows={allModelRows}
              onReset={() => setFilters(initialFilters)}
            />
          </div>
        </div>
      )}

      {selected && <DetailDialog row={selected} onClose={() => setSelected(null)} />}

      <footer className="site-footer">
        <a href="https://anates.ai" target="_blank" rel="noreferrer">
          Brought to you by Anates Labs
        </a>
      </footer>
    </main>
  );
}

function Filters({
  filters,
  setFilters,
  allRows,
  onReset
}: {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  allRows: RankedRow[];
  onReset: () => void;
}) {
  return (
    <div className="filters-content">
      <div className="filters-title">
        <span>Filter Matrix</span>
        <button onClick={onReset}>Reset</button>
      </div>
      <OptionGroup
        label="Company"
        options={unique(allRows.map((row) => row.company))}
        selected={filters.companies}
        onChange={(companies) => setFilters({ ...filters, companies })}
      />
      <OptionGroup
        label="Availability"
        options={unique(allRows.map((row) => row.availability))}
        selected={filters.availability}
        onChange={(availability) => setFilters({ ...filters, availability })}
      />
      <RadioGroup
        label="LLM Usage"
        value={filters.llmSupported}
        options={[
          ["all", "All"],
          ["yes", "LLM"],
          ["no", "No LLM"]
        ]}
        onChange={(llmSupported) => setFilters({ ...filters, llmSupported })}
      />
    </div>
  );
}

function OptionGroup({
  label,
  options,
  selected,
  onChange
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  return (
    <fieldset className="filter-group">
      <legend>{label}</legend>
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <button
            type="button"
            key={option}
            aria-pressed={checked}
            onClick={() =>
              onChange(checked ? selected.filter((item) => item !== option) : [...selected, option])
            }
          >
            <span>{checked && <Check size={12} />}</span>
            {option}
          </button>
        );
      })}
    </fieldset>
  );
}

function RadioGroup<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="filter-group">
      <legend>{label}</legend>
      {options.map(([optionValue, optionLabel]) => (
        <button
          type="button"
          key={optionValue}
          aria-pressed={value === optionValue}
          onClick={() => onChange(optionValue)}
        >
          <span>{value === optionValue && <Check size={12} />}</span>
          {optionLabel}
        </button>
      ))}
    </fieldset>
  );
}

function SegmentedControl({
  value,
  onChange
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}) {
  return (
    <div className="segmented" role="group" aria-label="Ranking view">
      <button aria-pressed={value === "models"} onClick={() => onChange("models")}>
        Models
      </button>
      <button aria-pressed={value === "companies"} onClick={() => onChange("companies")}>
        Companies
      </button>
    </div>
  );
}

function BenchmarkTrackControl({
  value,
  onChange
}: {
  value: BenchmarkTrack;
  onChange: (value: BenchmarkTrack) => void;
}) {
  return (
    <div className="segmented track-control" role="group" aria-label="Benchmark track">
      <button aria-pressed={value === "i2v"} onClick={() => onChange("i2v")}>
        Image-to-Video <small>I2V</small>
      </button>
      <button aria-pressed={value === "v2v"} onClick={() => onChange("v2v")}>
        Video-to-Video <small>V2V</small>
      </button>
    </div>
  );
}

function ScoreModeControl({
  value,
  onChange
}: {
  value: ScoreMode;
  onChange: (value: ScoreMode) => void;
}) {
  return (
    <div className="segmented score-mode-control" role="group" aria-label="Score mode">
      <button aria-pressed={value === "verified"} onClick={() => onChange("verified")}>
        Verified Score
      </button>
      <button aria-pressed={value === "net"} onClick={() => onChange("net")}>
        Net Improvement
      </button>
    </div>
  );
}

function CompanyMark({ company }: { company: string }) {
  const [iconFailed, setIconFailed] = useState(false);
  const iconSrc = getCompanyIconSrc(company);
  const initials = company
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="company-mark" style={getCompanyMarkStyle(company)} aria-hidden="true">
      {iconSrc && !iconFailed && <img src={iconSrc} alt="" onError={() => setIconFailed(true)} />}
      {(!iconSrc || iconFailed) && <span>{initials}</span>}
    </span>
  );
}

function MetricBreakdown({ rows }: { rows: RankedRow[] }) {
  const metrics = [
    { key: "sp" as const, label: "Spatial" },
    { key: "st" as const, label: "Spatiotemporal" },
    { key: "ws" as const, label: "Weighted Spatial" },
    { key: "mse" as const, label: "MSE" }
  ];
  const hasSubmetrics = rows.some((row) =>
    metrics.some((metric) => Boolean(row.metrics[metric.key]))
  );

  return (
    <section className="metric-breakdown" aria-label="Metric breakdown">
      <div className="panel-header">
        <div>
          <p className="section-kicker">Metric Breakdown</p>
          <h2>Submetric leaders</h2>
        </div>
      </div>
      {hasSubmetrics ? <div className="breakdown-grid">
        {metrics.map((metric) => {
          const leaders = rows
            .flatMap((row) => {
              const score = row.metrics[metric.key];
              return score ? [{ row, score }] : [];
            })
            .sort((a, b) => b.score.mean - a.score.mean)
            .slice(0, 5);
          const max = Math.max(...leaders.map(({ score }) => score.mean), 1);

          return (
            <article className="breakdown-card" key={metric.key}>
              <h3>{metric.label}</h3>
              <ol>
                {leaders.map(({ row, score }) => {
                  return (
                    <li key={`${metric.key}-${row.id}`}>
                      <span className="breakdown-name">{row.model}</span>
                      <span className="breakdown-bar" aria-hidden="true">
                        <span style={{ width: `${Math.max(5, (score.mean / max) * 100)}%` }} />
                      </span>
                      <span className="breakdown-score">
                        {formatScore(score.mean)}
                        <small>±{formatScore(score.std)}</small>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </article>
          );
        })}
      </div> : (
        <p className="track-empty-state">
          Component-level scores have not yet been reported for this benchmark track.
        </p>
      )}
    </section>
  );
}

function ParetoFrontier({ benchmarkTrack }: { benchmarkTrack: BenchmarkTrack }) {
  const points = costProfiles
    .map((profile) => {
      const submission = submissions.find((item) => item.id === profile.submissionId);
      if (!submission || submission.inputType !== benchmarkTrack) return null;
      return {
        ...profile,
        ...getNormalizedCost(profile),
        model: submission.model,
        company: submission.company,
        performance: submission.metrics.physIq.mean,
        std: submission.metrics.physIq.std
      };
    })
    .filter((point): point is NonNullable<typeof point> => Boolean(point));

  if (points.length === 0) {
    return (
      <section
        className="pareto-panel"
        aria-label={`${benchmarkTrack.toUpperCase()} cost performance frontier`}
      >
        <div className="panel-header">
          <div>
            <p className="section-kicker">{benchmarkTrack.toUpperCase()} Cost Frontier</p>
            <h2>Score vs Cost ($)</h2>
          </div>
        </div>
        <p className="track-empty-state">
          Cost data has not yet been reported for this benchmark track.
        </p>
      </section>
    );
  }

  const minPrice = 0;
  const maxPrice = Math.max(...points.map((point) => point.effectiveCost));
  const minPerformance = 15;
  const maxPerformance = 50;
  const priceRange = Math.max(0.001, maxPrice - minPrice);
  const performanceRange = Math.max(1, maxPerformance - minPerformance);
  const plotX = (price: number) => 7 + ((price - minPrice) / priceRange) * 86;
  const plotY = (performance: number) =>
    88 - ((performance - minPerformance) / performanceRange) * 76;
  const frontier = points
    .filter((candidate) =>
      points.every(
        (other) =>
          other === candidate ||
          other.effectiveCost > candidate.effectiveCost ||
          other.performance < candidate.performance ||
          (other.effectiveCost === candidate.effectiveCost && other.performance === candidate.performance)
      )
    )
    .sort((a, b) => a.effectiveCost - b.effectiveCost);
  const frontierPath = frontier
    .map((point, index) => `${index === 0 ? "M" : "L"} ${plotX(point.effectiveCost)} ${plotY(point.performance)}`)
    .join(" ");

  return (
    <section className="pareto-panel" aria-label="Cost performance frontier">
      <div className="panel-header">
        <div>
          <p className="section-kicker">Cost Frontier</p>
          <h2>Score vs Cost ($)</h2>
        </div>
      </div>
      <div className="pareto-grid">
        <div className="pareto-plot" role="img" aria-label="Normalized effective cost against Phys-IQ verified score">
          <div className="axis-label y-axis">Phys-IQ verified</div>
          <div className="axis-label x-axis">Effective cost</div>
          <svg className="frontier-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d={frontierPath} />
          </svg>
          {points.map((point) => {
            const isFrontier = frontier.some((item) => item.submissionId === point.submissionId);
            const x = plotX(point.effectiveCost);
            return (
              <div
                className={[
                  "pareto-point",
                  isFrontier ? "is-frontier" : "",
                  x > 74 ? "is-right-edge" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={point.submissionId}
                style={{ left: `${x}%`, top: `${plotY(point.performance)}%` }}
              >
                <CompanyMark company={point.company} />
                <span className="point-label">{point.model}</span>
                <span className="point-tooltip">
                  <strong>{point.model}</strong>
                  <span>{point.company}</span>
                  <span>
                    Score: {formatScore(point.performance)} ±{formatScore(point.std)}
                  </span>
                  <span>Effective cost {formatPrice(point.effectiveCost)}</span>
                </span>
              </div>
            );
          })}
          <div className="axis-tick x-start">{formatPrice(minPrice)}</div>
          <div className="axis-tick x-end">{formatPrice(maxPrice)}</div>
          <div className="axis-tick y-start">{minPerformance}%</div>
          <div className="axis-tick y-end">{maxPerformance}%</div>
        </div>
      </div>
      <p className="frontier-note">
        * Price via leading API providers or estimated via GPU market rate, May 2026. Effective
        cost normalizes to 24 FPS and 1280-wide output, with separate LLM prompt overhead where used.
        n.d. denotes values not publicly disclosed by the model provider. GPU implementations were
        done to the best of our knowledge and as close as possible to the recommended setup.
      </p>
    </section>
  );
}

function getCompanyIconSrc(company: string) {
  const icons: Record<string, string> = {
    "xai": "/icons/xai.svg",
    "tencent": "/icons/tencent.png",
    "alibaba": "/icons/alibaba.png",
    "openai": "/icons/openai.svg",
    "pruna ai": "/icons/pruna-ai.svg",
    "nvidia": "/icons/nvidia.svg",
    "google": "/icons/google.svg",
    "sand ai": "/icons/sand-ai.png",
    "magi": "/icons/magi.png",
    "kandinsky": "/icons/kandinsky.svg",
    "kandinsky lab": "/icons/kandinsky.svg"
  };

  return icons[company.toLowerCase()] ?? null;
}

function getCompanyMarkStyle(company: string): CSSProperties {
  const companyColors: Record<string, { color: string; bg: string; border: string }> = {
    "xai": {
      color: "rgba(255, 255, 255, 0.92)",
      bg: "rgba(255, 255, 255, 0.1)",
      border: "rgba(255, 255, 255, 0.3)"
    },
    "tencent": {
      color: "rgba(255, 220, 150, 0.98)",
      bg: "rgba(240, 190, 80, 0.14)",
      border: "rgba(240, 216, 120, 0.38)"
    },
    "alibaba": {
      color: "rgba(255, 210, 120, 0.98)",
      bg: "rgba(255, 150, 45, 0.14)",
      border: "rgba(240, 180, 90, 0.38)"
    },
    "openai": {
      color: "rgba(170, 240, 220, 0.98)",
      bg: "rgba(80, 190, 170, 0.14)",
      border: "rgba(120, 210, 190, 0.34)"
    },
    "pruna ai": {
      color: "rgba(170, 205, 255, 0.98)",
      bg: "rgba(95, 140, 255, 0.15)",
      border: "rgba(120, 170, 255, 0.38)"
    },
    "nvidia": {
      color: "rgba(190, 255, 125, 0.98)",
      bg: "rgba(118, 185, 0, 0.18)",
      border: "rgba(118, 185, 0, 0.46)"
    },
    "sand ai": {
      color: "rgba(255, 255, 255, 0.95)",
      bg: "rgba(240, 216, 120, 0.14)",
      border: "rgba(240, 216, 120, 0.38)"
    },
    "magi": {
      color: "rgba(255, 255, 255, 0.95)",
      bg: "rgba(240, 216, 120, 0.14)",
      border: "rgba(240, 216, 120, 0.38)"
    }
  };
  const colors = companyColors[company.toLowerCase()] ?? {
    color: "var(--gold)",
    bg: "rgba(240, 216, 120, 0.12)",
    border: "rgba(240, 216, 120, 0.28)"
  };

  return {
    "--mark-color": colors.color,
    "--mark-bg": colors.bg,
    "--mark-border": colors.border
  } as CSSProperties;
}

function ScoreCell({
  score,
  mode,
  baseline,
  netDomain
}: {
  score: MetricScore;
  mode: ScoreMode;
  baseline: number;
  netDomain: number;
}) {
  if (mode === "net") {
    const net = score.mean - baseline;
    const center = 50;
    const scale = 50 / netDomain;
    const valuePosition = Math.max(0, Math.min(100, center + net * scale));
    const ciStart = Math.max(0, Math.min(100, center + (net - score.std) * scale));
    const ciEnd = Math.max(ciStart, Math.min(100, center + (net + score.std) * scale));
    const fillStart = Math.min(center, valuePosition);
    const fillWidth = Math.max(1, Math.abs(valuePosition - center));

    return (
      <div className="score-cell">
        <div className="score-readout">
          <span className={net >= 0 ? "positive-score" : "negative-score"}>
            {formatSignedScore(net)}%
          </span>
          <small>±{formatScore(score.std)}%</small>
        </div>
        <div
          className="score-track score-track-net"
          aria-label={`Net improvement ${formatSignedScore(net)} percent plus or minus ${formatScore(score.std)} percent`}
        >
          <span className="score-zero" />
          <span
            className={net >= 0 ? "score-fill net-positive" : "score-fill net-negative"}
            style={{ left: `${fillStart}%`, width: `${fillWidth}%` }}
          />
          <span
            className="score-ci"
            style={{ left: `${ciStart}%`, width: `${Math.max(1.2, ciEnd - ciStart)}%` }}
          />
          <span className="score-marker" style={{ left: `${valuePosition}%` }} />
        </div>
      </div>
    );
  }

  const width = Math.max(6, Math.min(100, score.mean));
  const ciStart = Math.max(0, Math.min(100, score.mean - score.std));
  const ciEnd = Math.max(ciStart, Math.min(100, score.mean + score.std));
  return (
    <div className="score-cell">
      <div className="score-readout">
        <span>{formatScore(score.mean)}%</span>
        <small>±{formatScore(score.std)}</small>
      </div>
      <div
        className="score-track"
        aria-label={`Phys-IQ verified ${formatScore(score.mean)} plus or minus ${formatScore(score.std)}`}
      >
        <span className="score-fill" style={{ width: `${width}%` }} />
        <span
          className="score-ci"
          style={{ left: `${ciStart}%`, width: `${Math.max(1.2, ciEnd - ciStart)}%` }}
        />
        <span className="score-marker" style={{ left: `${width}%` }} />
      </div>
    </div>
  );
}

function DetailDialog({ row, onClose }: { row: RankedRow; onClose: () => void }) {
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={`${row.model} details`}>
      <button className="modal-scrim" onClick={onClose} />
      <article className="modal-panel">
        <header>
          <div>
            <p className="section-kicker">Submission Detail</p>
            <h2>{row.model}</h2>
            <span>{row.company}</span>
          </div>
          <button onClick={onClose} aria-label="Close detail">
            <X size={18} />
          </button>
        </header>
        <div className="detail-score">
          <span>{formatScore(row.metrics.physIq.mean)}</span>
          <small>Phys-IQ verified / std ±{formatScore(row.metrics.physIq.std)}</small>
        </div>
        <div className="detail-meta">
          <span>{row.inputType}</span>
          <span>{row.protocol}</span>
          <span>{row.availability}</span>
          <span>{hasLlmSupport(row.llmSupported) ? `LLM ${row.llmSupported}` : "No LLM support"}</span>
          <span>{row.dateAdded}</span>
        </div>
        {row.members.length > 1 && (
          <div className="member-list">
            <p className="section-kicker">Included submissions</p>
            {row.members.map((member) => (
              <span key={member.id}>{member.model}</span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
  if (direction === "asc") return <ArrowUp size={12} />;
  if (direction === "desc") return <ArrowDown size={12} />;
  return <ChevronDown size={12} />;
}

function OrbitalMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect width="16" height="16" rx="3.5" fill="#000B1A" />
      <circle cx="8" cy="8" r="1.5" fill="#F0D878" />
      <circle cx="8" cy="8" r="4" fill="none" stroke="#F0D878" strokeWidth="0.8" opacity="0.65" />
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="#F0D878" strokeWidth="0.5" opacity="0.33" />
    </svg>
  );
}

function BackgroundField() {
  return (
    <div className="background-field" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}
