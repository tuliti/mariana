const links = {
  vote: "https://icvss.dmi.unict.it/icvss2026/Posters",
  tim: "https://timraedsch.com",
  carsten: "https://sten2lu.github.io/",
  anates: "https://anates.ai",
  anatesX: "https://x.com/Anates_Labs",
  anatesLinkedIn: "https://www.linkedin.com/company/anates-labs/?viewAsMember=true",
  paper: "https://arxiv.org/abs/2606.18943",
  fixes: "https://physics-iq-verified.anates.ai/dataset-fixes/"
};

const people = [
  {
    name: "Tim Rädsch",
    role: "Anates Labs · Technical University of Munich",
    image: "/icvss/tim-raedsch.jpg",
    link: links.tim
  },
  {
    name: "Carsten T. Lüth",
    role: "Anates Labs",
    image: "/icvss/carsten-luth.jpg",
    link: links.carsten
  }
];

export default function IcvssPage() {
  return (
    <main className="visual-page variants-page icvss-simple-page">
      <div className="visual-bg" aria-hidden="true" />

      <header className="visual-header">
        <a className="brand" href={links.anates} aria-label="Anates Labs">
          <OrbitalMark />
          <span>Anates Labs</span>
        </a>
        <nav className="icvss-simple-nav" aria-label="Anates social links">
          <a href={links.anates}>Website</a>
          <a href={links.anatesLinkedIn}>LinkedIn</a>
          <a href={links.anatesX}>Twitter</a>
        </nav>
      </header>

      <section className="visual-hero variants-hero icvss-simple-hero">
        <p className="section-kicker">ICVSS 2026 · poster 117</p>
        <h1>Physics-IQ Verified</h1>
        <p>Poster companion for the Physics-IQ Verified benchmark audit.</p>
      </section>

      <section className="prompt-quality-section icvss-simple-card">
        <div className="icvss-simple-brand">
          <OrbitalMark />
          <div>
            <p className="section-kicker">Brought by</p>
            <h2>Anates Labs</h2>
          </div>
        </div>

        <div className="icvss-simple-actions">
          <a className="icvss-vote-primary" href={links.vote}>
            Vote for Poster 117
          </a>
          <a href={links.paper}>Full paper</a>
          <a href={links.fixes}>Dataset fixes</a>
          <a href={links.anatesX}>Twitter</a>
          <a href={links.anatesLinkedIn}>Anates LinkedIn</a>
        </div>

        <div className="icvss-simple-people">
          {people.map((person) => (
            <article className="icvss-simple-person" key={person.name}>
              <img src={person.image} alt={person.name} />
              <div>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
                <a href={person.link}>Personal website</a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
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
