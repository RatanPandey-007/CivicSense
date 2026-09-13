import { useState } from "react";
import {
  Search,
  ShieldCheck,
  XCircle,
  Users as UsersIcon,
  CheckCircle,
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { cn } from "../../lib/utils";

interface UserRecord {
  id: string;
  name: string;
  role: string;
  aadharStatus: "Verified" | "Pending" | "Failed";
  phone: string;
  trustScore: number;
  dateJoined: string;
}

const initialUsers: UserRecord[] = [
  {
    id: "USR-9921",
    name: "Vikram Malhotra",
    role: "Aadhaar Verified Citizen",
    aadharStatus: "Verified",
    phone: "+91 98451 22910",
    trustScore: 98,
    dateJoined: "2026-01-15",
  },
  {
    id: "USR-8812",
    name: "Sneha Patel",
    role: "Municipal Field Volunteer",
    aadharStatus: "Verified",
    phone: "+91 91234 56789",
    trustScore: 94,
    dateJoined: "2026-02-01",
  },
  {
    id: "USR-7419",
    name: "Aman Verma",
    role: "Citizen Informant",
    aadharStatus: "Pending",
    phone: "+91 99123 48102",
    trustScore: 82,
    dateJoined: "2026-02-18",
  },
  {
    id: "USR-4012",
    name: "Pooja Trivedi",
    role: "Ward Volunteer",
    aadharStatus: "Verified",
    phone: "+91 94500 12849",
    trustScore: 96,
    dateJoined: "2026-01-28",
  },
  {
    id: "USR-3301",
    name: "Rahul Saxena",
    role: "Citizen Informant",
    aadharStatus: "Pending",
    phone: "+91 97921 44556",
    trustScore: 78,
    dateJoined: "2026-02-22",
  },
  {
    id: "USR-1092",
    name: "Kavita Rao",
    role: "Citizen Informant",
    aadharStatus: "Verified",
    phone: "+91 98891 00223",
    trustScore: 91,
    dateJoined: "2026-01-10",
  },
];

export default function MasterUsers() {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const toggleVerification = (id: string, newStatus: "Verified" | "Failed") => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, aadharStatus: newStatus } : u)),
    );
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(term) ||
      u.id.toLowerCase().includes(term) ||
      u.phone.includes(term);
    const matchesRole =
      filterRole === "All" ||
      u.role.toLowerCase().includes(filterRole.toLowerCase());
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#818CF8] uppercase tracking-widest mb-1">
            <UsersIcon className="w-3 h-3" />
            <span>IDENTITY & CITIZEN DIRECTORY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Aadhaar Verification & Trust Ledger
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#71717A]">
          <span>VERIFIED ENCLAVE:</span>
          <span className="text-[#22C55E] font-bold">UIDAI KYC ONLINE</span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0A0A0C]">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <Input
              placeholder="Search by citizen name, phone, or token..."
              className="pl-9 bg-[#080808] border-[rgba(255,255,255,0.08)] text-xs text-white placeholder-[#71717A] font-mono focus:border-[#6366F1] rounded-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-[#080808] border border-[rgba(255,255,255,0.08)] text-xs font-mono text-white px-3 py-1.5 focus:outline-none focus:border-[#6366F1]"
            >
              <option value="All">All Roles</option>
              <option value="Citizen">Citizens</option>
              <option value="Volunteer">Field Volunteers</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#080808] border-b border-[rgba(255,255,255,0.06)] font-mono text-[10px] text-[#71717A] uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Citizen Profile</th>
                <th className="px-5 py-3">Jurisdiction Role</th>
                <th className="px-5 py-3">Aadhaar Status</th>
                <th className="px-5 py-3">Trust Metric</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Enrolled</th>
                <th className="px-5 py-3 text-right">KYC Triage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#18181B] border border-[rgba(255,255,255,0.1)] text-[#818CF8] flex items-center justify-center font-mono font-bold text-xs uppercase">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {user.name}
                        </div>
                        <div className="font-mono text-[10px] text-[#71717A] mt-0.5">
                          {user.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 font-mono text-white text-xs">
                    {user.role}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "font-mono text-[10px] uppercase px-2 py-0.5 border",
                        user.aadharStatus === "Verified"
                          ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30"
                          : user.aadharStatus === "Pending"
                            ? "bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/30"
                            : "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30",
                      )}
                    >
                      {user.aadharStatus}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-mono text-xs">
                    <span className="text-[#22C55E] font-bold">
                      {user.trustScore}%
                    </span>
                    <span className="text-[10px] text-[#71717A] ml-1">SLA</span>
                  </td>

                  <td className="px-5 py-4 font-mono text-[#A1A1AA]">
                    {user.phone}
                  </td>

                  <td className="px-5 py-4 font-mono text-[#71717A]">
                    {user.dateJoined}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {user.aadharStatus === "Pending" ? (
                        <>
                          <button
                            onClick={() => toggleVerification(user.id, "Verified")}
                            className="p-1.5 bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20 border border-[#22C55E]/20 transition-colors"
                            title="Verify Aadhaar"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleVerification(user.id, "Failed")}
                            className="p-1.5 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 border border-[#EF4444]/20 transition-colors"
                            title="Reject Verification"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className="font-mono text-[10px] text-[#71717A] flex items-center gap-1 justify-end">
                          <CheckCircle className="w-3 h-3 text-[#22C55E]" />
                          AUDITED
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
