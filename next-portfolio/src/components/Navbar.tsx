"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isStuck, setIsStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setIsStuck(y > 12);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1080) {
        setMenuOpen(false);
        document.body.classList.remove("locked");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const sections = document.querySelectorAll("main section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const toggleMenu = () => {
    const nextState = !menuOpen;
    setMenuOpen(nextState);
    if (nextState) {
      document.body.classList.add("locked");
    } else {
      document.body.classList.remove("locked");
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.classList.remove("locked");
  };

  const menuItems = [
    { label: "Home", href: "#home", id: "home" },
    { label: "About", href: "#about", id: "about" },
    { label: "Experience", href: "#experience", id: "experience" },
    { label: "Education", href: "#education", id: "education" },
    { label: "Skills", href: "#skills", id: "skills" },
    { label: "Projects", href: "#projects", id: "projects" },
    { label: "Achievements", href: "#achievements", id: "achievements" },
    { label: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <header className={`nav ${isStuck ? "stuck" : ""}`} id="topNav">
      <div className="wrap nav-inner">
        <a className="brand" href="#home" onClick={closeMenu}>
          <span className="brand-mark">
            <Image
              src="/assets/photo.jpg"
              alt="RY"
              width={36}
              height={36}
              className="rounded-[11px] object-cover"
            />
          </span>
          Rajeev Yadav
        </a>

        <nav>
          <ul className={`menu ${menuOpen ? "open" : ""}`} id="menu">
            {menuItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={activeSection === item.id ? "active" : ""}
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-cta">
          <a className="btn btn-glass btn-sm js-resume" href="/assets/resume.pdf" download>
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
            Resume
          </a>
          <a
            className="btn btn-primary btn-sm"
            href="https://github.com/rajeev8299"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.1 3.29 9.42 7.86 10.95.57.1.78-.25.78-.55v-2.1c-3.2.7-3.87-1.37-3.87-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.23 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.79.55A11.53 11.53 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
            </svg>
            GitHub
          </a>
          <button
            className="burger"
            id="burger"
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="menu"
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
