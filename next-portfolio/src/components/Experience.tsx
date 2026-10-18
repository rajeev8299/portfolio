export default function Experience() {
  return (
    <section id="experience" className="stage">
      <div className="wrap">
        <div className="reveal in">
          <span className="eyebrow">Work experience</span>
          <h2 className="section-title">
            Where I&apos;ve <span className="thin">worked</span>
          </h2>
          <p className="section-sub">
            Hands-on internship building real applications with a professional team.
          </p>
        </div>

        <div className="exp-grid">
          <article className="gcard exp reveal in" data-tilt data-tilt-max="8">
            <div className="exp-top">
              <div>
                <h3>Software Developer Intern</h3>
                <p className="org">Osizone · Varanasi, India</p>
              </div>
              <span className="exp-date">Sept 2025 — March 2026</span>
            </div>

            <ul className="exp-list">
              <li>
                Built interactive GUI desktop applications — including logic calculation engines and
                interactive games — using modular programming and clean design principles.
              </li>
              <li>
                Worked inside an Agile sprint lifecycle with active Git repositories, version
                control workflows and code reviews.
              </li>
              <li>
                Optimised core algorithmic routines and handled structured data operations to
                improve application performance and responsiveness.
              </li>
            </ul>

            <div className="tags">
              <span className="tag">Agile</span>
              <span className="tag">Git</span>
              <span className="tag">Code Review</span>
              <span className="tag">Modular Programming</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
