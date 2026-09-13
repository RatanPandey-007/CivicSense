import { useRef, useEffect } from "react";

function WaveformCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animId: number;
    let isVisible = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(([e]) => {
      isVisible = e.isIntersecting;
      if (isVisible && !prefersReducedMotion) render(performance.now());
    });
    observer.observe(canvas);

    let tick = 0;
    const render = (t: number) => {
      if (!isVisible) return;
      tick += 0.04;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "#6366F1";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin(x * 0.05 + tick) * 18 * Math.sin(x * 0.01);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      if (!prefersReducedMotion) animId = requestAnimationFrame(render);
    };
    render(performance.now());
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="w-full h-28 block" />;
}

function TokenBlocksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animId: number;
    let isVisible = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(([e]) => {
      isVisible = e.isIntersecting;
      if (isVisible && !prefersReducedMotion) render(performance.now());
    });
    observer.observe(canvas);

    let tick = 0;
    const render = () => {
      if (!isVisible) return;
      tick += 0.02;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, w, h);

      const cols = 8;
      const rows = 3;
      const bw = (w - 40) / cols;
      const bh = 14;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const active = Math.sin(tick + r * 1.2 + c * 0.8) > 0.1;
          ctx.fillStyle = active ? "#818CF8" : "rgba(255, 255, 255, 0.06)";
          ctx.fillRect(20 + c * bw, 20 + r * (bh + 8), bw - 4, bh);
        }
      }

      if (!prefersReducedMotion) animId = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="w-full h-28 block" />;
}

function DataLinesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animId: number;
    let isVisible = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(([e]) => {
      isVisible = e.isIntersecting;
      if (isVisible && !prefersReducedMotion) render();
    });
    observer.observe(canvas);

    let progress = [0, 0.25, 0.5, 0.75];
    const render = () => {
      if (!isVisible) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 4; i++) {
        const y = 20 + i * 20;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(w - 20, y);
        ctx.stroke();

        progress[i] = (progress[i] + 0.008) % 1;
        const px = 20 + progress[i] * (w - 40);
        ctx.fillStyle = i === 1 ? "#EF4444" : "#6366F1";
        ctx.fillRect(px - 10, y - 2, 20, 4);
      }

      if (!prefersReducedMotion) animId = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="w-full h-28 block" />;
}

function RadialSignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animId: number;
    let isVisible = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(([e]) => {
      isVisible = e.isIntersecting;
      if (isVisible && !prefersReducedMotion) render();
    });
    observer.observe(canvas);

    let radius = 2;
    const render = () => {
      if (!isVisible) return;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, w, h);

      radius = (radius + 0.4) % 36;
      ctx.strokeStyle = `rgba(99, 102, 241, ${1 - radius / 36})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#22C55E";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 3, 0, Math.PI * 2);
      ctx.fill();

      if (!prefersReducedMotion) animId = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="w-full h-28 block" />;
}

export function EngineGridSection() {
  const columns = [
    {
      index: "01",
      title: "REPORT",
      canvas: <WaveformCanvas />,
      desc: "Multimodal signal capture combines geotagged coordinates, forensic photo attachments, and speech-to-text voice recognition.",
    },
    {
      index: "02",
      title: "AI",
      canvas: <TokenBlocksCanvas />,
      desc: "Natural language tokens are vectorized via Scikit-Learn TF-IDF to predict urgency and trigger emergency heuristic safety overrides.",
    },
    {
      index: "03",
      title: "CITY",
      canvas: <DataLinesCanvas />,
      desc: "Metropolitan infrastructure geometry routes incidents strictly through designated ward pincodes for immediate territorial jurisdiction.",
    },
    {
      index: "04",
      title: "ACTION",
      canvas: <RadialSignalCanvas />,
      desc: "Authorized municipal officers update operational tickets in real time, transmitting transparent resolution proof to the citizen.",
    },
  ];

  return (
    <section id="engine" className="relative w-full bg-[#0A0A0A] py-24 md:py-36 px-6 md:px-12 hairline-b">
      <div className="max-w-[1440px] mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#6366F1]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA]">
              09 · ENGINE ARCHITECTURE
            </span>
          </div>
          <div className="h-[1px] w-full bg-white/10" />
        </div>

        {/* 4 Explicit Columns: Desktop 4, Tablet 2, Mobile 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 hairline">
          {columns.map((col) => (
            <div
              key={col.index}
              className="bg-[#080808] p-6 flex flex-col justify-between group hover:bg-[#101014] transition-colors"
            >
              <div>
                <div className="flex justify-between items-baseline mb-4">
                  <span className="font-mono text-xs text-[#71717A] tracking-wider">
                    {col.index}
                  </span>
                  <span className="font-mono text-[10px] text-[#818CF8] uppercase tracking-widest">
                    SYSTEM LAYER
                  </span>
                </div>

                <div className="mb-4 hairline bg-[#0A0A0A] overflow-hidden">
                  {col.canvas}
                </div>

                <h3 className="font-mono text-base text-white uppercase tracking-wider mb-2 group-hover:text-[#818CF8] transition-colors">
                  {col.title}
                </h3>
              </div>

              <div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed mb-6">
                  {col.desc}
                </p>
                <div className="h-[1px] w-6 bg-white/10 group-hover:w-full group-hover:bg-[#6366F1] transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
