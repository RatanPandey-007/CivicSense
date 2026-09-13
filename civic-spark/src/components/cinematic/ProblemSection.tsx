import { useRef, useEffect, useState } from "react";

export function ProblemSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSignalCount, setActiveSignalCount] = useState(12);

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

    interface CitySignal {
      x: number;
      y: number;
      type: "pothole" | "garbage" | "waterlogging" | "streetlight" | "wire";
      color: string;
      radius: number;
      maxRadius: number;
      birth: number;
    }

    const signalTypes = [
      { type: "pothole" as const, color: "#F59E0B" },
      { type: "garbage" as const, color: "#818CF8" },
      { type: "waterlogging" as const, color: "#38BDF8" },
      { type: "streetlight" as const, color: "#A1A1AA" },
      { type: "wire" as const, color: "#EF4444" },
    ];

    let signals: CitySignal[] = [];

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
    };

    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !prefersReducedMotion) {
          lastTime = performance.now();
          render(lastTime);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(container);

    let lastTime = performance.now();
    let spawnTimer = 0;
    let sweepX = -100;
    let isSweeping = false;

    const render = (time: number) => {
      if (!isVisible) return;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Spawn signals
      spawnTimer += dt;
      if (spawnTimer > 0.4 && signals.length < 50 && !isSweeping) {
        spawnTimer = 0;
        const pick = signalTypes[Math.floor(Math.random() * signalTypes.length)];
        signals.push({
          x: 40 + Math.random() * (width - 80),
          y: 40 + Math.random() * (height - 80),
          type: pick.type,
          color: pick.color,
          radius: 1,
          maxRadius: 18 + Math.random() * 16,
          birth: time,
        });
        setActiveSignalCount(signals.length);

        // When overloaded, trigger CivicSense AI sweep
        if (signals.length >= 48) {
          isSweeping = true;
          sweepX = 0;
        }
      }

      // Handle sweep
      if (isSweeping) {
        sweepX += dt * width * 0.8;
        // Dissolve signals behind sweep line
        signals = signals.filter((s) => s.x > sweepX);
        setActiveSignalCount(signals.length);
        if (sweepX > width + 100) {
          isSweeping = false;
          signals = [];
          setActiveSignalCount(0);
        }
      }

      // Draw background
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, width, height);

      // Draw subtle city block grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      const cellSize = 36;
      for (let x = 0; x < width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw signals
      signals.forEach((s) => {
        const age = (time - s.birth) / 1000;
        const pulse = (Math.sin(age * 4) + 1) / 2;

        // Expanding ring
        ctx.strokeStyle = `${s.color}${Math.floor(pulse * 100).toString(16).padStart(2, "0")}`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.maxRadius * pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Core dot
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw sweep wavefront
      if (isSweeping) {
        ctx.strokeStyle = "#6366F1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sweepX, 0);
        ctx.lineTo(sweepX, height);
        ctx.stroke();

        // Glow trail behind sweep
        const sweepGrad = ctx.createLinearGradient(sweepX - 80, 0, sweepX, 0);
        sweepGrad.addColorStop(0, "rgba(99, 102, 241, 0)");
        sweepGrad.addColorStop(1, "rgba(99, 102, 241, 0.15)");
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(sweepX - 80, 0, 80, height);
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render(performance.now());

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section id="problem" className="relative w-full bg-[#0A0A0A] py-24 md:py-36 px-6 md:px-12 hairline-b">
      <div className="max-w-[1440px] mx-auto">
        {/* Eyebrow Header with extending hairline */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#EF4444]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA]">
              01 · THE PROBLEM
            </span>
          </div>
          <div className="h-[1px] w-full bg-white/10" />
        </div>

        {/* Section Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Storytelling Content */}
          <div className="lg:col-span-6 flex flex-col">
            <h2 className="font-display font-light text-white tracking-[-0.045em] text-[clamp(2.5rem,6vw,5.2rem)] leading-[0.92] mb-8">
              SMALL PROBLEMS <br />
              BECOME CITY-SCALE <br />
              <span className="text-[#EF4444]">PROBLEMS.</span>
            </h2>

            <p className="text-[#A1A1AA] text-base md:text-lg leading-[1.7] max-w-lg mb-6">
              Citizens see broken infrastructure every day. The problem is not only reporting it. The problem is connecting that report to the right authority, priority and action.
            </p>

            <div className="space-y-4 max-w-lg pt-4 hairline-t">
              <div className="flex items-start gap-4">
                <span className="font-mono text-[11px] text-[#EF4444] pt-0.5">01</span>
                <div>
                  <h4 className="text-white text-sm font-medium">Uncoordinated Fragmentation</h4>
                  <p className="text-xs text-[#71717A] leading-relaxed mt-1">
                    Reports scatter across WhatsApp lines, municipal call centers, and paper registers with zero deduplication.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="font-mono text-[11px] text-[#F59E0B] pt-0.5">02</span>
                <div>
                  <h4 className="text-white text-sm font-medium">Flat Priority Illusion</h4>
                  <p className="text-xs text-[#71717A] leading-relaxed mt-1">
                    A fallen live electrical wire sits in the same unprioritized FIFO queue as a dim garden bollard.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="font-mono text-[11px] text-[#6366F1] pt-0.5">03</span>
                <div>
                  <h4 className="text-white text-sm font-medium">Jurisdictional Deadlocks</h4>
                  <p className="text-xs text-[#71717A] leading-relaxed mt-1">
                    Officers cannot triage complaints outside their designated postal pincode, causing week-long delays.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Procedural Signal Overload Canvas */}
          <div className="lg:col-span-6 flex flex-col">
            <div
              ref={containerRef}
              className="relative w-full h-[420px] md:h-[480px] bg-[#080808] hairline overflow-hidden flex flex-col justify-between p-4"
            >
              <canvas ref={canvasRef} className="absolute inset-0 block" />

              {/* Canvas Overlay Header */}
              <div className="relative z-10 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-none bg-[#EF4444] animate-ping" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white">
                    UNFILTERED SIGNAL ACCUMULATION
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#EF4444] border border-[#EF4444]/30 px-2 py-0.5 bg-[#EF4444]/5">
                  OVERLOAD THRESHOLD: {activeSignalCount}/50
                </span>
              </div>

              {/* Canvas Overlay Footer */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-[#71717A] pointer-events-none hairline-t pt-2 bg-[#080808]/70 backdrop-blur-sm">
                <span>SIMULATED SECTOR: PUNE_411</span>
                <span>AUTOMATIC AI DISPATCH: READY</span>
              </div>
            </div>

            <span className="font-mono text-[11px] text-[#71717A] uppercase tracking-[0.1em] mt-3 block text-right">
              PROCEDURAL SIGNAL OVERLOAD & AUTOMATED TRIAGE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
