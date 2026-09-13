export function FaqSection() {
  const faqs = [
    {
      q: "How does CivicSense classify issues?",
      a: "When a citizen inputs a complaint description or records voice audio, the text is dispatched to the Python machine learning microservice. It tokenizes the sentence, strips stop words, calculates TF-IDF term weights, and maps the incident to standard municipal operational categories (Waste, Road Infrastructure, Public Lighting, Water Supply, Drainage, or Traffic).",
    },
    {
      q: "How does the AI determine priority?",
      a: "The Scikit-Learn classification model outputs probability distributions across Low, Medium, High, and Critical tiers. Crucially, a hardcoded rule-based heuristic scans for life-threatening emergency terms (such as live electrical wires, gas explosions, bridge collapses, or active fires) and instantly escalates them to Critical regardless of statistical weight.",
    },
    {
      q: "How are reports assigned to municipalities?",
      a: "The Node.js backend extracts the reported postal pincode from the geolocation data. Municipal administrative officers are provisioned with specific district pincodes. The database queries automatically filter issues, ensuring officers only receive actionable tickets situated within their legal territory.",
    },
    {
      q: "Can citizens report anonymously?",
      a: "Yes. If an unregistered citizen does not wish to authenticate via Supabase Auth or phone OTP, the platform assigns the grievance to a designated anonymous citizen proxy ID. The incident remains publicly visible on the city radar and is still routed to municipal engineers.",
    },
    {
      q: "How does issue tracking work?",
      a: "Citizens authenticate with their phone number and receive an SMS OTP. The platform retrieves all complaints linked to that number, displaying a chronological 5-stage timeline from initial intake and AI triage to field dispatch and audited completion.",
    },
    {
      q: "What happens to critical reports?",
      a: "Critical reports bypass conventional queues. They are highlighted with high-frequency strobe beacons on the administrative radar and dispatch urgent automated notifications to ward supervisors for emergency on-site intervention.",
    },
  ];

  return (
    <section id="faq" className="relative w-full bg-[#0A0A0A] py-24 md:py-36 px-6 md:px-12 hairline-b">
      <div className="max-w-[1440px] mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#6366F1]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA]">
              11 · FREQUENTLY ANSWERED QUESTIONS
            </span>
          </div>
          <div className="h-[1px] w-full bg-white/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <h2 className="font-display font-light text-white tracking-[-0.045em] text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.92] mb-6">
              SYSTEM <br />
              <span className="text-[#818CF8]">INTELLIGENCE</span> <br />
              DISCLOSURE.
            </h2>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              Technical transparency regarding data handling, algorithmic triage, and municipal jurisdiction routing.
            </p>
          </div>

          <div className="lg:col-span-8 divide-y divide-white/10 hairline-t hairline-b">
            {faqs.map((faq, idx) => (
              <details
                key={faq.q}
                className="cs-faq-item group py-6 transition-colors"
              >
                <summary className="cursor-pointer flex items-center justify-between text-white hover:text-[#818CF8] transition-colors select-none">
                  <div className="flex items-baseline gap-4 pr-6">
                    <span className="font-mono text-xs text-[#71717A]">
                      0{idx + 1}
                    </span>
                    <span className="text-base md:text-lg font-light tracking-tight">
                      {faq.q}
                    </span>
                  </div>
                  <span className="cs-faq-toggle text-[#71717A] group-hover:text-white font-mono text-lg shrink-0" />
                </summary>
                <div className="pt-4 pl-8 pr-6 text-sm text-[#A1A1AA] leading-relaxed font-sans">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
