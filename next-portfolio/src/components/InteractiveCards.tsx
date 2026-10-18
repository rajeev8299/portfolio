"use client";

import { useEffect } from "react";

export default function InteractiveCards() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const isFine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    if (!isFine) return;

    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]")).filter(
      (c) => c.id !== "photoStack"
    );

    const invalidate = () => {
      cards.forEach((c) => {
        (c as HTMLElement & { _rect?: DOMRect | null })._rect = null;
      });
    };

    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);

    const cleanups: (() => void)[] = [];

    cards.forEach((card) => {
      const max = parseFloat(card.getAttribute("data-tilt-max") || "10");
      const cardWithRect = card as HTMLElement & { _rect?: DOMRect | null };

      const getRect = () => cardWithRect._rect || (cardWithRect._rect = card.getBoundingClientRect());

      const onEnter = () => {
        cardWithRect._rect = card.getBoundingClientRect();
      };

      const onMove = (e: MouseEvent) => {
        const rect = getRect();
        if (!rect.width) return;
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * max * 2;
        const ry = (px - 0.5) * max * 2;
        card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.02)`;
        card.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      };

      const onLeave = () => {
        card.style.transform = "";
        cardWithRect._rect = null;
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    // Beam effect on gcard
    const gcards = document.querySelectorAll(".gcard");
    gcards.forEach((card) => {
      if (!card.querySelector(".beam")) {
        const b = document.createElement("i");
        b.className = "beam";
        card.appendChild(b);
      }
    });

    return () => {
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
