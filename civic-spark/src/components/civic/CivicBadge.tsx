interface CivicBadgeProps {
  label: string;
  variant?: "critical" | "high" | "medium" | "low" | "open" | "in_progress" | "resolved" | "rejected" | "neutral";
  pulse?: boolean;
  className?: string;
}

export function CivicBadge({
  label,
  variant = "neutral",
  pulse,
  className = "",
}: CivicBadgeProps) {
  const styles: Record<string, string> = {
    critical: "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444]",
    high: "bg-[#F59E0B]/15 border-[#F59E0B]/40 text-[#F59E0B]",
    medium: "bg-[#6366F1]/15 border-[#6366F1]/40 text-[#818CF8]",
    low: "bg-[#71717A]/15 border-[#71717A]/40 text-[#A1A1AA]",
    open: "bg-[#38BDF8]/15 border-[#38BDF8]/40 text-[#38BDF8]",
    in_progress: "bg-[#F59E0B]/15 border-[#F59E0B]/40 text-[#F59E0B]",
    resolved: "bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E]",
    rejected: "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444]",
    neutral: "bg-white/5 border-white/15 text-[#A1A1AA]",
  };

  const currentStyle = styles[variant] || styles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 border font-mono text-[10px] uppercase tracking-widest font-medium ${currentStyle} ${className}`}
    >
      {pulse && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${
            variant === "critical"
              ? "bg-[#EF4444]"
              : variant === "resolved"
              ? "bg-[#22C55E]"
              : "bg-[#818CF8]"
          }`}
        />
      )}
      <span>{label}</span>
    </span>
  );
}
