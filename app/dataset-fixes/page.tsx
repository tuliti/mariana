import type { ReactNode } from "react";
import { House } from "lucide-react";

type Media = {
  src: string;
  kind: "video" | "image";
  label: string;
  priority?: boolean;
};

type PromptIssueExample = {
  id: string;
  title: string;
  original: string;
  verified: string;
  note: string;
  markedText?: string;
  markedPrefix?: string;
  markedSuffix?: string;
  secondaryMarkedText?: string;
  secondaryMarkedPrefix?: string;
  secondaryMarkedSuffix?: string;
  problemConsequence?: string;
  verifiedConsequence?: string;
  switchFrame: string;
  originalVideo: string;
  consequenceGif?: string;
  consequenceVideo?: string;
  outcomeVideo?: string;
  changes: string[];
};

type PromptIssueGroup = {
  title: string;
  summary: string;
  count: string;
  examples: PromptIssueExample[];
};

type SystematicFixExample = {
  id: string;
  title: string;
  tone?: "deterministic" | "non-systematic";
  detailLabel?: string;
  detail: string;
  highlightedEnding?: string;
  switchFrame: string;
  originalVideo: string;
  verifiedVideo: string;
  originalHeatmap: string;
  verifiedHeatmap: string;
};

const promptAsset = (name: string) => `/dataset-fixes/prompt-examples/${name}`;
const artifactAsset = (name: string) => `/dataset-fixes/examples/${name}`;

