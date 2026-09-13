import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import {
  fetchAdminIssues,
  updateAdminIssueStatus,
  deleteAdminIssue,
  type AdminIssue,
  FALLBACK_ADMIN_ISSUES,
} from "../../lib/dataAdapter";
import { cn } from "../../lib/utils";

export default function MasterIssues() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
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
    // Optimistic UI update
    setIssues((prev) =>
      prev.map((iss) =>
        iss.id === id ? { ...iss, status: newStatus as any } : iss,
      ),
    );
    await updateAdminIssueStatus(id, newStatus);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently archive and delete this civic ticket?"))
      return;
    setIssues((prev) => prev.filter((iss) => iss.id !== id));
    await deleteAdminIssue(id);
  };

  // Filter & Search logic
  const filteredIssues = issues.filter((issue) => {
    const term = searchTerm.toLowerCase();
    const searchMatch =
      (issue.title || "").toLowerCase().includes(term) ||
      (issue.id || "").toLowerCase().includes(term) ||
      (issue.address || "").toLowerCase().includes(term) ||
      (issue.ai_category || "").toLowerCase().includes(term);

    let statusMatch = true;
    if (filterStatus !== "All") {
      const normStatus = (issue.status || "open").toLowerCase().replace("_", " ");
      statusMatch = normStatus === filterStatus.toLowerCase();
    }

    let priorityMatch = true;
    if (filterPriority !== "All") {
      priorityMatch =
        (issue.priority || "").toLowerCase() === filterPriority.toLowerCase();
    }

    return searchMatch && statusMatch && priorityMatch;
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
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#818CF8] uppercase tracking-widest mb-1">
            <ShieldAlert className="w-3 h-3" />
            <span>INCIDENT TRIAGE & AUDIT LOG</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Global Ticket Management
          </h1>
        </div>

        <button
          onClick={loadIssues}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] text-xs font-mono text-[#A1A1AA] hover:text-white hover:border-[#6366F1] transition-colors"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin text-[#6366F1]")} />
          <span>Sync Log</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        {/* Filter Toolbar */}
        <div className="p-4 border-b border-[rgba(255,255,255,0.08)] bg-[#0A0A0C] flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <Input
              placeholder="Filter by ticket ID, keyword, or ward..."
              className="pl-9 bg-[#080808] border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-[#71717A] font-mono focus:border-[#6366F1] rounded-none"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#71717A]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Status:</span>
            </div>
            <select
              className="bg-[#080808] border border-[rgba(255,255,255,0.08)] text-xs font-mono text-white px-2.5 py-1.5 focus:outline-none focus:border-[#6366F1]"
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

            <select
              className="bg-[#080808] border border-[rgba(255,255,255,0.08)] text-xs font-mono text-white px-2.5 py-1.5 focus:outline-none focus:border-[#6366F1]"
              value={filterPriority}
              onChange={(e) => {
                setFilterPriority(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Dense Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#080808] border-b border-[rgba(255,255,255,0.06)] font-mono text-[10px] text-[#71717A] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Signal ID</th>
                <th className="px-5 py-3">Incident Synopsis & GPS</th>
                <th className="px-5 py-3">AI Classification</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Citizen Contact</th>
                <th className="px-5 py-3 text-right">Dispatch Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#71717A] font-mono">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-[#6366F1]" />
                      <span>Ingesting incident cluster...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedIssues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#71717A] font-mono">
                    No tickets match current filter constraints.
                  </td>
                </tr>
              ) : (
                paginatedIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* ID */}
                    <td className="px-5 py-4 font-mono font-medium text-white whitespace-nowrap">
                      <Link
                        to={`/master/issues/${issue.id}`}
                        className="text-[#818CF8] hover:underline flex items-center gap-1"
                      >
                        <span>{issue.id}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100" />
                      </Link>
                    </td>

                    {/* Title & Address */}
                    <td className="px-5 py-4 max-w-xs">
                      <div className="font-semibold text-white truncate text-xs">
                        {issue.title}
                      </div>
                      <div className="text-[11px] text-[#71717A] truncate mt-0.5 font-mono">
                        {issue.address}
                      </div>
                    </td>

                    {/* AI Classification */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-white">
                        <Sparkles className="w-3 h-3 text-[#6366F1]" />
                        <span>{issue.ai_category || "Unclassified"}</span>
                      </div>
                      <div className="font-mono text-[10px] text-[#818CF8] mt-0.5">
                        {Math.round((issue.ai_confidence || 0.92) * 100)}% CONFIDENCE
                      </div>
                    </td>

                    {/* Priority */}
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

                    {/* Status */}
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

                    {/* Reporter */}
                    <td className="px-5 py-4 whitespace-nowrap font-mono text-[11px] text-[#A1A1AA]">
                      <div>{issue.reporter_name || "Citizen Reporter"}</div>
                      <div className="text-[10px] text-[#71717A]">
                        {issue.reporter_phone || "Aadhaar Verified"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {issue.status !== "in_progress" && issue.status !== "resolved" && (
                          <button
                            onClick={() => handleStatusUpdate(issue.id, "in_progress")}
                            className="p-1.5 bg-[#06B6D4]/10 text-[#06B6D4] hover:bg-[#06B6D4]/20 border border-[#06B6D4]/20 transition-colors"
                            title="Dispatch field units"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {issue.status !== "resolved" && (
                          <button
                            onClick={() => handleStatusUpdate(issue.id, "resolved")}
                            className="p-1.5 bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20 border border-[#22C55E]/20 transition-colors"
                            title="Confirm resolution"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(issue.id)}
                          className="p-1.5 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 border border-[#EF4444]/20 transition-colors"
                          title="Purge from index"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[rgba(255,255,255,0.08)] bg-[#0A0A0C] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#71717A]">
            <div>
              Showing {paginatedIssues.length} of {filteredIssues.length} entries
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
