import React from "react";
import { CivicButton } from "./CivicButton";

interface CivicEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function CivicEmptyState({
  title = "NO ACTIVE SIGNALS RECORDED",
  description = "All municipal grievances in this sector have been triaged or no incidents match the current filters.",
  actionLabel,
  onAction,
  icon,
}: CivicEmptyStateProps) {
  return (
    <div className="w-full py-16 px-6 bg-[#0A0A0A] hairline flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 border border-white/10 flex items-center justify-center mb-4 text-[#818CF8]">
        {icon || (
          <span className="w-3 h-3 bg-[#6366F1] inline-block animate-pulse" />
        )}
      </div>

      <h4 className="font-mono text-xs uppercase tracking-[0.18em] text-white font-medium mb-2">
        {title}
      </h4>

      <p className="text-xs text-[#71717A] max-w-md leading-relaxed mb-6 font-sans">
        {description}
      </p>

      {actionLabel && onAction && (
        <CivicButton variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </CivicButton>
      )}
    </div>
  );
}
