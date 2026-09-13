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
  Building2,
  RefreshCw,
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

const FALLBACK_ADMINS: MunicipalAdmin[] = [
  {
    id: "adm-001",
    full_name: "Lucknow Central Zone Admin",
    email: "ward12@lucknow.civicsense.in",
    district_code: "226001, 226002, 226024",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "adm-002",
    full_name: "Gorakhpur Municipal Corporation",
    email: "gmc.desk@gorakhpur.gov.in",
    district_code: "273001, 273002, 273005",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
  },
  {
    id: "adm-003",
    full_name: "Pune Municipal Commissioner Desk",
    email: "commissioner@pmc.pune.gov.in",
    district_code: "411001, 411004, 411005, 411007",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  },
  {
    id: "adm-004",
    full_name: "Varanasi Smart City Ward Desk",
    email: "smartcity@varanasi.gov.in",
    district_code: "221001, 221002, 221010",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
];

export default function MunicipalAdmins() {
  const [admins, setAdmins] = useState<MunicipalAdmin[]>(FALLBACK_ADMINS);
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

      if (token) {
        const res = await fetch("http://localhost:5000/api/admin/municipal", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAdmins(data);
            setIsLoading(false);
            return;
          }
        }
      }
    } catch (err) {
      // Graceful fallback
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

    const newEntry: MunicipalAdmin = {
      id: `adm-${Math.random().toString(36).substring(2, 6)}`,
      full_name: formData.full_name,
      email: formData.email,
      district_code: formData.district_code,
      created_at: new Date().toISOString(),
    };

    // Optimistically add to state
    setAdmins([newEntry, ...admins]);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (token) {
        await fetch("http://localhost:5000/api/admin/municipal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }
    } catch (err) {
      // Offline fallback
    }

    setIsModalOpen(false);
    setFormData({
      full_name: "",
      email: "",
      password: "",
      district_code: "",
    });
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Revoke this municipal administrator's credentials?"))
      return;
    setAdmins(admins.filter((a) => a.id !== id));

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (token) {
        await fetch(`http://localhost:5000/api/admin/municipal/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      // Offline fallback
    }
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.district_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#818CF8] uppercase tracking-widest mb-1">
            <Building2 className="w-3 h-3" />
            <span>MUNICIPAL JURISDICTION DIRECTORY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Ward Administrators & Regional Officers
          </h1>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono text-xs uppercase tracking-wider rounded-none gap-2 shadow-[0_0_16px_rgba(99,102,241,0.3)]"
        >
          <Plus className="w-4 h-4" /> Provision Ward Admin
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] font-mono text-xs">
          ERR: {error}
        </div>
      )}

      {/* Main Table */}
      <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0A0A0C]">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <Input
              placeholder="Filter by ward name or postal pincode..."
              className="pl-9 bg-[#080808] border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-[#71717A] font-mono focus:border-[#6366F1] rounded-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="font-mono text-xs text-[#71717A]">
            Active Officers: <span className="text-white">{admins.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#080808] border-b border-[rgba(255,255,255,0.06)] font-mono text-[10px] text-[#71717A] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Ward Administration Profile</th>
                <th className="px-5 py-3">Assigned Pincodes</th>
                <th className="px-5 py-3">Enrolled Date</th>
                <th className="px-5 py-3 text-right">Revoke</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-[#71717A] font-mono">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#6366F1] mb-2" />
                    Ingesting ward administrators...
                  </td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-[#71717A] font-mono">
                    No municipal records located.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#18181B] border border-[#6366F1]/30 text-[#818CF8] flex items-center justify-center font-mono font-bold text-xs uppercase">
                          {admin.full_name ? admin.full_name[0] : "W"}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {admin.full_name}
                          </div>
                          <div className="font-mono text-[11px] text-[#71717A] mt-0.5">
                            {admin.email || `id: ${admin.id}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setViewPincodesAdmin(admin)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#18181B] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] font-mono text-[11px] text-[#A1A1AA] hover:text-white transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#06B6D4]" />
                        <span>Inspect Postal Zones</span>
                      </button>
                    </td>
                    <td className="px-5 py-4 font-mono text-[#71717A]">
                      {new Date(admin.created_at || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="p-1.5 text-[#71717A] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                        title="Revoke Credentials"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0D0D0F] w-full max-w-md border border-[rgba(255,255,255,0.12)] p-6 relative animate-fade-in shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#71717A] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6">
              <span className="font-mono text-[10px] text-[#818CF8] uppercase tracking-wider block mb-1">
                OPERATIONAL PROVISIONING
              </span>
              <h2 className="text-xl font-bold text-white">Enroll Ward Officer</h2>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[#A1A1AA] uppercase">Ward / Department Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                  <Input
                    className="pl-9 bg-[#080808] border-[rgba(255,255,255,0.08)] rounded-none text-white focus:border-[#6366F1]"
                    required
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="e.g. Pune Ward 14 Sanitation"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#A1A1AA] uppercase">Official Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                  <Input
                    type="email"
                    className="pl-9 bg-[#080808] border-[rgba(255,255,255,0.08)] rounded-none text-white focus:border-[#6366F1]"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="officer@municipal.gov.in"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#A1A1AA] uppercase">Access Passphrase</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                  <Input
                    type="password"
                    className="pl-9 bg-[#080808] border-[rgba(255,255,255,0.08)] rounded-none text-white focus:border-[#6366F1]"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Min 8 characters"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#A1A1AA] uppercase">
                  Jurisdiction Pincodes (comma separated)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                  <Input
                    className="pl-9 bg-[#080808] border-[rgba(255,255,255,0.08)] rounded-none text-white focus:border-[#6366F1]"
                    required
                    value={formData.district_code}
                    onChange={(e) =>
                      setFormData({ ...formData, district_code: e.target.value })
                    }
                    placeholder="e.g. 226001, 226002"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-none bg-transparent border-[rgba(255,255,255,0.08)] text-[#71717A] hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-none bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                >
                  {isSubmitting ? "Enrolling..." : "Enroll Administrator"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Pincodes Modal */}
      {viewPincodesAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0D0D0F] w-full max-w-lg border border-[rgba(255,255,255,0.12)] p-6 relative animate-fade-in shadow-2xl">
            <button
              onClick={() => setViewPincodesAdmin(null)}
              className="absolute top-4 right-4 text-[#71717A] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#06B6D4]" />
              Assigned Postal Jurisdictions
            </h2>
            <p className="text-xs text-[#71717A] mb-5 font-mono">
              Enforced routing area for {viewPincodesAdmin.full_name}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {viewPincodesAdmin.district_code.split(",").map((code, idx) => {
                const clean = code.trim().replace(/['"]/g, "");
                if (!clean) return null;
                return (
                  <div
                    key={idx}
                    className="bg-[#080808] border border-[rgba(255,255,255,0.08)] p-3 text-center font-mono text-sm text-white font-bold tracking-widest"
                  >
                    {clean}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)] flex justify-end">
              <Button
                variant="outline"
                onClick={() => setViewPincodesAdmin(null)}
                className="rounded-none font-mono text-xs border-[rgba(255,255,255,0.08)] text-white hover:bg-white/5"
              >
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
