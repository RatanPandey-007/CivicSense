import { AlertTriangle, Eye, Target, Cpu } from "lucide-react";

const problems = [
  "Citizens report problems but rarely see results → loss of trust.",
  "Municipal authorities receive noisy, duplicate or false complaints.",
  "Corporates (CSR) lack verified partners and measurable impact channels.",
  "No single system to measure civic behaviour or track city health.",
];

const goals = [
  "Empower 10M verified citizens in 3 years",
  "Onboard 100+ cities with >70% issue resolution",
  "Channel ₹500+ crores CSR into verifiable projects",
  "5M MAU target by Year 2, 99.5% uptime",
];

export function ExecutiveSummary() {
  return (
    <section className="section-padding border-t border-border/30">
      <div className="container-custom">
        {/* Executive Summary */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="badge-secondary mb-4 inline-block">
            Executive Summary
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Civic Sense Development Initiative
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            India's cities suffer from persistent civic problems — garbage,
            potholes, broken streetlights, traffic violations — and current
            reporting systems are fragmented and slow. Civic India is a
            citizen-driven platform that combines mobile/web reporting,
            volunteer verification, municipal dashboards and targeted AI to turn
            civic responsibility into measurable action and rewarded behavior.
          </p>
        </div>

        {/* Problem & Vision Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* The Problem */}
          <div className="card-elevated p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-xl font-bold text-foreground">The Problem</h3>
            </div>
            <ul className="space-y-4">
              {problems.map((problem, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <span className="w-6 h-6 rounded-lg bg-destructive/10 text-destructive text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground border-t border-border/30 pt-4">
              <strong className="text-foreground">Impact:</strong> Poor
              sanitation → health risks; infrastructure failure → safety &
              economic loss.
            </p>
          </div>

          {/* Vision & Goals */}
          <div className="card-elevated p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Vision & Goals
              </h3>
            </div>
            <ul className="space-y-4">
              {goals.map((goal, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground border-t border-border/30 pt-4">
              <strong className="text-foreground">Product in one line:</strong>{" "}
              Report → AI Verify → Volunteer Verify → Municipal Action → Resolve
              → Reward.
            </p>
          </div>
        </div>

        {/* AI & Tech Strip */}
        <div className="mt-12 glass-panel p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              AI-Powered Intelligence
            </h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "AI determines the urgency level of reported issues",
              "Automatically prioritizes critical problems for immediate action",
              "Routes high-priority cases to authorities instantly",
              "Ensures life-threatening or severe issues are solved first",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="text-primary mt-0.5">▸</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
