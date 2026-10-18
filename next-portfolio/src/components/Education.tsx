export default function Education() {
  return (
    <section id="education" className="stage">
      <div className="wrap">
        <div className="reveal in">
          <span className="eyebrow">Education</span>
          <h2 className="section-title">My academic journey</h2>
          <p className="section-sub">
            Two degrees in computer applications — from fundamentals to advanced software study.
          </p>
        </div>

        <div className="edu-grid">
          <article className="gcard edu reveal in" data-tilt data-tilt-max="9">
            <span className="edu-yr">Master&apos;s degree</span>
            <h3>MCA</h3>
            <p className="school">Dr. A.P.J. Abdul Kalam Technical University</p>
            <p className="note">Master of Computer Applications</p>
            <div className="bar" />
          </article>

          <article className="gcard edu reveal in" data-tilt data-tilt-max="9">
            <span className="edu-yr">Bachelor&apos;s degree</span>
            <h3>BCA</h3>
            <p className="school">Veer Bahadur Singh Purvanchal University</p>
            <p className="note">Bachelor of Computer Applications</p>
            <div className="bar" />
          </article>
        </div>
      </div>
    </section>
  );
}
