import React from "react";

interface CivicPanelProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  elevation?: "surface" | "panel" | "elevated";
}

export function CivicPanel({
  title,
  subtitle,
  badge,
  action,
  children,
  className = "",
  elevation = "panel",
}: CivicPanelProps) {
  const bgClass =
    elevation === "surface"
      ? "bg-[#080808]"
      : elevation === "panel"
      ? "bg-[#0A0A0A]"
      : "bg-[#111114]";

  return (
    <div className={`relative hairline ${bgClass} ${className}`}>
      {(title || badge || action) && (
        <div className="flex items-center justify-between p-4 sm:p-5 hairline-b">
          <div className="flex items-center gap-3">
            {badge && (
              <span className="w-1.5 h-1.5 bg-[#6366F1] inline-block" />
            )}
            <div>
              {title && (
                <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-white font-medium">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[11px] text-[#71717A] mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}
