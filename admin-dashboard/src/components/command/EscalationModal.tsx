import { useState } from "react";
import { AlertTriangle, X, Zap } from "lucide-react";

interface EscalationModalProps {
  issueId: string;
  issueTitle: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

const ESCALATION_REASONS = [
  "Immediate public safety risk",
  "Critical infrastructure failure",
  "Media/political attention required",
  "SLA breach imminent",
  "Multi-ward coordination needed",
  "Environmental hazard detected",
];

export default function EscalationModal({
  issueId,
  issueTitle,
  onConfirm,
  onClose,
}: EscalationModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    const reason = selectedReason || customReason;
    if (!reason) return;
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 800));
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#111114] border border-[rgba(239,68,68,0.3)] rounded-xl overflow-hidden shadow-2xl">
        {/* Critical header stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg leading-none">
                  ESCALATE INCIDENT
                </h2>
                <p className="text-[#71717A] text-xs mt-1 font-mono uppercase tracking-widest">
                  {issueId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#71717A] hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Issue title */}
          <div className="mb-5 p-3 bg-[#0D0D0F] rounded-lg border border-[rgba(255,255,255,0.06)]">
            <p className="text-[#A1A1AA] text-xs font-mono uppercase tracking-widest mb-1">
              INCIDENT
            </p>
            <p className="text-white text-sm font-medium leading-snug">
              {issueTitle}
            </p>
          </div>

          {/* Warning text */}
          <p className="text-[#A1A1AA] text-sm mb-5 leading-relaxed">
            Escalating this incident will trigger{" "}
            <span className="text-red-400 font-medium">PRIORITY OVERRIDE</span>{" "}
            protocols, alert all senior administrators, and fast-track resource
            allocation. This action is logged and audited.
          </p>

          {/* Reason selection */}
          <div className="mb-4">
            <p className="text-[#71717A] text-xs font-mono uppercase tracking-widest mb-3">
              ESCALATION REASON
            </p>
            <div className="grid grid-cols-1 gap-2">
              {ESCALATION_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`text-left p-3 rounded-lg border text-sm transition-all ${
                    selectedReason === reason
                      ? "border-red-500/50 bg-red-500/10 text-white"
                      : "border-[rgba(255,255,255,0.06)] bg-[#0D0D0F] text-[#A1A1AA] hover:border-[rgba(255,255,255,0.14)] hover:text-white"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          {/* Custom reason */}
          <div className="mb-6">
            <p className="text-[#71717A] text-xs font-mono uppercase tracking-widest mb-2">
              OR SPECIFY REASON
            </p>
            <textarea
              value={customReason}
              onChange={(e) => {
                setCustomReason(e.target.value);
                setSelectedReason("");
              }}
              placeholder="Describe the escalation reason..."
              rows={2}
              className="w-full bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2 text-white text-sm placeholder-[#71717A] focus:outline-none focus:border-red-500/40 resize-none transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#18181B] border border-[rgba(255,255,255,0.08)] rounded-lg text-[#A1A1AA] text-sm font-medium hover:text-white hover:border-[rgba(255,255,255,0.14)] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedReason && !customReason}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-red-900/30 disabled:text-red-700 rounded-lg text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              {confirming ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {confirming ? "Escalating..." : "ESCALATE NOW"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
