import { useState } from "react";
import {
  Search,
  Filter,
  ShieldCheck,
  XCircle,
  MoreVertical,
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const mockUsers = [
  {
    id: "USR-101",
    name: "Priya Sharma",
    role: "Volunteer",
    aadharStatus: "Verified",
    phone: "+91 9876543210",
    dateJoined: "2026-01-15",
  },
  {
    id: "USR-102",
    name: "Ravi Kumar",
    role: "Citizen",
    aadharStatus: "Pending",
    phone: "+91 9123456780",
    dateJoined: "2026-02-10",
  },
  {
    id: "USR-103",
    name: "Anjali Singh",
    role: "Volunteer",
    aadharStatus: "Verified",
    phone: "+91 9988776655",
    dateJoined: "2025-11-20",
  },
  {
    id: "USR-104",
    name: "Vikram Reddy",
    role: "Citizen",
    aadharStatus: "Failed",
    phone: "+91 9876501234",
    dateJoined: "2026-02-18",
  },
];

export default function MasterUsers() {
  const [searchTerm, setSearchTerm] = useState("");

  const getAadharStatusColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-primary/20 text-primary border-primary/30";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "Failed":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            User & Volunteer Verification
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage user roles and verify Aadhaar credentials.
          </p>
        </div>
      </div>

      <div className="card-elevated overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-background/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or ID..."
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <Filter className="w-4 h-4" /> Filter Role
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">User Profile</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Aadhaar Status</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">
                  Verification
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs border border-primary/30">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {user.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getAadharStatusColor(user.aadharStatus)}`}
                    >
                      {user.aadharStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {user.dateJoined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.aadharStatus === "Pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary hover:text-primary hover:bg-primary/20 h-8 w-8"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/20 h-8 w-8"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <button className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </button>
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
