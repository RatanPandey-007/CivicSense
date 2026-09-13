import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import CommandSidebar from "../components/command/CommandSidebar";
import CommandBar from "../components/command/CommandBar";
import CommandPalette from "../components/command/CommandPalette";
import NotificationDrawer from "../components/command/NotificationDrawer";
import SystemStatusModal from "../components/command/SystemStatusModal";
import CustomCursor from "../components/command/CustomCursor";
import SystemInitLoader from "../components/command/SystemInitLoader";

export default function MasterLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const [unreadCount] = useState(3);

  // Ctrl+K listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  if (!booted) {
    return <SystemInitLoader onComplete={handleBootComplete} />;
  }

  return (
    <>
      {/* Custom cursor — desktop only */}
      <CustomCursor />

      <div className="flex h-screen bg-[#070708] text-white overflow-hidden">
        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#6366F1]/3 rounded-full blur-[160px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#38BDF8]/2 rounded-full blur-[180px]" />
        </div>

        {/* Sidebar */}
        <CommandSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
        />

        {/* Main area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Top bar */}
          <CommandBar
            onSearchOpen={() => setPaletteOpen(true)}
            onNotificationsOpen={() => setNotificationsOpen(true)}
            onSystemStatusOpen={() => setStatusModalOpen(true)}
            unreadCount={unreadCount}
          />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgba(255,255,255,0.08)]">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global overlays */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />

      <NotificationDrawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {statusModalOpen && (
        <SystemStatusModal onClose={() => setStatusModalOpen(false)} />
      )}
    </>
  );
}
