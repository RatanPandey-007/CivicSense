import { Link } from "react-router-dom";

export function FinalCtaSection() {
  return (
    <section className="relative w-full bg-[#080808] py-36 md:py-48 px-6 md:px-12 overflow-hidden hairline-b">
      {/* Generated Ambient City Light Effect behind statement */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[350px] bg-[#6366F1]/10 rounded-full blur-[140px] transform -translate-y-12" />
        <div className="w-[300px] h-[200px] bg-[#818CF8]/15 rounded-full blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#818CF8] mb-6 block">
          THE CIVIC HORIZON
        </span>

        <h2 className="font-display font-light text-white tracking-[-0.045em] text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.92] mb-8 select-none">
          A BETTER CITY <br />
          STARTS WITH <br />
          <span className="text-[#818CF8]">BETTER SIGNALS.</span>
        </h2>

        <p className="font-mono text-sm md:text-base text-[#A1A1AA] tracking-[0.18em] uppercase mb-12">
          Report. Understand. Act.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#report"
            className="px-8 py-4 bg-white text-[#080808] font-mono text-[11px] uppercase tracking-[0.16em] font-medium hover:bg-[#818CF8] hover:text-white transition-all"
          >
            REPORT AN ISSUE
          </a>
          <Link
            to="/about"
            className="px-8 py-4 border border-white/20 text-white font-mono text-[11px] uppercase tracking-[0.16em] hover:border-[#6366F1] hover:text-[#818CF8] transition-all bg-white/[0.02]"
          >
            EXPLORE CIVICSENSE
          </Link>
        </div>
      </div>
    </section>
  );
}
