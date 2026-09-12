import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  BuildingIcon,
  AlertTriangleIcon,
  LogOutIcon,
  LayoutDashboard,
  MenuIcon,
} from "lucide-react";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabaseClient";

const sidebarLinks = [
  { name: "Dashboard", href: "/municipal/dashboard", icon: LayoutDashboard },
  {
    name: "Assigned Issues",
    href: "/municipal/issues",
    icon: AlertTriangleIcon,
  },
];

export default function MunicipalLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const [adminName, setAdminName] = useState("Loading...");
  const [adminInitial, setAdminInitial] = useState("M");

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.full_name) {
        setAdminName(session.user.user_metadata.full_name);
        setAdminInitial(
          session.user.user_metadata.full_name.charAt(0).toUpperCase(),
        );
      } else {
        setAdminName("Municipal Admin");
        setAdminInitial("M");
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="flex bg-background min-h-screen relative overflow-hidden text-foreground">
      {/* Dynamic Background - Municipal uses a slightly different tint */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none -z-10 opacity-70" />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-40 w-64 h-screen border-r border-border bg-sidebar transition-transform duration-300 ease-in-out",
          !isSidebarOpen && "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
          <BuildingIcon className="w-6 h-6 text-blue-500" />
          <span className="font-display font-bold text-lg tracking-tight">
            Municipal Admin
          </span>
        </div>

        <div className="p-4 flex flex-col h-[calc(100vh-4rem)]">
          <nav className="space-y-1 flex-1">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-500/10 text-blue-500"
                      : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <link.icon
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-blue-500" : "text-muted-foreground",
                    )}
                  />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-border mt-auto">
            <Link
              to="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOutIcon className="w-5 h-5" />
              Sign Out
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-muted-foreground hover:bg-accent rounded-md"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <h2 className="font-medium text-lg hidden sm:block">{adminName}</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-500 font-medium text-sm">
              {adminInitial}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
