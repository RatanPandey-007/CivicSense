import { useRef, useEffect } from "react";

export function CityGridCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationFrameId: number;
    let isVisible = true;
    let width = 0;
    let height = 0;

    // Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    // Scroll depth tracking
    let scrollProgress = 0;

    // Grid nodes & pulses
    const GRID_SIZE = 24;
    const PULSE_COUNT = 18;
    interface Pulse {
      track: number; // which horizontal or vertical street
      pos: number; // 0 to 1
      speed: number;
      isVertical: boolean;
      color: string;
    }

    const pulses: Pulse[] = Array.from({ length: PULSE_COUNT }, (_, i) => ({
      track: Math.floor(Math.random() * GRID_SIZE),
      pos: Math.random(),
      speed: 0.0015 + Math.random() * 0.003,
      isVertical: i % 2 === 0,
      color: i % 5 === 0 ? "#EF4444" : i % 3 === 0 ? "#818CF8" : "#6366F1",
    }));

    // Critical and high sensor signals
    interface SensorNode {
      gx: number;
      gy: number;
      status: "critical" | "high" | "open" | "resolved";
      pulseOffset: number;
    }
    const nodes: SensorNode[] = [
      { gx: 7, gy: 9, status: "critical", pulseOffset: 0 },
      { gx: 16, gy: 14, status: "high", pulseOffset: 1.2 },
      { gx: 12, gy: 6, status: "open", pulseOffset: 2.5 },
      { gx: 19, gy: 18, status: "resolved", pulseOffset: 3.1 },
      { gx: 4, gy: 15, status: "open", pulseOffset: 4.0 },
      { gx: 14, gy: 11, status: "high", pulseOffset: 0.8 },
    ];

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

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 40;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 40;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const onScroll = () => {
      scrollProgress = Math.min(window.scrollY / window.innerHeight, 1.5);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Viewport intersection observer to pause rendering off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !prefersReducedMotion) {
          lastTime = performance.now();
          render(lastTime);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let lastTime = performance.now();
    let tick = 0;

    const render = (currentTime: number) => {
      if (!isVisible) return;

      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      tick += dt;

      // Mouse smoothing
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Clear with deep black
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, width, height);

      // Camera parameters
      const fov = 380;
      const camY = 160 + mouseY * 0.8;
      const camZ = -220 - scrollProgress * 180;
      const centerX = width * 0.5 + mouseX;
      const centerY = height * 0.48;

      const project = (x: number, y: number, z: number) => {
        const relZ = z - camZ;
        if (relZ <= 10) return null;
        const scale = fov / relZ;
        return {
          px: centerX + x * scale,
          py: centerY + (y - camY) * scale,
          scale,
        };
      };

      // Draw Perspective Grid Streets
      const SPACING = 42;
      const halfGrid = (GRID_SIZE * SPACING) / 2;

      ctx.lineWidth = 1;

      // North-South streets
      for (let i = 0; i <= GRID_SIZE; i++) {
        const worldX = i * SPACING - halfGrid;
        const p1 = project(worldX, 0, -halfGrid);
        const p2 = project(worldX, 0, halfGrid);

        if (p1 && p2) {
          const alpha = i % 4 === 0 ? 0.16 : 0.05;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();
        }
      }

      // East-West streets
      for (let j = 0; j <= GRID_SIZE; j++) {
        const worldZ = j * SPACING - halfGrid;
        const p1 = project(-halfGrid, 0, worldZ);
        const p2 = project(halfGrid, 0, worldZ);

        if (p1 && p2) {
          const depthRatio = Math.max(0, 1 - (worldZ + halfGrid) / (halfGrid * 2));
          const alpha = (j % 4 === 0 ? 0.18 : 0.06) * depthRatio;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();
        }
      }

      // Procedural pulses running along streets
      pulses.forEach((p) => {
        if (!prefersReducedMotion) {
          p.pos += p.speed;
          if (p.pos > 1) p.pos = 0;
        }

        const currentPos = p.pos * (halfGrid * 2) - halfGrid;
        let pStart, pEnd;

        if (p.isVertical) {
          const fixedX = p.track * SPACING - halfGrid;
          pStart = project(fixedX, 0, currentPos);
          pEnd = project(fixedX, 0, currentPos + 30);
        } else {
          const fixedZ = p.track * SPACING - halfGrid;
          pStart = project(currentPos, 0, fixedZ);
          pEnd = project(currentPos + 30, 0, fixedZ);
        }

        if (pStart && pEnd) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.max(1, pStart.scale * 1.5);
          ctx.beginPath();
          ctx.moveTo(pStart.px, pStart.py);
          ctx.lineTo(pEnd.px, pEnd.py);
          ctx.stroke();
        }
      });

      // Municipal / Report Sensor Nodes
      nodes.forEach((node) => {
        const worldX = node.gx * SPACING - halfGrid;
        const worldZ = node.gy * SPACING - halfGrid;
        const p = project(worldX, 0, worldZ);

        if (p) {
          const pulse = prefersReducedMotion
            ? 1
            : (Math.sin(tick * 3 + node.pulseOffset) + 1) / 2;
          const color =
            node.status === "critical"
              ? "#EF4444"
              : node.status === "high"
              ? "#F59E0B"
              : node.status === "resolved"
              ? "#22C55E"
              : "#6366F1";

          // Vertical indicator pin
          const pinTop = project(worldX, -28, worldZ);
          if (pinTop) {
            ctx.strokeStyle = `${color}66`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.px, p.py);
            ctx.lineTo(pinTop.px, pinTop.py);
            ctx.stroke();

            // Head beacon
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(pinTop.px, pinTop.py, Math.max(1.8, 2.5 * p.scale), 0, Math.PI * 2);
            ctx.fill();
          }

          // Ground ripple
          ctx.strokeStyle = `${color}${Math.floor(pulse * 120).toString(16).padStart(2, "0")}`;
          ctx.beginPath();
          ctx.ellipse(p.px, p.py, (6 + pulse * 12) * p.scale, (3 + pulse * 6) * p.scale, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Subtle atmospheric edge vignette
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        height * 0.2,
        width * 0.5,
        height * 0.5,
        width * 0.7
      );
      grad.addColorStop(0, "rgba(8, 8, 8, 0)");
      grad.addColorStop(0.7, "rgba(8, 8, 8, 0.45)");
      grad.addColorStop(1, "rgba(8, 8, 8, 0.95)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Initial render
    render(performance.now());

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
