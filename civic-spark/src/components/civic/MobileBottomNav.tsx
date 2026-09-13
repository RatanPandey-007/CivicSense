import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, Search, Map, Shield } from "lucide-react";

export function MobileBottomNav() {
  const location = useLocation();

  const items = [
    { label: "HOME", href: "/", icon: Home },
    { label: "REPORT", href: "/report-issue", icon: PlusCircle, isPrimary: true },
    { label: "TRACK", href: "/track", icon: Search },
    { label: "CITY", href: "/#map", icon: Map },
    { label: "ADMIN", href: "https://admin-dashboard-six-nu-90.vercel.app", icon: Shield, isExternal: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080808]/95 backdrop-blur-md hairline-t md:hidden">
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          if (item.isExternal) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center text-[#71717A] hover:text-[#818CF8] font-mono text-[9px] tracking-wider transition-colors"
              >
                <Icon className="w-4 h-4 mb-1 text-[#71717A]" />
                <span>{item.label}</span>
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center justify-center font-mono text-[9px] tracking-wider transition-colors ${
                isActive || (item.isPrimary && location.pathname === "/report-issue")
                  ? "text-white"
                  : "text-[#71717A] hover:text-white"
              }`}
            >
              <div
                className={`flex items-center justify-center ${
                  item.isPrimary
                    ? "w-8 h-8 bg-white text-[#080808] rounded-none mb-0.5"
                    : "w-5 h-5 mb-1"
                }`}
              >
                <Icon
                  className={`${
                    item.isPrimary
                      ? "w-4 h-4"
                      : isActive
                      ? "text-[#818CF8]"
                      : "text-current"
                  }`}
                />
              </div>
              {!item.isPrimary && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
