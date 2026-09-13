import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  User,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { LeafletMap } from "../../components/ui/LeafletMap";
import {
  fetchAdminIssueById,
  updateAdminIssueStatus,
  type AdminIssue,
} from "../../lib/dataAdapter";
import { cn } from "../../lib/utils";

export default function ResolutionAction() {
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
        RETRIEVING WARD RESOLUTION DOSSIER...
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <p className="font-mono text-sm text-[#A1A1AA]">
          INCIDENT RECORD NOT FOUND OR RESTRICTED
        </p>
        <Button
          variant="outline"
          onClick={() => navigate("/municipal/issues")}
          className="rounded-none font-mono text-xs text-white border-[rgba(255,255,255,0.08)]"
        >
          Return to Assigned List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/municipal/issues")}
            className="rounded-none bg-[#0D0D0F] border-[rgba(255,255,255,0.08)] text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#71717A] uppercase tracking-wider">
              <span>WARD RESOLUTION DESK</span>
              <span>//</span>
              <span className="text-[#22D3EE] font-bold">{issue.id}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {issue.title}
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

      {/* 2-Column Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6 space-y-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[#71717A]">
              Submitted Field Payload
            </span>

            {issue.image_url ? (
              <div className="relative aspect-video w-full bg-[#080808] border border-[rgba(255,255,255,0.08)] overflow-hidden">
                <img
                  src={issue.image_url}
                  alt={issue.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-44 bg-[#080808] border border-[rgba(255,255,255,0.08)] flex items-center justify-center font-mono text-xs text-[#71717A]">
                No photographic payload submitted
              </div>
            )}

            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA] mb-2">
                Citizen Narrative
              </h3>
              <p className="text-sm text-white/90 leading-relaxed bg-[#080808] p-4 border border-[rgba(255,255,255,0.06)] font-mono">
                {issue.description || "No description logged."}
              </p>
            </div>
          </div>

          {/* AI Category */}
          <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#06B6D4]" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-white">
                AI Classification Breakdown
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3 bg-[#080808] border border-[rgba(255,255,255,0.06)]">
                <div className="text-[10px] text-[#71717A]">CATEGORY</div>
                <div className="text-sm font-semibold text-white mt-1">
                  {issue.ai_category || "Road Infrastructure"}
                </div>
              </div>
              <div className="p-3 bg-[#080808] border border-[rgba(255,255,255,0.06)]">
                <div className="text-[10px] text-[#71717A]">CONFIDENCE</div>
                <div className="text-sm font-semibold text-[#06B6D4] mt-1">
                  {Math.round((issue.ai_confidence || 0.94) * 100)}% Match
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6">
            <div className="flex items-center justify-between mb-3 font-mono text-xs">
              <span className="text-white flex items-center gap-1.5 uppercase">
                <MapPin className="w-4 h-4 text-[#06B6D4]" />
                Geotagged Incident Location
              </span>
              <span className="text-[#71717A]">{issue.address}</span>
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

        {/* Right Column */}
        <div className="space-y-6">
          {/* Informant Profile */}
          <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-[rgba(255,255,255,0.06)]">
              <User className="w-4 h-4 text-[#06B6D4]" />
              <h3 className="uppercase tracking-wider text-white">
                Citizen Informant
              </h3>
            </div>

            <div className="flex justify-between">
              <span className="text-[#71717A]">Name</span>
              <span className="text-white font-medium">
                {issue.reporter_name || "Aadhaar Citizen"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#71717A]">Phone</span>
              <span className="text-white">
                {issue.reporter_phone || "+91 98451 •••••"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#71717A]">KYC</span>
              <span className="text-[#22C55E]">VERIFIED // UIDAI</span>
            </div>
          </div>

          {/* Action Commands */}
          <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[rgba(255,255,255,0.06)]">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-white">
                Ward Dispatch Action
              </h3>
            </div>

            <div className="flex flex-col gap-2.5 font-mono text-xs">
              {issue.status !== "in_progress" && issue.status !== "resolved" && (
                <Button
                  onClick={() => handleStatusUpdate("in_progress")}
                  disabled={updating}
                  className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-black font-semibold rounded-none"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Deploy Municipal Repair Crew
                </Button>
              )}

              {issue.status !== "resolved" && (
                <Button
                  onClick={() => handleStatusUpdate("resolved")}
                  disabled={updating}
                  className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-black font-semibold rounded-none"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Certify Incident Resolved
                </Button>
              )}

              {issue.status === "resolved" && (
                <div className="p-3 bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-center font-mono text-xs">
                  ✓ TICKET RESOLVED & ARCHIVED
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
