import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Building,
  AlertTriangle,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ExternalLink,
  Search,
  Bell,
  Sliders,
  MapPin,
} from "lucide-react";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabaseClient";

const sidebarLinks = [
  {
    name: "Ward Dashboard",
    href: "/municipal/dashboard",
    icon: LayoutDashboard,
    badge: "LIVE",
  },
  {
    name: "Assigned Issues",
    href: "/municipal/issues",
    icon: AlertTriangle,
    badge: "ACTION",
  },
  {
    name: "Jurisdiction Config",
    href: "/municipal/settings",
    icon: Sliders,
  },
];

export default function MunicipalLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [adminName, setAdminName] = useState("Municipal Commissioner");
  const [adminInitial, setAdminInitial] = useState("M");

  useEffect(() => {
    async function fetchUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user?.user_metadata?.full_name) {
          setAdminName(session.user.user_metadata.full_name);
          setAdminInitial(
            session.user.user_metadata.full_name.charAt(0).toUpperCase(),
          );
        }
      } catch (err) {
        // Fallback
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="flex bg-[#080808] min-h-screen text-[#EDEDED] font-sans antialiased selection:bg-[#06B6D4]/30 selection:text-white">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#06B6D4]/04 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
      </div>

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 z-50 w-64 h-screen bg-[#0D0D0F] border-r border-[rgba(255,255,255,0.08)] flex flex-col transition-transform duration-300 ease-in-out shrink-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[rgba(255,255,255,0.08)]">
          <Link
            to="/municipal/dashboard"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-none bg-[#06B6D4] flex items-center justify-center text-black font-bold shadow-[0_0_16px_rgba(6,182,212,0.4)]">
              <Building className="w-4 h-4 text-black" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold tracking-widest text-white block">
                CIVICSENSE
              </span>
              <span className="font-mono text-[9px] text-[#22D3EE] tracking-widest block">
                WARD // OPERATIONS
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-[#71717A] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status indicator bar */}
        <div className="px-6 py-2.5 border-b border-[rgba(255,255,255,0.05)] bg-[#0A0A0C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06B6D4] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06B6D4]" />
            </span>
            <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-wider">
              DISPATCH: ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-[#71717A]">
            <MapPin className="w-3 h-3 text-[#06B6D4]" />
            <span>WARD-12</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-3 flex-1 flex flex-col gap-1 overflow-y-auto">
          <div className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-[#71717A]">
            Field Operations
          </div>
          {sidebarLinks.map((link) => {
            const isActive =
              location.pathname === link.href ||
              (link.href !== "/municipal/dashboard" &&
                location.pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 text-xs font-medium transition-all group relative",
                  isActive
                    ? "bg-[rgba(6,182,212,0.12)] text-white border-l-2 border-[#06B6D4]"
                    : "text-[#A1A1AA] hover:text-white hover:bg-[rgba(255,255,255,0.04)]",
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-[#22D3EE]"
                        : "text-[#71717A] group-hover:text-white",
                    )}
                  />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span
                    className={cn(
                      "font-mono text-[9px] px-1.5 py-0.5 rounded-none tracking-wider",
                      isActive
                        ? "bg-[#06B6D4]/30 text-[#22D3EE] border border-[#06B6D4]/40"
                        : "bg-white/5 text-[#71717A]",
                    )}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-auto border-t border-[rgba(255,255,255,0.06)] flex flex-col gap-1">
            <a
              href="http://localhost:8080"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2 text-xs text-[#71717A] hover:text-white hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>Citizen View</span>
              </div>
              <span className="font-mono text-[9px] text-[#71717A]">:8080</span>
            </a>

            <Link
              to="/login"
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Deauthenticate</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Command Bar */}
        <header className="h-16 border-b border-[rgba(255,255,255,0.08)] bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-[#A1A1AA] hover:text-white hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[#71717A]">
              <span>MUNICIPAL DESK</span>
              <span>/</span>
              <span className="text-white font-medium">
                WARD RESOLUTION CONSOLE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
              <input
                type="text"
                placeholder="Search ticket..."
                className="w-full bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#06B6D4] font-mono"
              />
            </div>

            <button
              title="Notifications"
              className="relative p-2 text-[#A1A1AA] hover:text-white hover:bg-white/5 border border-[rgba(255,255,255,0.08)] transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#06B6D4] rounded-full" />
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-[rgba(255,255,255,0.08)]">
              <div className="w-8 h-8 bg-[#18181B] border border-[#06B6D4]/40 flex items-center justify-center font-mono font-bold text-xs text-[#22D3EE]">
                {adminInitial}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-medium text-white leading-tight">
                  {adminName}
                </div>
                <div className="font-mono text-[10px] text-[#06B6D4] leading-tight">
                  ZONE OFFICER
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
