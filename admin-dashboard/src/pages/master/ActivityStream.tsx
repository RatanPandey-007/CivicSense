import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Cpu,
  CheckCircle,
  Brain,
  Info,
  Activity,
  MapPin,
  Clock,
  Shield,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatDistanceToNow } from "date-fns";
import { fetchActivityStream } from "../../lib/dataAdapter";
import type { ActivityEvent } from "../../lib/dataAdapter";

type FilterType = "all" | "critical" | "assignment" | "resolution" | "ai" | "system";

const EVENT_CONFIG = {
  critical: {
    icon: AlertTriangle,
    color: "#EF4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.25)",
    badge: "text-red-400 border-red-500/30 bg-red-500/10",
  },
  assignment: {
    icon: Cpu,
    color: "#6366F1",
    bg: "rgba(99,102,241,0.12)",
    border: "rgba(99,102,241,0.25)",
    badge: "text-[#818CF8] border-[#6366F1]/30 bg-[#6366F1]/10",
  },
  resolution: {
    icon: CheckCircle,
    color: "#22C55E",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.25)",
    badge: "text-green-400 border-green-500/30 bg-green-500/10",
  },
  ai: {
    icon: Brain,
    color: "#A855F7",
    bg: "rgba(168,85,247,0.12)",
    border: "rgba(168,85,247,0.25)",
    badge: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  },
  system: {
    icon: Info,
    color: "#38BDF8",
    bg: "rgba(56,189,248,0.12)",
    border: "rgba(56,189,248,0.25)",
    badge: "text-sky-400 border-sky-500/30 bg-sky-500/10",
  },
};

const HOURLY_ACTIVITY_DATA = [
  { hour: "00h", count: 2 },
  { hour: "02h", count: 1 },
  { hour: "04h", count: 3 },
  { hour: "06h", count: 8 },
  { hour: "08h", count: 24 },
  { hour: "10h", count: 48 },
  { hour: "12h", count: 39 },
  { hour: "14h", count: 42 },
  { hour: "16h", count: 56 },
  { hour: "18h", count: 31 },
  { hour: "20h", count: 18 },
  { hour: "22h", count: 9 },
];

const RECENT_ACTORS = [
  { name: "Superadmin root", role: "Central Command", count: 34 },
  { name: "Municipal Van #04", role: "Field Dispatch", count: 21 },
  { name: "Neural Inference Engine", role: "AI Subsystem", count: 52 },
  { name: "Inspector R. Verma", role: "Ward 12 Officer", count: 18 },
  { name: "Cluster Watchdog", role: "Automated Daemon", count: 96 },
];

