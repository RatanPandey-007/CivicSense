import { useEffect, useState, useRef } from "react";
import { Users, FileCheck, Building2, IndianRupee } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function formatNumber(num: number): string {
  if (num >= 10000000) return (num / 10000000).toFixed(0) + " Cr";
  if (num >= 100000) return (num / 100000).toFixed(0) + " L";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K";
  return num.toString();
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, isVisible]);

  return (
    <div ref={ref} className="stat-number">
      {formatNumber(count)}
      {suffix}
    </div>
  );
}

export function ImpactStats() {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Users,
      value: 10000000,
      suffix: "+",
      label: t("impact.stat1.label"),
      description: t("impact.stat1.desc"),
    },
    {
      icon: FileCheck,
      value: 1000000,
      suffix: "+",
      label: t("impact.stat2.label"),
      description: t("impact.stat2.desc"),
    },
    {
      icon: Building2,
      value: 100,
      suffix: "+",
      label: t("impact.stat3.label"),
      description: t("impact.stat3.desc"),
    },
    {
      icon: IndianRupee,
      value: 500,
      suffix: " Cr+",
      label: t("impact.stat4.label"),
      description: t("impact.stat4.desc"),
    },
  ];

  return (
    <section className="border-y border-border/30">
      <div className="container-custom section-padding">
        <div className="text-center mb-12">
          <span className="badge-secondary mb-4 inline-block">
            {t("impact.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("impact.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("impact.desc")}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="card-elevated p-6 md:p-8 text-center group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="font-semibold text-foreground mt-2">{stat.label}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
