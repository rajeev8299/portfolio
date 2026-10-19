"use client";

import { useEffect, useState } from "react";

export default function IntroOverlay() {
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (hidden) return;

    const handleEnd = () => {
      setDone(true);
      document.body.classList.remove("introing");
      setTimeout(() => {
        setHidden(true);
      }, 600);
    };

    document.body.classList.add("introing");

    const timer = setTimeout(() => {
      handleEnd();
    }, 750);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        handleEnd();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("introing");
    };
  }, [hidden]);

  const endIntro = () => {
    setDone(true);
    document.body.classList.remove("introing");
    setTimeout(() => {
      setHidden(true);
    }, 600);
  };

  if (hidden) return null;

  return (
    <div className={`intro ${done ? "done" : ""}`} id="intro" onClick={endIntro}>
      <span className="intro-letter t" aria-hidden="true" />
      <span className="intro-letter b" aria-hidden="true" />
      <div className="intro-inner">
        <span className="intro-kicker">Portfolio Presentation</span>
        <div className="intro-title">
          <span>Rajeev</span>
          <span>Yadav</span>
        </div>
        <span className="intro-sub">Web Developer</span>
        <div className="intro-line" aria-hidden="true" />
      </div>
      <button
        className="intro-skip"
        id="introSkip"
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          endIntro();
        }}
      >
        Skip
      </button>
    </div>
  );
}
