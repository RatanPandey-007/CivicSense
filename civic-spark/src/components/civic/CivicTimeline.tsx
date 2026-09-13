export interface TimelineEvent {
  step: string;
  label: string;
  description: string;
  timestamp?: string;
  isComplete: boolean;
  isActive?: boolean;
}

interface CivicTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function CivicTimeline({ events, className = "" }: CivicTimelineProps) {
  return (
    <div className={`space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10 ${className}`}>
      {events.map((ev, i) => (
        <div key={ev.step} className="relative pl-8 flex items-start gap-4">
          {/* Timeline Node Dot */}
          <span
            className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full -translate-x-1/2 transition-colors ${
              ev.isActive
                ? "bg-[#6366F1] ring-4 ring-[#6366F1]/20 animate-pulse"
                : ev.isComplete
                ? "bg-[#22C55E]"
                : "bg-white/20"
            }`}
          />

          <div className="flex-1 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-medium tracking-wide">
                {ev.step} · {ev.label}
              </span>
              {ev.timestamp && (
                <span className="text-[10px] text-[#71717A]">{ev.timestamp}</span>
              )}
            </div>
            <p className="text-xs text-[#A1A1AA] font-sans leading-relaxed mt-1">
              {ev.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
