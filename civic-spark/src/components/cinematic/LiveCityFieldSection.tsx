import { useRef, useEffect, useState } from "react";

interface FieldSignal {
  id: string;
  x: number;
  y: number;
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  category: string;
  zone: string;
  pulseSpeed: number;
  baseRadius: number;
}

export function LiveCityFieldSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedSignal, setSelectedSignal] = useState<FieldSignal | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let isVisible = false;
    let animId: number;
    let width = 0;
    let height = 0;

    // Generate 75 distributed signals
    const priorities: FieldSignal["priority"][] = [
      "critical", "high", "high", "medium", "medium", "medium", "low", "low"
    ];

    const categories = ["Road Damage", "Electrical Hazard", "Sanitation", "Water Supply", "Public Lighting"];

    let signals: FieldSignal[] = [];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);

      // Re-populate coordinates nicely within bounds
      if (signals.length === 0) {
        signals = Array.from({ length: 75 }, (_, i) => {
          const priority = priorities[i % priorities.length];
          const pulseSpeed =
            priority === "critical"
              ? 6.0
              : priority === "high"
              ? 3.8
              : priority === "medium"
              ? 2.2
              : 1.0;

          return {
            id: `SIG-${1000 + i}`,
            x: 50 + Math.random() * (width - 100),
            y: 50 + Math.random() * (height - 100),
            priority,
            title: `Report #${1000 + i} (${priority.toUpperCase()})`,
            category: categories[i % categories.length],
            zone: `DISTRICT-${411001 + (i % 24)}`,
            pulseSpeed,
            baseRadius: priority === "critical" ? 4.5 : 3.0,
          };
        });
        setSelectedSignal(signals[0]);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Click handler for node selection
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let found: FieldSignal | null = null;
      let minDistance = 24;

      signals.forEach((sig) => {
        const dist = Math.hypot(clickX - sig.x, clickY - sig.y);
        if (dist < minDistance) {
          minDistance = dist;
          found = sig;
        }
      });

      if (found) {
        setSelectedSignal(found);
      }
    };

    canvas.addEventListener("click", handleCanvasClick);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !prefersReducedMotion) {
          lastTime = performance.now();
          render(lastTime);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    let lastTime = performance.now();
    let tick = 0;

    const render = (time: number) => {
      if (!isVisible) return;
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      tick += dt;

      // Dark canvas background
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, width, height);

      // Technical constellation mesh lines between nearby nodes
      ctx.lineWidth = 0.5;
      for (let i = 0; i < signals.length; i++) {
        for (let j = i + 1; j < signals.length; j++) {
          const dx = signals[i].x - signals[j].x;
          const dy = signals[i].y - signals[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 90) {
            const alpha = (1 - dist / 90) * 0.08;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(signals[i].x, signals[i].y);
            ctx.lineTo(signals[j].x, signals[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw each signal
      signals.forEach((sig) => {
        const pulse = (Math.sin(tick * sig.pulseSpeed) + 1) / 2;
        const isSelected = selectedSignal?.id === sig.id;

        const color =
          sig.priority === "critical"
            ? "#EF4444"
            : sig.priority === "high"
            ? "#F59E0B"
            : sig.priority === "medium"
            ? "#6366F1"
            : "#71717A";

        // Outer pulse wave
        ctx.strokeStyle = `${color}${Math.floor(pulse * 90).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.beginPath();
        ctx.arc(sig.x, sig.y, sig.baseRadius + pulse * (sig.priority === "critical" ? 16 : 9), 0, Math.PI * 2);
        ctx.stroke();

        // Selected crosshairs
        if (isSelected) {
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1;
          const ch = 12;
          ctx.beginPath();
          ctx.moveTo(sig.x - ch, sig.y);
          ctx.lineTo(sig.x + ch, sig.y);
          ctx.moveTo(sig.x, sig.y - ch);
          ctx.lineTo(sig.x, sig.y + ch);
          ctx.stroke();
        }

        // Center solid node
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(sig.x, sig.y, sig.baseRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render(performance.now());

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      canvas.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("resize", resize);
    };
  }, [selectedSignal]);

  return (
    <section id="field" className="relative w-full bg-[#0A0A0A] py-24 md:py-36 px-6 md:px-12 hairline-b">
      <div className="max-w-[1440px] mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#EF4444]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA]">
              05 · LIVE CITY FIELD
            </span>
          </div>
          <div className="h-[1px] w-full bg-white/10" />
        </div>

        {/* Section Headline */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-display font-light text-white tracking-[-0.045em] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] mb-4">
              ACTIVE METROPOLITAN <br />
              <span className="text-[#818CF8]">FIELD PULSES.</span>
            </h2>
            <p className="text-[#A1A1AA] text-base max-w-xl">
              75 concurrent sensor telemetry streams. Pulse frequencies reflect algorithmic urgency: Critical (6 Hz rapid strobe), High (3.8 Hz), Medium (2.2 Hz), Low (1.0 Hz).
            </p>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] text-[#71717A]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> CRITICAL
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> HIGH
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#6366F1]" /> MEDIUM
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#71717A]" /> LOW
            </span>
          </div>
        </div>

        {/* Canvas Interactive Container */}
        <div
          ref={containerRef}
          className="relative w-full h-[480px] md:h-[560px] bg-[#080808] hairline overflow-hidden cursor-crosshair"
        >
          <canvas ref={canvasRef} className="absolute inset-0 block" />

          {/* Interactive Inspection HUD card */}
          {selectedSignal && (
            <div className="absolute top-6 left-6 z-10 bg-[#080808]/90 backdrop-blur-md hairline p-4 max-w-xs font-mono text-xs pointer-events-none space-y-2">
              <div className="flex justify-between text-[#71717A] text-[10px]">
                <span>SIGNAL LOCKED</span>
                <span>{selectedSignal.id}</span>
              </div>
              <h4 className="text-white text-sm font-medium tracking-tight">
                {selectedSignal.title}
              </h4>
              <div className="flex justify-between hairline-t pt-2 text-[11px]">
                <span className="text-[#71717A]">CATEGORY:</span>
                <span className="text-white">{selectedSignal.category}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#71717A]">ZONE:</span>
                <span className="text-white">{selectedSignal.zone}</span>
              </div>
              <div className="flex justify-between text-[11px] items-center">
                <span className="text-[#71717A]">FREQUENCY:</span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    selectedSignal.priority === "critical"
                      ? "bg-[#EF4444]/20 text-[#EF4444]"
                      : selectedSignal.priority === "high"
                      ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                      : "bg-[#6366F1]/20 text-[#818CF8]"
                  }`}
                >
                  {selectedSignal.priority} ({selectedSignal.pulseSpeed} Hz)
                </span>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 right-4 z-10 font-mono text-[10px] text-[#71717A] pointer-events-none">
            CLICK ANY PULSE TO LOCK TELEMETRY
          </div>
        </div>
      </div>
    </section>
  );
}
