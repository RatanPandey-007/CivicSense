import { useEffect, useState, lazy, Suspense } from "react";
import {
  X,
  MapPin,
  User,
  Phone,
  CreditCard,
  Camera,
  Brain,
  Zap,
  CheckCircle,
  Loader2,
} from "lucide-react";
import type { AdminIssue } from "../../lib/dataAdapter";
import { escalateIncident } from "../../lib/dataAdapter";
import EscalationModal from "./EscalationModal";
import { formatDistanceToNow, format } from "date-fns";

// Lazy load map to avoid SSR issues
const LeafletMap = lazy(() => import("../ui/LeafletMap"));

interface IncidentDrawerProps {
  issue: AdminIssue | null;
  open: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, status: AdminIssue["status"]) => void;
}

const STATUS_CONFIG = {
  open: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "OPEN" },
  in_progress: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "IN PROGRESS" },
  resolved: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", label: "RESOLVED" },
  rejected: { color: "text-[#71717A]", bg: "bg-[#71717A]/10", border: "border-[#71717A]/20", label: "REJECTED" },
};

const PRIORITY_CONFIG = {
  low: { color: "text-[#71717A]", label: "LOW" },
  medium: { color: "text-blue-400", label: "MEDIUM" },
  high: { color: "text-amber-400", label: "HIGH" },
  critical: { color: "text-red-400", label: "CRITICAL" },
  urgent: { color: "text-red-400", label: "URGENT" },
};

const LIFECYCLE_STAGES = [
  { key: "reported", label: "REPORTED" },
  { key: "analyzed", label: "AI ANALYZED" },
  { key: "assigned", label: "ASSIGNED" },
  { key: "in_progress", label: "IN PROGRESS" },
  { key: "resolved", label: "RESOLVED" },
];

function getActiveStage(status: AdminIssue["status"]): number {
  switch (status) {
    case "open": return 1;
    case "in_progress": return 3;
    case "resolved": return 4;
    case "rejected": return 4;
    default: return 0;
  }
}

