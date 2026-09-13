import { useState, useEffect, useCallback } from "react";
import { MapPin, RefreshCw, Layers } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { LeafletMap } from "../../components/ui/LeafletMap";
import type { MapMarker } from "../../components/ui/LeafletMap";
import IncidentDrawer from "../../components/command/IncidentDrawer";
import {
  fetchAdminIssues,
  updateAdminIssueStatus,
  FALLBACK_ADMIN_ISSUES,
} from "../../lib/dataAdapter";
import type { AdminIssue } from "../../lib/dataAdapter";

// ─── Filter option types ──────────────────────────────────────────────────────

type PriorityFilter = "ALL" | "critical" | "high" | "medium" | "low";
type StatusFilter = "ALL" | "open" | "in_progress" | "resolved";

// ─── Priority / Status colour maps ───────────────────────────────────────────

const PRIORITY_COLOR: Record<string, string> = {
  critical: "#EF4444",
  urgent:   "#EF4444",
  high:     "#F59E0B",
  medium:   "#38BDF8",
  low:      "#71717A",
};

const PRIORITY_BG: Record<string, string> = {
  critical: "rgba(239,68,68,0.12)",
  urgent:   "rgba(239,68,68,0.12)",
  high:     "rgba(245,158,11,0.12)",
  medium:   "rgba(56,189,248,0.12)",
  low:      "rgba(113,113,122,0.10)",
};

const STATUS_CFG: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  open: {
    label:  "OPEN",
    color:  "#F59E0B",
    bg:     "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.20)",
  },
  in_progress: {
    label:  "IN PROGRESS",
    color:  "#38BDF8",
    bg:     "rgba(56,189,248,0.10)",
    border: "rgba(56,189,248,0.20)",
  },
  resolved: {
    label:  "RESOLVED",
    color:  "#22C55E",
    bg:     "rgba(34,197,94,0.10)",
    border: "rgba(34,197,94,0.20)",
  },
  rejected: {
    label:  "REJECTED",
    color:  "#71717A",
    bg:     "rgba(113,113,122,0.10)",
    border: "rgba(113,113,122,0.20)",
  },
};

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="p-4 border-b animate-pulse"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div
        className="h-2.5 rounded mb-3 w-2/3"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />
      <div
        className="h-2 rounded mb-2 w-full"
        style={{ background: "rgba(255,255,255,0.04)" }}
      />
      <div
        className="h-2 rounded w-1/2"
        style={{ background: "rgba(255,255,255,0.04)" }}
      />
    </div>
  );
}

// ─── Issue sidebar card ───────────────────────────────────────────────────────

interface IssueCardProps {
  issue: AdminIssue;
  selected: boolean;
  onClick: () => void;
}

