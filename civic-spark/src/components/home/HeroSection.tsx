import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, MapPin, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabaseClient";

export function HeroSection() {
  const { t } = useLanguage();
  const [resolutionRate, setResolutionRate] = useState<number>(0);

  useEffect(() => {
    async function fetchResolutionRate() {
      try {
        const { data, error } = await supabase.from("issues").select("status");
        if (error || !data || data.length === 0) {
          return;
        }

        const resolvedCount = data.filter(
          (issue) => issue.status === "resolved",
        ).length;
        const rate = Math.round((resolvedCount / data.length) * 100);
        setResolutionRate(rate);
      } catch (err) {
        console.error("Failed to fetch resolution rate:", err);
      }
    }

    fetchResolutionRate();
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-primary-glow/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container-custom relative">
        <div className="section-padding">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-8 animate-fade-up">
              <div>
                <span className="badge-primary mb-6 inline-flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  Civic Sense Development Initiative
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                  {t("hero.title1")}{" "}
                  <span className="text-primary glow-text">
                    {t("hero.title2")}
                  </span>
                </h1>
              </div>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                {t("hero.subtitle")}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 py-2">
                {[
                  { icon: Users, label: "130+ Cr Citizens" },
                  { icon: MapPin, label: "800+ Cities" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2 text-sm"
                  >
                    <stat.icon className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="btn-gradient group" asChild>
                  <Link to="/report-issue">
                    {t("hero.cta.report")}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/5 hover:border-primary/50 text-foreground rounded-xl"
                  asChild
                >
                  <Link to="/about">{t("hero.cta.learn")}</Link>
                </Button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative animate-fade-up delay-200">
              <div className="relative rounded-2xl overflow-hidden glass-panel">
                <img
                  src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&h=600&fit=crop"
                  alt="Citizens collaborating for civic improvement"
                  className="w-full h-auto object-cover aspect-[4/3] opacity-80"
                />
                {/* Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 glass-panel p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Issue Resolved!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -top-4 -right-4 glass-panel p-4 hidden md:block animate-pulse-glow">
                <div className="text-center">
                  <p className="stat-number text-3xl">{resolutionRate}%</p>
                  <p className="text-sm text-muted-foreground">
                    Resolution Rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
