import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export function CinematicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  const navItems = [
    { label: "REPORT", href: "/#report", route: "/report-issue" },
    { label: "TRACK", href: "/#track", route: "/track" },
    { label: "IMPACT", href: "/#impact", route: "/impact" },
    { label: "HOW IT WORKS", href: "/#engine", route: "/#engine" },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      const targetId = item.href.replace("/#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#080808]/85 backdrop-blur-md hairline-b"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          {/* Left Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="text-[#6366F1] text-base leading-none select-none filter drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]">
              ✦
            </span>
            <span className="font-mono text-[13px] tracking-[0.22em] font-semibold text-white uppercase group-hover:text-[#818CF8] transition-colors">
              CIVICSENSE
            </span>
          </Link>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (location.pathname === "/") {
                    e.preventDefault();
                    handleNavClick(item);
                  }
                }}
                className="font-mono text-[11px] tracking-[0.14em] text-[#A1A1AA] hover:text-white transition-colors uppercase"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Controls (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={toggleLanguage}
              className="font-mono text-[11px] tracking-[0.14em] text-[#71717A] hover:text-white uppercase transition-colors px-2 py-1"
              title="Toggle Language (EN/HI)"
            >
              [{language.toUpperCase()}]
            </button>

            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[11px] tracking-[0.14em] text-white border border-white/20 hover:border-[#6366F1] hover:text-[#818CF8] px-3.5 py-1.5 transition-all uppercase bg-white/[0.02]"
            >
              OPEN PLATFORM ↗
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="font-mono text-[11px] tracking-[0.1em] text-[#A1A1AA] px-2 py-1"
            >
              [{language.toUpperCase()}]
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <span
                className={`w-6 h-[1px] bg-white transition-transform duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-[3.5px]" : ""
                }`}
              />
              <span
                className={`w-6 h-[1px] bg-white transition-transform duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#080808] flex flex-col justify-between p-8 pt-24 transition-all duration-400 ease-out md:hidden ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-6">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#71717A] uppercase">
            NAVIGATION INDEX
          </span>
          {navItems.map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  handleNavClick(item);
                } else {
                  setMobileMenuOpen(false);
                }
              }}
              className="text-2xl font-light text-white tracking-tight flex items-baseline gap-4 hover:text-[#818CF8] transition-colors"
            >
              <span className="font-mono text-xs text-[#71717A]">
                0{idx + 1}
              </span>
              <span>{item.label}</span>
            </a>
          ))}

          <Link
            to="/report-issue"
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl font-light text-[#818CF8] tracking-tight flex items-baseline gap-4 mt-2"
          >
            <span className="font-mono text-xs text-[#71717A]">05</span>
            <span>FULL REPORT FORM</span>
          </Link>
        </div>

        <div className="pt-8 hairline-t flex flex-col gap-4">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="w-full text-center font-mono text-[12px] tracking-[0.14em] uppercase py-3 border border-white/20 text-white hover:bg-white/5"
          >
            OPEN PLATFORM ↗
          </a>
          <div className="flex items-center justify-between text-xs text-[#71717A] font-mono">
            <span>© CIVICSENSE</span>
            <span>SYS STATUS: 200 OK</span>
          </div>
        </div>
      </div>
    </>
  );
}
