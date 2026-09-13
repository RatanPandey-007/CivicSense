import { useState } from "react";

export function MunicipalActionSection() {
  const [activeWorkflowStage, setActiveWorkflowStage] = useState(2);

  const stages = [
    {
      step: "01",
      title: "CITIZEN",
      role: "INCIDENT REPORT",
      detail: "Geocoded complaint captured with photographic evidence & voice transcript.",
      status: "LOGGED",
    },
    {
      step: "02",
      title: "AI ENGINE",
      role: "TRIAGE & PRIORITY",
      detail: "NLP vectorization calculates urgency rating and checks for emergency life hazards.",
      status: "CLASSIFIED",
    },
    {
      step: "03",
      title: "JURISDICTION",
      role: "POSTAL CODE FILTER",
      detail: "Backend queries strictly match report pincode against municipal officer assignment matrix.",
      status: "ROUTED",
    },
    {
      step: "04",
      title: "MUNICIPAL OFFICER",
      role: "FIELD DISPATCH",
      detail: "Local engineering team accepts ticket on the Admin Dashboard and deploys repair crew.",
      status: "DISPATCHED",
    },
    {
      step: "05",
      title: "RESOLUTION",
      role: "AUDITED COMPLETION",
      detail: "Resolution proof image uploaded, status updated to RESOLVED, citizen notified via SMS.",
      status: "RESOLVED",
    },
  ];

  return (
    <section id="workflow" className="relative w-full bg-[#080808] py-24 md:py-36 px-6 md:px-12 hairline-b">
      <div className="max-w-[1440px] mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#22C55E]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA]">
              06 · MUNICIPAL ACTION
            </span>
          </div>
          <div className="h-[1px] w-full bg-white/10" />
        </div>

        {/* Section Headline */}
        <div className="mb-16">
          <h2 className="font-display font-light text-white tracking-[-0.045em] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] mb-6">
            REPORTING IS ONLY <br />
            <span className="text-[#818CF8]">THE FIRST STEP.</span>
          </h2>
          <p className="text-[#A1A1AA] text-base md:text-lg max-w-2xl leading-relaxed">
            The platform enforces strict district-level access control. Municipal officers log in with postal jurisdiction credentials, triaging only what lies within their operational boundaries.
          </p>
        </div>

        {/* 5-Step Workflow Pipeline Horizontal Track */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-white/10 hairline mb-12">
          {stages.map((st, idx) => {
            const isActive = activeWorkflowStage === idx;
            const isPassed = activeWorkflowStage > idx;

            return (
              <div
                key={st.step}
                onClick={() => setActiveWorkflowStage(idx)}
                className={`p-6 bg-[#080808] flex flex-col justify-between cursor-pointer transition-all ${
                  isActive
                    ? "bg-[#101014] border-t-2 border-[#6366F1]"
                    : isPassed
                    ? "border-t-2 border-[#22C55E]/60 hover:bg-[#0A0A0A]"
                    : "hover:bg-[#0A0A0A]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#71717A] mb-4">
                    <span>STAGE {st.step}</span>
                    <span
                      className={
                        isActive
                          ? "text-[#818CF8]"
                          : isPassed
                          ? "text-[#22C55E]"
                          : "text-[#71717A]"
                      }
                    >
                      {st.status}
                    </span>
                  </div>

                  <h3 className="font-mono text-[13px] text-white uppercase tracking-wider mb-1">
                    {st.title}
                  </h3>
                  <span className="font-mono text-[10px] text-[#818CF8] block mb-3">
                    {st.role}
                  </span>

                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    {st.detail}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between font-mono text-[10px] text-[#71717A] hairline-t pt-3">
                  <span>TRANSIT</span>
                  <span>{isActive ? "ACTIVE STAGE" : "STANDBY"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Status Lifecycle State Matrix */}
        <div className="bg-[#0A0A0A] hairline p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 hairline-b pb-4 mb-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white">
              AUDITED STATUS TRANSITION LIFECYCLE
            </span>
            <span className="font-mono text-[10px] text-[#71717A]">
              RESTful ENUM: `public.issues.status`
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Open */}
            <div className="p-4 bg-[#080808] hairline border-l-2 border-l-[#38BDF8]">
              <span className="font-mono text-[10px] uppercase text-[#38BDF8] block mb-1">
                STATE 01
              </span>
              <h4 className="font-mono text-sm text-white font-medium mb-1">OPEN</h4>
              <p className="text-xs text-[#71717A]">
                Ingested, geolocated, prioritized by AI. Waiting for municipal engineer pickup.
              </p>
            </div>

            {/* In Progress */}
            <div className="p-4 bg-[#080808] hairline border-l-2 border-l-[#F59E0B]">
              <span className="font-mono text-[10px] uppercase text-[#F59E0B] block mb-1">
                STATE 02
              </span>
              <h4 className="font-mono text-sm text-white font-medium mb-1">IN PROGRESS</h4>
              <p className="text-xs text-[#71717A]">
                Accepted by authorized municipal officer. Repair crew dispatched on site.
              </p>
            </div>

            {/* Resolved */}
            <div className="p-4 bg-[#080808] hairline border-l-2 border-l-[#22C55E]">
              <span className="font-mono text-[10px] uppercase text-[#22C55E] block mb-1">
                STATE 03
              </span>
              <h4 className="font-mono text-sm text-white font-medium mb-1">RESOLVED</h4>
              <p className="text-xs text-[#71717A]">
                Repairs completed. Photographic resolution evidence recorded and citizen notified.
              </p>
            </div>

            {/* Rejected */}
            <div className="p-4 bg-[#080808] hairline border-l-2 border-l-[#EF4444]">
              <span className="font-mono text-[10px] uppercase text-[#EF4444] block mb-1">
                STATE 04
              </span>
              <h4 className="font-mono text-sm text-white font-medium mb-1">REJECTED</h4>
              <p className="text-xs text-[#71717A]">
                Duplicate complaint or outside municipal jurisdiction with formal justification logged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