const promptQualityGroups: PromptIssueGroup[] = [
  {
    title: "Factually Incorrect",
    count: "12 cases",
    summary: "The original prompt states something that does not match the recorded setup or event.",
    examples: [
      {
        id: "0179",
        title: "Two balls pass",
        original:
          "A light-colored wooden tabletop with two pipes at the edges. A blue and yellow tennis ball roll out of the pipes and towards eachother. Static shot with no camera movement.",
        verified:
          "A light-colored wooden tabletop with two pipes at the edges. A grey and a brown tennis ball roll fast out of the pipes. Static shot with no camera movement.",
        note: "Ball color is incorrect:",
        markedText: "blue and yellow",
        markedPrefix: "... A ",
        markedSuffix: " tennis ball ...",
        secondaryMarkedText: "towards eachother",
        secondaryMarkedPrefix: "... ",
        secondaryMarkedSuffix: " ...",
        problemConsequence: "The model spawns additional blue and yellow tennis balls.",
        verifiedConsequence: "No more blue and yellow tennis ball spawns.",
        switchFrame: promptAsset("0179_switch_frame.jpg"),
        originalVideo: promptAsset("0179_example_original.mp4"),
        consequenceVideo: promptAsset("0179_consequence.mp4"),
        outcomeVideo: promptAsset("0179_outcome.mp4"),
        changes: ["blue and yellow -> grey and brown", "towards eachother -> roll fast out of the pipes"]
      },
      {
        id: "0170",
        title: "Basket lifts from ball",
        original:
          "A woven basket is hanging from a rope with a strong magnet attached to the bottom. An orange tennis ball is placed on a table beneath it. The basket is lowered and covers the ball and then the basket starts to lift again. Static shot with no camera movement.",
        verified:
          "A woven basket is hanging from an orange cord with a strong magnet attached to the bottom. An orange tennis ball is placed on a table beneath it. The basket is lifted to the top of the frame. Static shot with no camera movement.",
        note: "Opposite action is described:",
        markedText: "basket is lowered and covers the ball",
        markedPrefix: "... The ",
        markedSuffix: " ...",
        problemConsequence: "The model can generate a basket moving down to hide the ball, although the verified event is the lift.",
        verifiedConsequence: "The action is anchored to the visible lift: basket rises to the top of the frame.",
        switchFrame: promptAsset("0170_switch_frame.jpg"),
        originalVideo: promptAsset("0170_example_original.mp4"),
        consequenceVideo: promptAsset("0170_consequence.mp4"),
        outcomeVideo: promptAsset("0170_outcome.mp4"),
        changes: ["basket is lowered and covers the ball -> basket is lifted to the top of the frame", "effect_end_frame=69"]
      }
    ]
  },
  {
    title: "Temporally Imprecise",
    count: "12 cases",
    summary: "The prompt describes the event timing incorrectly for image-to-video generation from the switch frame.",
    examples: [
      {
        id: "0004",
        title: "Ball behind rotating paper",
        original:
          "A grabber arm is holding a tennis ball above a piece of cardstock propped up on a rotating platform sitting on a table that rotates clockwise. The grabber lowers the ball and places is on the table as the cardstock rotates. Static shot with no camera movement.",
        verified:
          "A blue-black grabber tool is holding an orange tennis ball behind a piece of cardstock propped up on a black rotating platform sitting on a table. The platform rotates clockwise while the grabber releases the ball and places it on the table as the cardstock rotates. Static shot with no camera movement.",
        note: "This already happened in the past",
        markedText: "is holding a tennis ball above",
        markedPrefix: "... ",
        markedSuffix: " ...",
        problemConsequence:
          "The model may spawn additional grabbers from the top, or move the grabber upward and back down before releasing the ball.",
        switchFrame: promptAsset("0004_switch_frame.jpg"),
        originalVideo: promptAsset("0004_example_original.mp4"),
        consequenceVideo: promptAsset("0004_consequence.mp4"),
        outcomeVideo: promptAsset("0004_outcome.mp4"),
        changes: ["is holding a tennis ball above -> releases the ball behind", "lowers the ball -> releases the ball from the switch-frame state"]
      },
      {
        id: "0137",
        title: "Paper in water",
        original:
          "A small piece of crumpled white paper is being lowered into a tall glass containing blue liquid with a green band showing the water level. The crumpled paper is released into the glass. Static shot with no camera movement.",
        verified:
          "A blue-black grabber tool is holding a small piece of crumpled white paper at the inner rim of a tall glass containing blue liquid with a green band marking the water level. The grabber then releases the paper into the glass. Static shot with no camera movement.",
        note: "The switch frame already shows the release moment.",
        problemConsequence: "Grabbers tend to spawn and move downward inside the glass.",
        switchFrame: promptAsset("0137_switch_frame.jpg"),
        originalVideo: promptAsset("0137_example_original.mp4"),
        consequenceVideo: promptAsset("0137_consequence.mp4"),
        outcomeVideo: promptAsset("0137_outcome.mp4"),
        changes: ["being lowered into a tall glass -> holding at the inner rim", "released into the glass -> grabber then releases the paper"]
      }
    ]
  },
  {
    title: "Omitted Information",
    count: "54 cases",
    summary: "The prompt leaves out object identity, color, direction, or the key causal event needed to interpret the video.",
    examples: [
      {
        id: "0125",
        title: "Mug break",
        original:
          "A yellow mug is held by a grabber tool in front of a white projection screen with a concrete brick positioned beneath it. The grabber releases the mug. Static shot with no camera movement.",
        verified:
          "A yellow ceramic mug is held by a grabber tool in front of a white projection screen with a concrete brick positioned beneath it. The grabber releases the mug. Static shot with no camera movement.",
        note: "What’s the material?",
        markedText: "A yellow mug",
        markedPrefix: "... ",
        markedSuffix: " ...",
        problemConsequence:
          "It remains unclear if the mug does not break because of poor model generation or missing material information.",
        switchFrame: promptAsset("0125_switch_frame.jpg"),
        originalVideo: promptAsset("0125_example_original.mp4"),
        consequenceVideo: promptAsset("0125_consequence.mp4"),
        outcomeVideo: promptAsset("0125_outcome.mp4"),
        changes: ["A yellow mug -> A yellow ceramic mug", "Will the mug break?"]
      },
      {
        id: "0019",
        title: "Ball ramp",
        original:
          "A simple ramp made of cardboard propped up by a blue block on a light-colored wooden table. There's a black pipe to the left of the frame and a yellow tennis ball rolls out of the pipe towards the ramp. Static shot with no camera movement.",
        verified:
          "A simple ramp made of cardboard propped up by a blue block on a light-colored wooden table. There's a black pipe to the left of the frame and a yellow tennis ball rolls out of the pipe onto the ramp. Static shot with no camera movement.",
        note: "The fix specifies that the ball rolls onto the ramp, not merely toward it.",
        switchFrame: promptAsset("0019_switch_frame.jpg"),
        originalVideo: promptAsset("0019_example_original.mp4"),
        consequenceVideo: promptAsset("0019_consequence.mp4"),
        outcomeVideo: promptAsset("0019_outcome.mp4"),
        changes: ["towards the ramp -> onto the ramp"]
      }
    ]
  },
  {
    title: "Vague Language",
    count: "9 cases",
    summary: "The prompt uses language that can be interpreted in multiple physical ways.",
    examples: [
      {
        id: "0172",
        title: "Stable blocks",
        original:
          "A pink block is being lowered towards a simple structure made of colorful blocks resembling a gate. Static shot with no camera movement.",
        verified:
          "A blue-black grabber tool is holding a pink block above a simple structure made of colorful blocks resembling a gate. The grabber releases the block carefully and then retracts upward. Static shot with no camera movement.",
        note: "What will the grabber do afterwards or do next?",
        markedText: "A pink block is being lowered",
        markedPrefix: "... ",
        markedSuffix: " ...",
        switchFrame: promptAsset("0172_switch_frame.jpg"),
        originalVideo: promptAsset("0172_example_original.mp4"),
        consequenceVideo: promptAsset("0172_consequence.mp4"),
        outcomeVideo: promptAsset("0172_outcome.mp4"),
        changes: ["A pink block is being lowered -> The grabber releases the block", "adds: then retracts upward"]
      }
    ]
  }
];

