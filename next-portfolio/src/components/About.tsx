export default function About() {
  const highlights = [
    { num: "100%", label: "Responsive Layouts" },
    { num: "0.1s", label: "Optimized Latency" },
    { num: "6+", label: "Live Web Apps" },
    { num: "Clean", label: "Semantic Code" },
  ];

  const coreFocus = [
    "Pixel-Perfect UI",
    "Modern Next.js & React",
    "Tailwind & CSS Architecture",
    "Mobile-First Experience",
    "Performance & SEO",
    "Clean Code Practices",
  ];

  return (
    <section id="about" className="stage">
      <div className="wrap">
        <div className="reveal in">
          <span className="eyebrow">About me</span>
          <h2 className="section-title">
            A developer who cares <span className="thin">about the details</span>
          </h2>
          <p className="section-sub">Short version of who I am, what I study and what I build.</p>
        </div>

        <div className="about-grid">
          {/* Left Column: Rich interactive bio, stats & design philosophy cards */}
          <div className="about-left-col">
            <div className="gcard about-card reveal in" data-tilt data-tilt-max="7">
              <p>
                I&apos;m <strong>Rajeev Yadav</strong>, a passionate <strong>Web Developer</strong>{" "}
                who crafts clean, ultra-responsive and visually engaging web experiences with an eye for subtle details.
              </p>
              <p>
                My primary playground is <strong>React</strong> and <strong>Next.js</strong>, powered by deep fundamentals
                in <strong>HTML5</strong>, <strong>CSS3</strong> and modern <strong>JavaScript (ES6+)</strong>. I believe great
                software blends intuitive UI design, smooth micro-interactions, and blazing-fast loading speeds.
              </p>
              <p>
                Beyond writing code, I constantly experiment with cutting-edge web tech, refine interactive UI patterns,
                and push production-ready open-source projects on GitHub.
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="about-metrics-grid reveal in">
              {highlights.map((h) => (
                <div key={h.label} className="about-metric-card" data-tilt data-tilt-max="6">
                  <span className="about-metric-num">{h.num}</span>
                  <span className="about-metric-lbl">{h.label}</span>
                </div>
              ))}
            </div>

            {/* Development Philosophy & Design Values */}
            <div className="about-values-card reveal in" data-tilt data-tilt-max="6">
              <div className="about-values-head">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                Core Standards &amp; Principles
              </div>
              <div className="about-chips-wrap">
                {coreFocus.map((item) => (
                  <span key={item} className="about-chip">
                    <i /> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Key Contact & Academic Quick Facts */}
          <div className="gcard about-card reveal in" data-tilt data-tilt-max="7">
            <div className="facts">
              <div className="fact">
                <div className="fact-ic">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                    <path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5" />
                  </svg>
                </div>
                <span>
                  <b>Education</b>BCA — Veer Bahadur Singh Purvanchal University
                  <br />
                  MCA — Dr. A.P.J. Abdul Kalam Technical University
                </span>
              </div>
              <div className="fact">
                <div className="fact-ic">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span>
                  <b>Address</b>Varanasi, Uttar Pradesh, India
                </span>
              </div>
              <div className="fact">
                <div className="fact-ic">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
                  </svg>
                </div>
                <span>
                  <b>Focus</b>Frontend development — React, Next.js &amp; UI building
                </span>
              </div>
              <div className="fact">
                <div className="fact-ic">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.4.5-.7 1.1-.8 1.7-.1.6-.1 1.3 0 1.9v4" />
                    <path d="M9 18c-4.5 2-5-2-7-2" />
                  </svg>
                </div>
                <span>
                  <b>GitHub</b>
                  <a href="https://github.com/rajeev8299" target="_blank" rel="noopener noreferrer">
                    github.com/rajeev8299
                  </a>{" "}
                  · 6 public repositories
                </span>
              </div>
              <div className="fact">
                <div className="fact-ic">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 6L2 7" />
                  </svg>
                </div>
                <span>
                  <b>Email</b>
                  <a href="mailto:rajeev829927@gmail.com">rajeev829927@gmail.com</a>
                </span>
              </div>
              <div className="fact">
                <div className="fact-ic">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
                  </svg>
                </div>
                <span>
                  <b>Phone</b>
                  <a href="tel:+918299279529">+91&nbsp;82992&nbsp;79529</a>
                </span>
              </div>
              <div className="fact">
                <div className="fact-ic">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                  </svg>
                </div>
                <span>
                  <b>Resume</b>
                  <a href="/assets/resume.pdf" download className="js-resume">
                    Download PDF
                  </a>{" "}
                  — Rajeev_Yadav_Resume.pdf
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
