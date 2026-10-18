export default function Projects() {
  const projects = [
    {
      num: "01",
      lang: "TypeScript",
      title: "Taza Sabji Bazzar",
      desc: "An online sabzi bazaar storefront for fresh groceries, built as a fast Next.js + TypeScript web application.",
      tags: ["Next.js", "TypeScript", "UI"],
      link: "https://rajeev8299.github.io/tazasabjibazzar",
    },
    {
      num: "02",
      lang: "JavaScript",
      title: "Travel Buddy",
      desc: "A travel website to explore destinations and plan trips — interactive pages built with vanilla JavaScript.",
      tags: ["JavaScript", "Responsive", "Frontend"],
      link: "https://rajeev8299.github.io/travel-buddy",
    },
    {
      num: "03",
      lang: "HTML",
      title: "Dental Clinic Site",
      desc: "A complete dental clinic website with services, team, testimonials and a React frontend version.",
      tags: ["HTML", "CSS", "React"],
      link: "https://rajeev8299.github.io/dental-clinic-site",
    },
    {
      num: "04",
      lang: "HTML",
      title: "Rajeev Fitness (Gym)",
      desc: "A gym website with classes, timetable, gallery, pricing and diet plans — fully responsive with dark mode.",
      tags: ["HTML", "CSS", "JavaScript"],
      link: "https://rajeev8299.github.io/gym",
    },
    {
      num: "05",
      lang: "HTML",
      title: "E-Commerce Store",
      desc: "An e-commerce storefront with product listing, category navigation and cart interactions.",
      tags: ["HTML", "CSS", "JavaScript"],
      link: "https://rajeev8299.github.io/E-Commerce-",
    },
    {
      num: "06",
      lang: "HTML",
      title: "Portfolio Website",
      desc: "A personal portfolio showcasing my frontend work, skills and experience.",
      tags: ["HTML", "CSS", "JavaScript"],
      link: "https://rajeev8299.github.io/portfolio/",
    },
  ];

  return (
    <section id="projects" className="stage">
      <div className="wrap">
        <div className="proj-head reveal in">
          <div>
            <span className="eyebrow">Projects</span>
            <h2 className="section-title">
              Things I&apos;ve <span className="thin">built</span>
            </h2>
            <p className="section-sub">
              Explore my GitHub projects — open any live website to try it out.
            </p>
          </div>
          <a
            className="btn btn-glass btn-sm"
            href="https://github.com/rajeev8299?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
          >
            All repositories
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </div>

        <div className="proj-grid">
          {projects.map((p) => (
            <article key={p.num} className="gcard proj reveal in" data-tilt data-tilt-max="10">
              <span className="proj-no">{p.num}</span>
              <div className="proj-top">
                <span className="lang">
                  <i /> {p.lang}
                </span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <a
                className="proj-link"
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                View live website
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
