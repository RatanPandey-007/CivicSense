import { useState, useEffect } from "react";

interface IntroSequenceProps {
  onComplete?: () => void;
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [stage, setStage] = useState<"init" | "fade-in" | "lifting" | "fade-out" | "done">("init");

  useEffect(() => {
    // Completely omit intro if prefers-reduced-motion is active
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasSeenIntro = sessionStorage.getItem("civicsense_intro_shown");

    if (prefersReducedMotion || hasSeenIntro) {
      setStage("done");
      onComplete?.();
      return;
    }

    // 0ms: Black
    // 220ms: Text fades in from 14px below
    const timer1 = setTimeout(() => {
      setStage("fade-in");
    }, 220);

    // 1500ms: Text begins lifting
    const timer2 = setTimeout(() => {
      setStage("lifting");
    }, 1500);

    // 2050ms: Intro fades away
    const timer3 = setTimeout(() => {
      setStage("fade-out");
    }, 2050);

    // 2400ms: Finish & unmount
    const timer4 = setTimeout(() => {
      sessionStorage.setItem("civicsense_intro_shown", "true");
      setStage("done");
      onComplete?.();
    }, 2450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  if (stage === "done") return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] bg-[#080808] flex flex-col items-center justify-center pointer-events-none transition-opacity duration-400 ease-out ${
        stage === "fade-out" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`flex flex-col items-center text-center px-4 transition-all duration-700 ease-out ${
          stage === "init"
            ? "opacity-0 translate-y-[14px]"
            : stage === "fade-in"
            ? "opacity-100 translate-y-0"
            : stage === "lifting"
            ? "opacity-85 -translate-y-[14px]"
            : "opacity-0 -translate-y-[24px]"
        }`}
      >
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-light tracking-[-0.04em] uppercase font-sans select-none">
          CIVIC SENSE
        </h1>
        <div className="h-[1px] w-12 bg-white/20 my-4" />
        <p className="font-mono text-[11px] sm:text-[12px] tracking-[0.2em] text-[#A1A1AA] uppercase select-none">
          INTELLIGENCE FOR THE CITY.
        </p>
      </div>
    </div>
  );
}
