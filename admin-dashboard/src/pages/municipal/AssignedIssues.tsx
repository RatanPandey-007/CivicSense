import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, CheckCircle, Clock } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

import { supabase } from "../../lib/supabaseClient";

interface Issue {
  id: string;
  title: string;
  address: string;
  status: string;
  priority: string;
  created_at: string;
  reporter_id: string;
  ai_category: string;
  ai_confidence: number;
}

export default function MunicipalIssues() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/issues", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch issues");
      const data = await res.json();
      setIssues(data || []);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateIssueStatus = async (id: string, newStatus: string) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`http://localhost:5000/api/issues/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      // Soft update local state
      setIssues(
        issues.map((iss) =>
          iss.id === id ? { ...iss, status: newStatus } : iss,
        ),
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // Pagination & Filtering Logic
  const filteredIssues = issues.filter((issue) => {
    const term = searchTerm.toLowerCase();
    const searchMatch =
      (issue.title || "").toLowerCase().includes(term) ||
      (issue.id || "").toLowerCase().includes(term) ||
      (issue.address || "").toLowerCase().includes(term);

    let statusMatch = true;
    if (filterStatus !== "All") {
      const normalizedIssueStatus = (issue.status || "open")
        .toLowerCase()
        .replace("_", " ");
      statusMatch = normalizedIssueStatus === filterStatus.toLowerCase();
    }

    return searchMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage) || 1;
  const paginatedIssues = filteredIssues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return "bg-primary/20 text-primary border-primary/30";
      case "in_progress":
      case "in progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "open":
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "text-destructive font-bold";
      case "high":
        return "text-orange-400 font-semibold";
      case "medium":
        return "text-yellow-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Assigned Issues
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and resolve issues assigned to your municipality.
          </p>
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-background/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search assigned issues..."
              className="pl-9 bg-background focus:ring-blue-500 border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              className="bg-background border border-border text-sm rounded-md px-3 py-2 text-foreground"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1); // Reset page on filter
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* List View */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Issue ID</th>
                <th className="px-6 py-4 font-medium">Title & Location</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Date & Reporter</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Loading specific issues...
                  </td>
                </tr>
              ) : (
                paginatedIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      <Link
                        to={`/municipal/issues/${issue.id}`}
                        className="hover:underline text-primary"
                      >
                        {issue.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {issue.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 text-blue-500">
                        AI Category: {issue.ai_category || "Unclassified"} (
                        {Math.round((issue.ai_confidence || 0) * 100)}%)
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {issue.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(issue.status || "open")}`}
                      >
                        {(issue.status || "open").replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`capitalize ${getPriorityColor(issue.priority || "medium")}`}
                      >
                        {issue.priority || "medium"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-foreground">
                        {new Date(issue.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Reporter ID:{" "}
                        {issue.reporter_id?.substring(0, 8) || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {issue.status !== "in_progress" &&
                          issue.status !== "resolved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateIssueStatus(issue.id, "in_progress")
                              }
                              className="text-blue-500 hover:bg-blue-500/10 border-blue-500/20"
                            >
                              <Clock className="w-4 h-4 mr-2" /> Start
                            </Button>
                          )}
                        {issue.status !== "resolved" && (
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() =>
                              updateIssueStatus(issue.id, "resolved")
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Resolve
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination logic */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border/50 flex flex-wrap gap-4 items-center justify-between text-sm text-muted-foreground bg-background/50">
            <div>
              Showing {paginatedIssues.length} of {filteredIssues.length}{" "}
              assignments
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
