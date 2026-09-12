import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Impact", href: "/impact" },
  { name: "Track Issues", href: "/track" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-border/30">
      <nav className="container-custom flex items-center justify-between py-4 px-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <span className="text-primary font-bold text-lg">FIN</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg text-foreground">FIX IT</span>
            <span className="text-primary font-semibold ml-1">NOW</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navigation.map((item) => {
            const translationKey = `nav.${item.name.toLowerCase()}`;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors link-underline ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(translationKey)}
              </Link>
            );
          })}
        </div>

        {/* CTA Buttons + Toggles */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link to="/volunteer">{t("nav.volunteer")}</Link>
          </Button>
          <Button size="sm" className="btn-gradient text-sm" asChild>
            <Link to="/report-issue">{t("nav.reportIssue")}</Link>
          </Button>
          <button
            className="relative w-10 h-10 rounded-xl border border-border bg-muted/50 flex items-center justify-center hover:bg-muted hover:border-primary/30 transition-all duration-200 group"
            onClick={toggleLanguage}
            title={
              language === "en" ? "Switch to Hindi" : "अंग्रेज़ी में बदलें"
            }
          >
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {language === "en" ? "HI" : "EN"}
            </span>
          </button>
          <ThemeToggle />
        </div>

        {/* Mobile: Toggles + Menu Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            className="relative w-10 h-10 rounded-xl border border-border bg-muted/50 flex items-center justify-center hover:bg-muted hover:border-primary/30 transition-all duration-200 group"
            onClick={toggleLanguage}
            title={
              language === "en" ? "Switch to Hindi" : "अंग्रेज़ी में बदलें"
            }
          >
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {language === "en" ? "HI" : "EN"}
            </span>
          </button>
          <ThemeToggle />
          <button
            className="p-2 rounded-xl hover:bg-muted border border-border/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-nav border-b border-border/30 animate-fade-in">
          <div className="container-custom py-4 px-4 space-y-3">
            {navigation.map((item) => {
              const translationKey = `nav.${item.name.toLowerCase()}`;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block py-2.5 px-3 rounded-lg text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(translationKey)}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-border/30 space-y-3">
              <Button
                variant="outline"
                className="w-full border-border"
                asChild
              >
                <Link to="/volunteer" onClick={() => setMobileMenuOpen(false)}>
                  {t("nav.volunteer")}
                </Link>
              </Button>
              <Button className="w-full btn-gradient" asChild>
                <Link
                  to="/report-issue"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("nav.reportIssue")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
