export function SystemMetricsSection() {
  const metrics = [
    {
      num: "04",
      unit: "LEVELS",
      label: "AI PRIORITY ENGINE",
      desc: "Low, Medium, High, and Critical danger categories derived dynamically via TF-IDF machine learning.",
    },
    {
      num: "REAL",
      unit: "TIME",
      label: "ISSUE STATUS LIFECYCLE",
      desc: "Instant synchronization between citizen submissions, officer action, and resolution verification.",
    },
    {
      num: "GPS",
      unit: "ENABLED",
      label: "LOCATION PRECISION",
      desc: "Interactive Leaflet geospatial positioning matches coordinates directly to municipal postal pincodes.",
    },
    {
      num: "MULTI",
      unit: "LINGUAL",
      label: "CITIZEN ACCESS",
      desc: "Seamless Hindi and English language switching ensures universal accessibility across municipal regions.",
    },
  ];

  return (
    <section className="relative w-full bg-[#080808] py-20 px-6 md:px-12 hairline-b">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-center gap-6 mb-10">
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#6366F1]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA]">
              10 · SYSTEM SPECIFICATIONS
            </span>
          </div>
          <div className="h-[1px] w-full bg-white/10" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 hairline">
          {metrics.map((m) => (
            <div key={m.label} className="bg-[#0A0A0A] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline gap-2 mb-2 font-mono">
                  <span className="text-3xl md:text-4xl font-light text-[#818CF8] tracking-tight">
                    {m.num}
                  </span>
                  <span className="text-xs uppercase text-[#71717A] tracking-wider">
                    {m.unit}
                  </span>
                </div>
                <h4 className="font-mono text-xs uppercase text-white tracking-wider mb-2">
                  {m.label}
                </h4>
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed mt-4">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
