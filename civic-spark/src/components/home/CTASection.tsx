import { Link } from "react-router-dom";
import { ArrowRight, Smartphone, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden border-t border-border/30">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-glow/5 rounded-full blur-[100px]" />
      </div>

      <div className="container-custom relative">
        <div className="section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {t("cta.title1")}{" "}
                <span className="text-primary">{t("cta.title2")}</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg">
                {t("cta.subtitle")}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="btn-gradient group">
                  <Smartphone className="mr-2 w-5 h-5" />
                  {t("cta.btn.download")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/5 hover:border-primary/50 rounded-xl"
                  asChild
                >
                  <Link to="/volunteer">
                    {t("cta.btn.hero")}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* App Store Badges */}
              <div className="flex gap-4 pt-4">
                <div className="h-10 px-4 bg-muted/50 border border-border/50 rounded-xl flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t("cta.app.avail")}
                  </span>
                  <span className="font-semibold text-foreground">
                    Google Play
                  </span>
                </div>
                <div className="h-10 px-4 bg-muted/50 border border-border/50 rounded-xl flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t("cta.app.down")}
                  </span>
                  <span className="font-semibold text-foreground">
                    App Store
                  </span>
                </div>
              </div>
            </div>

            {/* Achievement Card */}
            <div className="relative">
              <div className="card-elevated p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Award className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {t("cta.card.title")}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {t("cta.card.subtitle")}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { action: t("cta.card.item1"), points: "+100 pts" },
                    { action: t("cta.card.item2"), points: "+500 pts" },
                    { action: t("cta.card.item3"), points: "+1000 pts" },
                  ].map((item) => (
                    <div
                      key={item.action}
                      className="flex items-center justify-between p-3 bg-muted/30 border border-border/30 rounded-xl"
                    >
                      <span className="font-medium text-foreground text-sm">
                        {item.action}
                      </span>
                      <span className="badge-primary text-xs">
                        {item.points}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border/30">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">
                      {t("cta.card.score")}
                    </span>
                    <span className="stat-number text-3xl">0</span>
                  </div>
                  <Button
                    className="w-full border-primary/30 hover:bg-primary/5 hover:border-primary/50 rounded-xl"
                    variant="outline"
                    asChild
                  >
                    <Link to="/get-started">{t("cta.card.btn")}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
