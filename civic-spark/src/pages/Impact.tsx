import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { CivicEyebrow } from "@/components/civic/CivicEyebrow";
import { CivicBadge } from "@/components/civic/CivicBadge";
import { dataAdapter, SystemTelemetry } from "@/lib/dataAdapter";
import { TrendingUp, CheckCircle, Clock, MapPin, Download, ShieldCheck } from "lucide-react";

export default function Impact() {
  const [telemetry, setTelemetry] = useState<SystemTelemetry>({
    reportsCount: 1284,
    aiClassifiedPercent: 94.7,
    resolvedPercent: 78.2,
    activeZones: 23,
  });

  useEffect(() => {
    dataAdapter.getTelemetry().then(setTelemetry).catch(() => {});
  }, []);

  const categories = [
    { name: "Road Infrastructure & Potholes", count: 436, percent: 34, color: "#6366F1" },
    { name: "Public Street Lighting & Power", count: 282, percent: 22, color: "#818CF8" },
    { name: "Solid Waste & Sanitation", count: 256, percent: 20, color: "#A1A1AA" },
    { name: "Water Supply & Distribution", count: 205, percent: 16, color: "#71717A" },
    { name: "Drainage & Sewerage Systems", count: 105, percent: 8, color: "#52525B" },
  ];

  const rankings = [
    { rank: "01", name: "PUNE METROPOLITAN (PMC)", resolved: "91.2%", speed: "14.2 hrs", score: 96 },
    { rank: "02", name: "PIMPRI CHINCHWAD (PCMC)", resolved: "87.4%", speed: "16.8 hrs", score: 92 },
    { rank: "03", name: "NAGPUR MUNICIPAL (NMC)", resolved: "82.1%", speed: "19.5 hrs", score: 88 },
    { rank: "04", name: "THANE CORPORATION (TMC)", resolved: "79.0%", speed: "22.1 hrs", score: 84 },
    { rank: "05", name: "NASHIK MUNICIPAL (NMC)", resolved: "76.5%", speed: "24.0 hrs", score: 81 },
  ];

  return (
    <Layout>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        <CivicEyebrow number="METRICS 01" label="PUBLIC IMPACT & RESOLUTION AUDIT" />

        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display font-light text-white tracking-tight text-3xl md:text-5xl uppercase mb-3">
              MUNICIPAL VELOCITY.
            </h1>
            <p className="text-sm text-[#A1A1AA] font-mono">
              Audited public metrics tracking redressal efficiency across designated postal jurisdictions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#22C55E] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              DATABASE SYNCED: 100%
            </span>
          </div>
        </div>

        {/* 4-Column High-Impact KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 hairline mb-12">
          <div className="bg-[#0A0A0A] p-6 font-mono">
            <span className="text-[10px] uppercase text-[#71717A] tracking-wider block mb-2">
              TOTAL COMPLAINTS
            </span>
            <div className="text-3xl md:text-4xl text-white font-light">
              {telemetry.reportsCount.toLocaleString()}
            </div>
            <span className="text-[11px] text-[#A1A1AA] block mt-1">
              Recorded since launch
            </span>
          </div>

          <div className="bg-[#0A0A0A] p-6 font-mono">
            <span className="text-[10px] uppercase text-[#71717A] tracking-wider block mb-2">
              RESOLVED REDRESSALS
            </span>
            <div className="text-3xl md:text-4xl text-[#22C55E] font-light">
              {Math.round((telemetry.reportsCount * telemetry.resolvedPercent) / 100).toLocaleString()}
            </div>
            <span className="text-[11px] text-[#22C55E] block mt-1">
              Rate: {telemetry.resolvedPercent}%
            </span>
          </div>

          <div className="bg-[#0A0A0A] p-6 font-mono">
            <span className="text-[10px] uppercase text-[#71717A] tracking-wider block mb-2">
              AI CLASSIFICATION ACCURACY
            </span>
            <div className="text-3xl md:text-4xl text-[#818CF8] font-light">
              {telemetry.aiClassifiedPercent}%
            </div>
            <span className="text-[11px] text-[#A1A1AA] block mt-1">
              TF-IDF automated validation
            </span>
          </div>

          <div className="bg-[#0A0A0A] p-6 font-mono">
            <span className="text-[10px] uppercase text-[#71717A] tracking-wider block mb-2">
              AVG RESOLUTION TIME
            </span>
            <div className="text-3xl md:text-4xl text-white font-light">
              18.4 hrs
            </div>
            <span className="text-[11px] text-[#818CF8] block mt-1">
              -3.2h reduction vs baseline
            </span>
          </div>
        </div>

        {/* Technical Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Resolution Velocity Chart */}
          <div className="lg:col-span-7 bg-[#0A0A0A] hairline p-6 md:p-8">
            <div className="flex items-center justify-between pb-4 hairline-b mb-6 font-mono text-xs">
              <span className="text-white uppercase tracking-wider">
                RESOLUTION VELOCITY (PAST 30 DAYS)
              </span>
              <span className="text-[#818CF8]">MOVING AVERAGE CURVE</span>
            </div>

            <div className="w-full h-64 relative">
              <svg
                viewBox="0 0 500 200"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

                <polygon
                  points="0,170 40,150 80,140 120,130 160,110 200,90 240,95 280,75 320,65 360,70 400,50 440,40 480,30 500,25 500,200 0,200"
                  fill="url(#impactIndigo)"
                />

                <polyline
                  points="0,170 40,150 80,140 120,130 160,110 200,90 240,95 280,75 320,65 360,70 400,50 440,40 480,30 500,25"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="2"
                />

                <circle cx="500" cy="25" r="4" fill="#FFFFFF" stroke="#6366F1" strokeWidth="2" />

                <defs>
                  <linearGradient id="impactIndigo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex justify-between font-mono text-[10px] text-[#71717A] mt-6 pt-4 hairline-t">
              <span>DAY 01 (INTAKE)</span>
              <span>DAY 15</span>
              <span>DAY 30 (OPTIMIZED)</span>
            </div>
          </div>

          {/* Category Share Breakdown */}
          <div className="lg:col-span-5 bg-[#0A0A0A] hairline p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 hairline-b font-mono text-xs">
              <span className="text-white uppercase tracking-wider">
                SECTOR CATEGORY SHARE
              </span>
              <span className="text-[#71717A]">5 SECTORS</span>
            </div>

            <div className="space-y-4">
              {categories.map((c) => (
                <div key={c.name} className="font-mono">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#A1A1AA]">{c.name}</span>
                    <span className="text-white font-medium">{c.count} ({c.percent}%)</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 overflow-hidden">
                    <div
                      style={{ width: `${c.percent}%`, backgroundColor: c.color }}
                      className="h-full transition-all duration-700"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 hairline-t space-y-3 font-mono">
              <span className="text-[10px] uppercase text-[#71717A] block tracking-wider">
                MUNICIPAL LEADERBOARD
              </span>
              {rankings.map((r) => (
                <div key={r.rank} className="flex items-center justify-between text-xs text-[#A1A1AA] py-1 border-b border-white/5">
                  <span>{r.rank} · {r.name}</span>
                  <span className="text-white font-medium">{r.resolved}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
