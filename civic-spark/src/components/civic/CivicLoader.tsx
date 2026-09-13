import { useState, useEffect } from "react";

interface CivicLoaderProps {
  onReady?: () => void;
  minDuration?: number;
}

export function CivicLoader({ onReady, minDuration = 1400 }: CivicLoaderProps) {
  const [subsystems, setSubsystems] = useState([
    { name: "CITY MESH", status: "INITIALIZING" },
    { name: "AI TRIAGE ENGINE", status: "INITIALIZING" },
    { name: "GEOSPATIAL RADAR", status: "INITIALIZING" },
    { name: "JURISDICTION MATRIX", status: "INITIALIZING" },
  ]);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setSubsystems((prev) =>
        prev.map((s, i) => (i === 0 ? { ...s, status: "READY" } : s))
      );
    }, 280);

    const t2 = setTimeout(() => {
      setSubsystems((prev) =>
        prev.map((s, i) => (i === 1 ? { ...s, status: "READY" } : s))
      );
    }, 600);

    const t3 = setTimeout(() => {
      setSubsystems((prev) =>
        prev.map((s, i) => (i === 2 ? { ...s, status: "READY" } : s))
      );
    }, 950);

    const t4 = setTimeout(() => {
      setSubsystems((prev) =>
        prev.map((s, i) => (i === 3 ? { ...s, status: "READY" } : s))
      );
    }, 1250);

    const tDone = setTimeout(() => {
      onReady?.();
    }, minDuration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tDone);
    };
  }, [minDuration, onReady]);

  return (
    <div className="fixed inset-0 z-[999] bg-[#080808] flex flex-col items-center justify-center p-6 select-none font-mono">
      <div className="w-full max-w-sm bg-[#0A0A0A] hairline p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 hairline-b">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#6366F1] animate-pulse" />
            <span className="text-white text-xs font-medium tracking-[0.2em]">
              CIVICSENSE
            </span>
          </div>
          <span className="text-[10px] text-[#71717A]">SYS: 2026.4</span>
        </div>

        <div className="space-y-3">
          {subsystems.map((sub) => (
            <div
              key={sub.name}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-[#A1A1AA]">{sub.name}</span>
              <span
                className={`text-[10px] tracking-wider ${
                  sub.status === "READY"
                    ? "text-[#22C55E]"
                    : "text-[#818CF8] animate-pulse"
                }`}
              >
                [{sub.status}]
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 hairline-t flex items-center justify-between text-[10px] text-[#71717A]">
          <span>STATUS</span>
          <span>ESTABLISHING METROPOLITAN LINK...</span>
        </div>
      </div>
    </div>
  );
}