const systematicFixExamples: SystematicFixExample[] = [
  {
    id: "0057",
    title: "Duck and dominos",
    detail:
      "A yellow rubber duck has been positioned in the middle of a line of black and white dominoes on a wooden table. The wooden stick attached to the black platform rotates clockwise and knocks the first domino block. Then the rotation stops.",
    highlightedEnding: "Then the rotation stops.",
    switchFrame: artifactAsset("0057_switch_frame.jpg"),
    originalVideo: artifactAsset("0057_original_video.mp4"),
    verifiedVideo: artifactAsset("0057_verified_video.mp4"),
    originalHeatmap: artifactAsset("0057_original_heatmap.png"),
    verifiedHeatmap: artifactAsset("0057_verified_heatmap.png")
  },
  {
    id: "0051",
    title: "Dominos with space",
    detail:
      "Two rows of alternating black and white dominoes have been set up on a wooden table with a gap between the two rows. The wooden stick attached to the black platform rotates clockwise and knocks the first domino. Then the rotation stops.",
    highlightedEnding: "Then the rotation stops.",
    switchFrame: artifactAsset("0051_switch_frame.jpg"),
    originalVideo: artifactAsset("0051_original_video.mp4"),
    verifiedVideo: artifactAsset("0051_verified_video.mp4"),
    originalHeatmap: artifactAsset("0051_original_heatmap.png"),
    verifiedHeatmap: artifactAsset("0051_verified_heatmap.png")
  },
];

const nonSystematicFixExamples: SystematicFixExample[] = [
  {
    id: "0002",
    title: "Ball and block fall",
    tone: "non-systematic",
    detailLabel: "Prompt",
    detail:
      "Two pillows are on a table, and two grabber tools, one orange-black and one blue-black, are positioned above them. The blue-black grabber is holding a brown tennis ball, and the orange-black grabber is holding an orange block. Both grabbers then release their objects. Static shot with no camera movement.",
    switchFrame: artifactAsset("0002_switch_frame.jpg"),
    originalVideo: artifactAsset("0002_original_video.mp4"),
    verifiedVideo: artifactAsset("0002_verified_video.mp4"),
    originalHeatmap: artifactAsset("0002_original_heatmap.png"),
    verifiedHeatmap: artifactAsset("0002_verified_heatmap.png")
  },
  {
    id: "0016",
    title: "Ball in sand",
    tone: "non-systematic",
    detailLabel: "Prompt",
    detail:
      "A blue-black grabber tool is holding a blue tennis ball above a pile of green kinetic sand on a wooden table. The grabber then releases the ball. Static shot with no camera movement.",
    switchFrame: artifactAsset("0016_switch_frame.jpg"),
    originalVideo: artifactAsset("0016_original_video.mp4"),
    verifiedVideo: artifactAsset("0016_verified_video.mp4"),
    originalHeatmap: artifactAsset("0016_original_heatmap.png"),
    verifiedHeatmap: artifactAsset("0016_verified_heatmap.png")
  },
  {
    id: "0047",
    title: "Domino in juice",
    tone: "non-systematic",
    detailLabel: "Prompt",
    detail:
      "A blue-black grabber tool is holding a white ceramic domino above a blue mug filled with dark-colored liquid on a wooden surface. The grabber then releases the domino into the mug. Static shot with no camera movement.",
    switchFrame: artifactAsset("0047_switch_frame.jpg"),
    originalVideo: artifactAsset("0047_original_video.mp4"),
    verifiedVideo: artifactAsset("0047_verified_video.mp4"),
    originalHeatmap: artifactAsset("0047_original_heatmap.png"),
    verifiedHeatmap: artifactAsset("0047_verified_heatmap.png")
  }
];

