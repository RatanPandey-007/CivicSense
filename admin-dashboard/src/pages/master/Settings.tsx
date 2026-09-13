import { useState } from "react";
import {
  Sliders,
  Cpu,
  Database,
  Radio,
  CheckCircle2,
  Save,
  RotateCcw,
} from "lucide-react";
import { Button } from "../../components/ui/Button";

export default function MasterSettings() {
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);
  const [duplicateWindowHours, setDuplicateWindowHours] = useState(24);
  const [smsGateway, setSmsGateway] = useState("Fast2SMS India");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#818CF8] uppercase tracking-widest mb-1">
            <Sliders className="w-3 h-3" />
            <span>INFRASTRUCTURE & ORCHESTRATION</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            System Configuration & SLA Matrix
          </h1>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-3 py-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>SETTINGS PERSISTED TO CLUSTER</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: AI Triage Engine */}
        <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Cpu className="w-4 h-4 text-[#6366F1]" />
            <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Autonomous AI Triage Engine
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Auto-Dispatch on High Confidence</span>
                <button
                  type="button"
                  onClick={() => setAutoDispatch(!autoDispatch)}
                  className={`w-11 h-6 flex items-center p-1 transition-colors ${
                    autoDispatch ? "bg-[#6366F1]" : "bg-[#27272A]"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 shadow-md transform transition-transform ${
                      autoDispatch ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11px] text-[#71717A]">
                Automatically route tickets to municipal wards when AI model confidence exceeds target threshold.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Confidence Cutoff Threshold</span>
                <span className="text-[#818CF8] font-bold">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-[#6366F1] bg-[#080808]"
              />
              <p className="text-[11px] text-[#71717A]">
                Reports scoring below this value are queued for human review in Incident Triage.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Deduplication & Spatial Grouping */}
        <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Database className="w-4 h-4 text-[#06B6D4]" />
            <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Spatial Deduplication & Cluster Merging
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="space-y-2">
              <label className="text-white font-medium block">
                Proximity Radius for Duplicate Suppression
              </label>
              <select className="w-full bg-[#080808] border border-[rgba(255,255,255,0.08)] text-white p-2.5 focus:border-[#6366F1]">
                <option>50 meters (Dense Urban Alleyway)</option>
                <option>100 meters (Default Standard)</option>
                <option>250 meters (Highway / Arterial Corridor)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-white font-medium block">
                Time Window for Signal Grouping
              </label>
              <input
                type="number"
                value={duplicateWindowHours}
                onChange={(e) => setDuplicateWindowHours(Number(e.target.value))}
                className="w-full bg-[#080808] border border-[rgba(255,255,255,0.08)] text-white p-2 focus:border-[#6366F1]"
              />
              <span className="text-[10px] text-[#71717A]">Hours to treat co-located reports as single issue</span>
            </div>
          </div>
        </div>

        {/* Section 3: Telemetry & OTP Gateway */}
        <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Radio className="w-4 h-4 text-[#22C55E]" />
            <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Citizen SMS OTP & Communication Gateway
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="space-y-2">
              <label className="text-white font-medium block">Primary Gateway Provider</label>
              <select
                value={smsGateway}
                onChange={(e) => setSmsGateway(e.target.value)}
                className="w-full bg-[#080808] border border-[rgba(255,255,255,0.08)] text-white p-2.5 focus:border-[#6366F1]"
              >
                <option>Fast2SMS India (Live DLT Gateway)</option>
                <option>Twilio Telecom Cloud</option>
                <option>Simulated Mock Sandbox (Zero Latency)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-white font-medium block">Cluster Endpoint Status</label>
              <div className="p-2.5 bg-[#080808] border border-[rgba(255,255,255,0.08)] flex items-center justify-between text-[#A1A1AA]">
                <span>http://localhost:5000</span>
                <span className="text-[#22C55E] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setAutoDispatch(true);
              setConfidenceThreshold(90);
              setDuplicateWindowHours(24);
            }}
            className="rounded-none bg-transparent border-[rgba(255,255,255,0.08)] text-[#71717A] hover:text-white font-mono text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset Defaults
          </Button>

          <Button
            type="submit"
            className="rounded-none bg-[#6366F1] hover:bg-[#4F46E5] text-white font-mono text-xs uppercase tracking-wider gap-2 shadow-[0_0_16px_rgba(99,102,241,0.3)]"
          >
            <Save className="w-3.5 h-3.5" />
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
