"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ExternalLink,
  Filter,
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
import { useMemo, useState } from "react";
import { submissions, type MetricScore, type Submission } from "../data/submissions";

type ViewMode = "models" | "companies";
type ScoreMode = "verified" | "net";
type MetricKey = keyof Submission["metrics"];
type RankedRow = {
  id: string;
  rank: number;
  model: string;
  company: string;
  availability: string;
  inputType: string;
  dateAdded: string;
  llmSupported: boolean;
  metrics: Submission["metrics"];
  members: Submission[];
};

type FilterState = {
  query: string;
  companies: string[];
  inputTypes: string[];
  availability: string[];
  llmSupported: "all" | "yes" | "no";
};

const initialFilters: FilterState = {
  query: "",
  companies: [],
  inputTypes: [],
  availability: [],
  llmSupported: "all"
};

function formatScore(value: number) {
  return value.toFixed(1);
}

function formatSignedScore(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}`;
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values)).sort();
}

function optionMatch(selected: string[], value: string) {
  return selected.length === 0 || selected.includes(value);
}

function averageMetric(rows: Submission[], metric: MetricKey): MetricScore {
  const means = rows.map((row) => row.metrics[metric].mean);
  const stds = rows.map((row) => row.metrics[metric].std);
  return {
    mean: means.reduce((sum, value) => sum + value, 0) / means.length,
    std: stds.reduce((sum, value) => sum + value, 0) / stds.length
  };
}

function scoreSubmission(submission: Submission): RankedRow {
  return {
    id: submission.id,
    rank: 0,
    model: submission.model,
    company: submission.company,
    availability: submission.availability,
    inputType: submission.inputType,
    dateAdded: submission.dateAdded,
    llmSupported: submission.llmSupported,
    metrics: submission.metrics,
    members: [submission]
  };
}

function passesFilters(row: RankedRow, filters: FilterState) {
  const query = filters.query.trim().toLowerCase();
  const searchable = [row.model, row.company, row.availability, row.inputType, row.dateAdded]
    .join(" ")
    .toLowerCase();

  return (
    (!query || searchable.includes(query)) &&
    optionMatch(filters.companies, row.company) &&
    optionMatch(filters.inputTypes, row.inputType) &&
    optionMatch(filters.availability, row.availability) &&
    (filters.llmSupported === "all" ||
      (filters.llmSupported === "yes" ? row.llmSupported : !row.llmSupported))
  );
}

function makeRows(viewMode: ViewMode, filters: FilterState) {
  const modelRows = submissions.map(scoreSubmission).filter((row) => passesFilters(row, filters));

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
    .map(([company, members]) => ({
      id: `company-${company}`,
      rank: 0,
      model: company,
      company: `${members.length} submission${members.length === 1 ? "" : "s"}`,
      availability: unique(members.map((member) => member.availability)).join(", "),
      inputType: unique(members.map((member) => member.inputType)).join(", "),
      dateAdded: unique(members.map((member) => member.dateAdded)).at(-1) ?? "",
      llmSupported: members.some((member) => member.llmSupported),
      metrics: {
        physIq: averageMetric(members, "physIq"),
        sp: averageMetric(members, "sp"),
        st: averageMetric(members, "st"),
        ws: averageMetric(members, "ws"),
        mse: averageMetric(members, "mse")
      },
      members
    }))
    .sort((a, b) => b.metrics.physIq.mean - a.metrics.physIq.mean)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

export default function Home() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [viewMode, setViewMode] = useState<ViewMode>("models");
  const [scoreMode, setScoreMode] = useState<ScoreMode>("verified");
  const [sorting, setSorting] = useState<SortingState>([{ id: "physIq", desc: true }]);
  const [selected, setSelected] = useState<RankedRow | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const rows = useMemo(() => makeRows(viewMode, filters), [viewMode, filters]);
  const allModelRows = useMemo(() => submissions.map(scoreSubmission), []);
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
    filters.inputTypes.length +
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
        header: scoreMode === "net" ? "Net Improvement" : "Phys-IQ",
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
          <span className={row.original.llmSupported ? "yes" : "muted-value"}>
            {row.original.llmSupported ? "Yes" : "No"}
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
        <a className="brand" href="https://anates.com" aria-label="Anates Labs">
          <OrbitalMark />
          <span>Anates Labs</span>
        </a>
        <nav className="header-links" aria-label="Primary">
          <a href="https://arxiv.org/abs/2606.18943" target="_blank" rel="noreferrer">
            Paper <ExternalLink size={13} />
          </a>
          <a href="#leaderboard">Mariana</a>
        </nav>
      </header>

      <section className="hero">
        <div>
          <h1>Mariana</h1>
          <p className="terminal-line">// measuring visual intelligence<span className="blink">_</span></p>
          <p className="benchmark-title">Physics-IQ Verified</p>
        </div>
      </section>

      <section className="notice-band">
        <a href="https://github.com/google-deepmind/physics-IQ-benchmark" target="_blank" rel="noreferrer">
          GitHub repo
        </a>
        <a href="https://arxiv.org/abs/2606.18943" target="_blank" rel="noreferrer">
          Full paper
        </a>
      </section>

      <section className="control-band" aria-label="Leaderboard controls">
        <div className="search-box">
          <Search size={16} />
          <input
            value={filters.query}
            onChange={(event) => setFilters({ ...filters, query: event.target.value })}
            placeholder="Search model, company, input type"
            aria-label="Search leaderboard"
          />
        </div>
        <SegmentedControl value={viewMode} onChange={setViewMode} />
        <ScoreModeControl value={scoreMode} onChange={setScoreMode} />
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
          <div className="panel-header">
            <div>
              <p className="section-kicker">Verified Ranking</p>
              <h2>{viewMode === "models" ? "Model results" : "Company aggregate"}</h2>
            </div>
            <span className="row-count">{rows.length} visible</span>
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
        label="Input Type"
        options={unique(allRows.map((row) => row.inputType))}
        selected={filters.inputTypes}
        onChange={(inputTypes) => setFilters({ ...filters, inputTypes })}
      />
      <OptionGroup
        label="Availability"
        options={unique(allRows.map((row) => row.availability))}
        selected={filters.availability}
        onChange={(availability) => setFilters({ ...filters, availability })}
      />
      <RadioGroup
        label="LLM Support"
        value={filters.llmSupported}
        options={[
          ["all", "All"],
          ["yes", "Supported"],
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
  const normalized = company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const initials = company
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className={`company-mark company-${normalized}`} aria-hidden="true">
      {initials}
    </span>
  );
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
          <span>{row.availability}</span>
          <span>{row.llmSupported ? "LLM supported" : "No LLM support"}</span>
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
