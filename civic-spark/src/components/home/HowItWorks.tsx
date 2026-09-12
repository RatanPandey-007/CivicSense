import { Smartphone, Send, Clock, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Smartphone,
      step: "01",
      title: t("how.step1.title"),
      description: t("how.step1.desc"),
    },
    {
      icon: Send,
      step: "02",
      title: t("how.step2.title"),
      description: t("how.step2.desc"),
    },
    {
      icon: Clock,
      step: "03",
      title: t("how.step3.title"),
      description: t("how.step3.desc"),
    },
    {
      icon: CheckCircle,
      step: "04",
      title: t("how.step4.title"),
      description: t("how.step4.desc"),
    },
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="badge-secondary mb-4 inline-block">
            {t("how.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("how.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("how.subtitle")}
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-px bg-border">
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/30"
              style={{ width: "75%" }}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="relative text-center animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-card border-2 border-primary/20 flex items-center justify-center mx-auto shadow-md group-hover:shadow-glow transition-shadow">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-glow-sm">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
