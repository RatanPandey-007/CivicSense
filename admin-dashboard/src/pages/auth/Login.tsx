import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, BuildingIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { cn } from "../../lib/utils";
import { supabase } from "../../lib/supabaseClient";

export default function Login() {
  const [role, setRole] = useState<"master" | "municipal">("master");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // 1. Fetch the user's actual role from the public.users table (or fallback to metadata from signup)
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user?.id)
        .single();

      const userRole = userData?.role || data.user?.user_metadata?.role;

      // 2. Enforce Role-Based Access Control
      if (userRole === "master" || userRole === "master_admin") {
        navigate("/master/dashboard");
      } else if (userRole === "municipal" || userRole === "municipal_admin") {
        navigate("/municipal/dashboard");
      } else {
        // If they are just a citizen or have no recognized admin role, block access
        await supabase.auth.signOut();
        throw new Error(
          "Access Denied: You do not have administrator privileges.",
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(
          err.message || "Failed to login. Please check credentials.",
        );
      } else {
        setErrorMsg("Failed to login. Please check credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [isRegistering, setIsRegistering] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter an email and password to register.");
      setIsRegistering(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role, // Save their selected local role explicitly into Supabase user metadata
          },
        },
      });

      if (error) throw error;

      setSuccessMsg("Registration successful! You can now sign in.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || "Failed to register.");
      } else {
        setErrorMsg("Failed to register.");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="w-full card-elevated p-8 md:p-10 relative overflow-hidden group">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-[80px] -z-10 group-hover:bg-primary/10 transition-colors duration-500" />

      <div className="mb-8 text-center space-y-2">
        <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">
          Fix It<span className="text-primary"> Now</span> - Admin
        </h1>
        <p className="text-muted-foreground text-sm">
          Sign in to access the management dashboard
        </p>
      </div>

      <div className="flex p-1 bg-muted/50 rounded-lg mb-8 backdrop-blur-sm border border-border/50">
        <button
          onClick={() => setRole("master")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all duration-300",
            role === "master"
              ? "bg-background text-foreground shadow-sm glow-border"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50",
          )}
        >
          <Shield className="w-4 h-4" />
          Master Admin
        </button>
        <button
          onClick={() => setRole("municipal")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all duration-300",
            role === "municipal"
              ? "bg-background text-foreground shadow-sm glow-border"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50",
          )}
        >
          <BuildingIcon className="w-4 h-4" />
          Municipal Admin
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Email / Username
            </label>
            {errorMsg && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 mb-4 text-sm text-green-500 bg-green-500/10 rounded-md border border-green-500/20">
                {successMsg}
              </div>
            )}
            <Input
              type="text"
              placeholder={
                role === "master"
                  ? "master@civic.india"
                  : "admin@muncipal.gov.in"
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <a href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full btn-gradient group"
            disabled={isLoading || isRegistering}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In to Dashboard
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleRegister}
            disabled={isLoading || isRegistering}
            className="w-full"
          >
            {isRegistering ? "Registering..." : "Create Account"}
          </Button>
        </div>
      </form>
    </div>
  );
}