export default function IncidentDrawer({
  issue,
  open,
  onClose,
  onStatusChange,
}: IncidentDrawerProps) {
  const [showEscalation, setShowEscalation] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<AdminIssue["status"] | "">("");
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (issue) setSelectedStatus(issue.status);
  }, [issue]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleStatusUpdate = async () => {
    if (!issue || !selectedStatus || selectedStatus === issue.status) return;
    setUpdating(true);
    await new Promise((r) => setTimeout(r, 800));
    onStatusChange?.(issue.id, selectedStatus as AdminIssue["status"]);
    setUpdating(false);
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 2000);
  };

  const handleEscalate = async (_reason: string) => {
    if (!issue) return;
    await escalateIncident(issue.id);
    setShowEscalation(false);
    onClose();
  };

  if (!issue) return null;

  const statusCfg = STATUS_CONFIG[issue.status];
  const priorityCfg = PRIORITY_CONFIG[issue.priority] || PRIORITY_CONFIG.medium;
  const activeStage = getActiveStage(issue.status);

  const miniMarkers = [
    {
      id: issue.id,
      lat: issue.location_lat || 26.85,
      lng: issue.location_lng || 80.95,
      title: issue.title,
      priority: issue.priority,
      status: issue.status,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-[91] w-full max-w-lg bg-[#0D0D0F] border-l border-[rgba(255,255,255,0.08)] shadow-2xl transition-transform duration-300 ease-out flex flex-col overflow-hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Priority accent stripe */}
        <div
          className={`h-0.5 w-full ${
            issue.priority === "critical" || issue.priority === "urgent"
              ? "bg-gradient-to-r from-red-600 via-orange-500 to-red-600"
              : issue.priority === "high"
              ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"
              : "bg-gradient-to-r from-[#6366F1] via-indigo-400 to-[#6366F1]"
          }`}
        />

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest">
                INCIDENT
              </span>
              <span className="text-[10px] font-mono text-[#6366F1] uppercase tracking-widest">
                #{issue.id}
              </span>
            </div>
            <h2 className="text-white font-semibold text-base leading-snug pr-4 truncate">
              {issue.title}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusCfg.bg} ${statusCfg.border} ${statusCfg.color}`}
              >
                {statusCfg.label}
              </span>
              <span className={`text-[10px] font-mono ${priorityCfg.color}`}>
                ⬤ {priorityCfg.label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#71717A] hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgba(255,255,255,0.08)]">
          {/* Photo evidence */}
          {issue.image_url && (
            <div className="relative">
              <img
                src={issue.image_url}
                alt="Incident evidence"
                className="w-full h-44 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-white/60" />
                <span className="text-white/60 text-xs">Photo Evidence</span>
              </div>
            </div>
          )}

          <div className="p-5 space-y-5">
            {/* Citizen statement */}
            <div>
              <p className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest mb-2">
                CITIZEN STATEMENT
              </p>
              <p className="text-[#A1A1AA] text-sm leading-relaxed">
                {issue.description}
              </p>
            </div>

            {/* AI Analysis */}
            {issue.ai_category && (
              <div className="bg-[#111114] rounded-lg border border-[rgba(99,102,241,0.15)] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-[#6366F1]" />
                  <p className="text-[10px] font-mono text-[#6366F1] uppercase tracking-widest">
                    AI ANALYSIS
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#0D0D0F] rounded p-3">
                    <p className="text-[10px] font-mono text-[#52525B] uppercase mb-1">
                      CATEGORY
                    </p>
                    <p className="text-white text-xs font-medium">
                      {issue.ai_category}
                    </p>
                  </div>
                  <div className="bg-[#0D0D0F] rounded p-3">
                    <p className="text-[10px] font-mono text-[#52525B] uppercase mb-1">
                      CONFIDENCE
                    </p>
                    <p className="text-[#6366F1] text-xs font-mono font-medium">
                      {((issue.ai_confidence || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-[#0D0D0F] rounded p-3">
                    <p className="text-[10px] font-mono text-[#52525B] uppercase mb-1">
                      PRIORITY
                    </p>
                    <p className={`text-xs font-mono font-medium ${priorityCfg.color}`}>
                      {priorityCfg.label}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reporter info */}
            <div>
              <p className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest mb-2">
                REPORTER
              </p>
              <div className="space-y-2">
                {issue.reporter_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-3.5 h-3.5 text-[#71717A]" />
                    <span className="text-[#A1A1AA]">{issue.reporter_name}</span>
                  </div>
                )}
                {issue.reporter_phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-3.5 h-3.5 text-[#71717A]" />
                    <span className="text-[#A1A1AA] font-mono">{issue.reporter_phone}</span>
                  </div>
                )}
                {issue.reporter_aadhar && (
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="w-3.5 h-3.5 text-[#71717A]" />
                    <span className="text-[#A1A1AA] font-mono">{issue.reporter_aadhar}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <p className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest mb-2">
                LOCATION
              </p>
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="w-3.5 h-3.5 text-[#71717A] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#A1A1AA] text-sm">{issue.address}</p>
                  {issue.location_lat && issue.location_lng && (
                    <p className="text-[#52525B] text-xs font-mono mt-0.5">
                      {issue.location_lat.toFixed(6)}, {issue.location_lng.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
              {/* Mini map */}
              {issue.location_lat && issue.location_lng && (
                <div className="h-36 rounded-lg overflow-hidden border border-[rgba(255,255,255,0.06)]">
                  <Suspense
                    fallback={
                      <div className="h-full bg-[#111114] flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-[#71717A] animate-spin" />
                      </div>
                    }
                  >
                    <LeafletMap
                      markers={miniMarkers}
                      center={[issue.location_lat, issue.location_lng]}
                      zoom={15}
                      height="144px"
                    />
                  </Suspense>
                </div>
              )}
            </div>

            {/* Lifecycle timeline */}
            <div>
              <p className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest mb-3">
                LIFECYCLE
              </p>
              <div className="flex items-center gap-0">
                {LIFECYCLE_STAGES.map((stage, i) => {
                  const isActive = i <= activeStage;
                  const isCurrent = i === activeStage;
                  return (
                    <div key={stage.key} className="flex items-center flex-1">
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                            isCurrent
                              ? "border-[#6366F1] bg-[#6366F1] shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                              : isActive
                              ? "border-[#6366F1]/40 bg-[#6366F1]/20"
                              : "border-[rgba(255,255,255,0.08)] bg-[#111114]"
                          }`}
                        >
                          {isActive ? (
                            <CheckCircle className={`w-3 h-3 ${isCurrent ? "text-white" : "text-[#6366F1]"}`} />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#52525B]" />
                          )}
                        </div>
                        <p
                          className={`text-[9px] font-mono text-center leading-tight max-w-[44px] ${
                            isActive ? "text-[#A1A1AA]" : "text-[#52525B]"
                          }`}
                        >
                          {stage.label}
                        </p>
                      </div>
                      {i < LIFECYCLE_STAGES.length - 1 && (
                        <div
                          className={`h-px flex-1 mx-1 ${
                            i < activeStage
                              ? "bg-[#6366F1]/40"
                              : "bg-[rgba(255,255,255,0.06)]"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#111114] rounded-lg p-3 border border-[rgba(255,255,255,0.04)]">
                <p className="text-[10px] font-mono text-[#52525B] uppercase mb-1">
                  REPORTED
                </p>
                <p className="text-[#A1A1AA] text-xs">
                  {formatDistanceToNow(new Date(issue.created_at), {
                    addSuffix: true,
                  })}
                </p>
                <p className="text-[#52525B] text-[10px] font-mono mt-0.5">
                  {format(new Date(issue.created_at), "dd MMM yyyy HH:mm")}
                </p>
              </div>
              {issue.updated_at && (
                <div className="bg-[#111114] rounded-lg p-3 border border-[rgba(255,255,255,0.04)]">
                  <p className="text-[10px] font-mono text-[#52525B] uppercase mb-1">
                    LAST UPDATE
                  </p>
                  <p className="text-[#A1A1AA] text-xs">
                    {formatDistanceToNow(new Date(issue.updated_at), {
                      addSuffix: true,
                    })}
                  </p>
                  <p className="text-[#52525B] text-[10px] font-mono mt-0.5">
                    {format(new Date(issue.updated_at), "dd MMM yyyy HH:mm")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action footer */}
        <div className="border-t border-[rgba(255,255,255,0.06)] p-4 space-y-3 flex-shrink-0 bg-[#0A0A0C]">
          {/* Status update */}
          <div className="flex gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as AdminIssue["status"])}
              className="flex-1 bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-[#A1A1AA] text-sm focus:outline-none focus:border-[rgba(255,255,255,0.20)] transition-colors"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || selectedStatus === issue.status || updating}
              className="px-4 py-2 bg-[#6366F1] hover:bg-indigo-500 disabled:bg-[#6366F1]/20 disabled:text-[#6366F1]/40 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2"
            >
              {updating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : updateSuccess ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : null}
              Update
            </button>
          </div>

          {/* Escalate button */}
          <button
            onClick={() => setShowEscalation(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/10 border border-red-500/20 hover:bg-red-600/20 hover:border-red-500/40 rounded-lg text-red-400 text-sm font-medium transition-all"
          >
            <Zap className="w-4 h-4" />
            ESCALATE INCIDENT
          </button>
        </div>
      </div>

      {/* Escalation modal */}
      {showEscalation && (
        <EscalationModal
          issueId={issue.id}
          issueTitle={issue.title}
          onConfirm={handleEscalate}
          onClose={() => setShowEscalation(false)}
        />
      )}
    </>
  );
}
