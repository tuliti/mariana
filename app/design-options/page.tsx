"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { CircleHelp, Clapperboard, Database, FileText, FlaskConical, Github } from "lucide-react";
import { costProfiles, formatPrice, getComparisonCost, getCostViewLabel, getCostViewNote, type CostView } from "../../data/cost-profiles";
import { submissions, type InputType, type Submission } from "../../data/submissions";
import "./design-options.css";

// Kept in the source results for auditability, but Magi-1 original-prompt runs are omitted from the preview pending review.
const excludedPreviewSubmissionIds = new Set([
  "magi-1-24b-geophys-bon-op-v2v",
  "magi-1-24b-op-v2v",
  "magi-1-24b-geophys-bon-op"
]);

function BrandMark() {
  return <img className="design-brand-mark" src="/icons/anates-ripple-pale-gold.svg" alt="" aria-hidden="true" />;
}

const companyIcons: Record<string, string> = {
  google: "/icons/google.svg",
  "z.ai": "/icons/zai.svg",
  openai: "/icons/openai.svg",
  nvidia: "/icons/nvidia.svg",
  "pruna ai": "/icons/pruna-ai.svg",
  minimax: "/icons/minimax.svg",
  "xai": "/icons/xai.svg",
  tencent: "/icons/tencent.png",
  alibaba: "/icons/alibaba.png",
  "sand ai": "/icons/sand-ai.png",
  "kandinsky lab": "/icons/kandinsky.svg",
  "seedance": "/icons/seedance.webp",
  "black forest labs": "/icons/bfl.png",
  awomo: "/icons/awomo.svg",
  "microsoft research asia": "/icons/microsoft-research-asia.png",
  fal: "/icons/fal.svg"
};
const allModelsTooltip = "Includes benchmarked models and models known from preprints or announcements, even if public access is unavailable or no release date is confirmed.";

function CompanyIcon({ company }: { company: string }) {
  const icon = companyIcons[company.toLowerCase()];
  const initials = company.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <span className="preview-company-icon" title={company} aria-label={company}>{icon ? <img src={icon} alt="" /> : <small>{initials}</small>}</span>;
}

function ModelLink({ submission, className, children, style, ariaLabel }: { submission: Submission; className: string; children: ReactNode; style?: CSSProperties; ariaLabel?: string }) {
  if (!submission.sourceUrl) return <span className={className} style={style} aria-label={ariaLabel}>{children}</span>;
  return <a className={className} href={submission.sourceUrl} target="_blank" rel="noreferrer" style={style} aria-label={ariaLabel} title={`Open ${submission.model} model page`}>{children}</a>;
}

function ScoreSpread({ mean, std, relative, domain }: { mean: number; std: number; relative: boolean; domain: number }) {
  const valuePosition = relative
    ? Math.max(0, Math.min(100, 50 + (mean / domain) * 50))
    : Math.max(0, Math.min(100, (mean / domain) * 100));
  const low = relative ? 50 + ((mean - std) / domain) * 50 : ((mean - std) / domain) * 100;
  const high = relative ? 50 + ((mean + std) / domain) * 50 : ((mean + std) / domain) * 100;
  const ciStart = Math.max(0, Math.min(100, low));
  const ciEnd = Math.max(ciStart, Math.min(100, high));
  const fillStart = relative ? Math.min(50, valuePosition) : 0;
  const fillWidth = relative ? Math.max(1, Math.abs(valuePosition - 50)) : valuePosition;
  return <div className={`preview-spread ${relative ? "is-relative" : ""}`} role="img" aria-label={`${relative ? "Relative improvement" : "Verified score"} ${mean > 0 && relative ? "+" : ""}${mean.toFixed(2)} plus or minus ${std.toFixed(2)} percentage points`}>
    {relative && <i className="spread-zero" />}
    <i className={`spread-fill ${relative && mean < 0 ? "is-negative" : ""}`} style={{ left: `${fillStart}%`, width: `${fillWidth}%` }} />
    <i className="spread-whisker" style={{ left: `${ciStart}%`, width: `${Math.max(1.2, ciEnd - ciStart)}%` }} />
    <i className="spread-marker" style={{ left: `${valuePosition}%` }} />
  </div>;
}

