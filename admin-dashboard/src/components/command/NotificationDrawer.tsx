import { useEffect, useState } from "react";
import { X, Bell, CheckCheck, AlertTriangle, Info, Cpu, CheckCircle } from "lucide-react";
import { fetchNotifications, markNotificationAsRead } from "../../lib/dataAdapter";
import type { SystemNotification } from "../../lib/dataAdapter";
import { formatDistanceToNow } from "date-fns";

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

const categoryConfig = {
  critical: {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-400",
  },
  assignment: {
    icon: Cpu,
    color: "text-[#6366F1]",
    bg: "bg-[#6366F1]/10",
    border: "border-[#6366F1]/20",
    dot: "bg-[#6366F1]",
  },
  system: {
    icon: Info,
    color: "text-[#38BDF8]",
    bg: "bg-[#38BDF8]/10",
    border: "border-[#38BDF8]/20",
    dot: "bg-[#38BDF8]",
  },
  resolution: {
    icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    dot: "bg-green-400",
  },
};

export default function NotificationDrawer({
  open,
  onClose,
}: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchNotifications().then((data) => {
        setNotifications(data);
        setLoading(false);
      });
    }
  }, [open]);

  const handleMarkRead = (id: string) => {
    markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    notifications.forEach((n) => {
      if (!n.read) markNotificationAsRead(n.id);
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-[101] w-full max-w-sm bg-[#0D0D0F] border-l border-[rgba(255,255,255,0.08)] shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#6366F1]" />
            <div>
              <h2 className="text-white font-semibold text-base">
                NOTIFICATIONS
              </h2>
              {unreadCount > 0 && (
                <p className="text-[#71717A] text-xs font-mono">
                  {unreadCount} unread
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 text-xs text-[#6366F1] hover:text-indigo-300 transition-colors px-2 py-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#71717A] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgba(255,255,255,0.1)]">
          {loading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-[#111114] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <Bell className="w-10 h-10 text-[#71717A]/40 mb-4" />
              <p className="text-[#71717A] text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
              {notifications.map((notif) => {
                const config = categoryConfig[notif.category];
                const IconComp = config.icon;
                return (
                  <div
                    key={notif.id}
                    className={`p-4 transition-colors hover:bg-[rgba(255,255,255,0.02)] ${
                      !notif.read ? "bg-[rgba(99,102,241,0.03)]" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <IconComp className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm font-medium leading-snug ${
                              notif.read ? "text-[#A1A1AA]" : "text-white"
                            }`}
                          >
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <div className={`w-2 h-2 rounded-full ${config.dot} flex-shrink-0 mt-1.5`} />
                          )}
                        </div>
                        <p className="text-[#71717A] text-xs mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[#52525B] text-xs">
                            {formatDistanceToNow(new Date(notif.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                          {!notif.read && (
                            <button
                              onClick={() => handleMarkRead(notif.id)}
                              className="text-[10px] text-[#6366F1] hover:text-indigo-300 transition-colors font-mono uppercase tracking-widest"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
          <p className="text-center text-[10px] font-mono text-[#52525B] uppercase tracking-widest">
            CIVICSENSE COMMAND CENTER · ALERT SYSTEM
          </p>
        </div>
      </div>
    </>
  );
}
