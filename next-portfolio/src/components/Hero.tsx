"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const [imgError, setImgError] = useState(false);
  const stackRef = useRef<HTMLDivElement | null>(null);

  // Typing effect
  useEffect(() => {
    const words = ["Web Developer", "React Developer", "Next.js Developer", "Web Designer"];
    let w = 0;
    let c = 0;
    let del = false;
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      const word = words[w];
      setTypedText(word.slice(0, c));
      let d = del ? 45 : 95;

      if (!del && c === word.length) {
        d = 1900;
        del = true;
      } else if (del && c === 0) {
        del = false;
        w = (w + 1) % words.length;
        d = 320;
      } else {
        c += del ? -1 : 1;
      }

      timeoutId = setTimeout(tick, d);
    };

    tick();
    return () => clearTimeout(timeoutId);
  }, []);

  // Photo stack kept stable and clear without mouse tilting or covering the picture
  useEffect(() => {
    const stack = stackRef.current;
    if (stack && stack.style.transform) {
      stack.style.transform = "";
    }
  }, []);

  return (
    <section className="hero stage" id="home">
      <div className="wrap hero-grid">
        <div className="reveal in">
          <span className="pill">
            <span className="dot" /> Available for opportunities
          </span>

          <h1>
            Hi, I&apos;m
            <br />
            <span className="grad">Rajeev Yadav</span>
          </h1>
          <div className="role">
            <span id="typed">{typedText}</span>
            <span className="cursor" />
          </div>

          <p className="lead">
            I design and build <b>fast, responsive and stylish</b> web interfaces with{" "}
            <b>React</b>, <b>Next.js</b>, <b>HTML</b>, <b>CSS</b> and <b>JavaScript</b> — from a
            rough idea to a polished, production-ready website.
          </p>

          <div className="hero-actions">
            <a className="btn btn-primary" href="#projects">
              View my projects
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="btn btn-glass js-resume" href="/assets/resume.pdf" download>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M7 10l5 5 5-5M12 15V3" />
              </svg>
              Download resume
            </a>
            <a
              className="btn btn-glass"
              href="https://github.com/rajeev8299"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.1 3.29 9.42 7.86 10.95.57.1.78-.25.78-.55v-2.1c-3.2.7-3.87-1.37-3.87-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.23 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.79.55A11.53 11.53 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
              </svg>
              github.com/rajeev8299
            </a>
          </div>

          <div className="stats">
            <div className="stat">
              <b>6+</b>
              <span>Projects</span>
            </div>
            <div className="stat">
              <b>2</b>
              <span>Degrees</span>
            </div>
            <div className="stat">
              <b>5</b>
              <span>Core skills</span>
            </div>
            <div className="stat">
              <b>1</b>
              <span>Internship</span>
            </div>
          </div>
        </div>

        {/* 3D photo */}
        <div className="photo-stage reveal in">
          <div className="photo-stack" ref={stackRef} id="photoStack">
            <div className="photo-card">
              {!imgError ? (
                <Image
                  src="/assets/photo.jpg"
                  alt="Rajeev Yadav"
                  width={400}
                  height={500}
                  className="w-full h-full object-cover"
                  priority
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="photo-fallback flex" id="photoFallback">
                  <div>
                    <b>RY</b>
                    <small>Rajeev Yadav</small>
                  </div>
                </div>
              )}
              <div className="photo-glass">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>
                  <b>Rajeev Yadav</b> · Varanasi, UP
                </span>
              </div>
            </div>

            <span className="chip3d chip-a tech-orbiter orb-react">⚛ React</span>
            <span className="chip3d chip-b tech-orbiter orb-next">▲ Next.js</span>
            <span className="chip3d chip-c tech-orbiter orb-js">JS JavaScript</span>
            <span className="chip3d chip-d tech-orbiter orb-ts">TS TypeScript</span>
            <span className="chip3d chip-e tech-orbiter orb-html">HTML5</span>
            <span className="chip3d chip-f tech-orbiter orb-css">CSS3</span>
          </div>
        </div>
      </div>
    </section>
  );
}
