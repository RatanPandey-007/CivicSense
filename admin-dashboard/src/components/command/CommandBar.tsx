import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronRight,
  Command,
} from "lucide-react";

interface CommandBarProps {
  onSearchOpen: () => void;
  onNotificationsOpen: () => void;
  onSystemStatusOpen: () => void;
  unreadCount: number;
}

const BREADCRUMB_MAP: Record<string, string[]> = {
  "/master/dashboard": ["Operations", "Dashboard"],
  "/master/map": ["Operations", "Live Map"],
  "/master/activity": ["Operations", "Activity Stream"],
  "/master/ai": ["Intelligence", "AI Intelligence"],
  "/master/analytics": ["Intelligence", "City Analytics"],
  "/master/issues": ["Management", "Issues"],
  "/master/users": ["Management", "Citizens"],
  "/master/municipalities": ["Management", "Municipalities"],
  "/master/blogs": ["Management", "Bulletins"],
  "/master/settings": ["System", "Settings"],
};

export default function CommandBar({
  onSearchOpen,
  onNotificationsOpen,
  onSystemStatusOpen,
  unreadCount,
}: CommandBarProps) {
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine breadcrumb from path
  const pathParts = BREADCRUMB_MAP[location.pathname];
  const issueMatch = location.pathname.match(/\/master\/issues\/(.+)/);

  const breadcrumb = issueMatch
    ? ["Management", "Issues", `#${issueMatch[1]}`]
    : pathParts || ["Operations", "Dashboard"];

  return (
    <header className="h-14 flex items-center justify-between px-5 border-b border-[rgba(255,255,255,0.06)] bg-[#070708]/90 backdrop-blur-sm flex-shrink-0">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-1.5 min-w-0">
        {breadcrumb.map((crumb, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRight className="w-3 h-3 text-[#52525B] flex-shrink-0" />
            )}
            <span
              className={`text-sm truncate ${
                i === breadcrumb.length - 1
                  ? "text-white font-semibold"
                  : "text-[#71717A]"
              }`}
            >
              {crumb}
            </span>
          </div>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
          <span className="text-[#71717A] text-xs font-mono">
            {time.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </span>
        </div>

        {/* System status pill */}
        <button
          onClick={onSystemStatusOpen}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-colors"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_4px_rgba(34,197,94,0.8)]" />
          <span className="text-green-400 text-xs font-mono uppercase tracking-widest">
            ALL SYSTEMS
          </span>
        </button>

        {/* Search */}
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.07)] transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-[#71717A]" />
          <span className="hidden md:block text-[#71717A] text-xs">Search</span>
          <kbd className="hidden md:flex items-center gap-0.5 text-[10px] text-[#52525B] border border-[rgba(255,255,255,0.08)] rounded px-1.5 py-0.5 font-mono">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          onClick={onNotificationsOpen}
          className="relative p-2 text-[#71717A] hover:text-white hover:bg-[rgba(255,255,255,0.04)] rounded-lg transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#6366F1] shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
          )}
        </button>
      </div>
    </header>
  );
}
