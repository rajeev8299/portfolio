"use client";

import { useEffect, useRef, useState } from "react";

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [shutterOpen, setShutterOpen] = useState(false);
  const [shutterRemoved, setShutterRemoved] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (shutterRemoved) return;

    const openTimer = setTimeout(() => {
      setShutterOpen(true);
    }, 50);
    const removeTimer = setTimeout(() => {
      setShutterRemoved(true);
    }, 1000);
    return () => {
      clearTimeout(openTimer);
      clearTimeout(removeTimer);
    };
  }, [shutterRemoved]);

  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);

  // Spotlight mouse listener & Smooth Custom Cursor
  useEffect(() => {
    let ptQueued = false;
    let lastPt: PointerEvent | null = null;
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let cursorVisible = false;
    let animId: number;

    const isFine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isFine && !isReduced) {
      const cursorLoop = () => {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        if (cursorDotRef.current) {
          cursorDotRef.current.style.transform = `translate3d(${mouseX}px,${mouseY}px,0)`;
        }
        if (cursorRingRef.current) {
          cursorRingRef.current.style.transform = `translate3d(${ringX}px,${ringY}px,0)`;
        }
        animId = requestAnimationFrame(cursorLoop);
      };
      animId = requestAnimationFrame(cursorLoop);
    }

    const onPointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.closest &&
        target.closest(
          "a, button, input, textarea, select, [role='button'], label, .btn, .interactive, .chip3d, .tab"
        )
      ) {
        document.body.classList.add("cursor-hover");
      } else {
        document.body.classList.remove("cursor-hover");
      }
    };

    const onPointerLeave = () => {
      document.body.classList.remove("cursor-active", "cursor-hover");
      cursorVisible = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      lastPt = e;
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!cursorVisible && isFine && !isReduced) {
        cursorVisible = true;
        ringX = mouseX;
        ringY = mouseY;
        document.body.classList.add("cursor-active");
      }

      if (ptQueued) return;
      ptQueued = true;
      requestAnimationFrame(() => {
        ptQueued = false;
        if (!lastPt || !spotlightRef.current) return;
        spotlightRef.current.style.setProperty("--mx", `${lastPt.clientX}px`);
        spotlightRef.current.style.setProperty("--my", `${lastPt.clientY}px`);
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.body.classList.remove("cursor-active", "cursor-hover");
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  // Scroll Progress & Background Video scroll-linking
  useEffect(() => {
    const v = videoRef.current;
    const pr = progressRef.current;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let ready = false;
    let running = false;
    let loadStarted = false;
    const EASE = 0.28;

    const getProgress = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return 0;
      const y = window.pageYOffset || doc.scrollTop || 0;
      const p = y / max;
      return p < 0 ? 0 : p > 1 ? 1 : p;
    };

    const kick = () => {
      if (running) return;
      running = true;
      requestAnimationFrame(tick);
    };

    const tick = () => {
      const p = getProgress();
      if (pr) {
        pr.style.transform = `scaleX(${p})`;
      }

      if (v && ready) {
        const dur = v.duration;
        if (dur && isFinite(dur) && dur > 0.2) {
          const target = p * (dur - 0.06);
          const cur = v.currentTime;
          const d = target - cur;
          if (Math.abs(d) > 0.03) {
            let next = Math.abs(d) > 0.5 ? cur + d * EASE : target;
            if (next < 0) next = 0;
            if (next > dur - 0.06) next = dur - 0.06;
            try {
              v.currentTime = next;
            } catch {}
            v.style.transform = `scale(${1 + p * 0.5})`;
            requestAnimationFrame(tick);
            return;
          }
        }
      }
      running = false;
    };

    const startVideo = () => {
      if (!v || loadStarted) return;
      loadStarted = true;
      v.preload = "auto";
      if (!ready) v.load();
    };

    const handleLoadedData = () => {
      if (!v || ready) return;
      ready = true;
      v.classList.add("on");
      kick();
    };

    const handleScroll = () => {
      startVideo();
      kick();
    };

    if (v) {
      v.addEventListener("loadeddata", handleLoadedData);
      v.addEventListener("seeked", kick);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", kick);

    kick();

    return () => {
      if (v) {
        v.removeEventListener("loadeddata", handleLoadedData);
        v.removeEventListener("seeked", kick);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", kick);
    };
  }, []);

  // 3D Canvas Space Particle Network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let vw = 0,
      vh = 0,
      dpr = 1;
    let pts: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      sx?: number;
      sy?: number;
      s?: number;
      word?: string | null;
      colorBase?: string | null;
      glowColor?: string | null;
      rot?: number;
      rotSpeed?: number;
      side?: number;
    }> = [];
    let mx = 0,
      my = 0,
      running = true,
      rafQueued = false;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = mq.matches;

    const resize = () => {
      vw = window.innerWidth || document.documentElement.clientWidth || 800;
      vh = window.innerHeight || document.documentElement.clientHeight || 600;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(vw * dpr));
      canvas.height = Math.max(1, Math.round(vh * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const N = Math.max(38, Math.min(90, Math.round((vw * vh) / 16000)));
      pts = [];

      const techWords = [
        { name: "HTML5", color: "rgba(255,115,70,", glow: "rgba(255,87,34,0.35)" },
        { name: "CSS3", color: "rgba(34,211,238,", glow: "rgba(34,211,238,0.35)" },
        { name: "JavaScript", color: "rgba(251,191,36,", glow: "rgba(251,191,36,0.35)" },
        { name: "React", color: "rgba(56,189,248,", glow: "rgba(56,189,248,0.35)" },
        { name: "Next.js", color: "rgba(245,245,250,", glow: "rgba(124,92,255,0.35)" },
      ];

      for (let i = 0; i < N; i++) {
        const isTech = i < techWords.length * 2;
        const tw = isTech ? techWords[i % techWords.length] : null;
        const pSide = i % 2 === 0 ? -1 : 1;
        const px = isTech
          ? pSide * (vw * 0.46 + Math.random() * (vw * 0.32))
          : (Math.random() - 0.5) * vw * 1.6;
        const py = (Math.random() - 0.5) * vh * 1.6;

        pts.push({
          x: px,
          y: py,
          z: Math.random() * 650 + 130,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          word: tw ? tw.name : null,
          colorBase: tw ? tw.color : null,
          glowColor: tw ? tw.glow : null,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.008,
          side: pSide,
        });
      }
      if (reduce) paintStatic();
    };

    const paintStatic = () => {
      ctx.clearRect(0, 0, vw, vh);
      pts.forEach((p) => {
        const s = 560 / (560 + p.z);
        ctx.beginPath();
        ctx.arc(vw / 2 + p.x * s, vh / 2 + p.y * s, Math.max(0.5, 2 * s), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(124,92,255,.4)";
        ctx.fill();
      });
    };

    const schedule = () => {
      if (rafQueued || !ctx || !running || reduce) return;
      rafQueued = true;
      requestAnimationFrame(() => {
        rafQueued = false;
        frame();
      });
    };

    const frame = () => {
      if (!running || !ctx) return;
      ctx.clearRect(0, 0, vw, vh);
      const cx = vw / 2;
      const cy = vh / 2;
      const proj = 560;
      const contentHalfW = Math.min(vw * 0.46, 600);
      const marginSafe = Math.max(contentHalfW + 40, vw * 0.4);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.word && p.rotSpeed) {
          p.rot = (p.rot || 0) + p.rotSpeed;
        }

        if (p.word) {
          const minX = marginSafe;
          if (p.side === -1) {
            if (p.x > -minX) {
              p.x = -minX;
              p.vx = -Math.abs(p.vx);
            }
            if (p.x < -vw * 0.95) {
              p.x = -vw * 0.95;
              p.vx = Math.abs(p.vx);
            }
          } else {
            if (p.x < minX) {
              p.x = minX;
              p.vx = Math.abs(p.vx);
            }
            if (p.x > vw * 0.95) {
              p.x = vw * 0.95;
              p.vx = -Math.abs(p.vx);
            }
          }
        } else {
          if (p.x > vw * 0.9) p.x = -vw * 0.9;
          if (p.x < -vw * 0.9) p.x = vw * 0.9;
        }

        if (p.y > vh * 0.9) p.y = -vh * 0.9;
        if (p.y < -vh * 0.9) p.y = vh * 0.9;

        const s = proj / (proj + p.z);
        const sx = cx + (p.x + mx * 40) * s;
        const sy = cy + (p.y + my * 40) * s;

        if (p.word && p.colorBase) {
          const screenDist = Math.abs(sx - cx);
          if (screenDist < marginSafe * 0.92) {
            continue;
          }
          const aWord = Math.min(0.58, Math.max(0.22, s * 0.52));
          const fontSize = Math.max(11, Math.round(13.8 * s));
          const curRot = p.rot || 0;
          const tiltAngle = Math.sin(curRot) * 0.09;

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(tiltAngle);

          // Glowing planet core
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(0.9, 2.2 * s), 0, Math.PI * 2);
          ctx.fillStyle = `${p.colorBase}${aWord * 1.35})`;
          ctx.shadowColor = p.glowColor || "rgba(124,92,255,0.4)";
          ctx.shadowBlur = 8 * s;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Shiny multicolor typography
          ctx.font = `600 ${fontSize}px 'Space Grotesk', -apple-system, sans-serif`;
          ctx.fillStyle = `${p.colorBase}${aWord})`;
          ctx.fillText(p.word, 7, 4);

          ctx.restore();
        } else {
          const r = Math.max(0.5, 2.1 * s);
          const a = Math.min(0.65, Math.max(0.1, s * 0.6));
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fillStyle =
            i % 3 === 0
              ? `rgba(34,211,238,${a})`
              : i % 3 === 1
              ? `rgba(124,92,255,${a})`
              : `rgba(255,92,157,${a * 0.7})`;
          ctx.fill();
        }

        p.sx = sx;
        p.sy = sy;
        p.s = s;
      }

      // Soft connecting links
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const A = pts[i];
          const B = pts[j];
          if (!A.sx || !B.sx || !A.sy || !B.sy) continue;
          const dx = A.sx - B.sx;
          const dy = A.sy - B.sy;
          const d2 = dx * dx + dy * dy;
          if (d2 < 8000) {
            const o = (1 - d2 / 8000) * 0.22;
            ctx.strokeStyle = `rgba(160,170,255,${o.toFixed(3)})`;
            ctx.lineWidth = 0.55;
            ctx.beginPath();
            ctx.moveTo(A.sx, A.sy);
            ctx.lineTo(B.sx, B.sy);
            ctx.stroke();
          }
        }
      }
      schedule();
    };

    const handlePointerMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };

    const handleVisibility = () => {
      running = !document.hidden;
      if (running) schedule();
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    resize();
    if (!reduce) {
      schedule();
    } else {
      paintStatic();
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <>
      {/* Background Video */}
      <video
        ref={videoRef}
        className="bg-video"
        id="bgVideo"
        muted
        playsInline
        preload="none"
        aria-hidden="true"
      >
        <source src="/assets/solar-system.mp4" type="video/mp4" media="(min-width:769px)" />
        <source src="/assets/bg-360.mp4" type="video/mp4" />
      </video>
      <div className="bg-veil" aria-hidden="true" />

      {/* Cinematic Overlays */}
      <div ref={progressRef} className="progress" id="progress" />
      <div className="bars" id="bars" />
      <div className="grain" />
      <div className="vignette" />

      {/* Space & Auras */}
      <canvas ref={canvasRef} id="space" aria-hidden="true" />
      <div className="aura aura-a" />
      <div className="aura aura-b" />
      <div className="aura aura-c" />
      <div className="grid-lines" />
      <div ref={spotlightRef} className="spotlight" id="spot" />

      {/* Elegant Custom Cursor */}
      <div ref={cursorDotRef} className="cursor-dot" id="cursorDot" aria-hidden="true" />
      <div ref={cursorRingRef} className="cursor-ring" id="cursorRing" aria-hidden="true" />

      {/* Shutter Portal Effect */}
      {!shutterRemoved && (
        <div className={`shutter ${shutterOpen ? "open" : ""}`} id="shutter">
          <div className="shutter-inner">
            <span className="shutter-blade shutter-blade-t" />
            <span className="shutter-blade shutter-blade-b" />
          </div>
        </div>
      )}
    </>
  );
}
