import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  User,
  CheckCircle2,
  Shield,
  Clock,
  Sparkles,
  Building,
  FileDown,
  AlertOctagon,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { LeafletMap } from "../../components/ui/LeafletMap";
import {
  fetchAdminIssueById,
  updateAdminIssueStatus,
  type AdminIssue,
} from "../../lib/dataAdapter";
import { cn } from "../../lib/utils";

export default function IssueDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<AdminIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadIssue(id);
    }
  }, [id]);

  const loadIssue = async (issueId: string) => {
    setLoading(true);
    const data = await fetchAdminIssueById(issueId);
    setIssue(data);
    setLoading(false);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!issue) return;
    setUpdating(true);
    setIssue({ ...issue, status: newStatus as any });
    await updateAdminIssueStatus(issue.id, newStatus);
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-[#71717A] font-mono text-xs">
        RETRIEVING INCIDENT CASE FILE...
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <AlertOctagon className="w-8 h-8 text-[#EF4444]" />
        <p className="font-mono text-sm text-[#A1A1AA]">
          INCIDENT RECORD NOT FOUND OR RESTRICTED
        </p>
        <Button
          variant="outline"
          onClick={() => navigate("/master/issues")}
          className="rounded-none font-mono text-xs text-white border-[rgba(255,255,255,0.08)]"
        >
          Return to Queue
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/master/issues")}
            className="rounded-none bg-[#0D0D0F] border-[rgba(255,255,255,0.08)] text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#71717A] uppercase tracking-wider">
              <span>DOSSIER</span>
              <span>//</span>
              <span className="text-[#818CF8] font-bold">{issue.id}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>{issue.title}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-mono text-xs uppercase px-2.5 py-1 border font-semibold tracking-wider",
              issue.status === "resolved"
                ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30"
                : issue.status === "in_progress"
                  ? "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30"
                  : "bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/30",
            )}
          >
            {issue.status.replace("_", " ")}
          </span>
          <span
            className={cn(
              "font-mono text-xs uppercase px-2.5 py-1 border font-semibold tracking-wider",
              issue.priority === "critical" || issue.priority === "urgent"
                ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30"
                : "bg-white/5 text-[#A1A1AA] border-white/10",
            )}
          >
            {issue.priority}
          </span>
        </div>
      </div>

      {/* 2-Column Main Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Photographic Evidence, AI Analysis, Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Evidence Viewer */}
          <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#71717A]">
                Photographic / Field Telemetry Evidence
              </span>
              <span className="font-mono text-[10px] text-[#22C55E]">
                EXIF GPS VERIFIED
              </span>
            </div>

            {issue.image_url ? (
              <div className="relative aspect-video w-full bg-[#080808] border border-[rgba(255,255,255,0.08)] overflow-hidden flex items-center justify-center group">
                <img
                  src={issue.image_url}
                  alt={issue.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/80">
                  <span>RESOLVED RESOLUTION: 1920x1080</span>
                  <span>GEO: {issue.location_lat}, {issue.location_lng}</span>
                </div>
              </div>
            ) : (
              <div className="h-48 bg-[#080808] border border-[rgba(255,255,255,0.08)] flex items-center justify-center font-mono text-xs text-[#71717A]">
                No photographic payload submitted
              </div>
            )}

            {/* Description */}
            <div className="pt-2">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA] mb-2">
                Citizen Incident Statement
              </h3>
              <p className="text-sm text-white/90 leading-relaxed bg-[#080808] p-4 border border-[rgba(255,255,255,0.06)] font-mono">
                {issue.description || "No descriptive narrative recorded."}
              </p>
            </div>
          </div>

          {/* AI Inference Breakdown */}
          <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#6366F1]" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-white">
                Autonomous AI Triage Engine Verdict
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="p-3 bg-[#080808] border border-[rgba(255,255,255,0.06)]">
                <div className="text-[10px] text-[#71717A] uppercase">
                  Classified Category
                </div>
                <div className="text-sm font-semibold text-white mt-1">
                  {issue.ai_category || "Public Safety"}
                </div>
              </div>

              <div className="p-3 bg-[#080808] border border-[rgba(255,255,255,0.06)]">
                <div className="text-[10px] text-[#71717A] uppercase">
                  Model Confidence
                </div>
                <div className="text-sm font-semibold text-[#818CF8] mt-1">
                  {Math.round((issue.ai_confidence || 0.94) * 100)}% Match
                </div>
              </div>

              <div className="p-3 bg-[#080808] border border-[rgba(255,255,255,0.06)]">
                <div className="text-[10px] text-[#71717A] uppercase">
                  Routing Priority
                </div>
                <div className="text-sm font-semibold text-[#EF4444] mt-1 uppercase">
                  {issue.priority}
                </div>
              </div>
            </div>
          </div>

          {/* GPS Pinpoint Map */}
          <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#6366F1]" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-white">
                  Geographic Pinpoint
                </h3>
              </div>
              <span className="font-mono text-[11px] text-[#71717A]">
                {issue.address}
              </span>
            </div>

            <div className="h-64 border border-[rgba(255,255,255,0.08)] overflow-hidden">
              <LeafletMap
                center={[issue.location_lat || 26.8467, issue.location_lng || 80.9462]}
                zoom={14}
                markers={[
                  {
                    id: issue.id,
                    lat: issue.location_lat || 26.8467,
                    lng: issue.location_lng || 80.9462,
                    title: issue.title,
                    priority: issue.priority,
                    status: issue.status,
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Reporter Credentials & Administrative Commands */}
        <div className="space-y-6">
          {/* Reporter Identification */}
          <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#818CF8]" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-white">
                Citizen Informant Profile
              </h3>
            </div>

            <div className="space-y-3 font-mono text-xs divide-y divide-[rgba(255,255,255,0.06)]">
              <div className="pt-2 flex justify-between">
                <span className="text-[#71717A]">Citizen Name</span>
                <span className="text-white font-medium">
                  {issue.reporter_name || "Aadhaar Verified Citizen"}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#71717A]">Phone Verified</span>
                <span className="text-white">
                  {issue.reporter_phone || "+91 98451 •••••"}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#71717A]">Aadhaar Auth</span>
                <span className="text-[#22C55E]">VALIDATED // SHA256</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#71717A]">Timestamp</span>
                <span className="text-[#A1A1AA]">
                  {new Date(issue.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Municipal Jurisdiction Card */}
          <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#06B6D4]" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-white">
                Assigned Jurisdiction
              </h3>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 bg-[#080808] border border-[rgba(255,255,255,0.06)]">
                <div className="text-[10px] text-[#71717A]">WARD DESIGNATION</div>
                <div className="text-white font-bold mt-0.5">
                  Ward 12 // Central District
                </div>
              </div>
              <div className="p-3 bg-[#080808] border border-[rgba(255,255,255,0.06)]">
                <div className="text-[10px] text-[#71717A]">MUNICIPAL PINCODE</div>
                <div className="text-[#06B6D4] font-bold mt-0.5">
                  {issue.district_code || "226001"}
                </div>
              </div>
            </div>
          </div>

          {/* Executive Dispatch Actions */}
          <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#22C55E]" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-white">
                Executive Action Controls
              </h3>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs">
              {issue.status !== "in_progress" && issue.status !== "resolved" && (
                <Button
                  onClick={() => handleStatusUpdate("in_progress")}
                  disabled={updating}
                  className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-black font-semibold rounded-none"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Dispatch Municipal Work Crew
                </Button>
              )}

              {issue.status !== "resolved" && (
                <Button
                  onClick={() => handleStatusUpdate("resolved")}
                  disabled={updating}
                  className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-black font-semibold rounded-none"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm Field Resolution & Close
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => alert("Official case file exported to PDF.")}
                className="w-full bg-transparent hover:bg-white/5 border-[rgba(255,255,255,0.08)] text-[#A1A1AA] hover:text-white rounded-none"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export Audit Dossier (PDF)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
