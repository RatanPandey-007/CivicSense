import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Layers,
  ChevronRight,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { LeafletMap } from "../../components/ui/LeafletMap";
import {
  fetchAdminIssues,
  type AdminIssue,
  FALLBACK_ADMIN_ISSUES,
} from "../../lib/dataAdapter";
import { cn } from "../../lib/utils";
import IncidentDrawer from "../../components/command/IncidentDrawer";

export default function MasterDashboard() {
  const [issues, setIssues] = useState<AdminIssue[]>(FALLBACK_ADMIN_ISSUES);
  const [loading, setLoading] = useState(true);
  const [mapFilter, setMapFilter] = useState<"all" | "critical" | "active">("all");
  const [timeRange, setTimeRange] = useState("Last 30 Days");
  const [drawerIssue, setDrawerIssue] = useState<AdminIssue | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = (id: string) => {
    const found = issues.find((i) => i.id === id);
    if (found) {
      setDrawerIssue(found);
      setDrawerOpen(true);
    }
  };


  const loadData = async () => {
    setLoading(true);
    const data = await fetchAdminIssues();
    setIssues(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute metrics
  const totalReports = issues.length;
  const activeReports = issues.filter((i) => i.status !== "resolved").length;
  const criticalReports = issues.filter(
    (i) => i.priority === "critical" || i.priority === "urgent",
  ).length;
  const resolvedReports = issues.filter((i) => i.status === "resolved").length;
  const resolutionRate = totalReports > 0
    ? Math.round((resolvedReports / totalReports) * 100)
    : 84;

  // Chart 1: Resolution velocity trend
  const trendData = [
    { period: "W1", reported: 42, resolved: 36 },
    { period: "W2", reported: 68, resolved: 54 },
    { period: "W3", reported: 95, resolved: 82 },
    { period: "W4", reported: 112, resolved: 104 },
    { period: "W5", reported: 84, resolved: 88 },
    { period: "W6", reported: 76, resolved: 79 },
  ];

  // Chart 2: Category breakdown
  const categoryData = [
    { category: "Roads", count: 28, resolved: 22 },
    { category: "Sanitation", count: 24, resolved: 19 },
    { category: "Electrical", count: 18, resolved: 17 },
    { category: "Water", count: 15, resolved: 12 },
    { category: "Lighting", count: 12, resolved: 11 },
  ];

  // Map markers filtered
  const filteredMapMarkers = issues
    .filter((issue) => {
      if (mapFilter === "critical") {
        return issue.priority === "critical" || issue.priority === "urgent";
      }
      if (mapFilter === "active") {
        return issue.status !== "resolved";
      }
      return true;
    })
    .map((issue) => ({
      id: issue.id,
      lat: issue.location_lat || 26.8467,
      lng: issue.location_lng || 80.9462,
      title: issue.title,
      priority: issue.priority,
      status: issue.status,
      category: issue.ai_category,
      popupContent: `
        <div style="font-size: 11px; color: #A1A1AA; margin-bottom: 6px;">
          ${issue.address}
        </div>
        <div style="display: flex; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px;">
          <span style="background: rgba(99,102,241,0.15); color: #818CF8; padding: 1px 6px; text-transform: uppercase;">
            ${issue.ai_category || "Civic Issue"}
          </span>
          <span style="background: rgba(239,68,68,0.15); color: #F87171; padding: 1px 6px; text-transform: uppercase;">
            ${issue.priority}
          </span>
        </div>
      `,
    }));

  return (
    <>
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto p-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#818CF8] uppercase tracking-widest mb-1">
            <Activity className="w-3 h-3" />
            <span>EXECUTIVE INTELLIGENCE MATRIX</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Municipal Command & Analytics
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] text-xs text-white font-mono px-3 py-1.5 focus:outline-none focus:border-[#6366F1]"
          >
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Fiscal Quarter</option>
          </select>
          <button
            onClick={loadData}
            title="Refresh Central Telemetry"
            className="p-1.5 bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] text-[#A1A1AA] hover:text-white hover:border-[#6366F1] transition-colors"
          >
            <RefreshCw
              className={cn("w-4 h-4", loading && "animate-spin text-[#6366F1]")}
            />
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inflow */}
        <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#71717A] mb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              Total Ingested Signals
            </span>
            <Layers className="w-4 h-4 text-[#818CF8]" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-3xl font-bold text-white">
              {totalReports.toLocaleString()}
            </div>
            <div className="flex items-center text-xs font-mono text-[#22C55E]">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.8%</span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#71717A] font-mono">
            Across 14 Municipal Wards
          </div>
        </div>

        {/* Active Open */}
        <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#71717A] mb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              Active In Progress
            </span>
            <Clock className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-3xl font-bold text-white">
              {activeReports}
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20">
              DISPATCHED
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#71717A] font-mono">
            Avg Triage Time: 4.2 mins
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#71717A] mb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              Critical & Urgent
            </span>
            <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-3xl font-bold text-[#EF4444]">
              {criticalReports}
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 animate-pulse">
              ESCALATED
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#71717A] font-mono">
            Requires High-Level Escort
          </div>
        </div>

        {/* SLA Compliance */}
        <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#71717A] mb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              SLA Resolution Rate
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="flex items-baseline justify-between">
            <div className="font-mono text-3xl font-bold text-[#22C55E]">
              {resolutionRate}%
            </div>
            <div className="flex items-center text-xs font-mono text-[#22C55E]">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>-18% MTTR</span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-[#71717A] font-mono">
            {resolvedReports} Verified Field Closures
          </div>
        </div>
      </div>

      {/* CartoDB Dark Matter Live Map */}
      <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-5 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono">
                Live Geotagged Incident Radar
              </h3>
              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                ACTIVE RADAR
              </span>
            </div>
            <p className="text-xs text-[#71717A] mt-0.5">
              Real-time telemetry coordinates across Uttar Pradesh municipal zones
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMapFilter("all")}
              className={cn(
                "px-2.5 py-1 font-mono text-[10px] uppercase transition-colors border",
                mapFilter === "all"
                  ? "bg-[#6366F1] text-white border-[#6366F1]"
                  : "bg-transparent text-[#71717A] border-[rgba(255,255,255,0.08)] hover:text-white",
              )}
            >
              All ({issues.length})
            </button>
            <button
              onClick={() => setMapFilter("critical")}
              className={cn(
                "px-2.5 py-1 font-mono text-[10px] uppercase transition-colors border",
                mapFilter === "critical"
                  ? "bg-[#EF4444] text-white border-[#EF4444]"
                  : "bg-transparent text-[#71717A] border-[rgba(255,255,255,0.08)] hover:text-white",
              )}
            >
              Critical ({criticalReports})
            </button>
            <button
              onClick={() => setMapFilter("active")}
              className={cn(
                "px-2.5 py-1 font-mono text-[10px] uppercase transition-colors border",
                mapFilter === "active"
                  ? "bg-[#06B6D4] text-black font-semibold border-[#06B6D4]"
                  : "bg-transparent text-[#71717A] border-[rgba(255,255,255,0.08)] hover:text-white",
              )}
            >
              Pending ({activeReports})
            </button>
          </div>
        </div>

        <div className="h-[420px] w-full border border-[rgba(255,255,255,0.08)] overflow-hidden relative">
          <LeafletMap
            center={[26.8467, 80.9462]}
            zoom={12}
            markers={filteredMapMarkers}
            onMarkerClick={(marker) => openDrawer(marker.id)}
          />
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inflow vs Resolution Trend */}
        <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                Ingestion vs Resolution Velocity
              </h3>
              <p className="text-xs text-[#71717A]">
                Weekly throughput across all automated municipal queues
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px]">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#EF4444]" />
                <span className="text-[#A1A1AA]">Reported</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-[#6366F1]" />
                <span className="text-[#A1A1AA]">Resolved</span>
              </div>
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="reportedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="period"
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  fontFamily="JetBrains Mono"
                />
                <YAxis
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  fontFamily="JetBrains Mono"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D0D0F",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "0px",
                    fontFamily: "JetBrains Mono",
                    fontSize: "12px",
                  }}
                  itemStyle={{ color: "#EDEDED" }}
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fill="url(#resolvedGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="reported"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fill="url(#reportedGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Efficiency */}
        <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
                Sector Triage Efficiency
              </h3>
              <p className="text-xs text-[#71717A]">
                Distribution and closure rate by municipal department
              </p>
            </div>
            <span className="font-mono text-[10px] text-[#818CF8]">
              TOP DOMAINS
            </span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="category"
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  fontFamily="JetBrains Mono"
                />
                <YAxis
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  fontFamily="JetBrains Mono"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D0D0F",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "0px",
                    fontFamily: "JetBrains Mono",
                    fontSize: "12px",
                  }}
                  cursor={{ fill: "rgba(255,255,255,0.02)" }}
                />
                <Bar dataKey="count" fill="#27272A" />
                <Bar dataKey="resolved" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* High-Priority Queue Table */}
      <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        <div className="p-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
            <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Urgent Incidents Demanding Escalation
            </h3>
          </div>
          <Link
            to="/master/issues"
            className="font-mono text-xs text-[#818CF8] hover:underline flex items-center gap-1"
          >
            <span>Full Incident Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0A0A0C] border-b border-[rgba(255,255,255,0.06)] font-mono text-[11px] text-[#71717A] uppercase">
              <tr>
                <th className="px-5 py-3">Signal ID</th>
                <th className="px-5 py-3">Incident Synopsis</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
              {issues.slice(0, 4).map((issue) => (
                <tr
                  key={issue.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-white font-medium">
                    {issue.id}
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-white max-w-sm truncate">
                      {issue.title}
                    </div>
                    <div className="text-[11px] text-[#71717A] truncate">
                      {issue.address}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-[10px] text-[#A1A1AA]">
                      {issue.ai_category || "General"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "font-mono text-[10px] uppercase font-bold",
                        issue.priority === "critical" || issue.priority === "urgent"
                          ? "text-[#EF4444]"
                          : issue.priority === "high"
                            ? "text-[#F97316]"
                            : "text-[#EAB308]",
                      )}
                    >
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "font-mono text-[10px] uppercase px-1.5 py-0.5 border",
                        issue.status === "resolved"
                          ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30"
                          : issue.status === "in_progress"
                            ? "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30"
                            : "bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/30",
                      )}
                    >
                      {issue.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/master/issues/${issue.id}`}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-[#818CF8] hover:text-white"
                    >
                      <span>Triage</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

      {/* Incident Drawer — opens when a map marker is clicked */}
      <IncidentDrawer
        issue={drawerIssue}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStatusChange={(id, status) => {
          setIssues((prev) =>
            prev.map((i) => (i.id === id ? { ...i, status } : i))
          );
        }}
      />
    </>
  );
}