function ParetoCostCurves({ rows, costView, setCostView }: { rows: Submission[]; costView: CostView; setCostView: (view: CostView) => void }) {
  const points = costProfiles.flatMap((profile) => {
    const submission = rows.find((row) => row.id === profile.submissionId);
    const score = submission?.metrics.physIq;
    if (!submission || !score) return [];
    return [{ submission, score, effectiveCost: getComparisonCost(profile, costView).effectiveCost }];
  });
  const minPrice = Math.min(0.05, ...points.map((point) => point.effectiveCost));
  const maxPrice = Math.max(...points.map((point) => point.effectiveCost), minPrice * 1.02);
  const minPerformance = 15;
  const maxPerformance = 60;
  const logMinPrice = Math.log(minPrice);
  const logPriceRange = Math.max(0.001, Math.log(maxPrice) - logMinPrice);
  const performanceRange = maxPerformance - minPerformance;
  const plotX = (price: number) => 7 + ((Math.log(Math.max(price, minPrice)) - logMinPrice) / logPriceRange) * 86;
  const plotY = (performance: number) => 88 - ((performance - minPerformance) / performanceRange) * 76;
  const costTicks = Array.from(new Set([minPrice, ...[0.1, 0.25, 0.5, 1, 2, 5].filter((value) => value > minPrice && value < maxPrice), maxPrice])).sort((a, b) => a - b);
  const frontier = points
    .filter((candidate) => points.every((other) => other === candidate || other.effectiveCost > candidate.effectiveCost || other.score.mean < candidate.score.mean || (other.effectiveCost === candidate.effectiveCost && other.score.mean === candidate.score.mean)))
    .sort((a, b) => a.effectiveCost - b.effectiveCost);
  const frontierPath = frontier.map((point, index) => `${index === 0 ? "M" : "L"} ${plotX(point.effectiveCost)} ${plotY(point.score.mean)}`).join(" ");
  const title = `${getCostViewLabel(costView)} against Physics-IQ Verified score`;

  return <section className="preview-pareto" aria-label="Pareto cost-performance curves">
    <div className="preview-pareto-heading"><div><span>COST FRONTIER</span><h3>Score vs Cost ($)</h3></div>
      <label className="preview-cost-control"><span>Cost view</span><select value={costView} onChange={(event) => setCostView(event.target.value as CostView)} aria-label="Cost normalization">
        <option value="normalized">FPS + resolution normalized</option><option value="fps">FPS normalized</option><option value="raw">Native generation cost</option>
      </select></label>
    </div>
    {points.length ? <div className="preview-pareto-plot" role="group" aria-label={`${title}; logarithmic cost axis`}>
      <span className="preview-axis-label y">Physics-IQ Verified</span><span className="preview-axis-label x">{getCostViewLabel(costView)} · LOG SCALE</span>
      <svg className="preview-frontier-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d={frontierPath} /></svg>
      {points.map(({ submission, score, effectiveCost }) => {
        const isFrontier = frontier.some((item) => item.submission.id === submission.id);
        const x = plotX(effectiveCost);
        return <ModelLink submission={submission} className={`preview-pareto-point ${isFrontier ? "is-frontier" : ""} ${x > 74 ? "is-right-edge" : ""}`} key={submission.id} style={{ left: `${x}%`, top: `${plotY(score.mean)}%` }} ariaLabel={`${submission.model}: ${score.mean.toFixed(2)}% verified, ${formatPrice(effectiveCost)} ${getCostViewLabel(costView)}`}>
          <CompanyIcon company={submission.company} /><span className="preview-pareto-label">{submission.model}</span>
          <span className="preview-pareto-tooltip"><strong>{submission.model}</strong><span>{submission.company}</span><span>Score: {score.mean.toFixed(2)}{score.std === undefined ? "" : ` ± ${score.std.toFixed(2)}`}</span><span>{getCostViewLabel(costView)}: {formatPrice(effectiveCost)}</span></span>
        </ModelLink>;
      })}
      {costTicks.map((tick) => <span className="preview-cost-tick" key={tick} style={{ left: `${plotX(tick)}%` }}>{formatPrice(tick)}</span>)}<span className="preview-pareto-tick y-start">{minPerformance}%</span><span className="preview-pareto-tick y-end">{maxPerformance}%</span>
    </div> : <p className="preview-pareto-empty">No cost profiles are available for this track and sampling selection.</p>}
    <p className="preview-pareto-note">Cost uses a logarithmic x-axis to keep low-cost models legible. {getCostViewNote(costView)} Separate LLM/prompt costs are added after generation-cost normalization.</p>
  </section>;
}

