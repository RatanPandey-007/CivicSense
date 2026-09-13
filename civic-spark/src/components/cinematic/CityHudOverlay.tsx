import React, { useState } from "react";
import { X, ArrowUpRight, ShieldAlert, CheckCircle2, Clock, MapPin, Brain } from "lucide-react";
import type { CityBeacon } from "./ThreeCityScene";

interface CityHudOverlayProps {
  beacons: CityBeacon[];
  selectedBeaconId?: string | null;
  onSelectBeacon?: (id: string) => void;
}

export const CityHudOverlay: React.FC<CityHudOverlayProps> = ({
  beacons,
  selectedBeaconId,
  onSelectBeacon,
}) => {
  const [hoveredBeaconId, setHoveredBeaconId] = useState<string | null>(null);
  const [activeModalBeacon, setActiveModalBeacon] = useState<CityBeacon | null>(null);

  const getBeaconConfig = (type: CityBeacon["type"]) => {
    switch (type) {
      case "critical":
        return {
          header: "CRITICAL ISSUE",
          accentColor: "#EF4444",
          borderColor: "rgba(239, 68, 68, 0.35)",
          hoverBorder: "rgba(239, 68, 68, 0.8)",
          bgColor: "rgba(13, 13, 16, 0.78)",
          badgeBg: "rgba(239, 68, 68, 0.12)",
          icon: ShieldAlert,
        };
      case "resolved":
        return {
          header: "RESOLVED",
          accentColor: "#22C55E",
          borderColor: "rgba(34, 197, 94, 0.35)",
          hoverBorder: "rgba(34, 197, 94, 0.8)",
          bgColor: "rgba(13, 13, 16, 0.78)",
          badgeBg: "rgba(34, 197, 94, 0.12)",
          icon: CheckCircle2,
        };
      case "in_progress":
        return {
          header: "IN PROGRESS",
          accentColor: "#38BDF8",
          borderColor: "rgba(56, 189, 248, 0.35)",
          hoverBorder: "rgba(56, 189, 248, 0.8)",
          bgColor: "rgba(13, 13, 16, 0.78)",
          badgeBg: "rgba(56, 189, 248, 0.12)",
          icon: Clock,
        };
      default:
        return {
          header: "ACTIVE SIGNAL",
          accentColor: "#F59E0B",
          borderColor: "rgba(245, 158, 11, 0.35)",
          hoverBorder: "rgba(245, 158, 11, 0.8)",
          bgColor: "rgba(13, 13, 16, 0.78)",
          badgeBg: "rgba(245, 158, 11, 0.12)",
          icon: MapPin,
        };
    }
  };

  // Pre-configured layout offsets so HUD cards sit precisely around the 3D city as in reference
  const cardLayoutMap: Record<string, { top: string; left: string; floatDelay: string }> = {
    "beacon-critical": { top: "24%", left: "57%", floatDelay: "0s" },
    "beacon-resolved": { top: "30%", left: "86%", floatDelay: "1.4s" },
    "beacon-in-progress": { top: "62%", left: "82%", floatDelay: "2.6s" },
  };

  const primaryBeacons = beacons.filter((b) => cardLayoutMap[b.id]);

  const handleCardClick = (beacon: CityBeacon) => {
    setActiveModalBeacon(beacon);
    onSelectBeacon?.(beacon.id);
  };

  return (
    <>
      {/* Absolute Overlays Container */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {primaryBeacons.map((beacon) => {
          const cfg = getBeaconConfig(beacon.type);
          const layout = cardLayoutMap[beacon.id];
          const isHovered = hoveredBeaconId === beacon.id || selectedBeaconId === beacon.id;

          return (
            <div
              key={beacon.id}
              className="absolute pointer-events-auto transition-transform duration-300"
              style={{
                top: layout.top,
                left: layout.left,
                transform: "translate(-50%, -50%)",
                animation: `hudFloat 6s ease-in-out infinite alternate ${layout.floatDelay}`,
              }}
              onMouseEnter={() => setHoveredBeaconId(beacon.id)}
              onMouseLeave={() => setHoveredBeaconId(null)}
              onClick={() => handleCardClick(beacon)}
            >
              {/* Technical Glass HUD Panel */}
              <div
                className="relative px-4 py-3 rounded-none backdrop-blur-md cursor-pointer transition-all duration-300"
                style={{
                  backgroundColor: cfg.bgColor,
                  border: `1px solid ${isHovered ? cfg.hoverBorder : cfg.borderColor}`,
                  boxShadow: isHovered
                    ? `0 0 24px ${cfg.accentColor}25, inset 0 0 12px ${cfg.accentColor}15`
                    : "0 8px 32px rgba(0,0,0,0.65)",
                }}
              >
                {/* Corner Technical Crosshairs */}
                <div
                  className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2"
                  style={{ borderColor: cfg.accentColor }}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2"
                  style={{ borderColor: cfg.accentColor }}
                />

                {/* Header Tag */}
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span
                    className="font-mono text-[10px] font-semibold tracking-[0.16em] uppercase"
                    style={{ color: cfg.accentColor }}
                  >
                    {cfg.header}
                  </span>
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: cfg.accentColor,
                      boxShadow: `0 0 8px ${cfg.accentColor}`,
                    }}
                  />
                </div>

                {/* Incident Title */}
                <p className="text-white text-xs font-medium tracking-tight mb-1 font-sans">
                  {beacon.title}
                </p>

                {/* Subtitle / Distance / Reticle */}
                <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-[#71717A]">
                  <span>
                    {beacon.sector} · {beacon.distance}
                  </span>
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-dashed flex items-center justify-center transition-transform"
                    style={{
                      borderColor: cfg.accentColor,
                      transform: isHovered ? "scale(1.2) rotate(45deg)" : "scale(1)",
                    }}
                  >
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: cfg.accentColor }}
                    />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Inspection Dossier Modal */}
      {activeModalBeacon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div
            className="relative w-full max-w-md bg-[#0D0D0F] border border-white/10 p-6 shadow-2xl overflow-hidden"
            style={{
              boxShadow: `0 0 40px ${getBeaconConfig(activeModalBeacon.type).accentColor}20`,
            }}
          >
            {/* Top Accent Stripe */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                backgroundColor: getBeaconConfig(activeModalBeacon.type).accentColor,
              }}
            />

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold block mb-1"
                  style={{
                    color: getBeaconConfig(activeModalBeacon.type).accentColor,
                  }}
                >
                  INCIDENT DOSSIER // {activeModalBeacon.sector}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {activeModalBeacon.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalBeacon(null)}
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
                  {activeModalBeacon.confidence}%
                </span>
              </div>
              <div>
                <span className="text-[9px] text-[#71717A] uppercase block">PRIORITY</span>
                <span
                  className="font-semibold text-sm uppercase"
                  style={{
                    color: getBeaconConfig(activeModalBeacon.type).accentColor,
                  }}
                >
                  {activeModalBeacon.type}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-[#71717A] uppercase block">PROXIMITY</span>
                <span className="text-white font-semibold text-sm">
                  {activeModalBeacon.distance}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#A1A1AA] leading-relaxed mb-6 font-sans">
              Real-time sensory telemetry registered by autonomous municipal nodes. Categorized by
              the neural triage engine and routed to municipal response dispatch.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <a
                href="http://localhost:5173"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 bg-[#6366F1] text-white text-xs font-mono uppercase tracking-[0.14em] font-semibold hover:bg-[#4F46E5] transition-colors flex items-center justify-center gap-2"
              >
                <span>OPEN IN COMMAND CENTER</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setActiveModalBeacon(null)}
                className="py-2.5 px-4 bg-transparent border border-white/10 text-[#A1A1AA] hover:text-white text-xs font-mono uppercase tracking-[0.14em] transition-colors"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Keyframes for subtle float */}
      <style>{`
        @keyframes hudFloat {
          0% { transform: translate(-50%, -50%) translateY(-2px); }
          100% { transform: translate(-50%, -50%) translateY(3px); }
        }
      `}</style>
    </>
  );
};
