"use client";

import { useState } from "react";

export default function Contact() {
  const [copyText, setCopyText] = useState("Copy email");

  const handleCopy = () => {
    const mail = "rajeev829927@gmail.com";
    const done = () => {
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy email"), 1800);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(mail).then(done).catch(() => fallbackCopy(mail));
    } else {
      fallbackCopy(mail);
    }
  };

  const fallbackCopy = (mail: string) => {
    const t = document.createElement("textarea");
    t.value = mail;
    t.style.position = "fixed";
    t.style.opacity = "0";
    document.body.appendChild(t);
    t.select();
    try {
      document.execCommand("copy");
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy email"), 1800);
    } catch {
      setCopyText(mail);
    }
    document.body.removeChild(t);
  };

  return (
    <section id="contact" className="stage">
      <div className="wrap">
        <div className="gcard contact-card reveal in" data-tilt data-tilt-max="5">
          <span className="eyebrow">Contact</span>
          <h2>
            Let&apos;s build something <span className="grad">together</span>
          </h2>
          <p>
            Have a project, an internship or a role in mind? My inbox is always open — I&apos;ll get
            back to you.
          </p>

          <div className="contact-actions">
            <a className="btn btn-primary" href="mailto:rajeev829927@gmail.com">
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
              Email me
            </a>
            <a className="btn btn-glass" href="tel:+918299279529">
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
              +91&nbsp;82992&nbsp;79529
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
              GitHub
            </a>
            <button className="btn btn-glass" id="copyBtn" type="button" onClick={handleCopy}>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="12" height="12" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span id="copyText">{copyText}</span>
            </button>
          </div>

          <p className="mail-note">
            Direct: <code>rajeev829927@gmail.com</code> · <code>+91&nbsp;82992&nbsp;79529</code> ·
            Varanasi, UP
          </p>
        </div>
      </div>
    </section>
  );
}
