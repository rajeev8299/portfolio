export default function Skills() {
  const skills = [
    {
      code: "H5",
      title: "HTML",
      desc: "Semantic, accessible and well-structured markup — the skeleton of every page.",
      pips: [true, true, true, true, true],
    },
    {
      code: "CS",
      title: "CSS",
      desc: "Responsive layouts, flexbox, grid, animations and clean modern styling.",
      pips: [true, true, true, true, true],
    },
    {
      code: "JS",
      title: "JavaScript",
      desc: "Interactive UI, DOM manipulation, API calls and modern ES6+ syntax.",
      pips: [true, true, true, true, false],
    },
    {
      code: "Re",
      title: "React",
      desc: "Components, props, state, hooks and reusable UI architecture.",
      pips: [true, true, true, true, false],
    },
    {
      code: "Nx",
      title: "Next.js",
      desc: "Fast production websites with routing, SSR and optimized builds.",
      pips: [true, true, true, false, false],
    },
  ];

  return (
    <section id="skills" className="stage">
      <div className="wrap">
        <div className="reveal in">
          <span className="eyebrow">Skills</span>
          <h2 className="section-title">
            Tools I <span className="thin">build with</span>
          </h2>
          <p className="section-sub">
            The technologies I use every day to design and develop web projects.
          </p>
        </div>

        <div className="skills-grid">
          {skills.map((s) => (
            <div key={s.title} className="gcard skill reveal in" data-tilt data-tilt-max="11">
              <div className="skill-ic">{s.code}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="pips">
                {s.pips.map((isOn, idx) => (
                  <i key={idx} className={isOn ? "on" : ""} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
