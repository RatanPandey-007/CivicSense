import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { LeafletMap } from "../../components/ui/LeafletMap";

interface Issue {
  id: string;
  title: string;
  address: string;
  location_lat?: number;
  location_lng?: number;
  status: string;
  priority: string;
  ai_category?: string;
  created_at: string;
  updated_at: string;
}

export default function MunicipalDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIssues() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/issues", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setIssues(data);
        }
      } catch (err) {
        console.error("Error fetching issues:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchIssues();
  }, []);

  const totalAssigned = issues.length;
  const pendingAction = issues.filter(
    (i) => i.status === "open" || i.status === "in_progress",
  ).length;

  // Calculate resolved this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const resolvedThisWeek = issues.filter(
    (i) => i.status === "resolved" && new Date(i.updated_at) >= oneWeekAgo,
  ).length;

  if (loading) {
    return (
      <div className="p-8 text-muted-foreground animate-pulse text-center">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Municipal Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of issues assigned to your ward.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-elevated p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Assigned Issues
            </span>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-foreground">
              {totalAssigned}
            </h3>
          </div>
        </div>

        <div className="card-elevated p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Pending Action
            </span>
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-foreground">
              {pendingAction}
            </h3>
          </div>
        </div>

        <div className="card-elevated p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Resolved This Week
            </span>
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-foreground">
              {resolvedThisWeek}
            </h3>
          </div>
        </div>
      </div>

      {/* Live Map */}
      <div className="card-elevated p-6 mt-6">
        <div className="mb-6">
          <h3 className="font-semibold text-lg">Assigned Issue Map</h3>
          <p className="text-sm text-muted-foreground">
            Geotagged civic issues requiring your attention
          </p>
        </div>
        <div className="h-[400px] w-full rounded-xl overflow-hidden z-0 relative">
          <LeafletMap
            center={[26.8467, 80.9462]}
            zoom={12}
            markers={issues
              .filter(
                (i) =>
                  i.location_lat && i.location_lng && i.status !== "resolved",
              )
              .map((issue: Issue) => ({
                id: issue.id,
                lat: issue.location_lat!,
                lng: issue.location_lng!,
                popupContent: `
                  <strong style="color: hsl(var(--primary))">${issue.title}</strong><br/>
                  <span style="font-size: 0.75rem; color: #666;">${issue.address}</span><br/><br/>
                  <div style="font-size: 0.875rem;">
                    Status: <span style="text-transform: capitalize; font-weight: 600; color: rgb(234 179 8)">${issue.status.replace("_", " ")}</span><br/>
                    Priority: <span style="text-transform: capitalize;">${issue.priority}</span>
                  </div>
                `,
              }))}
          />
        </div>
      </div>
    </div>
  );
}
