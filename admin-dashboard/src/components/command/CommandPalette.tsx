import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, LayoutDashboard, MapPin, Brain, BarChart2, Activity, FileText, Users, Building, Settings, X } from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  description: string;
  path: string;
  icon: React.ElementType;
  tags: string[];
}

const MASTER_NAV: NavItem[] = [
  { label: "Dashboard", description: "Operations overview and KPIs", path: "/master/dashboard", icon: LayoutDashboard, tags: ["home", "overview", "stats"] },
  { label: "Live Map", description: "Real-time incident mapping", path: "/master/map", icon: MapPin, tags: ["map", "location", "gps", "live"] },
  { label: "AI Intelligence", description: "AI prediction and analytics", path: "/master/ai", icon: Brain, tags: ["ai", "ml", "prediction", "intelligence"] },
  { label: "City Analytics", description: "Municipal data visualization", path: "/master/analytics", icon: BarChart2, tags: ["analytics", "charts", "data"] },
  { label: "Activity Stream", description: "Real-time event feed", path: "/master/activity", icon: Activity, tags: ["activity", "events", "feed"] },
  { label: "Issues", description: "All civic issue reports", path: "/master/issues", icon: FileText, tags: ["issues", "reports", "tickets"] },
  { label: "Citizens", description: "Citizen account management", path: "/master/users", icon: Users, tags: ["users", "citizens", "accounts"] },
  { label: "Municipalities", description: "Ward and district management", path: "/master/municipalities", icon: Building, tags: ["municipalities", "wards", "districts"] },
  { label: "Blogs", description: "Municipal bulletin management", path: "/master/blogs", icon: FileText, tags: ["blogs", "bulletins", "news"] },
  { label: "Settings", description: "System configuration", path: "/master/settings", icon: Settings, tags: ["settings", "config", "system"] },
];

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? MASTER_NAV.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.some((t) => t.includes(query.toLowerCase()))
      )
    : MASTER_NAV;

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const handleSelect = (item: NavItem) => {
    navigate(item.path);
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        if (filtered[selectedIdx]) handleSelect(filtered[selectedIdx]);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, selectedIdx]);

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4 transition-all duration-200 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Palette */}
      <div
        className={`relative w-full max-w-xl bg-[#111114] border border-[rgba(255,255,255,0.10)] rounded-xl shadow-2xl overflow-hidden transition-all duration-200 ${
          open ? "translate-y-0 scale-100" : "-translate-y-4 scale-95"
        }`}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[rgba(255,255,255,0.06)]">
          <Search className="w-4 h-4 text-[#71717A] flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, actions..."
            className="flex-1 bg-transparent text-white text-sm placeholder-[#71717A] outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[#71717A] hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="text-[10px] text-[#52525B] border border-[rgba(255,255,255,0.08)] rounded px-1.5 py-0.5 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-[#71717A] text-sm">
              No results for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left ${
                    idx === selectedIdx
                      ? "bg-[#6366F1]/10 border-l-2 border-[#6366F1]"
                      : "hover:bg-[rgba(255,255,255,0.04)] border-l-2 border-transparent"
                  }`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIdx(idx)}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      idx === selectedIdx
                        ? "bg-[#6366F1]/20 border border-[#6366F1]/30"
                        : "bg-[#18181B] border border-[rgba(255,255,255,0.06)]"
                    }`}
                  >
                    <IconComp
                      className={`w-4 h-4 ${
                        idx === selectedIdx ? "text-[#6366F1]" : "text-[#71717A]"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        idx === selectedIdx ? "text-white" : "text-[#A1A1AA]"
                      }`}
                    >
                      {item.label}
                    </p>
                    <p className="text-[#52525B] text-xs truncate">
                      {item.description}
                    </p>
                  </div>
                  {idx === selectedIdx && (
                    <ArrowRight className="w-4 h-4 text-[#6366F1] flex-shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[rgba(255,255,255,0.06)] bg-[#0D0D0F]">
          <div className="flex items-center gap-1.5 text-[#52525B] text-xs">
            <kbd className="border border-[rgba(255,255,255,0.08)] rounded px-1 py-0.5 font-mono text-[10px]">↑</kbd>
            <kbd className="border border-[rgba(255,255,255,0.08)] rounded px-1 py-0.5 font-mono text-[10px]">↓</kbd>
            <span>navigate</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#52525B] text-xs">
            <kbd className="border border-[rgba(255,255,255,0.08)] rounded px-1 py-0.5 font-mono text-[10px]">↵</kbd>
            <span>select</span>
          </div>
          <div className="ml-auto text-[10px] font-mono text-[#52525B] uppercase tracking-widest">
            COMMAND PALETTE
          </div>
        </div>
      </div>
    </div>
  );
}
