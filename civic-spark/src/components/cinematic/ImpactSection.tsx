import { useState, useEffect } from "react";
import { dataAdapter, SystemTelemetry } from "@/lib/dataAdapter";

export function ImpactSection() {
  const [telemetry, setTelemetry] = useState<SystemTelemetry>({
    reportsCount: 1284,
    aiClassifiedPercent: 94.7,
    resolvedPercent: 78.0,
    activeZones: 23,
  });

  useEffect(() => {
    dataAdapter.getTelemetry().then(setTelemetry).catch(() => {});
  }, []);

  const categories = [
    { name: "Road Infrastructure & Potholes", share: 34, color: "#6366F1" },
    { name: "Public Street Lighting", share: 22, color: "#818CF8" },
    { name: "Solid Waste & Compost Overflow", share: 20, color: "#A1A1AA" },
    { name: "Water Supply & Line Leakage", share: 16, color: "#71717A" },
    { name: "Encroachment & General Civic", share: 8, color: "#52525B" },
  ];

  const cityRankings = [
    { zone: "PUNE METROPOLITAN (PMC)", resolved: "91.2%", avgTime: "14.2h" },
    { zone: "PIMPRI CHINCHWAD (PCMC)", resolved: "87.4%", avgTime: "16.8h" },
    { zone: "NAGPUR MUNICIPAL (NMC)", resolved: "82.1%", avgTime: "19.5h" },
    { zone: "THANE CORPORATION (TMC)", resolved: "79.0%", avgTime: "22.1h" },
  ];

  return (
    <section id="impact" className="relative w-full bg-[#080808] py-24 md:py-36 px-6 md:px-12 hairline-b">
      <div className="max-w-[1440px] mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#6366F1]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA]">
              08 · CITY IMPACT
            </span>
          </div>
          <div className="h-[1px] w-full bg-white/10" />
        </div>

        {/* Section Headline */}
        <div className="mb-16">
          <h2 className="font-display font-light text-white tracking-[-0.045em] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] mb-6">
            MEASURE THE <br />
            <span className="text-[#818CF8]">CHANGE.</span>
          </h2>
          <p className="text-[#A1A1AA] text-base md:text-lg max-w-2xl leading-relaxed">
            Data transparency turns citizen participation into measurable civic accountability. Municipal performance audited live across districts.
          </p>
        </div>

        {/* 4-Stat Core Metric Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 hairline mb-12">
          <div className="bg-[#080808] p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#71717A] block mb-2">
              REPORTS RECEIVED
            </span>
            <span className="font-mono text-3xl md:text-4xl text-white font-light">
              {telemetry.reportsCount.toLocaleString()}
            </span>
            <span className="font-mono text-[11px] text-[#A1A1AA] block mt-1">
              +142 this week
            </span>
          </div>

          <div className="bg-[#080808] p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#71717A] block mb-2">
              ISSUES RESOLVED
            </span>
            <span className="font-mono text-3xl md:text-4xl text-[#22C55E] font-light">
              {Math.round((telemetry.reportsCount * telemetry.resolvedPercent) / 100).toLocaleString()}
            </span>
            <span className="font-mono text-[11px] text-[#A1A1AA] block mt-1">
              Rate: {telemetry.resolvedPercent}%
            </span>
          </div>

          <div className="bg-[#080808] p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#71717A] block mb-2">
              AVERAGE RESPONSE
            </span>
            <span className="font-mono text-3xl md:text-4xl text-white font-light">
              18.4 hrs
            </span>
            <span className="font-mono text-[11px] text-[#818CF8] block mt-1">
              -3.2h vs benchmark
            </span>
          </div>

          <div className="bg-[#080808] p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#71717A] block mb-2">
              ACTIVE AREAS
            </span>
            <span className="font-mono text-3xl md:text-4xl text-white font-light">
              {telemetry.activeZones}
            </span>
            <span className="font-mono text-[11px] text-[#A1A1AA] block mt-1">
              Postal Divisions
            </span>
          </div>
        </div>

        {/* Visual Charts: Minimal Technical Resolution Curve & Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Minimal Indigo Technical Velocity Curve */}
          <div className="lg:col-span-7 bg-[#0A0A0A] hairline p-6 md:p-8">
            <div className="flex items-center justify-between pb-4 hairline-b mb-6 font-mono text-xs">
              <span className="text-white uppercase tracking-wider">
                RESOLUTION VELOCITY (PAST 30 DAYS)
              </span>
              <span className="text-[#818CF8]">LIVE MOVING AVERAGE</span>
            </div>

            {/* Technical SVG Line Chart */}
            <div className="w-full h-56 relative">
              <svg
                viewBox="0 0 500 180"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                {/* Horizontal Grid lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

                {/* Shaded area under curve */}
                <polygon
                  points="0,150 40,140 80,120 120,135 160,110 200,95 240,105 280,80 320,70 360,75 400,55 440,45 480,35 500,30 500,180 0,180"
                  fill="url(#indigoGradient)"
                />

                {/* Primary Data Line */}
                <polyline
                  points="0,150 40,140 80,120 120,135 160,110 200,95 240,105 280,80 320,70 360,75 400,55 440,45 480,35 500,30"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="1.75"
                />

                {/* Latest point node */}
                <circle cx="500" cy="30" r="3.5" fill="#FFFFFF" stroke="#6366F1" strokeWidth="2" />

                <defs>
                  <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex justify-between font-mono text-[10px] text-[#71717A] mt-4 pt-4 hairline-t">
              <span>DAY 01 (INCEPTION)</span>
              <span>DAY 15</span>
              <span>DAY 30 (PEAK EFFICIENCY)</span>
            </div>
          </div>

          {/* Category Distribution Technical Meters */}
          <div className="lg:col-span-5 bg-[#0A0A0A] hairline p-6 md:p-8 space-y-6">
            <div className="pb-4 hairline-b font-mono text-xs text-white uppercase tracking-wider">
              GRIEVANCE CATEGORY DISTRIBUTION
            </div>

            <div className="space-y-4">
              {categories.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between font-mono text-xs mb-1.5">
                    <span className="text-[#A1A1AA]">{c.name}</span>
                    <span className="text-white font-medium">{c.share}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 overflow-hidden">
                    <div
                      style={{ width: `${c.share}%`, backgroundColor: c.color }}
                      className="h-full transition-all duration-700"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 hairline-t space-y-3 font-mono text-xs">
              <span className="text-[10px] uppercase text-[#71717A] block">
                MUNICIPAL JURISDICTION RANKINGS
              </span>
              {cityRankings.map((r, i) => (
                <div key={r.zone} className="flex justify-between text-[#A1A1AA] text-[11px]">
                  <span>0{i + 1} · {r.zone}</span>
                  <span className="text-white">{r.resolved} (AVG {r.avgTime})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
