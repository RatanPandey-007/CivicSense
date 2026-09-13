import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  Brain,
  BarChart2,
  Activity,
  FileText,
  Users,
  Building,
  BookOpen,
  Settings,
  ChevronLeft,
  LogOut,
  Shield,
} from "lucide-react";

interface CommandSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  {
    section: "OPERATIONS",
    items: [
      { label: "Dashboard", path: "/master/dashboard", icon: LayoutDashboard },
      { label: "Live Map", path: "/master/map", icon: MapPin },
      { label: "Activity Stream", path: "/master/activity", icon: Activity },
    ],
  },
  {
    section: "INTELLIGENCE",
    items: [
      { label: "AI Intelligence", path: "/master/ai", icon: Brain },
      { label: "City Analytics", path: "/master/analytics", icon: BarChart2 },
    ],
  },
  {
    section: "MANAGEMENT",
    items: [
      { label: "Issues", path: "/master/issues", icon: FileText },
      { label: "Citizens", path: "/master/users", icon: Users },
      { label: "Municipalities", path: "/master/municipalities", icon: Building },
      { label: "Bulletins", path: "/master/blogs", icon: BookOpen },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      { label: "Settings", path: "/master/settings", icon: Settings },
    ],
  },
];

export default function CommandSidebar({
  collapsed,
  onToggle,
}: CommandSidebarProps) {
  const navigate = useNavigate();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div
      className={`relative flex flex-col h-full bg-[#0A0A0C] border-r border-[rgba(255,255,255,0.06)] transition-all duration-300 ease-out ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      {/* Logo / Brand */}
      <div
        className={`flex items-center border-b border-[rgba(255,255,255,0.06)] h-14 px-4 gap-3 overflow-hidden`}
      >
        <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(99,102,241,0.4)]">
          <Shield className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white text-sm font-bold leading-none tracking-tight">
              CivicSense
            </p>
            <p className="text-[10px] font-mono text-[#6366F1] mt-0.5 uppercase tracking-widest">
              COMMAND
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgba(255,255,255,0.06)]">
        {NAV_ITEMS.map((section) => (
          <div key={section.section} className="mb-2">
            {/* Section label */}
            {!collapsed && (
              <p className="text-[10px] font-mono text-[#52525B] uppercase tracking-widest px-4 py-2">
                {section.section}
              </p>
            )}
            {collapsed && (
              <div className="h-px bg-[rgba(255,255,255,0.04)] mx-3 my-2" />
            )}

            {section.items.map((item) => {
              const IconComp = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onMouseEnter={() => setHoveredPath(item.path)}
                  onMouseLeave={() => setHoveredPath(null)}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                      isActive
                        ? "bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20"
                        : "text-[#71717A] hover:text-white hover:bg-[rgba(255,255,255,0.04)]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#6366F1] rounded-r-full -ml-2" />
                      )}
                      <IconComp className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#6366F1]" : ""}`} />
                      {!collapsed && (
                        <span className="text-sm font-medium truncate">
                          {item.label}
                        </span>
                      )}
                      {/* Tooltip for collapsed state */}
                      {collapsed && hoveredPath === item.path && (
                        <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#18181B] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-xs whitespace-nowrap z-50 shadow-xl pointer-events-none">
                          {item.label}
                          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#18181B]" />
                        </div>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom controls */}
      <div className="border-t border-[rgba(255,255,255,0.06)] p-3 space-y-1">
        {/* System status indicator */}
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-green-500/5 border border-green-500/10`}
        >
          <div className="relative flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40" />
          </div>
          {!collapsed && (
            <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest">
              SYSTEMS NOMINAL
            </span>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHoveredPath("logout")}
          onMouseLeave={() => setHoveredPath(null)}
          className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#71717A] hover:text-red-400 hover:bg-red-500/5 transition-colors group"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-medium">Sign Out</span>
          )}
          {collapsed && hoveredPath === "logout" && (
            <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#18181B] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-xs whitespace-nowrap z-50 shadow-xl pointer-events-none">
              Sign Out
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#18181B]" />
            </div>
          )}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#18181B] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#71717A] hover:text-white hover:bg-[#27272A] transition-all z-10 shadow-lg"
      >
        <ChevronLeft
          className={`w-3 h-3 transition-transform duration-300 ${
            collapsed ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Decorative glow */}
      <div className="absolute top-14 right-0 w-px h-32 bg-gradient-to-b from-[#6366F1]/30 via-[#6366F1]/10 to-transparent pointer-events-none" />
    </div>
  );
}