function Preview({ listing, setListing, track, setTrack, scoreMode, setScoreMode, samplingMode, setSamplingMode, costView, setCostView }: {
  listing: "leaderboard" | "all";
  setListing: (listing: "leaderboard" | "all") => void;
  track: InputType;
  setTrack: (track: InputType) => void;
  scoreMode: "verified" | "relative";
  setScoreMode: (mode: "verified" | "relative") => void;
  samplingMode: "all" | "single" | "bon";
  setSamplingMode: (mode: "all" | "single" | "bon") => void;
  costView: CostView;
  setCostView: (view: CostView) => void;
}) {
  const isBon = (submission: Submission) => Boolean(submission.sampling);
  const boardRows = submissions.filter((submission) => !excludedPreviewSubmissionIds.has(submission.id));
  const trackRows = boardRows
    .filter((submission) => submission.inputType === track)
    .sort((a, b) => {
      const aScore = a.metrics.physIq?.mean;
      const bScore = b.metrics.physIq?.mean;
      if (aScore === undefined) return bScore === undefined ? 0 : 1;
      if (bScore === undefined) return -1;
      return bScore - aScore;
    });
  const listingRows = listing === "all" ? trackRows : trackRows.filter((submission) => submission.listing === "leaderboard");
  const shownRows = listingRows.filter((submission) => samplingMode === "all" || (samplingMode === "bon" ? isBon(submission) : !isBon(submission)));
  const boardLabCount = new Set(boardRows.map((submission) => submission.company)).size;
  const scoredTrackRows = listingRows.filter((row) => row.metrics.physIq);
  const scoredShownRows = shownRows.filter((row) => row.metrics.physIq);
  const baseline = scoredTrackRows.reduce((sum, row) => sum + row.metrics.physIq!.mean, 0) / Math.max(scoredTrackRows.length, 1);
  const relativeDomain = Math.max(5, Math.ceil(Math.max(...scoredShownRows.map((row) => Math.abs(row.metrics.physIq!.mean - baseline) + (row.metrics.physIq!.std ?? 0)), 5) / 5) * 5);
  const verifiedDomain = 100;
  const scoreOf = (row: Submission) => scoreMode === "verified" ? row.metrics.physIq!.mean : row.metrics.physIq!.mean - baseline;
  const rankById = new Map(scoredShownRows.map((row, index) => [row.id, index + 1]));
  const costBySubmission = new Map(costProfiles.map((profile) => [profile.submissionId, getComparisonCost(profile, costView).effectiveCost]));
  const outputFpsBySubmission = new Map(costProfiles.map((profile) => [profile.submissionId, profile.fps]));
  const scoreLabel = scoreMode === "verified" ? "PHYSICS-IQ VERIFIED" : "NET IMPROVEMENT";
  const format = (value: number) => scoreMode === "relative" ? `${value > 0 ? "+" : ""}${value.toFixed(2)}` : value.toFixed(2);
  const submetrics = [
    { key: "sp" as const, short: "SP", label: "Spatial" },
    { key: "st" as const, short: "ST", label: "Spatiotemporal" },
    { key: "ws" as const, short: "WS", label: "Weighted spatial" },
    { key: "mse" as const, short: "MSE", label: "Mean squared error" }
  ];
  return (
    <article className="leader-preview preview-ledger">
      <header className="preview-topbar">
        <a className="preview-brand" href="https://anates.ai" target="_blank" rel="noreferrer" aria-label="Anates Labs home">
          <BrandMark /><span>ANATES LABS</span>
        </a>
      </header>
      <section className="preview-heading">
        <div className="preview-title-wrap">
          <h2>Physics-IQ Verified</h2>
          <p className="preview-description">Dynamic ranking of video models by how well they understand physical principles.</p>
          <div className="preview-summary-row">
            <div className="preview-population" aria-label={`${boardRows.length} models from ${boardLabCount} labs`}>
              <span><Clapperboard size={14} strokeWidth={1.6} aria-hidden="true" /><b>{boardRows.length}</b><small>models</small></span>
              <span><FlaskConical size={14} strokeWidth={1.6} aria-hidden="true" /><b>{boardLabCount}</b><small>labs</small></span>
            </div>
            <nav className="preview-resources" aria-label="Resources">
              <a href="https://github.com/google-deepmind/physics-IQ-benchmark" target="_blank" rel="noreferrer"><Github size={14} strokeWidth={1.6} aria-hidden="true" />GitHub</a>
              <a href="https://arxiv.org/abs/2606.18943" target="_blank" rel="noreferrer"><FileText size={14} strokeWidth={1.6} aria-hidden="true" />Paper</a>
              <a href="/dataset-fixes/"><Database size={14} strokeWidth={1.6} aria-hidden="true" />Dataset audit</a>
            </nav>
          </div>
        </div>
      </section>
      <section className="preview-controls">
        <div className="preview-tabs" aria-label="Choose benchmark track"><button className={track === "i2v" ? "on" : ""} onClick={() => setTrack("i2v")}>Image to video</button><button className={track === "v2v" ? "on" : ""} onClick={() => setTrack("v2v")}>Video to video</button></div>
        <div className="score-mode-tabs" aria-label="Choose score view"><button className={scoreMode === "verified" ? "on" : ""} onClick={() => setScoreMode("verified")}>Verified score</button><button className={scoreMode === "relative" ? "on" : ""} onClick={() => setScoreMode("relative")}>Net improvement</button></div>
        <div className="sampling-tabs" aria-label="Filter by sampling method">
          <span>Sampling</span>
          {([ ["all", "All"], ["single", "Single generation"], ["bon", "BoN"] ] as const).map(([mode, label]) => <button key={mode} className={samplingMode === mode ? "on" : ""} onClick={() => setSamplingMode(mode)} aria-pressed={samplingMode === mode}>{label}<small>{mode === "all" ? listingRows.length : listingRows.filter((row) => mode === "bon" ? isBon(row) : !isBon(row)).length}</small></button>)}
        </div>
        <div className="listing-tabs" role="group" aria-label="Choose model listing">
          <button className={listing === "leaderboard" ? "on" : ""} onClick={() => setListing("leaderboard")} aria-pressed={listing === "leaderboard"}>Leaderboard</button>
          <button className={listing === "all" ? "on" : ""} onClick={() => setListing("all")} aria-pressed={listing === "all"}>All</button>
          <span className="listing-help" tabIndex={0} aria-label={allModelsTooltip} title={allModelsTooltip}><CircleHelp size={12} strokeWidth={1.5} aria-hidden="true" /><span className="listing-tooltip" role="tooltip">{allModelsTooltip}</span></span>
        </div>
      </section>
      <div className="preview-workspace">
        <div className="preview-table-scroll">
        <table className="leader-table">
          <thead><tr>
            <th className="rank-col">RANK</th>
            <th className="model-col">MODEL</th>
            <th className="score-col">{scoreLabel}<small>{scoreMode === "relative" ? "VS TRACK MEAN · PP" : "MEAN ± SAMPLE SD"}</small></th>
            <th>LLM <small>USAGE</small></th>
            <th>PROMPT <small>SOURCE</small></th>
            <th className="num output-fps-head">OUTPUT FPS</th>
            <th className="num compute-head">COST / VIDEO <small>{getCostViewLabel(costView)}</small></th>
            <th className="num compute-head">FLOPs</th>
          </tr></thead>
          <tbody>{shownRows.map((row) => <tr key={row.id}>
            <td className="rank-col">{rankById.has(row.id) ? String(rankById.get(row.id)).padStart(2, "0") : "—"}</td>
            <td className="model-col"><ModelLink submission={row} className="preview-model-mark"><CompanyIcon company={row.company} /><div className="preview-model-copy"><span className="model-name">{row.model}{row.sampling && <em className="model-tag" title={row.sampling.selector}>BoN ×{row.sampling.candidatesPerPrompt}</em>}</span><small>{row.company === row.model ? row.availability.toUpperCase() : `${row.company} · ${row.availability.toUpperCase()}`}</small></div></ModelLink></td>
            <td className="score-col">{row.metrics.physIq ? <div className="preview-score-cell"><div className="preview-score-readout"><span className="preview-score-number">{format(scoreOf(row))}<small>{scoreMode === "relative" ? " pp" : "%"}</small></span>{row.metrics.physIq.std !== undefined && <span className="preview-score-uncertainty">± {row.metrics.physIq.std.toFixed(2)}{scoreMode === "relative" ? " pp" : ""}</span>}</div>{row.metrics.physIq.std !== undefined ? <ScoreSpread mean={scoreOf(row)} std={row.metrics.physIq.std} relative={scoreMode === "relative"} domain={scoreMode === "relative" ? relativeDomain : verifiedDomain} /> : <span className="spread-not-reported">SD not reported</span>}</div> : <span className="unscored-cell">—</span>}</td>
            <td className={`llm-cell ${row.llmSupported === "Yes" ? "is-yes" : ""}`}>{row.llmSupported}</td>
            <td><span className="prompt-label" title={row.promptDetails}>{row.protocol}</span></td>
            <td className="num output-fps-cell">{row.outputFps ?? outputFpsBySubmission.get(row.id) ?? "n.d."}</td>
            <td className="num compute-cell">{costBySubmission.has(row.id) ? formatPrice(costBySubmission.get(row.id)!) : "n.d."}</td>
            <td className="num compute-cell">—</td>
          </tr>)}</tbody>
        </table>
        </div>
      </div>
      <ParetoCostCurves rows={shownRows} costView={costView} setCostView={setCostView} />
      <section className="preview-submetrics" aria-label="Verified submetric leaderboards">
        <div className="preview-submetrics-heading"><div><span>METRIC BREAKDOWN</span><h3>Submetric leaders</h3></div><small>Ranked independently · verified scores</small></div>
        <div className="preview-submetrics-grid">
          {submetrics.map((metric) => {
            const leaders = shownRows
              .flatMap((row) => {
                const score = row.metrics[metric.key];
                return score ? [{ row, score }] : [];
              })
              .sort((a, b) => b.score.mean - a.score.mean)
              .slice(0, 5);
            const max = Math.max(...leaders.map(({ score }) => score.mean), 1);
            return <article className="preview-submetric-card" key={metric.key}>
              <h4><span>{metric.short}</span>{metric.label}</h4>
              {leaders.length ? <div className="preview-submetric-table-wrap"><table className="preview-submetric-table">
                <thead><tr><th>RANK</th><th>MODEL</th><th>SCORE</th></tr></thead>
                <tbody>{leaders.map(({ row, score }, index) => <tr key={row.id}>
                  <td className="submetric-rank">{String(index + 1).padStart(2, "0")}</td>
                  <td><ModelLink submission={row} className="submetric-model"><CompanyIcon company={row.company} />{row.model}</ModelLink><i className="submetric-bar"><i style={{ width: `${Math.max(4, (score.mean / max) * 100)}%` }} /></i></td>
                  <td className="submetric-value">{score.mean.toFixed(2)}<small>{score.std !== undefined ? ` ± ${score.std.toFixed(2)}` : ""}</small></td>
                </tr>)}</tbody>
              </table></div> : <p className="preview-submetric-empty">No scores reported for this metric in the selected list.</p>}
            </article>;
          })}
        </div>
      </section>
      <footer className="preview-credit">Brought to you with love 💛 from <a href="https://anates.ai" target="_blank" rel="noreferrer">Anates Labs</a></footer>
    </article>
  );
}

