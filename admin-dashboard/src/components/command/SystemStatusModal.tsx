import { useState, useEffect } from "react";
import { X, Activity, Wifi, WifiOff, Clock, RefreshCw } from "lucide-react";
import { checkSystemHealth } from "../../lib/dataAdapter";
import type { ComponentHealth } from "../../lib/dataAdapter";

interface SystemStatusModalProps {
  onClose: () => void;
}

export default function SystemStatusModal({ onClose }: SystemStatusModalProps) {
  const [components, setComponents] = useState<ComponentHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const runHealthCheck = async () => {
    setLoading(true);
    const results = await checkSystemHealth();
    setComponents(results);
    setLastChecked(new Date());
    setLoading(false);
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const overallStatus = components.every((c) => c.status === "operational")
    ? "operational"
    : components.some((c) => c.status === "offline")
    ? "critical"
    : "degraded";

  const statusColor = {
    operational: "text-green-400",
    degraded: "text-yellow-400",
    critical: "text-red-400",
  }[overallStatus];

  const statusLabel = {
    operational: "ALL SYSTEMS OPERATIONAL",
    degraded: "DEGRADED PERFORMANCE",
    critical: "CRITICAL — SYSTEM OFFLINE",
  }[overallStatus];

  const componentStatusConfig = {
    operational: {
      dot: "bg-green-400",
      badge: "bg-green-500/10 text-green-400 border-green-500/20",
      label: "OPERATIONAL",
    },
    degraded: {
      dot: "bg-yellow-400",
      badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      label: "DEGRADED",
    },
    offline: {
      dot: "bg-red-400",
      badge: "bg-red-500/10 text-red-400 border-red-500/20",
      label: "OFFLINE",
    },
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#111114] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden shadow-2xl">
        {/* Top accent */}
        <div
          className={`h-0.5 w-full ${
            overallStatus === "operational"
              ? "bg-green-500"
              : overallStatus === "degraded"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#6366F1]" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">
                  SYSTEM STATUS
                </h2>
                <p className={`text-xs font-mono ${statusColor} mt-0.5`}>
                  {loading ? "CHECKING SYSTEMS..." : statusLabel}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={runHealthCheck}
                disabled={loading}
                className="p-2 text-[#71717A] hover:text-white transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-[#71717A] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Components list */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-[#0D0D0F] rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {components.map((component) => {
                const config = componentStatusConfig[component.status];
                return (
                  <div
                    key={component.name}
                    className="flex items-center justify-between p-4 bg-[#0D0D0F] rounded-lg border border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${config.dot} ${
                          component.status === "operational"
                            ? "shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                            : component.status === "degraded"
                            ? "shadow-[0_0_6px_rgba(245,158,11,0.6)]"
                            : "shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                        }`}
                      />
                      <div>
                        <p className="text-white text-sm font-medium">
                          {component.name}
                        </p>
                        <p className="text-[#71717A] text-xs mt-0.5">
                          {component.endpoint}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        {component.status !== "offline" ? (
                          <div className="flex items-center gap-1 text-[#A1A1AA] text-xs">
                            <Clock className="w-3 h-3" />
                            <span className="font-mono">
                              {component.latencyMs}ms
                            </span>
                          </div>
                        ) : (
                          <WifiOff className="w-3.5 h-3.5 text-red-400" />
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${config.badge}`}
                      >
                        {config.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          {lastChecked && (
            <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#71717A] text-xs">
                <Wifi className="w-3 h-3" />
                <span>Last checked: {lastChecked.toLocaleTimeString()}</span>
              </div>
              <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-widest">
                CIVICSENSE PLATFORM v2.0
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
