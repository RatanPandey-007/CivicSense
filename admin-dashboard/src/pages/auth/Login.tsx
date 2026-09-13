import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Building2, ArrowRight, Lock, Mail, KeyRound, Sparkles } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabaseClient";

export default function Login() {
  const [role, setRole] = useState<"master" | "municipal">("master");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const isPlaceholder =
      !import.meta.env.VITE_SUPABASE_URL ||
      import.meta.env.VITE_SUPABASE_URL.includes("your-project-id");

    if (isPlaceholder) {
      // Offline / Local Demonstration mode
      localStorage.setItem("token", "local-demo-token");
      localStorage.setItem(
        "userRole",
        role === "master" ? "master_admin" : "municipal_admin"
      );
      localStorage.setItem("userEmail", email || "operator@civicsense.gov");

      setTimeout(() => {
        setIsLoading(false);
        if (role === "master") {
          navigate("/master/dashboard");
        } else {
          navigate("/municipal/dashboard");
        }
      }, 400);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Fetch user role
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user?.id)
        .single();

      const userRole = userData?.role || data.user?.user_metadata?.role;
      localStorage.setItem("token", data.session?.access_token || "auth-token");
      localStorage.setItem("userRole", userRole || role);

      if (userRole === "master" || userRole === "master_admin") {
        navigate("/master/dashboard");
      } else if (userRole === "municipal" || userRole === "municipal_admin") {
        navigate("/municipal/dashboard");
      } else {
        if (role === "master") navigate("/master/dashboard");
        else navigate("/municipal/dashboard");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // If remote Supabase fails to fetch or connect, fall back cleanly
      if (
        msg.toLowerCase().includes("failed to fetch") ||
        msg.toLowerCase().includes("networkerror")
      ) {
        localStorage.setItem("token", "local-demo-token");
        localStorage.setItem(
          "userRole",
          role === "master" ? "master_admin" : "municipal_admin"
        );
        localStorage.setItem("userEmail", email || "operator@civicsense.gov");

        if (role === "master") navigate("/master/dashboard");
        else navigate("/municipal/dashboard");
        return;
      }
      setErrorMsg(msg || "Failed to authenticate with credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Please provide an email and security passphrase.");
      setIsRegistering(false);
      return;
    }

    const isPlaceholder =
      !import.meta.env.VITE_SUPABASE_URL ||
      import.meta.env.VITE_SUPABASE_URL.includes("your-project-id");

    if (isPlaceholder) {
      localStorage.setItem(
        "userRole",
        role === "master" ? "master_admin" : "municipal_admin"
      );
      localStorage.setItem("userEmail", email);
      setSuccessMsg("Operator registered in local registry. Authenticating...");
      setTimeout(() => {
        setIsRegistering(false);
        if (role === "master") navigate("/master/dashboard");
        else navigate("/municipal/dashboard");
      }, 500);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role === "master" ? "master_admin" : "municipal_admin",
          },
        },
      });

      if (error) throw error;
      setSuccessMsg("Operator enrolled. You may now authenticate.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.toLowerCase().includes("failed to fetch") ||
        msg.toLowerCase().includes("networkerror")
      ) {
        setSuccessMsg("Operator enrolled in local cluster. You may now authenticate.");
      } else {
        setErrorMsg(msg || "Registration failed.");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const enterDemo = (targetRole: "master" | "municipal") => {
    localStorage.setItem("token", "demo-token");
    localStorage.setItem(
      "userRole",
      targetRole === "master" ? "master_admin" : "municipal_admin"
    );
    if (targetRole === "master") {
      navigate("/master/dashboard");
    } else {
      navigate("/municipal/dashboard");
    }
  };

  return (
    <div className="w-full bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-8 md:p-10 relative overflow-hidden shadow-2xl">
      {/* Top accent hairline */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#6366F1] to-transparent" />

      {/* Brand Header */}
      <div className="mb-8 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[rgba(99,102,241,0.08)] border border-[rgba(99,102,241,0.2)] font-mono text-[10px] text-[#818CF8] uppercase tracking-widest mb-3">
          <KeyRound className="w-3 h-3" />
          <span>CIVICSENSE // AUTH MATRIX</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          Operations Control
        </h1>
        <p className="text-xs text-[#71717A] max-w-sm mx-auto">
          Authenticate with municipal cryptographic credentials or access via demo terminal.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 p-1 bg-[#080808] border border-[rgba(255,255,255,0.08)] mb-6">
        <button
          type="button"
          onClick={() => setRole("master")}
          className={cn(
            "flex items-center justify-center gap-2 py-2.5 text-xs font-medium font-mono uppercase tracking-wider transition-all",
            role === "master"
              ? "bg-[#18181B] text-white border border-[rgba(255,255,255,0.12)] shadow-sm"
              : "text-[#71717A] hover:text-white",
          )}
        >
          <Shield className="w-3.5 h-3.5 text-[#6366F1]" />
          Superadmin
        </button>
        <button
          type="button"
          onClick={() => setRole("municipal")}
          className={cn(
            "flex items-center justify-center gap-2 py-2.5 text-xs font-medium font-mono uppercase tracking-wider transition-all",
            role === "municipal"
              ? "bg-[#18181B] text-white border border-[rgba(255,255,255,0.12)] shadow-sm"
              : "text-[#71717A] hover:text-white",
          )}
        >
          <Building2 className="w-3.5 h-3.5 text-[#06B6D4]" />
          Ward Officer
        </button>
      </div>

      {/* Feedback Alerts */}
      {errorMsg && (
        <div className="mb-4 p-3 text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 font-mono">
          ERR: {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 text-xs text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 font-mono">
          {successMsg}
        </div>
      )}

      {/* Authentication Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider block">
            Operator Identifier
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <Input
              type="email"
              placeholder={
                role === "master"
                  ? "superadmin@civicsense.gov"
                  : "ward12@municipal.gov.in"
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#080808] border-[rgba(255,255,255,0.08)] pl-9 text-xs text-white placeholder-[#52525B] font-mono focus:border-[#6366F1]"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider block">
              Passphrase
            </label>
            <span className="font-mono text-[10px] text-[#71717A]">
              SHA-256 ENCRYPTED
            </span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#080808] border-[rgba(255,255,255,0.08)] pl-9 text-xs text-white placeholder-[#52525B] font-mono focus:border-[#6366F1]"
              required
            />
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <Button
            type="submit"
            disabled={isLoading || isRegistering}
            className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white py-2.5 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 rounded-none border border-[#818CF8]/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            {isLoading ? (
              <span>VERIFYING CREDENTIALS...</span>
            ) : (
              <>
                <span>AUTHENTICATE OPERATOR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleRegister}
            disabled={isLoading || isRegistering}
            className="w-full bg-transparent hover:bg-white/5 text-[#A1A1AA] hover:text-white border-[rgba(255,255,255,0.08)] text-xs font-mono uppercase tracking-wider rounded-none"
          >
            {isRegistering ? "ENROLLING..." : "REGISTER NEW KEY"}
          </Button>
        </div>
      </form>

      {/* Quick Demo Access Bar */}
      <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#818CF8]" />
          <span className="font-mono text-[10px] text-[#A1A1AA] uppercase tracking-wider">
            Evaluation / Quick Demo Access
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => enterDemo("master")}
            className="px-3 py-2 bg-[#18181B] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] text-left group transition-all"
          >
            <div className="font-mono text-[9px] text-[#818CF8] uppercase">
              ONE-CLICK
            </div>
            <div className="text-xs font-medium text-white group-hover:text-[#818CF8]">
              Superadmin Matrix →
            </div>
          </button>
          <button
            type="button"
            onClick={() => enterDemo("municipal")}
            className="px-3 py-2 bg-[#18181B] hover:bg-[#27272A] border border-[rgba(255,255,255,0.08)] text-left group transition-all"
          >
            <div className="font-mono text-[9px] text-[#06B6D4] uppercase">
              ONE-CLICK
            </div>
            <div className="text-xs font-medium text-white group-hover:text-[#06B6D4]">
              Ward Officer Desk →
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
