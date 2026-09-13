import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<"default" | "hover" | "interact" | "view" | "open">("default");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest("canvas")) {
        setCursorType("interact");
      } else if (target.closest("img")) {
        setCursorType("view");
      } else if (target.closest("header a, nav a")) {
        setCursorType("open");
      } else if (target.closest("button, a, input, textarea, select, details, [role='button']")) {
        setCursorType("hover");
      } else {
        setCursorType("default");
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out select-none hidden md:block"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      {cursorType === "default" && (
        <div className="w-2 h-2 rounded-full bg-white/80 ring-1 ring-white/30" />
      )}

      {cursorType === "hover" && (
        <div className="w-8 h-8 rounded-full border border-[#818CF8] bg-[#6366F1]/10 -translate-x-3 -translate-y-3 transition-all duration-150" />
      )}

      {cursorType === "interact" && (
        <div className="px-2 py-1 bg-[#6366F1] text-white font-mono text-[9px] uppercase tracking-widest border border-white/20 -translate-x-1/2 -translate-y-1/2 shadow-lg">
          INTERACT
        </div>
      )}

      {cursorType === "view" && (
        <div className="px-2 py-1 bg-white text-[#080808] font-mono text-[9px] uppercase tracking-widest -translate-x-1/2 -translate-y-1/2 shadow-lg font-medium">
          VIEW
        </div>
      )}

      {cursorType === "open" && (
        <div className="px-2 py-1 bg-[#0A0A0A] border border-[#818CF8] text-[#818CF8] font-mono text-[9px] uppercase tracking-widest -translate-x-1/2 -translate-y-1/2 shadow-lg">
          OPEN
        </div>
      )}
    </div>
  );
}