export default function DatasetFixesPage() {
  return (
    <main className="visual-page variants-page">
      <div className="visual-bg" aria-hidden="true" />
      <header className="visual-header">
        <a className="brand" href="https://anates.ai" aria-label="Anates Labs">
          <OrbitalMark />
          <span>Anates Labs</span>
        </a>
      </header>

      <section className="visual-hero variants-hero">
        <div className="variants-hero-layout">
          <a className="overview-resource" href="/" aria-label="Return to the Physics-IQ Verified leaderboard overview">
            <span>Leaderboard</span>
            <House size={38} strokeWidth={1.5} aria-hidden="true" />
            <small>Scores &amp; results</small>
          </a>
          <div className="variants-hero-copy">
            <p className="section-kicker">Physics-IQ Verified</p>
            <h1>Dataset-fix visual overview</h1>
            <p>
              Visual examples of the applied fixes behind Physics-IQ Verified.
            </p>
          </div>
        </div>
      </section>

      <section className="prompt-quality-section" id="prompt-quality">
        <div className="prompt-quality-heading">
          <p className="section-kicker">Prompt audit</p>
          <h2>Prompt Quality</h2>
        </div>

        <div className="prompt-quality-groups">
          {promptQualityGroups.map((group) => (
            <section className="prompt-quality-group" key={group.title}>
              <div className="prompt-quality-group-heading">
                <div>
                  <h3>{group.title}</h3>
                  <p>{group.summary}</p>
                </div>
                <span>{group.count}</span>
              </div>

              <div className="prompt-example-stack">
                {group.examples.map((example) => {
                  const isPriorityExample = example.id === "0179" || example.id === "0170";

                  return (
                  <article className="prompt-example-card" key={example.id}>
                    <div className="prompt-example-title">
                      <span>{example.id}</span>
                      <strong>{example.title}</strong>
                    </div>
                    <div className="prompt-evidence-flow">
                      <PromptEvidenceRow
                        label="Original"
                        tone="original"
                      >
                        <div className="prompt-original-grid">
                          <PromptText label="Original prompt" body={example.original} tone="original" />
                          <MediaBox
                            media={{ src: example.switchFrame, kind: "image", label: "Switch frame" }}
                            priority={isPriorityExample}
                          />
                          <MediaBox
                            media={{ src: example.originalVideo, kind: "video", label: "Original video" }}
                            priority={isPriorityExample}
                          />
                        </div>
                      </PromptEvidenceRow>
                      <PromptEvidenceRow
                        label="Problem"
                        tone="problem"
                      >
                        <div className="prompt-problem-grid">
                          <ProblemNote
                            note={example.note}
                            markedText={example.markedText}
                            markedPrefix={example.markedPrefix}
                            markedSuffix={example.markedSuffix}
                            secondaryMarkedText={example.secondaryMarkedText}
                            secondaryMarkedPrefix={example.secondaryMarkedPrefix}
                            secondaryMarkedSuffix={example.secondaryMarkedSuffix}
                            consequence={example.problemConsequence}
                          />
                          <div className="consequence-placeholder">
                            <span>Consequence</span>
                            {example.consequenceGif ? (
                              <img src={example.consequenceGif} alt={`${example.title} consequence`} loading="lazy" />
                            ) : null}
                            {example.consequenceVideo ? (
                              <video
                                src={example.consequenceVideo}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload={isPriorityExample ? "auto" : "metadata"}
                              />
                            ) : null}
                          </div>
                        </div>
                      </PromptEvidenceRow>
                      <PromptEvidenceRow
                        label="Verified"
                        tone="verified"
                      >
                        <div className="prompt-verified-grid">
                          <PromptText
                            label="Verified prompt"
                            body={example.verified}
                            tone="verified"
                            highlightCorrections={
                              example.id === "0179" ||
                              example.id === "0170" ||
                              example.id === "0004" ||
                              example.id === "0137" ||
                              example.id === "0125" ||
                              example.id === "0172" ||
                              example.id === "0019"
                            }
                            consequence={example.verifiedConsequence}
                          />
                          <div className="outcome-placeholder">
                            <span>Outcome</span>
                            {example.outcomeVideo ? (
                              <video
                                src={example.outcomeVideo}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload={isPriorityExample ? "auto" : "metadata"}
                              />
                            ) : (
                              example.changes.map((change) => <p key={change}>{change}</p>)
                            )}
                          </div>
                        </div>
                      </PromptEvidenceRow>
                    </div>
                  </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="artifact-section" id="artifact-removal">
        <div className="prompt-quality-heading">
          <p className="section-kicker">Mask audit</p>
          <h2>Artifact Removal</h2>
          <p>
            An artifact is a metric activation caused by a visual event that is not part of the
            physical effect under observation. We distinguish artifacts by predictability.
          </p>
        </div>

        <div className="artifact-stack">
          <article className="artifact-card systematic-fix-card">
            <div className="artifact-heading">
              <div>
                <span>0057 / 0051</span>
                <h3>Deterministic Artifacts</h3>
                <p>
                  Specifiable from the prompt or experimental setup, but attributable to apparatus
                  motion rather than the physical phenomenon of interest. Here the rotator is the
                  activator, but the metric should follow the caused physical event.
                </p>
              </div>
              <strong>12 cases</strong>
            </div>

            <div className="systematic-fix-stack">
              {systematicFixExamples.map((example) => (
                <SystematicFixCard example={example} key={example.id} />
              ))}
            </div>
          </article>

          <article className="artifact-card systematic-fix-card">
            <div className="artifact-heading">
              <div>
                <span>0002 / 0016 / 0047</span>
                <h3>Non-deterministic Artifacts</h3>
                <p>
                  Chance recording events that are absent from any prompt or experimental
                  specification. These create metric activation that a model should not need to
                  reproduce.
                </p>
              </div>
              <strong>47 cases</strong>
            </div>

            <div className="systematic-fix-stack">
              {nonSystematicFixExamples.map((example) => (
                <SystematicFixCard example={example} key={example.id} />
              ))}
            </div>
          </article>

        </div>
      </section>
    </main>
  );
}

function SystematicFixCard({ example }: { example: SystematicFixExample }) {
  const label = example.detailLabel ?? "Verified prompt";
  const ending = example.highlightedEnding;
  const hasEnding = ending ? example.detail.endsWith(ending) : false;
  const leadingDetail = hasEnding && ending ? example.detail.slice(0, -ending.length).trimEnd() : example.detail;

  return (
    <article className={`systematic-fix-example systematic-fix-${example.tone ?? "deterministic"}`}>
      <div className="prompt-example-title">
        <span>{example.id}</span>
        <strong>{example.title}</strong>
      </div>

      <div className="systematic-fix-rows">
        <div className="systematic-fix-row systematic-fix-media-row">
          <MediaBox media={{ src: example.switchFrame, kind: "image", label: "Switch frame" }} />
          <MediaBox media={{ src: example.originalVideo, kind: "video", label: "Original video" }} />
          <MediaBox media={{ src: example.verifiedVideo, kind: "video", label: "Verified video" }} />
        </div>

        <div className="systematic-fix-row systematic-fix-analysis-row">
          <div className="prompt-text prompt-text-verified systematic-prompt">
            <span>{label}</span>
            <p>
              {leadingDetail}{" "}
              {ending && hasEnding ? <strong className="correction-mark">{ending}</strong> : null}
            </p>
          </div>
          <MediaBox
            media={{
              src: example.originalHeatmap,
              kind: "image",
              label: "Original accumulated heatmap"
            }}
          />
          <MediaBox
            media={{
              src: example.verifiedHeatmap,
              kind: "image",
              label: "Verified accumulated heatmap"
            }}
          />
        </div>
      </div>
    </article>
  );
}

function MediaBox({ media, priority = false }: { media: Media; priority?: boolean }) {
  return (
    <figure className="variant-media">
      {media.kind === "video" ? (
        <video src={media.src} autoPlay muted loop playsInline preload={priority ? "auto" : "metadata"} />
      ) : (
        <img src={media.src} alt="" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} />
      )}
      <figcaption>{media.label}</figcaption>
    </figure>
  );
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

function PromptText({
  label,
  body,
  tone,
  highlightCorrections = false,
  consequence
}: {
  label: string;
  body: string;
  tone: "original" | "verified";
  highlightCorrections?: boolean;
  consequence?: string;
}) {
  return (
    <div className={`prompt-text prompt-text-${tone}`}>
      <span>{label}</span>
      {highlightCorrections ? (
        tone === "verified" && body.includes("woven basket") ? (
          <p>
            A woven basket is hanging from an <strong className="correction-mark">orange cord</strong>{" "}
            with a strong magnet attached to the bottom. An orange tennis ball is placed on a
            table beneath it. The <strong className="correction-mark">basket is lifted to the top of the frame</strong>.
            Static shot with no camera movement.
          </p>
        ) : tone === "verified" && body.includes("cardstock") ? (
          <p>
            A blue-black grabber tool is holding an{" "}
            <strong className="correction-mark">orange</strong> tennis ball{" "}
            <strong className="correction-mark">behind a piece of cardstock</strong> propped up on a black rotating
            platform sitting on a table. The platform rotates clockwise while the grabber{" "}
            <strong className="correction-mark">releases the ball</strong> and places it on the table as the
            cardstock rotates. Static shot with no camera movement.
          </p>
        ) : tone === "verified" && body.includes("inner rim") ? (
          <p>
            A blue-black grabber tool is holding a small piece of crumpled white paper{" "}
            <strong className="correction-mark">at the inner rim</strong> of a tall glass containing blue liquid
            with a green band marking the water level. The grabber then{" "}
            <strong className="correction-mark">releases the paper into the glass</strong>. Static shot with no
            camera movement.
          </p>
        ) : tone === "verified" && body.includes("yellow ceramic mug") ? (
          <p>
            A yellow <strong className="correction-mark">ceramic</strong> mug is held by a
            grabber tool in front of a white projection screen with a concrete brick positioned
            beneath it. The grabber releases the mug. Static shot with no camera movement.
          </p>
        ) : tone === "verified" && body.includes("retracts upward") ? (
          <p>
            A blue-black grabber tool is holding a pink block above a simple structure made of
            colorful blocks resembling a gate.{" "}
            <strong className="correction-mark">
              The grabber releases the block carefully and then retracts upward.
            </strong>{" "}
            Static shot with no camera movement.
          </p>
        ) : tone === "verified" && body.includes("onto the ramp") ? (
          <p>
            A simple ramp made of cardboard propped up by a blue block on a light-colored wooden
            table. There&apos;s a black pipe to the left of the frame and a yellow tennis ball
            rolls out of the pipe <strong className="correction-mark">onto the ramp</strong>.
            Static shot with no camera movement.
          </p>
        ) : (
          <p>
            A light-colored wooden tabletop with two pipes at the edges. A{" "}
            <strong className="correction-mark">grey</strong> and a{" "}
            <strong className="correction-mark">brown</strong> tennis ball{" "}
            <strong className="correction-mark">roll fast out of the pipes</strong>. Static
            shot with no camera movement.
          </p>
        )
      ) : (
        <p>{body}</p>
      )}
      {consequence ? (
        <p className="prompt-consequence">
          <strong>{tone === "verified" ? "Outcome:" : "Consequence:"}</strong> {consequence}
        </p>
      ) : null}
    </div>
  );
}

function ProblemNote({
  note,
  markedText,
  markedPrefix = "",
  markedSuffix = "",
  secondaryMarkedText,
  secondaryMarkedPrefix = "",
  secondaryMarkedSuffix = "",
  consequence
}: {
  note: string;
  markedText?: string;
  markedPrefix?: string;
  markedSuffix?: string;
  secondaryMarkedText?: string;
  secondaryMarkedPrefix?: string;
  secondaryMarkedSuffix?: string;
  consequence?: string;
}) {
  const renderMarkedText = (text: string) =>
    text === "blue and yellow" ? (
      <>
        <strong>blue</strong> and <strong>yellow</strong>
      </>
    ) : (
      <strong>{text}</strong>
    );

  return (
    <div className="prompt-note">
      <p>{note}</p>
      {markedText ? (
        <div className="marked-phrase">
          {markedPrefix}
          {renderMarkedText(markedText)}
          {markedSuffix}
        </div>
      ) : null}
      {secondaryMarkedText ? (
        <div className="marked-phrase">
          {secondaryMarkedPrefix}
          {renderMarkedText(secondaryMarkedText)}
          {secondaryMarkedSuffix}
        </div>
      ) : null}
      {consequence ? (
        <p className="prompt-consequence">
          <strong>Consequence:</strong> {consequence}
        </p>
      ) : null}
    </div>
  );
}

function PromptEvidenceRow({
  label,
  tone,
  children
}: {
  label: string;
  tone: "original" | "problem" | "verified";
  children: ReactNode;
}) {
  return (
    <div className={`prompt-evidence-row prompt-evidence-${tone}`}>
      <div className="prompt-evidence-label">
        <span>{label}</span>
      </div>
      <div className="prompt-evidence-body">{children}</div>
    </div>
  );
}