export default function ActivityStream() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [newestId, setNewestId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchActivityStream().then((data) => {
      if (mounted) {
        setEvents(data);
        setLoading(false);
      }
    });

    // Simulate periodic live events feed
    const interval = setInterval(() => {
      const mockTypes: ActivityEvent["type"][] = [
        "critical",
        "assignment",
        "resolution",
        "ai",
        "system",
      ];
      const selectedType = mockTypes[Math.floor(Math.random() * mockTypes.length)];
      const id = `act-live-${Date.now()}`;
      
      const newEvent: ActivityEvent = {
        id,
        timestamp: new Date().toISOString(),
        event:
          selectedType === "critical"
            ? "New high-priority hazard detected and flagged for escalation"
            : selectedType === "ai"
            ? "Automated visual classification confidence 96.4% on inbound report"
            : selectedType === "assignment"
            ? "Ward emergency crew dispatched to sector junction"
            : selectedType === "resolution"
            ? "Field repair verified with geo-fenced resolution telemetry"
            : "Central database write-ahead-log replication synced",
        actor:
          selectedType === "ai"
            ? "Neural Inference Engine"
            : selectedType === "critical"
            ? "Central Sentinel"
            : "Municipal Rapid Response",
        location: "Ward Sector 4B",
        type: selectedType,
        issueId: `ISS-${Math.floor(8000 + Math.random() * 500)}`,
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 30)]);
      setNewestId(id);

      setTimeout(() => {
        setNewestId((curr) => (curr === id ? null : curr));
      }, 3500);
    }, 25000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredEvents = events.filter((ev) => {
    if (filter === "all") return true;
    return ev.type === filter;
  });

  const criticalCount = events.filter((e) => e.type === "critical").length;
  const resolutionCount = events.filter((e) => e.type === "resolution").length;
  const aiCount = events.filter((e) => e.type === "ai").length;

  const renderTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      if (!isNaN(date.getTime())) {
        return formatDistanceToNow(date, { addSuffix: true });
      }
      return ts;
    } catch {
      return ts;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in min-h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#818CF8] uppercase tracking-widest mb-1">
            <Activity className="w-3 h-3" />
            <span>CENTRAL TELEMETRY FEED</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Activity Stream
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Real-time municipal event stream, automated triggers & dispatch log
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-green-400">
            STREAM LIVE
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-[#71717A] mr-1 flex-shrink-0" />
        {(
          [
            "all",
            "critical",
            "assignment",
            "resolution",
            "ai",
            "system",
          ] as FilterType[]
        ).map((type) => {
          const isActive = filter === type;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap border ${
                isActive
                  ? "bg-[#6366F1]/15 text-[#818CF8] border-[#6366F1]/40 shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                  : "bg-[#111114] text-[#71717A] border-[rgba(255,255,255,0.06)] hover:text-white hover:border-[rgba(255,255,255,0.12)]"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Timeline Feed */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-[#111114] border border-[rgba(255,255,255,0.06)] rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-xl p-12 text-center text-[#71717A]">
              <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-mono text-sm">No events matching this filter</p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-px before:bg-[rgba(255,255,255,0.08)]">
              {filteredEvents.map((ev) => {
                const cfg = EVENT_CONFIG[ev.type] || EVENT_CONFIG.system;
                const IconComponent = cfg.icon;
                const isNew = ev.id === newestId;

                return (
                  <div
                    key={ev.id}
                    className={`relative p-4 rounded-xl border transition-all duration-300 bg-[#111114] ${
                      isNew
                        ? "border-[#6366F1] shadow-[0_0_20px_rgba(99,102,241,0.3)] ring-1 ring-[#6366F1]"
                        : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.14)]"
                    }`}
                  >
                    {/* Timeline Node Marker */}
                    <div
                      className="absolute -left-[30px] top-4 w-5 h-5 rounded-full border flex items-center justify-center bg-[#070708]"
                      style={{ borderColor: cfg.color }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cfg.color }}
                      />
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
                        >
                          <IconComponent className="w-4 h-4" style={{ color: cfg.color }} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${cfg.badge}`}
                            >
                              {ev.type}
                            </span>
                            {ev.issueId && (
                              <span className="text-[10px] font-mono text-[#818CF8] bg-[#6366F1]/10 px-1.5 py-0.5 rounded border border-[#6366F1]/20">
                                {ev.issueId}
                              </span>
                            )}
                            {isNew && (
                              <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#22C55E] text-black font-bold animate-pulse">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-white leading-snug">
                            {ev.event}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#71717A] mt-2">
                            <span className="font-mono text-[#A1A1AA] flex items-center gap-1">
                              <Shield className="w-3 h-3 text-[#6366F1]" />
                              {ev.actor}
                            </span>
                            {ev.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#71717A]" />
                                {ev.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-mono text-[#71717A] whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        <span>{renderTimestamp(ev.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Telemetry Analytics Sidebar */}
        <div className="space-y-4">
          {/* Event Statistics */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111114] p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] mb-4">
              Event Statistics
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#0D0D0F] rounded-lg border border-[rgba(255,255,255,0.04)]">
                <span className="text-[10px] font-mono text-[#71717A] uppercase block">
                  Total Events
                </span>
                <span className="text-xl font-bold font-mono text-white mt-1 block">
                  {events.length}
                </span>
              </div>
              <div className="p-3 bg-[#0D0D0F] rounded-lg border border-[rgba(255,255,255,0.04)]">
                <span className="text-[10px] font-mono text-[#EF4444] uppercase block">
                  Critical
                </span>
                <span className="text-xl font-bold font-mono text-red-400 mt-1 block">
                  {criticalCount}
                </span>
              </div>
              <div className="p-3 bg-[#0D0D0F] rounded-lg border border-[rgba(255,255,255,0.04)]">
                <span className="text-[10px] font-mono text-[#22C55E] uppercase block">
                  Resolved
                </span>
                <span className="text-xl font-bold font-mono text-green-400 mt-1 block">
                  {resolutionCount}
                </span>
              </div>
              <div className="p-3 bg-[#0D0D0F] rounded-lg border border-[rgba(255,255,255,0.04)]">
                <span className="text-[10px] font-mono text-[#A855F7] uppercase block">
                  AI Triggers
                </span>
                <span className="text-xl font-bold font-mono text-purple-400 mt-1 block">
                  {aiCount}
                </span>
              </div>
            </div>
          </div>

          {/* Hourly Ingestion Velocity */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111114] p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] mb-3">
              Hourly Ingestion Velocity
            </p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={HOURLY_ACTIVITY_DATA} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="hour"
                  tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#111114",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    fontSize: "11px",
                    color: "#fff",
                  }}
                  cursor={{ fill: "rgba(99,102,241,0.08)" }}
                />
                <Bar dataKey="count" fill="#6366F1" radius={[3, 3, 0, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Operational Actors */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111114] p-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] mb-4">
              Active Operational Units
            </p>
            <div className="space-y-2.5">
              {RECENT_ACTORS.map((actor) => (
                <div
                  key={actor.name}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D0D0F] border border-[rgba(255,255,255,0.04)]"
                >
                  <div>
                    <p className="text-xs font-medium text-white">{actor.name}</p>
                    <p className="text-[10px] font-mono text-[#71717A]">{actor.role}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#6366F1]/10 text-[#818CF8] border border-[#6366F1]/20">
                    {actor.count} ops
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
