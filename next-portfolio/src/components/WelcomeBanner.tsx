"use client";

import { useEffect, useState } from "react";

interface WelcomeBannerProps {
  name?: string;
  role?: string;
  stack?: string;
  onDone?: () => void;
}

const glitchChars = "01</>{}[]=>;:#$%&*+-_";
const bootMessages = [
  "> booting portfolio...",
  "> loading html  css  javascript  react  next.js",
  "> access granted",
];
const orbitSymbols = ["</>", "{ }", "=>", "npm", "React", "JS", "CSS", "HTML", "Next", "Node.js", "SQL", "git"];

export default function WelcomeBanner({
  name = "RAJEEV YADAV",
  role = "Web Developer",
  stack = "HTML  ·  CSS  ·  JAVASCRIPT  ·  NODE.JS  ·  REACT",
  onDone,
}: WelcomeBannerProps) {
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [displayRole, setDisplayRole] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    const intervals: NodeJS.Timeout[] = [];

    const addTimeout = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timeouts.push(id);
      return id;
    };
    const addInterval = (fn: () => void, ms: number) => {
      const id = setInterval(fn, ms);
      intervals.push(id);
      return id;
    };

    const clearAll = () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = (ms: number) => {
      addTimeout(() => setIsLeaving(true), ms - 500);
      addTimeout(() => {
        setHidden(true);
        if (onDone) onDone();
      }, ms);
    };

    if (prefersReduced) {
      setBootLines(bootMessages);
      setDisplayName(name);
      setDisplayRole(role);
      setIsReady(true);
      finish(1500);
      return clearAll;
    }

    // 1. Boot log lines
    bootMessages.forEach((msg, idx) => {
      addTimeout(() => {
        setBootLines((prev) => [...prev, msg]);
      }, 150 + idx * 300);
    });

    // 2. Glitch Name Decoder
    addTimeout(() => {
      const totalSteps = name.length * 2;
      let step = 0;
      const nameInterval = addInterval(() => {
        step++;
        const resolvedCount = Math.floor((step / totalSteps) * name.length);
        let str = "";
        for (let i = 0; i < name.length; i++) {
          const ch = name[i];
          if (ch === " " || i < resolvedCount) {
            str += ch;
          } else {
            str += glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
        }
        setDisplayName(str);
        if (step >= totalSteps) {
          clearInterval(nameInterval);
          setDisplayName(name);

          // 3. Role Typewriter
          addTimeout(() => {
            let roleStep = 0;
            const roleInterval = addInterval(() => {
              roleStep++;
              setDisplayRole(role.slice(0, roleStep));
              if (roleStep >= role.length) {
                clearInterval(roleInterval);
                addTimeout(() => setIsReady(true), 100);
              }
            }, 30);
          }, 100);
        }
      }, 35);
    }, 900);

    // Auto dismiss after 3.6s
    finish(3600);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        setIsLeaving(true);
        setTimeout(() => {
          setHidden(true);
          if (onDone) onDone();
        }, 500);
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearAll();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [name, role, onDone]);

  const handleSkip = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setHidden(true);
      if (onDone) onDone();
    }, 500);
  };

  if (hidden) return null;

  const showCaret = displayName === name && !isReady;

  return (
    <section
      className={`wi${isReady ? " is-ready" : ""}${isLeaving ? " is-leaving" : ""}`}
      aria-label="Welcome"
    >
      <div className="wi-seam" />
      <div className="wi-center">
        <div className="wi-orbit" aria-hidden="true">
          {orbitSymbols.map((sym, idx) => (
            <span
              key={sym}
              style={{ ["--a" as string]: `${(idx * 360) / orbitSymbols.length}deg` }}
            >
              {sym}
            </span>
          ))}
        </div>
        <h1 className="wi-name">{displayName || "\u00A0"}</h1>
        <p className="wi-role">
          {displayRole}
          {showCaret && <span className="wi-caret" />}
        </p>
        <p className={`wi-stack${isReady ? " on" : ""}`}>{stack}</p>
      </div>

      <div className="wi-boot" aria-hidden="true">
        {bootLines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
        {!isReady && <span className="wi-cursor" />}
      </div>

      <button className="wi-skip" type="button" onClick={handleSkip}>
        Skip &rarr;
      </button>
    </section>
  );
}
