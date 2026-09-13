import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  MapPin,
  Flame,
} from "lucide-react";
import { LeafletMap } from "../../components/ui/LeafletMap";
import {
  fetchAdminIssues,
  type AdminIssue,
  FALLBACK_ADMIN_ISSUES,
} from "../../lib/dataAdapter";
import { cn } from "../../lib/utils";

export default function MunicipalDashboard() {
  const [issues, setIssues] = useState<AdminIssue[]>(FALLBACK_ADMIN_ISSUES);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAdminIssues();
    setIssues(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalAssigned = issues.length;
  const pendingAction = issues.filter(
    (i) => i.status === "open" || i.status === "in_progress",
  ).length;
  const criticalAction = issues.filter(
    (i) => (i.priority === "critical" || i.priority === "urgent") && i.status !== "resolved",
  ).length;
  const resolvedCount = issues.filter((i) => i.status === "resolved").length;

  const mapMarkers = issues
    .filter((i) => i.status !== "resolved")
    .map((issue) => ({
      id: issue.id,
      lat: issue.location_lat || 26.8467,
      lng: issue.location_lng || 80.9462,
      title: issue.title,
      priority: issue.priority,
      status: issue.status,
      category: issue.ai_category,
      popupContent: `
        <div style="font-size: 11px; color: #A1A1AA; margin-bottom: 4px;">
          ${issue.address}
        </div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #06B6D4;">
          PRIORITY: ${issue.priority.toUpperCase()}
        </div>
      `,
    }));

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#22D3EE] uppercase tracking-widest mb-1">
            <Building className="w-3 h-3" />
            <span>WARD JURISDICTION MATRIX // SECTOR 12</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Ward Operations & Incident Dispatch
          </h1>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] text-xs font-mono text-[#A1A1AA] hover:text-white hover:border-[#06B6D4] transition-colors"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin text-[#06B6D4]")} />
          <span>Sync Ward Queue</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assigned */}
        <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-5 relative">
          <div className="flex items-center justify-between text-[#71717A] mb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              Total Assigned
            </span>
            <Building className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <div className="font-mono text-3xl font-bold text-white">
            {totalAssigned}
          </div>
          <div className="mt-2 text-[11px] text-[#71717A] font-mono">
            Assigned to Pincode 226001 / 273001
          </div>
        </div>

        {/* Pending Action */}
        <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-5 relative">
          <div className="flex items-center justify-between text-[#71717A] mb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              Pending Action
            </span>
            <Clock className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="font-mono text-3xl font-bold text-[#F59E0B]">
            {pendingAction}
          </div>
          <div className="mt-2 text-[11px] text-[#71717A] font-mono">
            Awaiting Field Crew Confirmation
          </div>
        </div>

        {/* Escalated Emergency */}
        <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-5 relative">
          <div className="flex items-center justify-between text-[#71717A] mb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              Critical Emergency
            </span>
            <Flame className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="font-mono text-3xl font-bold text-[#EF4444]">
            {criticalAction}
          </div>
          <div className="mt-2 text-[11px] text-[#71717A] font-mono">
            Requires Immediate Ward Van
          </div>
        </div>

        {/* Resolved Closures */}
        <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-5 relative">
          <div className="flex items-center justify-between text-[#71717A] mb-3">
            <span className="font-mono text-[11px] uppercase tracking-wider">
              Resolved Closures
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="font-mono text-3xl font-bold text-[#22C55E]">
            {resolvedCount}
          </div>
          <div className="mt-2 text-[11px] text-[#71717A] font-mono">
            Citizen Confirmed
          </div>
        </div>
      </div>

      {/* CartoDB Map */}
      <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#06B6D4]" />
              Assigned Field Incident Radar
            </h3>
            <p className="text-xs text-[#71717A] mt-0.5">
              Geolocated civic signals in your jurisdiction requiring on-site remediation
            </p>
          </div>
          <span className="font-mono text-xs text-[#06B6D4]">
            {mapMarkers.length} ACTIVE SIGNALS
          </span>
        </div>

        <div className="h-[380px] w-full border border-[rgba(255,255,255,0.08)] overflow-hidden">
          <LeafletMap
            center={[26.8467, 80.9462]}
            zoom={13}
            markers={mapMarkers}
          />
        </div>
      </div>

      {/* Incident Action Queue Table */}
      <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        <div className="p-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#06B6D4]" />
            <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Immediate Action Queue
            </h3>
          </div>
          <Link
            to="/municipal/issues"
            className="font-mono text-xs text-[#22D3EE] hover:underline flex items-center gap-1"
          >
            <span>View All Assigned</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#080808] border-b border-[rgba(255,255,255,0.06)] font-mono text-[10px] text-[#71717A] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Ticket ID</th>
                <th className="px-5 py-3">Issue Synopsis</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Current Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
              {issues.slice(0, 5).map((issue) => (
                <tr
                  key={issue.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5 font-mono text-white font-medium">
                    <Link
                      to={`/municipal/issues/${issue.id}`}
                      className="text-[#22D3EE] hover:underline"
                    >
                      {issue.id}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-white max-w-sm truncate">
                      {issue.title}
                    </div>
                    <div className="text-[11px] text-[#71717A] truncate font-mono">
                      {issue.address}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-[#A1A1AA]">
                    {issue.ai_category || "Civic Incident"}
                  </td>
                  <td className="px-5 py-3.5">
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
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "font-mono text-[10px] uppercase px-2 py-0.5 border",
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
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      to={`/municipal/issues/${issue.id}`}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-[#22D3EE] hover:text-white"
                    >
                      <span>Resolve</span>
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
  );
}