export default function DesignOptionsPage() {
  const [listing, setListing] = useState<"leaderboard" | "all">("leaderboard");
  const [track, setTrack] = useState<InputType>("i2v");
  const [scoreMode, setScoreMode] = useState<"verified" | "relative">("relative");
  const [samplingMode, setSamplingMode] = useState<"all" | "single" | "bon">("single");
  const [costView, setCostView] = useState<CostView>("normalized");
  const [urlReady, setUrlReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedListing = params.get("listing");
    const requestedTrack = params.get("track");
    const requestedScore = params.get("score");
    const requestedSampling = params.get("sampling");
    const requestedCost = params.get("cost");
    if (requestedListing === "leaderboard" || requestedListing === "all") setListing(requestedListing);
    if (requestedTrack === "i2v" || requestedTrack === "v2v") setTrack(requestedTrack);
    if (requestedScore === "verified" || requestedScore === "relative") setScoreMode(requestedScore);
    if (requestedSampling === "all" || requestedSampling === "single" || requestedSampling === "bon") setSamplingMode(requestedSampling);
    if (requestedCost === "normalized" || requestedCost === "fps" || requestedCost === "raw") setCostView(requestedCost);
    setUrlReady(true);
  }, []);

  useEffect(() => {
    if (!urlReady) return;
    const url = new URL(window.location.href);
    url.searchParams.delete("design");
    url.searchParams.set("listing", listing);
    url.searchParams.set("track", track);
    url.searchParams.set("score", scoreMode);
    url.searchParams.set("sampling", samplingMode);
    url.searchParams.set("cost", costView);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [costView, listing, samplingMode, scoreMode, track, urlReady]);

  return (
    <main className="design-options-page">
      <Preview listing={listing} setListing={setListing} track={track} setTrack={setTrack} scoreMode={scoreMode} setScoreMode={setScoreMode} samplingMode={samplingMode} setSamplingMode={setSamplingMode} costView={costView} setCostView={setCostView} />
    </main>
  );
}
