"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

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
    }, 20);
    const removeTimer = setTimeout(() => {
      setShutterRemoved(true);
    }, 500);
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

  // Three.js 3D Scroll Background Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const TEAL = 0x5eead4;
    const VIOLET = 0xa78bfa;
    const WORLD = 120;

    function makeSprite() {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d");
      if (!g) return new THREE.CanvasTexture(c);
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, "rgba(255,255,255,1)");
      grd.addColorStop(0.35, "rgba(255,255,255,0.5)");
      grd.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }

    const TECH: [string, string][] = [
      ["HTML5", "#fb923c"],
      ["CSS3", "#60a5fa"],
      ["JavaScript", "#facc15"],
      ["React", "#38bdf8"],
      ["Next.js", "#e5e7eb"],
      ["Node.js", "#4ade80"],
      ["TypeScript", "#3b82f6"],
      ["Tailwind", "#22d3ee"],
      ["Python", "#5eead4"],
      ["PHP", "#a78bfa"],
      ["MySQL", "#38bdf8"],
      ["WordPress", "#93c5fd"],
      ["Git", "#f87171"],
      ["API", "#fbbf24"],
    ];

    function makeWordTexture(text: string, color: string) {
      const w = 512;
      const h = 160;
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const g = c.getContext("2d");
      if (g) {
        g.font = 'bold 72px "Space Grotesk", "Courier New", monospace';
        g.textAlign = "center";
        g.textBaseline = "middle";
        g.shadowColor = color;
        g.shadowBlur = 35;
        g.fillStyle = color;
        g.fillText(text, w / 2, h / 2);
        g.fillText(text, w / 2, h / 2);
      }
      return new THREE.CanvasTexture(c);
    }

    const isMobile = window.innerWidth < 768;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduceMotion ? 0 : 1;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true, powerPreference: "high-performance" });
    } catch (err) {
      console.warn("WebGL unavailable:", err);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030305, 0.012);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 400);
    camera.position.set(0, 0, 30);

    /* ---- particles: across entire length (reduced by another 50% for crystal clear page) ---- */
    const COUNT = isMobile ? 180 : 420;
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const cA = new THREE.Color(TEAL);
    const cB = new THREE.Color(VIOLET);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 140;
      pos[i * 3 + 1] = 40 - Math.random() * (WORLD + 80);
      pos[i * 3 + 2] = (Math.random() - 0.5) * 90;
      const c = cA.clone().lerp(cB, Math.random());
      col.set([c.r, c.g, c.b], i * 3);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const sprite = makeSprite();
    const particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        size: 0.65,
        map: sprite,
        vertexColors: true,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    scene.add(particles);

    /* ---- hero clouds with rotating 3D tech names (reduced by 50% for clean breathing space) ---- */
    const dim = isMobile ? 0.45 : 0.65;
    const wordTex = new Map<string, THREE.CanvasTexture>();
    const heroDefs = [
      { at: 0.12, side: 1 },
      { at: 0.48, side: -1 },
      { at: 0.82, side: 1 },
    ];
    const heroes = heroDefs.map((d, i) => {
      const group = new THREE.Group();
      const s = isMobile ? 0.7 : 1.0;
      group.scale.set(s, s, s);
      group.position.set(isMobile ? 0 : d.side * 24, -d.at * WORLD, -10);

      const cloud = new THREE.Group();
      const n = isMobile ? 4 : 6;
      const R = 9.2;
      const sprites: THREE.Sprite[] = [];
      for (let j = 0; j < n; j++) {
        const [name, color] = TECH[(j + i * 4) % TECH.length];
        if (!wordTex.has(name)) wordTex.set(name, makeWordTexture(name, color));
        const sp = new THREE.Sprite(
          new THREE.SpriteMaterial({ map: wordTex.get(name)!, transparent: true, opacity: 0.65 * dim, depthWrite: false })
        );
        sp.scale.set(isMobile ? 6 : 8.5, isMobile ? 1.9 : 2.6, 1);
        const y = 1 - (2 * (j + 0.5)) / n;
        const r = Math.sqrt(1 - y * y);
        const a = j * 2.399963;
        sp.position.set(Math.cos(a) * r * R, y * R, Math.sin(a) * r * R);
        cloud.add(sp);
        sprites.push(sp);
      }
      const ico = new THREE.Mesh(
        new THREE.IcosahedronGeometry(11.8, 1),
        new THREE.MeshBasicMaterial({ color: VIOLET, wireframe: true, transparent: true, opacity: 0.11 * dim })
      );
      group.add(cloud);
      group.add(ico);
      scene.add(group);
      return { group, cloud, sprites, ico, Rw: R * s, baseY: group.position.y, phase: i * 1.7 };
    });

    /* ---- small floating wireframe shapes (cubes, octahedrons, tetrahedrons - reduced by another 50%) ---- */
    const floaters: THREE.Mesh[] = [];
    const geos = [
      new THREE.OctahedronGeometry(1.2),
      new THREE.TetrahedronGeometry(1.3),
      new THREE.BoxGeometry(1.3, 1.3, 1.3),
    ];
    const FCOUNT = isMobile ? 3 : 7;
    for (let fIdx = 0; fIdx < FCOUNT; fIdx++) {
      const m = new THREE.Mesh(
        geos[fIdx % 3],
        new THREE.MeshBasicMaterial({
          color: fIdx % 2 ? TEAL : VIOLET,
          wireframe: true,
          transparent: true,
          opacity: 0.22,
        })
      );
      const yPos = 16 - Math.random() * (WORLD + 30);
      m.position.set((Math.random() - 0.5) * (isMobile ? 44 : 88), yPos, (Math.random() - 0.5) * 34 - 5);
      m.userData = { speed: 0.2 + Math.random() * 0.5, off: Math.random() * 6.28, base: yPos };
      floaters.push(m);
      scene.add(m);
    }

    /* ---- interaction ---- */
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);

    const scrollProgress = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      return Math.min(1, Math.max(0, (window.scrollY || window.pageYOffset || 0) / max));
    };

    /* ---- loop with tight scroll tracking ---- */
    const t0 = performance.now();
    const tmpV = new THREE.Vector3();
    let raf = 0;
    let running = true;
    let p = scrollProgress();

    const loop = () => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const t = (performance.now() - t0) / 1000;

      // Tight responsive lerp (0.16) for immediate scroll-match without lag
      p += (scrollProgress() - p) * 0.16;
      const camBase = -p * WORLD;

      mouse.x += (target.x - mouse.x) * 0.08;
      mouse.y += (target.y - mouse.y) * 0.08;

      camera.position.x = mouse.x * 2.5;
      camera.position.y = camBase - mouse.y * 1.5;
      camera.lookAt(0, camBase, 0);

      heroes.forEach((h) => {
        h.cloud.rotation.x = 0.26;
        h.cloud.rotation.y = t * 0.38 * k + p * 2.8;
        h.sprites.forEach((sp) => {
          sp.getWorldPosition(tmpV);
          const f = Math.min(1, Math.max(0, (tmpV.z - h.group.position.z + h.Rw) / (2 * h.Rw)));
          sp.material.opacity = (0.25 + 0.75 * f) * dim;
        });
        h.ico.rotation.y = -t * 0.14 * k;
        h.ico.rotation.z = t * 0.1 * k;
        h.group.position.y = h.baseY + Math.sin(t * 0.6 + h.phase) * 0.6 * k;
      });

      particles.rotation.y = t * 0.015 * k + p * 0.5;

      floaters.forEach((f) => {
        f.rotation.x += 0.005 * f.userData.speed * k;
        f.rotation.y += 0.007 * f.userData.speed * k;
        f.position.y = f.userData.base + Math.sin(t * f.userData.speed + f.userData.off) * 1.2 * k;
      });

      renderer.render(scene, camera);
    };


    const onVisibility = () => {
      running = !document.hidden;
      if (running) loop();
      else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVisibility);
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
        if ((obj as THREE.Mesh).material) {
          const mat = (obj as THREE.Mesh).material;
          const mats = Array.isArray(mat) ? mat : [mat];
          mats.forEach((m) => {
            if ("map" in m && m.map) (m.map as THREE.Texture).dispose();
            m.dispose();
          });
        }
      });
      sprite.dispose();
      renderer.dispose();
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
      <canvas ref={canvasRef} id="bg3d" aria-hidden="true" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: -2, pointerEvents: "none" }} />
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
