interface CivicEyebrowProps {
  number?: string;
  label: string;
  tag?: string;
  color?: string;
  className?: string;
}

export function CivicEyebrow({
  number = "01",
  label,
  tag,
  color = "#6366F1",
  className = "",
}: CivicEyebrowProps) {
  return (
    <div className={`flex items-center gap-6 mb-8 ${className}`}>
      <div className="flex items-center gap-3 shrink-0">
        <span
          className="w-1.5 h-1.5 inline-block"
          style={{ backgroundColor: color }}
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA]">
          {number} · {label}
        </span>
        {tag && (
          <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-white/10 text-[#71717A] bg-white/[0.02]">
            {tag}
          </span>
        )}
      </div>
      <div className="h-[1px] w-full bg-white/10" />
    </div>
  );
}
