import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  MapPin,
  X,
  Building,
  Mail,
  Lock,
  Trash2,
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../lib/supabaseClient";

interface MunicipalAdmin {
  id: string;
  full_name: string;
  email?: string;
  district_code: string;
  created_at: string;
}

export default function MunicipalAdmins() {
  const [admins, setAdmins] = useState<MunicipalAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewPincodesAdmin, setViewPincodesAdmin] =
    useState<MunicipalAdmin | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    district_code: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch("http://localhost:5000/api/admin/municipal", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetch admins response status:", res.status);
      const data = await res.json();
      console.log("Fetched admins data:", data);
      if (!res.ok)
        throw new Error(data.error || "Failed to fetch municipal admins");
      setAdmins(data);
    } catch (err: unknown) {
      console.error("Error fetching admins:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while fetching admins");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch("http://localhost:5000/api/admin/municipal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create admin");

      setIsModalOpen(false);
      setFormData({
        full_name: "",
        email: "",
        password: "",
        district_code: "",
      });
      fetchAdmins(); // refresh the list
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during creation");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm("Are you sure you want to delete this municipal admin?")
    )
      return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(
        `http://localhost:5000/api/admin/municipal/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete admin");
      }

      fetchAdmins(); // Refresh the list
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during deletion");
      }
    }
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.district_code?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Municipal Admins
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage regional administrators and their assigned district codes.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Municipal Admin
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm animate-fade-in">
          Error: {error}
        </div>
      )}

      <div className="card-elevated overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-background/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or district code..."
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Administrator Profile</th>
                <th className="px-6 py-4 font-medium">Assigned Pincode(s)</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Loading administrators...
                  </td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No municipal admins found.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs border border-primary/30 uppercase">
                          {admin.full_name ? admin.full_name[0] : "?"}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {admin.full_name || "Unnamed"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {admin.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewPincodesAdmin(admin)}
                        className="bg-background hover:bg-muted text-foreground border-border"
                      >
                        <MapPin className="w-4 h-4 mr-2 text-primary" />
                        View Pincodes
                      </Button>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(
                        admin.created_at || Date.now(),
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(admin.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-2xl p-6 relative animate-fade-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-6">Create Municipal Admin</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    required
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="e.g. Pune City Admin"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    className="pl-9"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="admin@pune.civicsense.in"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Temporary Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    className="pl-9"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Assigned Pincode(s) (comma separated)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    required
                    value={formData.district_code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        district_code: e.target.value,
                      })
                    }
                    placeholder="e.g. 273001, 273002"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Admin will only see issues assigned to these pincodes.
                </p>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View Pincodes Modal */}
      {viewPincodesAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-2xl p-6 relative animate-fade-in max-h-[80vh] flex flex-col">
            <button
              onClick={() => setViewPincodesAdmin(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Assigned Pincodes
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Jurisdiction areas for{" "}
              {viewPincodesAdmin.full_name || "this admin"}.
            </p>
            <div className="overflow-y-auto pr-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {viewPincodesAdmin.district_code.split(",").map((code, idx) => {
                const cleanCode = code.trim().replace(/['"]/g, "");
                if (!cleanCode) return null;
                return (
                  <div
                    key={idx}
                    className="bg-muted/50 border border-border/50 rounded-lg flex items-center justify-center p-3 text-sm font-medium text-foreground tracking-widest shadow-sm"
                  >
                    {cleanCode}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-border/50 flex justify-end">
              <Button onClick={() => setViewPincodesAdmin(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
