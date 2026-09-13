import { useEffect, useState } from "react";
import { Shield, Cpu, Radio } from "lucide-react";

const BOOT_SEQUENCE = [
  { delay: 0, text: "CIVICSENSE COMMAND CENTER v2.0.0", type: "header" },
  { delay: 300, text: "Initializing secure context...", type: "log" },
  { delay: 600, text: "Loading mission control interface...", type: "log" },
  { delay: 900, text: "Connecting to Supabase cluster...", type: "log" },
  { delay: 1200, text: "Verifying administrator credentials...", type: "log" },
  { delay: 1500, text: "Establishing AI service link...", type: "log" },
  { delay: 1800, text: "Mapping active districts...", type: "log" },
  { delay: 2100, text: "SYSTEM READY", type: "success" },
];

const SESSION_KEY = "civicsense_boot_shown";

interface SystemInitLoaderProps {
  onComplete: () => void;
}

export default function SystemInitLoader({ onComplete }: SystemInitLoaderProps) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check session cache
    if (sessionStorage.getItem(SESSION_KEY)) {
      onComplete();
      return;
    }

    // Boot sequence
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_SEQUENCE.forEach((step, idx) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, idx]);
        setProgress(Math.round(((idx + 1) / BOOT_SEQUENCE.length) * 100));
      }, step.delay);
      timers.push(t);
    });

    // Complete and cache
    const finalTimer = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      onComplete();
    }, 2800);
    timers.push(finalTimer);

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[300] bg-[#070708] flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#6366F1]/5 blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative w-full max-w-lg px-8">
        {/* Logo */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.2)]">
            <Shield className="w-8 h-8 text-[#6366F1]" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight">
              CivicSense
            </h1>
            <p className="text-[10px] font-mono text-[#6366F1] uppercase tracking-[0.3em] mt-1">
              MUNICIPAL COMMAND CENTER
            </p>
          </div>
        </div>

        {/* Terminal output */}
        <div className="bg-[#0A0A0C] border border-[rgba(255,255,255,0.06)] rounded-xl p-5 mb-6 min-h-[180px] font-mono text-xs space-y-1.5">
          {BOOT_SEQUENCE.map((step, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 transition-all duration-300 ${
                visibleLines.includes(idx)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-1"
              }`}
            >
              {step.type === "header" && (
                <span className="text-[#6366F1] font-bold">{step.text}</span>
              )}
              {step.type === "log" && (
                <>
                  <span className="text-[#52525B] select-none">›</span>
                  <span className="text-[#71717A]">{step.text}</span>
                </>
              )}
              {step.type === "success" && (
                <>
                  <span className="text-green-400 select-none">✓</span>
                  <span className="text-green-400 font-bold">{step.text}</span>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="h-0.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6366F1] to-indigo-400 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Radio className="w-3 h-3 text-[#71717A]" />
              <span className="text-[10px] font-mono text-[#52525B]">
                SECURE BOOT SEQUENCE
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#6366F1]">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <Cpu className="w-3 h-3 text-[#52525B]" />
        <span className="text-[10px] font-mono text-[#52525B]">
          CIVICSENSE OS v2.0
        </span>
      </div>
    </div>
  );
}
