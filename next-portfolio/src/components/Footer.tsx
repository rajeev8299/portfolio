"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [showToTop, setShowToTop] = useState(false);
  const [year] = useState(() => new Date().getFullYear().toString());

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setShowToTop(y > 640);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer>
        <div className="wrap foot">
          <span>© {year} Rajeev Yadav — Web Developer</span>
          <div className="foot-links">
            <a href="https://github.com/rajeev8299" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="/assets/resume.pdf" download className="js-resume">
              Resume
            </a>
            <a href="mailto:rajeev829927@gmail.com">Email</a>
            <a href="#home">Back to top</a>
          </div>
        </div>
      </footer>

      <button
        className={`to-top ${showToTop ? "show" : ""}`}
        id="toTop"
        type="button"
        aria-label="Back to top"
        onClick={scrollToTop}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}
