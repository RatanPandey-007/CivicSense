import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown, X, ArrowUpRight } from "lucide-react";
import { ThreeCityScene } from "./ThreeCityScene";

interface HudCardData {
  id: string;
  type: "critical" | "resolved" | "in_progress";
  header: string;
  title: string;
  sector: string;
  distance: string;
  confidence: number;
  color: string;
  cardTop: string;
  cardLeft: string;
  floatDelay: string;
}

const HUD_CARDS: HudCardData[] = [
  {
    id: "card-critical",
    type: "critical",
    header: "CRITICAL ISSUE",
    title: "Water Leakage",
    sector: "Sector 14",
    distance: "2.4 km",
    confidence: 94.7,
    color: "#EF4444",
    cardTop: "24%",
    cardLeft: "62.5%",
    floatDelay: "0s",
  },
  {
    id: "card-resolved",
    type: "resolved",
    header: "RESOLVED",
    title: "Road Repair",
    sector: "Sector 7",
    distance: "1.2 km",
    confidence: 98.2,
    color: "#22C55E",
    cardTop: "32%",
    cardLeft: "91%",
    floatDelay: "1.5s",
  },
  {
    id: "card-in-progress",
    type: "in_progress",
    header: "IN PROGRESS",
    title: "Street Light",
    sector: "Sector 22",
    distance: "3.1 km",
    confidence: 89.4,
    color: "#38BDF8",
    cardTop: "63%",
    cardLeft: "86.5%",
    floatDelay: "2.8s",
  },
];

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [activeModal, setActiveModal] = useState<HudCardData | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToNext = () => {
    const nextEl = document.getElementById("problem") || document.getElementById("report");
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col justify-between bg-[#050506] overflow-hidden pt-20 pb-8 px-6 md:px-12 selection:bg-[#6366F1] selection:text-white">
      {/* ─── 1. Real Interactive Procedural 3D City Scene (Three.js WebGL) ─── */}
      <ThreeCityScene />

      {/* ─── 2. Atmospheric Left-Side Gradient Mask (Preserves Typography Readability) ─── */}
      <div
        className="absolute inset-0 pointer-events-none z-10 select-none"
        style={{
          background:
            "linear-gradient(to right, #050506 0%, #050506 34%, rgba(5,5,6,0.8) 48%, rgba(5,5,6,0.2) 68%, transparent 100%)",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#050506] via-[#050506]/80 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050506] to-transparent pointer-events-none z-10" />

      {/* ─── 3. Top Sub-Nav Metadata Bar (Matching Reference Exactly) ─── */}
      <div className="relative z-30 max-w-[1536px] mx-auto w-full flex items-center justify-between pt-2 pb-4 border-b border-white/[0.08]">
        {/* Left: 01 · CIVIC INTELLIGENCE */}
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-none bg-[#6366F1] shadow-[0_0_8px_#6366F1]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#A1A1AA] font-medium">
            01 · CIVIC INTELLIGENCE
          </span>
        </div>

        {/* Right: NODE: CENTRAL_GATEWAY   LATENCY: 14MS with glowing blue pill */}
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#71717A]">
          <span className="w-6 h-1.5 bg-[#6366F1] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)] inline-block" />
          <span className="hidden sm:inline text-[#A1A1AA]">NODE: CENTRAL_GATEWAY</span>
          <span className="text-white/40">•</span>
          <span className="text-[#818CF8]">LATENCY: 14MS</span>
        </div>
      </div>

      {/* ─── 4. Main Hero Typography & Action Area (Anchored Left) ─── */}
      <div className="relative z-30 max-w-[1536px] mx-auto w-full my-auto py-8 md:py-16 pointer-events-none">
        <div className="max-w-2xl pointer-events-auto">
          {/* Headline matching reference scale and spacing */}
          <h1 className="font-sans font-light tracking-[-0.05em] select-none text-[clamp(4.25rem,8.6vw,9rem)] leading-[0.84] mb-8">
            <span
              className={`block text-white transition-all duration-700 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              SEE WHAT
            </span>
            <span
              className={`block text-white transition-all duration-700 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              YOUR CITY
            </span>
            <span
              className={`block text-[#6366F1] transition-all duration-700 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                textShadow: "0 0 45px rgba(99, 102, 241, 0.55)",
              }}
            >
              NEEDS.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-[#A1A1AA] text-base md:text-lg font-normal max-w-lg leading-[1.65] mb-10 tracking-tight transition-all duration-700 delay-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            One platform connecting citizens, AI and municipal action in real time.
          </p>

          {/* Action CTAs */}
          <div
            className={`flex flex-wrap items-center gap-4 transition-all duration-700 delay-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* Primary Action Button */}
            <Link
              to="/report-issue"
              className="group px-7 py-3.5 bg-[#6366F1] text-white font-mono text-[11px] uppercase tracking-[0.16em] font-semibold hover:bg-[#4F46E5] transition-all duration-200 shadow-[0_0_24px_rgba(99,102,241,0.45)] flex items-center gap-2 hover:translate-y-[-1px] active:scale-[0.98]"
            >
              <span>REPORT AN ISSUE</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Secondary Action Button */}
            <button
              onClick={scrollToNext}
              className="group px-7 py-3.5 border border-white/20 text-white font-mono text-[11px] uppercase tracking-[0.16em] hover:border-[#6366F1] hover:text-[#818CF8] transition-all duration-200 bg-white/[0.02] flex items-center gap-2 active:scale-[0.98]"
            >
              <span>EXPLORE THE SYSTEM</span>
              <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── 5. Real Interactive HUD Callout Panels (Over the City) ─── */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {HUD_CARDS.map((card) => {
          const isHovered = hoveredCard === card.id;

          return (
            <div
              key={card.id}
              className="absolute pointer-events-auto transition-transform duration-300"
              style={{
                top: card.cardTop,
                left: card.cardLeft,
                transform: "translate(-50%, -50%)",
                animation: `hudFloat 6s ease-in-out infinite alternate ${card.floatDelay}`,
              }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setActiveModal(card)}
            >
              {/* Technical Glass Panel */}
              <div
                className="relative px-3.5 py-2.5 rounded-none backdrop-blur-md cursor-pointer transition-all duration-300"
                style={{
                  backgroundColor: "rgba(10, 10, 14, 0.82)",
                  border: `1px solid ${isHovered ? card.color : "rgba(255, 255, 255, 0.12)"}`,
                  boxShadow: isHovered
                    ? `0 0 20px ${card.color}35, inset 0 0 10px ${card.color}20`
                    : "0 8px 30px rgba(0, 0, 0, 0.75)",
                }}
              >
                {/* Corner Hairline Accent Marks */}
                <div
                  className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l"
                  style={{ borderColor: card.color }}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r"
                  style={{ borderColor: card.color }}
                />

                {/* Header Badge */}
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span
                    className="font-mono text-[9px] font-semibold tracking-[0.16em] uppercase"
                    style={{ color: card.color }}
                  >
                    {card.header}
                  </span>
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: card.color,
                      boxShadow: `0 0 6px ${card.color}`,
                    }}
                  />
                </div>

                {/* Incident Title */}
                <p className="text-white text-xs font-medium tracking-tight mb-1 font-sans">
                  {card.title}
                </p>

                {/* Subtitle / Distance / Reticle */}
                <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-[#71717A]">
                  <span>
                    {card.sector} · {card.distance}
                  </span>
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-dashed flex items-center justify-center transition-transform"
                    style={{
                      borderColor: card.color,
                      transform: isHovered ? "scale(1.2) rotate(45deg)" : "scale(1)",
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: card.color }}
                    />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── 6. Bottom Scroll Indicator (Bottom Left) ─── */}
      <div className="relative z-30 max-w-[1536px] mx-auto w-full flex items-center justify-between pt-4">
        {/* Left: • SCROLL with vertical indicator */}
        <button
          onClick={scrollToNext}
          className="group flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#71717A] hover:text-white transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-none bg-[#71717A] group-hover:bg-[#6366F1] transition-colors" />
          <span>SCROLL</span>
          <div className="relative w-8 h-px bg-white/10 overflow-hidden">
            <span className="absolute top-0 bottom-0 left-0 w-3 bg-[#6366F1] animate-scrollPulse" />
          </div>
        </button>

        {/* Right: Ambient coordinates */}
        <div className="hidden md:flex items-center gap-4 font-mono text-[9px] uppercase tracking-widest text-white/25">
          <span>LAT: 26.8467° N</span>
          <span>LNG: 80.9462° E</span>
          <span>GRID: MUNICIPAL_OCTANT_04</span>
        </div>
      </div>

      {/* ─── 7. Interactive Incident Dossier Modal (on Card Click) ─── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div
            className="relative w-full max-w-md bg-[#0D0D0F] border border-white/10 p-6 shadow-2xl overflow-hidden"
            style={{
              boxShadow: `0 0 45px ${activeModal.color}25`,
            }}
          >
            {/* Top Accent Stripe */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ backgroundColor: activeModal.color }}
            />

            {/* Modal Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold block mb-1"
                  style={{ color: activeModal.color }}
                >
                  INCIDENT DOSSIER // {activeModal.sector}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {activeModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#71717A] hover:text-white p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Diagnostics Matrix */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-[#070708] border border-white/5 mb-5 font-mono text-xs">
              <div>
                <span className="text-[9px] text-[#71717A] uppercase block">AI CONFIDENCE</span>
                <span className="text-[#818CF8] font-semibold text-sm">
                  {activeModal.confidence}%
                </span>
              </div>
              <div>
                <span className="text-[9px] text-[#71717A] uppercase block">STATUS</span>
                <span
                  className="font-semibold text-sm uppercase"
                  style={{ color: activeModal.color }}
                >
                  {activeModal.type}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-[#71717A] uppercase block">PROXIMITY</span>
                <span className="text-white font-semibold text-sm">
                  {activeModal.distance}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A1A1AA] leading-relaxed mb-6 font-sans">
              Real-time sensory telemetry registered by autonomous municipal nodes. Categorized by
              the neural triage engine and routed to municipal response dispatch.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <a
                href="https://admin-dashboard-six-nu-90.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 bg-[#6366F1] text-white text-xs font-mono uppercase tracking-[0.14em] font-semibold hover:bg-[#4F46E5] transition-colors flex items-center justify-center gap-2"
              >
                <span>OPEN IN COMMAND CENTER</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setActiveModal(null)}
                className="py-2.5 px-4 bg-transparent border border-white/10 text-[#A1A1AA] hover:text-white text-xs font-mono uppercase tracking-[0.14em] transition-colors"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes hudFloat {
          0% { transform: translate(-50%, -50%) translateY(-3px); }
          100% { transform: translate(-50%, -50%) translateY(3px); }
        }
        @keyframes scrollPulse {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        .animate-scrollPulse {
          animation: scrollPulse 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
}
