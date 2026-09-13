import { useState } from "react";
import {
  Sliders,
  Building,
  MapPin,
  Truck,
  Phone,
  CheckCircle2,
  Save,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export default function MunicipalSettings() {
  const [wardName, setWardName] = useState("Central Urban Ward 12");
  const [pincodes, setPincodes] = useState("226001, 226002, 226024");
  const [activeVans, setActiveVans] = useState(4);
  const [hotline, setHotline] = useState("+91 522 2621000");
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
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#06B6D4] uppercase tracking-widest mb-1">
            <Sliders className="w-3 h-3" />
            <span>WARD CONFIGURATION</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Jurisdiction Boundaries & Rapid Response Fleet
          </h1>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 font-mono text-xs text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-3 py-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>WARD CONFIGURATION SAVED</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
        {/* Jurisdiction Details */}
        <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Building className="w-4 h-4 text-[#06B6D4]" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Ward Identification & Boundaries
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[#A1A1AA] uppercase block">
                Assigned Ward Title
              </label>
              <Input
                value={wardName}
                onChange={(e) => setWardName(e.target.value)}
                className="bg-[#080808] border-[rgba(255,255,255,0.08)] text-white rounded-none focus:border-[#06B6D4]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#A1A1AA] uppercase block">
                Covered Postal Pincodes (Comma separated)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                <Input
                  value={pincodes}
                  onChange={(e) => setPincodes(e.target.value)}
                  className="pl-9 bg-[#080808] border-[rgba(255,255,255,0.08)] text-white rounded-none focus:border-[#06B6D4]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fleet & Hotline */}
        <div className="bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <Truck className="w-4 h-4 text-[#22C55E]" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              On-Call Emergency Fleet & Dispatch Hotline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[#A1A1AA] uppercase block">
                Active Repair Crew Vehicles
              </label>
              <Input
                type="number"
                value={activeVans}
                onChange={(e) => setActiveVans(Number(e.target.value))}
                className="bg-[#080808] border-[rgba(255,255,255,0.08)] text-white rounded-none focus:border-[#06B6D4]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#A1A1AA] uppercase block">
                Direct Municipal Control Room Line
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
                <Input
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  className="pl-9 bg-[#080808] border-[rgba(255,255,255,0.08)] text-white rounded-none focus:border-[#06B6D4]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="rounded-none bg-[#06B6D4] hover:bg-[#0891B2] text-black font-semibold uppercase tracking-wider gap-2 shadow-[0_0_16px_rgba(6,182,212,0.3)]"
          >
            <Save className="w-4 h-4" />
            Save Ward Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
