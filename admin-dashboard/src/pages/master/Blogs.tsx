import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  Search,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "../../lib/supabaseClient";

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

export default function BlogsCMS() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch("http://localhost:5000/api/blogs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const data = await response.json();
      setBlogs(data);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
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
        category: "Announcements",
        author_name: "Admin Team",
        read_time: "5 min read",
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
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error("Not authenticated");

      const url = isEditMode
        ? `http://localhost:5000/api/blogs/${currentBlog.id}`
        : `http://localhost:5000/api/blogs`;

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentBlog),
      });

      if (!response.ok) throw new Error("Failed to save blog");

      await fetchBlogs();
      closeModal();
    } catch (err: unknown) {
      console.error(err);
      alert("Failed to save article. View console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this article?",
      )
    )
      return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error("Not authenticated");

      const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete blog");
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err: unknown) {
      console.error(err);
      alert("Failed to delete article.");
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">
            Content Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Publish, edit, and organize Civic Sense public blog articles.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Article</span>
        </button>
      </div>

      <div className="flex items-center gap-4 bg-card rounded-xl border border-border p-2">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search blogs by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
          />
        </div>
        <button
          onClick={fetchBlogs}
          className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors border border-border"
          title="Refresh Data"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">
                  Article Title & Excerpt
                </th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Date Published</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw className="w-8 h-8 animate-spin text-primary/50 mb-4" />
                      <p>Loading active articles...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-destructive"
                  >
                    <div className="bg-destructive/10 p-4 rounded-lg inline-block">
                      <p className="font-medium">{error}</p>
                      <button
                        onClick={fetchBlogs}
                        className="mt-2 text-xs underline"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
                      <p className="text-lg font-medium">No articles found</p>
                      <p className="text-sm">
                        Click 'New Article' to publish your first post.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground tracking-tight break-all line-clamp-1 max-w-sm">
                          {blog.title}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-sm break-all">
                          {blog.excerpt}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {blog.author_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {format(new Date(blog.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 text-muted-foreground">
                        <button
                          onClick={() =>
                            window.open(
                              `http://localhost:8081/blog/${blog.id}`,
                              "_blank",
                            )
                          }
                          className="p-2 hover:bg-secondary rounded-lg transition-colors hover:text-foreground"
                          title="View Live Article"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(blog)}
                          className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors"
                          title="Edit Article"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="p-2 hover:bg-destructive/20 hover:text-destructive rounded-lg transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-4xl max-h-[90vh] rounded-xl border border-border shadow-lg flex flex-col animate-fade-in relative">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold font-display">
                {isEditMode ? "Edit Article" : "Compose New Article"}
              </h2>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground p-2 bg-muted rounded-full"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 overflow-y-auto flex-1 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={currentBlog.title || ""}
                    onChange={(e) =>
                      setCurrentBlog({ ...currentBlog, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Enter an engaging title..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={currentBlog.author_name || ""}
                    onChange={(e) =>
                      setCurrentBlog({
                        ...currentBlog,
                        author_name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category *</label>
                  <select
                    value={currentBlog.category || ""}
                    onChange={(e) =>
                      setCurrentBlog({
                        ...currentBlog,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="Announcements">Announcements</option>
                    <option value="Success Stories">Success Stories</option>
                    <option value="Guides">Guides</option>
                    <option value="Impact">Impact</option>
                    <option value="Community">Community</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cover Image URL</label>
                  <input
                    type="url"
                    value={currentBlog.image_url || ""}
                    onChange={(e) =>
                      setCurrentBlog({
                        ...currentBlog,
                        image_url: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={currentBlog.read_time || ""}
                    onChange={(e) =>
                      setCurrentBlog({
                        ...currentBlog,
                        read_time: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="5 min read"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">Brief Excerpt</label>
                  <textarea
                    rows={2}
                    value={currentBlog.excerpt || ""}
                    onChange={(e) =>
                      setCurrentBlog({
                        ...currentBlog,
                        excerpt: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="A short summary shown on the blog listing grid..."
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium">
                    Full Content Body (Markdown Supported) *
                  </label>
                  <textarea
                    required
                    rows={12}
                    value={currentBlog.content || ""}
                    onChange={(e) =>
                      setCurrentBlog({
                        ...currentBlog,
                        content: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm leading-relaxed whitespace-pre-wrap break-all"
                    placeholder="Write your beautiful article here..."
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-border bg-background hover:bg-muted text-foreground rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Update Article"
                      : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
