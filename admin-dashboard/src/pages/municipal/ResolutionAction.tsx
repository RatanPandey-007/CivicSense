import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  User,
  CheckCircle,
  Tag,
  Phone,
  Shield,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../lib/supabaseClient";
import { LeafletMap } from "../../components/ui/LeafletMap";

interface Issue {
  id: string;
  title: string;
  description: string;
  address: string;
  location_lat: number;
  location_lng: number;
  image_url?: string;
  status: string;
  priority: string;
  created_at: string;
  reporter_id: string;
  reporter_name?: string;
  reporter_phone?: string;
  reporter_aadhar?: string;
  ai_category: string;
  ai_confidence: number;
}

export default function ResolutionAction() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchIssueDetails(id);
    }
  }, [id]);

  const fetchIssueDetails = async (issueId: string) => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error("Not authenticated");

      const response = await fetch(
        `http://localhost:5000/api/issues/${issueId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        if (response.status === 403)
          throw new Error("Forbidden: This issue is not in your municipality");
        throw new Error("Failed to load issue details");
      }

      const data = await response.json();
      setIssue(data);
    } catch (error) {
      console.error("Error fetching issue details:", error);
      alert(error instanceof Error ? error.message : "Error loading issue");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!issue) return;
    try {
      setUpdating(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error("Not authenticated");

      const response = await fetch(
        `http://localhost:5000/api/issues/${issue.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) throw new Error("Failed to update status");

      // Update local state
      setIssue({ ...issue, status: newStatus });
      alert(`Status Updated: Issue marked as ${newStatus.replace("_", " ")}`);
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : "Could not update issue status.";
      alert(`Update Failed: ${msg}`);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch ((status || "open").toLowerCase()) {
      case "open":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "in_progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "resolved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-muted-foreground">
        Loading issue details...
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground">
        <p>Issue not found or access denied.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/municipal/issues")}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/municipal/issues")}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-3">
            Issue Details
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(
                issue.status,
              )}`}
            >
              {(issue.status || "open").replace("_", " ")}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            ID: {issue.id} • Reported on{" "}
            {new Date(issue.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-elevated p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                {issue.title || "Untitled Issue"}
              </h2>

              {issue.image_url && (
                <div className="mb-6 rounded-xl overflow-hidden border border-border bg-muted/20 relative aspect-video flex items-center justify-center">
                  <img
                    src={issue.image_url}
                    alt="Submitted issue evidence"
                    className="object-contain max-h-[400px] w-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {!issue.image_url.startsWith("data:image") &&
                    !issue.image_url.startsWith("http") && (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground p-4 text-center">
                        <p>Image preview unavailable or processing...</p>
                      </div>
                    )}
                </div>
              )}

              <div className="prose prose-invert max-w-none space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Description
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {issue.description || "No description provided."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Tag className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-muted-foreground">
                  AI Category:
                </span>{" "}
                {issue.ai_category || "Unclassified"} (
                {Math.round((issue.ai_confidence || 0) * 100)}% Confidence)
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Shield className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-muted-foreground">
                  Priority:
                </span>{" "}
                <span className="capitalize">{issue.priority || "Medium"}</span>
              </div>
            </div>
          </div>

          {/* Location details */}
          <div className="card-elevated p-6 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Location
            </h3>
            <p className="text-muted-foreground">{issue.address}</p>

            <div className="h-[300px] rounded-lg overflow-hidden border border-border relative z-0">
              {issue.location_lat && issue.location_lng ? (
                <LeafletMap
                  center={[issue.location_lat, issue.location_lng]}
                  zoom={15}
                  markers={[
                    {
                      id: issue.id,
                      lat: issue.location_lat,
                      lng: issue.location_lng,
                      popupContent: issue.title || "Issue Location",
                    },
                  ]}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/20 text-muted-foreground">
                  No precise location recorded.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - User Info & Actions */}
        <div className="space-y-6">
          <div className="card-elevated p-6 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-secondary" /> Reporter Details
            </h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground py-1">
                  Reporter Type
                </Label>
                <div className="font-medium">
                  {issue.reporter_id === "14015746-53d5-4719-9c3e-bbc18a88fba8"
                    ? "Anonymous Citizen"
                    : "Registered User"}
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground py-1">
                  Reporter ID
                </Label>
                <div className="text-xs break-all bg-muted/50 p-2 rounded border border-border/50">
                  {issue.reporter_id || "N/A"}
                </div>
              </div>

              {issue.reporter_name && (
                <div>
                  <Label className="text-xs text-muted-foreground py-1">
                    Name
                  </Label>
                  <div className="font-medium">{issue.reporter_name}</div>
                </div>
              )}

              {issue.reporter_phone && (
                <div>
                  <Label className="text-xs text-muted-foreground py-1">
                    Phone
                  </Label>
                  <div className="font-medium flex items-center gap-2">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    {issue.reporter_phone}
                  </div>
                </div>
              )}

              {issue.reporter_aadhar && (
                <div>
                  <Label className="text-xs text-muted-foreground py-1">
                    Aadhar Credential
                  </Label>
                  <div className="font-medium text-blue-400 tracking-wider">
                    {issue.reporter_aadhar}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Administrative Actions */}
          <div className="card-elevated p-6 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" /> Municipal
              Actions
            </h3>
            <p className="text-sm text-muted-foreground">
              Update the status of this issue as work progresses. Only marked as
              Over once completely resolved.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  variant="outline"
                  disabled={
                    updating ||
                    issue.status === "in_progress" ||
                    issue.status === "resolved"
                  }
                  onClick={() => handleStatusUpdate("in_progress")}
                >
                  Mark In Progress
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  disabled={updating || issue.status === "resolved"}
                  onClick={() => handleStatusUpdate("resolved")}
                >
                  Mark Resolved
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Label = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={className}>{children}</div>;
