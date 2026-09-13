import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const buildFooterLinks = (t: (key: string) => string) => ({
  [t("footer.group.about")]: [
    { name: t("footer.link.mission"), href: "/about#mission" },
    { name: t("footer.link.team"), href: "/about#team" },
    { name: t("footer.link.partners"), href: "/about#partners" },
    { name: t("footer.link.careers"), href: "/careers" },
  ],
  [t("footer.group.programs")]: [
    { name: t("footer.link.heroes"), href: "/programs/civic-heroes" },
    { name: t("footer.link.clean"), href: "/programs/clean-city" },
    { name: t("footer.link.traffic"), href: "/programs/traffic" },
    { name: t("footer.link.green"), href: "/programs/green-spaces" },
  ],
  [t("footer.group.resources")]: [
    { name: t("footer.link.blog"), href: "/blog" },
    { name: t("footer.link.impact"), href: "/impact" },
    { name: t("footer.link.media"), href: "/media" },
    { name: t("footer.link.faqs"), href: "/faq" },
  ],
  [t("footer.group.legal")]: [
    { name: t("footer.link.privacy"), href: "/privacy" },
    { name: t("footer.link.terms"), href: "/terms" },
    { name: t("footer.link.cookies"), href: "/cookies" },
  ],
});

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
];

export function Footer() {
  const { t } = useLanguage();
  const footerLinks = buildFooterLinks(t);

  return (
    <footer className="bg-card border-t border-border/30">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <span className="w-2 h-2 bg-[#6366F1] inline-block animate-pulse" />
              <span className="font-mono text-sm tracking-[0.2em] font-medium text-white uppercase group-hover:text-[#818CF8] transition-colors">
                CIVICSENSE
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              {t("footer.desc")}
            </p>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:contact@civicindia.in"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                contact@civicindia.in
              </a>
              <a
                href="tel:+911800CIVIC"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                1800-CIVIC-00
              </a>
              <p className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  123 Civic Center, Connaught Place, New Delhi - 110001
                </span>
              </p>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key}>
              <h4 className="font-semibold mb-4 text-foreground capitalize">
                {key}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar with aqua divider */}
      <div className="border-t border-primary/10">
        <div className="container-custom py-6 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t("footer.rights")}
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-9 h-9 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
                aria-label={social.name}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