function IssueCard({ issue, selected, onClick }: IssueCardProps) {
  const priorityColor = PRIORITY_COLOR[issue.priority] ?? "#71717A";
  const priorityBg    = PRIORITY_BG[issue.priority]    ?? "rgba(113,113,122,0.10)";
  const statusCfg     = STATUS_CFG[issue.status]       ?? STATUS_CFG.open;
  const timeAgo       = formatDistanceToNow(new Date(issue.created_at), { addSuffix: true });

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 border-b transition-colors duration-150"
      style={{
        borderColor:     "rgba(255,255,255,0.06)",
        backgroundColor: selected ? "rgba(99,102,241,0.08)" : "transparent",
        borderLeft:      selected ? "2px solid #6366F1" : "2px solid transparent",
      }}
      onMouseEnter={(e) => {
        if (!selected)
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "rgba(255,255,255,0.03)";
      }}
      onMouseLeave={(e) => {
        if (!selected)
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
      }}
    >
      {/* Priority dot + ID row */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              backgroundColor: priorityColor,
              boxShadow:       `0 0 6px ${priorityColor}`,
            }}
          />
          <span
            className="text-[10px] uppercase tracking-widest truncate"
            style={{
              fontFamily:      "JetBrains Mono, monospace",
              color:           priorityColor,
              backgroundColor: priorityBg,
              padding:         "1px 6px",
              borderRadius:    "3px",
            }}
          >
            {issue.priority}
          </span>
        </div>
        <span
          className="text-[10px] uppercase tracking-widest flex-shrink-0"
          style={{ fontFamily: "JetBrains Mono, monospace", color: "#52525B" }}
        >
          {issue.id}
        </span>
      </div>

      {/* Title */}
      <p
        className="text-sm font-medium leading-snug mb-1.5 line-clamp-2"
        style={{ color: "#E4E4E7" }}
      >
        {issue.title}
      </p>

      {/* Address */}
      <div className="flex items-start gap-1 mb-2">
        <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: "#52525B" }} />
        <p className="text-xs leading-snug line-clamp-1" style={{ color: "#71717A" }}>
          {issue.address}
        </p>
      </div>

      {/* Footer: time + status badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px]" style={{ color: "#52525B" }}>
          {timeAgo}
        </span>
        <span
          className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border"
          style={{
            fontFamily:      "JetBrains Mono, monospace",
            color:           statusCfg.color,
            backgroundColor: statusCfg.bg,
            borderColor:     statusCfg.border,
          }}
        >
          {statusCfg.label}
        </span>
      </div>
    </button>
  );
}

// ─── Filter pill ──────────────────────────────────────────────────────────────

interface FilterPillProps {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}

function FilterPill({ label, active, color, onClick }: FilterPillProps) {
  const accentColor = color ?? "#6366F1";
  return (
    <button
      onClick={onClick}
      className="text-[10px] uppercase tracking-widest px-3 py-1 rounded transition-all duration-150"
      style={{
        fontFamily:      "JetBrains Mono, monospace",
        color:           active ? accentColor : "#71717A",
        backgroundColor: active ? `${accentColor}18` : "transparent",
        border:          active ? `1px solid ${accentColor}40` : "1px solid transparent",
      }}
    >
      {label}
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LiveMap() {
  const [issues, setIssues]                 = useState<AdminIssue[]>(FALLBACK_ADMIN_ISSUES);
  const [loading, setLoading]               = useState(true);
  const [refreshing, setRefreshing]         = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");
  const [statusFilter, setStatusFilter]     = useState<StatusFilter>("ALL");
  const [selectedIssue, setSelectedIssue]   = useState<AdminIssue | null>(null);
  const [drawerOpen, setDrawerOpen]         = useState(false);

  // ── Data loading ────────────────────────────────────────────────────────────
  const loadIssues = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);

    const data = await fetchAdminIssues();
    setIssues(data);

    if (showRefreshing) setRefreshing(false);
    else setLoading(false);
  }, []);

  useEffect(() => {
    loadIssues(false);
  }, [loadIssues]);

  // ── Filtering ────────────────────────────────────────────────────────────────
  const filteredIssues = issues.filter((issue) => {
    const matchPriority =
      priorityFilter === "ALL" ||
      issue.priority === priorityFilter ||
      (priorityFilter === "critical" && issue.priority === "urgent");
    const matchStatus = statusFilter === "ALL" || issue.status === statusFilter;
    return matchPriority && matchStatus;
  });

  // ── Markers ─────────────────────────────────────────────────────────────────
  const markers: MapMarker[] = filteredIssues.map((issue) => ({
    id:       issue.id,
    lat:      issue.location_lat || 26.85,
    lng:      issue.location_lng || 80.95,
    title:    issue.title,
    priority: issue.priority,
    status:   issue.status,
  }));

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleMarkerClick = useCallback(
    (marker: MapMarker) => {
      const issue = issues.find((i) => i.id === marker.id) ?? null;
      setSelectedIssue(issue);
      setDrawerOpen(true);
    },
    [issues],
  );

  const handleCardClick = useCallback((issue: AdminIssue) => {
    setSelectedIssue(issue);
    setDrawerOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedIssue(null), 300);
  }, []);

  const handleStatusChange = useCallback(
    async (id: string, status: AdminIssue["status"]) => {
      setIssues((prev) =>
        prev.map((iss) => (iss.id === id ? { ...iss, status } : iss)),
      );
      if (selectedIssue?.id === id) {
        setSelectedIssue((prev) => (prev ? { ...prev, status } : prev));
      }
      await updateAdminIssueStatus(id, status);
    },
    [selectedIssue],
  );

  // ── Filter pill config ────────────────────────────────────────────────────────
  const priorityPills: Array<{ value: PriorityFilter; label: string; color?: string }> = [
    { value: "ALL",      label: "ALL" },
    { value: "critical", label: "CRITICAL", color: "#EF4444" },
    { value: "high",     label: "HIGH",     color: "#F59E0B" },
    { value: "medium",   label: "MEDIUM",   color: "#38BDF8" },
    { value: "low",      label: "LOW",      color: "#71717A" },
  ];

  const statusPills: Array<{ value: StatusFilter; label: string; color?: string }> = [
    { value: "ALL",         label: "ALL" },
    { value: "open",        label: "OPEN",        color: "#F59E0B" },
    { value: "in_progress", label: "IN PROGRESS", color: "#38BDF8" },
    { value: "resolved",    label: "RESOLVED",    color: "#22C55E" },
  ];

  const criticalCount = filteredIssues.filter(
    (i) => i.priority === "critical" || i.priority === "urgent",
  ).length;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "#070708" }}
    >
      {/* ── Control strip ──────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 px-5 py-3 border-b flex flex-col gap-3"
        style={{
          backgroundColor: "#111114",
          borderColor:     "rgba(255,255,255,0.08)",
        }}
      >
        {/* Row 1: title + badges + refresh */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4" style={{ color: "#6366F1" }} />
            <h1
              className="text-sm uppercase tracking-widest"
              style={{ fontFamily: "JetBrains Mono, monospace", color: "#E4E4E7" }}
            >
              LIVE INCIDENT MAP
            </h1>
            {/* Live pulse */}
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: "#22C55E",
                  boxShadow:       "0 0 6px #22C55E",
                }}
              />
              <span
                className="text-[10px]"
                style={{ fontFamily: "JetBrains Mono, monospace", color: "#52525B" }}
              >
                LIVE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Count badges */}
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] px-2 py-0.5 rounded"
                style={{
                  fontFamily:      "JetBrains Mono, monospace",
                  color:           "#6366F1",
                  backgroundColor: "rgba(99,102,241,0.12)",
                }}
              >
                {filteredIssues.length} INCIDENT{filteredIssues.length !== 1 ? "S" : ""}
              </span>
              {criticalCount > 0 && (
                <span
                  className="text-[10px] px-2 py-0.5 rounded"
                  style={{
                    fontFamily:      "JetBrains Mono, monospace",
                    color:           "#EF4444",
                    backgroundColor: "rgba(239,68,68,0.12)",
                  }}
                >
                  {criticalCount} CRITICAL
                </span>
              )}
            </div>

            {/* Refresh button */}
            <button
              onClick={() => loadIssues(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] uppercase tracking-widest transition-colors"
              style={{
                fontFamily:      "JetBrains Mono, monospace",
                color:           refreshing ? "#52525B" : "#71717A",
                border:          "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "transparent",
              }}
            >
              <RefreshCw
                className="w-3 h-3"
                style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }}
              />
              REFRESH
            </button>
          </div>
        </div>

        {/* Row 2: filter pills */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Priority pills */}
          <div className="flex items-center gap-1">
            <span
              className="text-[9px] uppercase tracking-widest mr-1"
              style={{ fontFamily: "JetBrains Mono, monospace", color: "#3F3F46" }}
            >
              PRIORITY
            </span>
            {priorityPills.map((pill) => (
              <FilterPill
                key={pill.value}
                label={pill.label}
                active={priorityFilter === pill.value}
                color={pill.color}
                onClick={() => setPriorityFilter(pill.value)}
              />
            ))}
          </div>

          <div
            className="w-px h-5 self-center flex-shrink-0"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          />

          {/* Status pills */}
          <div className="flex items-center gap-1">
            <span
              className="text-[9px] uppercase tracking-widest mr-1"
              style={{ fontFamily: "JetBrains Mono, monospace", color: "#3F3F46" }}
            >
              STATUS
            </span>
            {statusPills.map((pill) => (
              <FilterPill
                key={pill.value}
                label={pill.label}
                active={statusFilter === pill.value}
                color={pill.color}
                onClick={() => setStatusFilter(pill.value as StatusFilter)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Main two-column area ────────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0">

        {/* ── Map (flex-1) ─────────────────────────────────────────────────── */}
        <div className="flex-1 relative min-w-0">
          {loading ? (
            /* Map loading skeleton */
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              style={{ backgroundColor: "#0A0A0C" }}
            >
              <div
                className="w-8 h-8 rounded-full border-2"
                style={{
                  borderColor:    "#6366F1",
                  borderTopColor: "transparent",
                  animation:      "spin 0.8s linear infinite",
                }}
              />
              <span
                className="text-[11px] uppercase tracking-widest"
                style={{ fontFamily: "JetBrains Mono, monospace", color: "#52525B" }}
              >
                LOADING MAP
              </span>
            </div>
          ) : (
            <LeafletMap
              markers={markers}
              height="100%"
              zoom={11}
              onMarkerClick={handleMarkerClick}
            />
          )}

          {/* Empty state overlay */}
          {!loading && filteredIssues.length === 0 && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none"
              style={{ backgroundColor: "rgba(7,7,8,0.70)" }}
            >
              <MapPin className="w-10 h-10" style={{ color: "#3F3F46" }} />
              <p
                className="text-sm uppercase tracking-widest"
                style={{ fontFamily: "JetBrains Mono, monospace", color: "#52525B" }}
              >
                NO INCIDENTS MATCH CURRENT FILTERS
              </p>
            </div>
          )}
        </div>

        {/* ── Sidebar (w-80) ───────────────────────────────────────────────── */}
        <div
          className="w-80 flex-shrink-0 flex flex-col border-l"
          style={{
            backgroundColor: "#111114",
            borderColor:     "rgba(255,255,255,0.08)",
          }}
        >
          {/* Sidebar header */}
          <div
            className="flex-shrink-0 px-4 py-3 border-b"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <p
              className="text-[10px] uppercase tracking-widest"
              style={{ fontFamily: "JetBrains Mono, monospace", color: "#52525B" }}
            >
              INCIDENT QUEUE
            </p>
          </div>

          {/* Scrollable issue list */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filteredIssues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 gap-2">
                <MapPin className="w-8 h-8" style={{ color: "#27272A" }} />
                <p
                  className="text-[10px] uppercase tracking-widest text-center"
                  style={{ fontFamily: "JetBrains Mono, monospace", color: "#3F3F46" }}
                >
                  NO INCIDENTS
                </p>
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  selected={selectedIssue?.id === issue.id}
                  onClick={() => handleCardClick(issue)}
                />
              ))
            )}
          </div>

          {/* Footer: total count */}
          {!loading && filteredIssues.length > 0 && (
            <div
              className="flex-shrink-0 px-4 py-2.5 border-t"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
            >
              <p
                className="text-[10px] uppercase tracking-widest text-center"
                style={{ fontFamily: "JetBrains Mono, monospace", color: "#3F3F46" }}
              >
                {filteredIssues.length} OF {issues.length} TOTAL
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Incident Drawer ─────────────────────────────────────────────────── */}
      <IncidentDrawer
        issue={selectedIssue}
        open={drawerOpen}
        onClose={handleDrawerClose}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
