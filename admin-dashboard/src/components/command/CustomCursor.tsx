import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [dotPos, setDotPos] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [onLink, setOnLink] = useState(false);

  useEffect(() => {
    // Only show on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let rafId: number;
    let currentX = -100;
    let currentY = -100;
    let targetX = -100;
    let targetY = -100;

    const moveMouse = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setDotPos({ x: e.clientX, y: e.clientY });
    };

    const updateRing = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      setPos({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(updateRing);
    };

    const mouseDown = () => setClicking(true);
    const mouseUp = () => setClicking(false);

    const checkLink = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setOnLink(
        !!(
          el.closest("a") ||
          el.closest("button") ||
          el.closest("[role='button']") ||
          el.closest("select") ||
          el.closest("input") ||
          el.closest("textarea")
        )
      );
    };

    document.addEventListener("mousemove", moveMouse);
    document.addEventListener("mousemove", checkLink);
    document.addEventListener("mousedown", mouseDown);
    document.addEventListener("mouseup", mouseUp);
    rafId = requestAnimationFrame(updateRing);

    // Hide default cursor
    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", moveMouse);
      document.removeEventListener("mousemove", checkLink);
      document.removeEventListener("mousedown", mouseDown);
      document.removeEventListener("mouseup", mouseUp);
      cancelAnimationFrame(rafId);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      {/* Ring (lagging) */}
      <div
        className="pointer-events-none fixed z-[9999] rounded-full border transition-[width,height,opacity] duration-150"
        style={{
          left: pos.x,
          top: pos.y,
          width: onLink ? 40 : clicking ? 20 : 28,
          height: onLink ? 40 : clicking ? 20 : 28,
          transform: "translate(-50%, -50%)",
          borderColor: onLink
            ? "rgba(99,102,241,0.6)"
            : "rgba(255,255,255,0.25)",
          backgroundColor: onLink ? "rgba(99,102,241,0.08)" : "transparent",
        }}
      />
      {/* Dot (immediate) */}
      <div
        className="pointer-events-none fixed z-[9999] rounded-full bg-white transition-[width,height] duration-100"
        style={{
          left: dotPos.x,
          top: dotPos.y,
          width: clicking ? 3 : 4,
          height: clicking ? 3 : 4,
          transform: "translate(-50%, -50%)",
          opacity: 0.9,
        }}
      />
    </>
  );
}
