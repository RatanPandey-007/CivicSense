import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  Building,
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import {
  fetchAdminIssues,
  updateAdminIssueStatus,
  type AdminIssue,
  FALLBACK_ADMIN_ISSUES,
} from "../../lib/dataAdapter";
import { cn } from "../../lib/utils";

export default function MunicipalIssues() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [issues, setIssues] = useState<AdminIssue[]>(FALLBACK_ADMIN_ISSUES);
  const [loading, setLoading] = useState(true);

  const loadIssues = async () => {
    setLoading(true);
    const data = await fetchAdminIssues();
    setIssues(data);
    setLoading(false);
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setIssues((prev) =>
      prev.map((iss) =>
        iss.id === id ? { ...iss, status: newStatus as any } : iss,
      ),
    );
    await updateAdminIssueStatus(id, newStatus);
  };

  const filteredIssues = issues.filter((issue) => {
    const term = searchTerm.toLowerCase();
    const searchMatch =
      (issue.title || "").toLowerCase().includes(term) ||
      (issue.id || "").toLowerCase().includes(term) ||
      (issue.address || "").toLowerCase().includes(term);

    let statusMatch = true;
    if (filterStatus !== "All") {
      const norm = (issue.status || "open").toLowerCase().replace("_", " ");
      statusMatch = norm === filterStatus.toLowerCase();
    }

    return searchMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage) || 1;
  const paginatedIssues = filteredIssues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#22D3EE] uppercase tracking-widest mb-1">
            <Building className="w-3 h-3" />
            <span>MUNICIPAL ACTION DISPATCH</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Assigned Ward Incidents
          </h1>
        </div>

        <button
          onClick={loadIssues}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] text-xs font-mono text-[#A1A1AA] hover:text-white hover:border-[#06B6D4] transition-colors"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin text-[#06B6D4]")} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[rgba(255,255,255,0.08)] bg-[#0A0A0C] flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <Input
              placeholder="Filter by ticket ID or address..."
              className="pl-9 bg-[#080808] border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-[#71717A] font-mono focus:border-[#06B6D4] rounded-none"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#71717A]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Status:</span>
            </div>
            <select
              className="bg-[#080808] border border-[rgba(255,255,255,0.08)] text-xs font-mono text-white px-3 py-1.5 focus:outline-none focus:border-[#06B6D4]"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#080808] border-b border-[rgba(255,255,255,0.06)] font-mono text-[10px] text-[#71717A] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Signal ID</th>
                <th className="px-5 py-3">Incident Synopsis & GPS</th>
                <th className="px-5 py-3">AI Prediction</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Current Status</th>
                <th className="px-5 py-3">Reported Time</th>
                <th className="px-5 py-3 text-right">Field Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
              {paginatedIssues.map((issue) => (
                <tr
                  key={issue.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-5 py-4 font-mono font-medium text-white whitespace-nowrap">
                    <Link
                      to={`/municipal/issues/${issue.id}`}
                      className="text-[#22D3EE] hover:underline flex items-center gap-1"
                    >
                      <span>{issue.id}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                    </Link>
                  </td>

                  <td className="px-5 py-4 max-w-xs">
                    <div className="font-semibold text-white truncate text-xs">
                      {issue.title}
                    </div>
                    <div className="text-[11px] text-[#71717A] truncate mt-0.5 font-mono">
                      {issue.address}
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-white">
                      <Sparkles className="w-3 h-3 text-[#06B6D4]" />
                      <span>{issue.ai_category || "Unclassified"}</span>
                    </div>
                    <div className="font-mono text-[10px] text-[#22D3EE] mt-0.5">
                      {Math.round((issue.ai_confidence || 0.94) * 100)}% MATCH
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
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

                  <td className="px-5 py-4 whitespace-nowrap">
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

                  <td className="px-5 py-4 font-mono text-[11px] text-[#71717A] whitespace-nowrap">
                    {new Date(issue.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5 font-mono text-xs">
                      {issue.status !== "in_progress" && issue.status !== "resolved" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(issue.id, "in_progress")}
                          className="rounded-none bg-[#06B6D4] hover:bg-[#0891B2] text-black font-semibold text-[11px] h-7 px-2.5"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          Deploy
                        </Button>
                      )}
                      {issue.status !== "resolved" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(issue.id, "resolved")}
                          className="rounded-none bg-[#22C55E] hover:bg-[#16A34A] text-black font-semibold text-[11px] h-7 px-2.5"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[rgba(255,255,255,0.08)] bg-[#0A0A0C] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#71717A]">
            <div>
              Showing {paginatedIssues.length} of {filteredIssues.length} assignments
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#EDEDED]">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="rounded-none text-xs bg-transparent border-[rgba(255,255,255,0.08)] text-white hover:bg-white/5"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-none text-xs bg-transparent border-[rgba(255,255,255,0.08)] text-white hover:bg-white/5"
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
