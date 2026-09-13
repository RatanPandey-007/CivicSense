import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  Search,
  RefreshCw,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "../../lib/supabaseClient";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  author_name: string;
  read_time: string;
  created_at: string;
}

const FALLBACK_BLOGS: Blog[] = [
  {
    id: "blg-001",
    title: "Monsoon Storm Readiness & Rapid Drainage Protocol 2026",
    excerpt: "Citywide municipal deployment guidelines for heavy precipitation and sewer backflow prevention.",
    content: "Comprehensive overview of emergency drainage infrastructure and automated water-level sensor telemetry deployed across Gorakhpur and Lucknow districts.",
    image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=60",
    category: "Advisories",
    author_name: "Disaster Management Desk",
    read_time: "4 min read",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "blg-002",
    title: "AI Computer Vision Deployment in Ward 12 Pothole Detection",
    excerpt: "Automated road condition assessment using dashcam telemetry and citizen smartphone payloads.",
    content: "Results from the first 90 days of autonomous edge-classification for road surface subsidence and pothole triage.",
    image_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60",
    category: "Technology",
    author_name: "CivicSense AI Team",
    read_time: "6 min read",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: "blg-003",
    title: "Citizen Volunteer Milestone: 10,000 Verified Field Closures",
    excerpt: "Recognizing community contributors across municipal zones in Uttar Pradesh.",
    content: "Community reporting velocity increased by 312% with Aadhaar tokenized reporting and anonymous whistleblower options.",
    image_url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=60",
    category: "Milestones",
    author_name: "Community Desk",
    read_time: "3 min read",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
];

export default function BlogsCMS() {
  const [blogs, setBlogs] = useState<Blog[]>(FALLBACK_BLOGS);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (token) {
        const response = await fetch("http://localhost:5000/api/blogs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setBlogs(data);
            setIsLoading(false);
            return;
          }
        }
      }
    } catch (err) {
      // Offline fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleOpenModal = (blog?: Blog) => {
    if (blog) {
      setCurrentBlog(blog);
      setIsEditMode(true);
    } else {
      setCurrentBlog({
        title: "",
        excerpt: "",
        content: "",
        image_url: "",
        category: "Advisories",
        author_name: "Superadmin Team",
        read_time: "4 min read",
      });
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBlog({});
    setIsEditMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isEditMode && currentBlog.id) {
      setBlogs((prev) =>
        prev.map((b) => (b.id === currentBlog.id ? ({ ...b, ...currentBlog } as Blog) : b)),
      );
    } else {
      const newArticle: Blog = {
        id: `blg-${Math.random().toString(36).substring(2, 6)}`,
        title: currentBlog.title || "Untitled Bulletin",
        excerpt: currentBlog.excerpt || "",
        content: currentBlog.content || "",
        image_url: currentBlog.image_url || "",
        category: currentBlog.category || "Advisories",
        author_name: currentBlog.author_name || "Superadmin",
        read_time: currentBlog.read_time || "3 min read",
        created_at: new Date().toISOString(),
      };
      setBlogs([newArticle, ...blogs]);
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (token) {
        const url = isEditMode
          ? `http://localhost:5000/api/blogs/${currentBlog.id}`
          : `http://localhost:5000/api/blogs`;
        const method = isEditMode ? "PUT" : "POST";

        await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(currentBlog),
        });
      }
    } catch (err) {
      // Offline fallback
    } finally {
      setIsSubmitting(false);
      closeModal();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Archive and delete this municipal bulletin?")) return;
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#818CF8] uppercase tracking-widest mb-1">
            <FileText className="w-3 h-3" />
            <span>MUNICIPAL CONTENT CMS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Public Advisories & Bulletins
          </h1>
        </div>

        <Button
          onClick={() => handleOpenModal()}
          className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono text-xs uppercase tracking-wider rounded-none gap-2 shadow-[0_0_16px_rgba(99,102,241,0.3)]"
        >
          <Plus className="w-4 h-4" /> Compose Bulletin
        </Button>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0A0A0C]">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <Input
              type="text"
              placeholder="Search published bulletins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#080808] border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-[#71717A] font-mono focus:border-[#6366F1] rounded-none"
            />
          </div>
          <button
            onClick={fetchBlogs}
            className="p-1.5 bg-[#080808] border border-[rgba(255,255,255,0.08)] text-[#A1A1AA] hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#080808] border-b border-[rgba(255,255,255,0.06)] font-mono text-[10px] text-[#71717A] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Bulletin Title & Synopsis</th>
                <th className="px-5 py-3">Classification</th>
                <th className="px-5 py-3">Author</th>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#71717A] font-mono">
                    Loading municipal bulletins...
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#71717A] font-mono">
                    No articles found.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4 max-w-md">
                      <div className="font-semibold text-white truncate text-xs">
                        {blog.title}
                      </div>
                      <div className="text-[11px] text-[#71717A] truncate mt-0.5 font-mono">
                        {blog.excerpt}
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-mono text-[10px] px-2 py-0.5 bg-[rgba(99,102,241,0.12)] text-[#818CF8] border border-[rgba(99,102,241,0.25)]">
                        {blog.category}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-mono text-white text-xs">
                      {blog.author_name}
                    </td>

                    <td className="px-5 py-4 font-mono text-[#71717A]">
                      {format(new Date(blog.created_at || Date.now()), "MMM d, yyyy")}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal(blog)}
                          className="p-1.5 bg-[#18181B] text-[#A1A1AA] hover:text-white border border-[rgba(255,255,255,0.08)] transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="p-1.5 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 border border-[#EF4444]/20 transition-colors"
                          title="Delete"
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
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0F] w-full max-w-2xl border border-[rgba(255,255,255,0.12)] p-6 relative animate-fade-in shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-[#71717A] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6">
              <span className="font-mono text-[10px] text-[#818CF8] uppercase tracking-wider block mb-1">
                DISPATCH BULLETIN
              </span>
              <h2 className="text-xl font-bold text-white">
                {isEditMode ? "Modify Advisory" : "Draft Municipal Bulletin"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[#A1A1AA] uppercase">Headline *</label>
                <Input
                  required
                  value={currentBlog.title || ""}
                  onChange={(e) =>
                    setCurrentBlog({ ...currentBlog, title: e.target.value })
                  }
                  className="bg-[#080808] border-[rgba(255,255,255,0.08)] rounded-none text-white focus:border-[#6366F1]"
                  placeholder="e.g. Ward 14 Drainage Closure Notice"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#A1A1AA] uppercase">Department / Author *</label>
                  <Input
                    required
                    value={currentBlog.author_name || ""}
                    onChange={(e) =>
                      setCurrentBlog({ ...currentBlog, author_name: e.target.value })
                    }
                    className="bg-[#080808] border-[rgba(255,255,255,0.08)] rounded-none text-white focus:border-[#6366F1]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#A1A1AA] uppercase">Category</label>
                  <select
                    value={currentBlog.category || "Advisories"}
                    onChange={(e) =>
                      setCurrentBlog({ ...currentBlog, category: e.target.value })
                    }
                    className="w-full bg-[#080808] border border-[rgba(255,255,255,0.08)] p-2 text-white focus:border-[#6366F1]"
                  >
                    <option value="Advisories">Advisories</option>
                    <option value="Technology">Technology</option>
                    <option value="Milestones">Milestones</option>
                    <option value="Roads">Roads & Traffic</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#A1A1AA] uppercase">Brief Synopsis</label>
                <textarea
                  rows={2}
                  value={currentBlog.excerpt || ""}
                  onChange={(e) =>
                    setCurrentBlog({ ...currentBlog, excerpt: e.target.value })
                  }
                  className="w-full bg-[#080808] border border-[rgba(255,255,255,0.08)] p-2 text-white focus:border-[#6366F1] font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#A1A1AA] uppercase">Full Narrative Payload</label>
                <textarea
                  rows={6}
                  required
                  value={currentBlog.content || ""}
                  onChange={(e) =>
                    setCurrentBlog({ ...currentBlog, content: e.target.value })
                  }
                  className="w-full bg-[#080808] border border-[rgba(255,255,255,0.08)] p-2 text-white focus:border-[#6366F1] font-mono text-xs"
                  placeholder="Draft official directive..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="rounded-none bg-transparent border-[rgba(255,255,255,0.08)] text-[#71717A] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-none bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                >
                  {isSubmitting ? "Broadcasting..." : "Publish Bulletin"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
