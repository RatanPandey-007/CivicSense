import { useEffect, useRef, useState } from "react";
import { dataAdapter, CivicIssueItem } from "@/lib/dataAdapter";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export function CityMapSection() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  const [issues, setIssues] = useState<CivicIssueItem[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<CivicIssueItem | null>(null);
  const [filter, setFilter] = useState<"all" | "critical" | "open" | "resolved">("all");

  useEffect(() => {
    dataAdapter.getIssues().then((data) => {
      setIssues(data);
      if (data.length > 0) {
        setSelectedIssue(data[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstance.current) {
      // Initialize Leaflet map with dark theme
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([18.5204, 73.8567], 13);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // CartoDB Dark Matter tiles for pure dark command-center look
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
        }
      ).addTo(map);

      markersLayer.current = L.layerGroup().addTo(map);
      mapInstance.current = map;
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update map markers when issues or filter changes
  useEffect(() => {
    if (!mapInstance.current || !markersLayer.current) return;

    markersLayer.current.clearLayers();

    const filteredIssues = issues.filter((issue) => {
      if (filter === "all") return true;
      if (filter === "critical") return issue.priority === "critical";
      if (filter === "open") return issue.status === "open" || issue.status === "in_progress";
      if (filter === "resolved") return issue.status === "resolved";
      return true;
    });

    filteredIssues.forEach((issue) => {
      const color =
        issue.priority === "critical"
          ? "#EF4444"
          : issue.status === "resolved"
          ? "#22C55E"
          : issue.priority === "high"
          ? "#F59E0B"
          : "#6366F1";

      const isCritical = issue.priority === "critical";

      // Command-center custom HTML div icon
      const customIcon = L.divIcon({
        className: "custom-command-pin",
        html: `
          <div style="position: relative; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center;">
            ${
              isCritical
                ? `<span style="position: absolute; width: 22px; height: 22px; border-radius: 50%; background: ${color}33; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>`
                : ""
            }
            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${color}; border: 1.5px solid #080808; box-shadow: 0 0 8px ${color};"></span>
          </div>
        `,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([issue.location_lat, issue.location_lng], {
        icon: customIcon,
      });

      marker.on("click", () => {
        setSelectedIssue(issue);
        mapInstance.current?.panTo([issue.location_lat, issue.location_lng], {
          animate: true,
          duration: 0.8,
        });
      });

      markersLayer.current?.addLayer(marker);
    });
  }, [issues, filter]);

  return (
    <section id="map" className="relative w-full bg-[#080808] py-24 md:py-36 px-6 md:px-12 hairline-b">
      <div className="max-w-[1440px] mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#6366F1]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA]">
              04 · CITY INTELLIGENCE
            </span>
          </div>
          <div className="h-[1px] w-full bg-white/10" />
        </div>

        {/* Section Headline & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="font-display font-light text-white tracking-[-0.045em] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] mb-4">
              EVERY REPORT <br />
              <span className="text-[#818CF8]">HAS A PLACE.</span>
            </h2>
            <p className="text-[#A1A1AA] text-base max-w-xl">
              Geospatial coordination connects incidents to designated postal zones and emergency municipal dispatch units.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {(["all", "critical", "open", "resolved"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border transition-all ${
                  filter === f
                    ? "border-[#6366F1] bg-[#6366F1]/10 text-white font-medium"
                    : "border-white/10 text-[#71717A] hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Map & Detail Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/10 hairline overflow-hidden min-h-[560px]">
          {/* Leaflet Command Map */}
          <div className="lg:col-span-8 bg-[#080808] relative min-h-[420px] lg:min-h-[560px]">
            <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

            {/* Map Telemetry Floating Header */}
            <div className="absolute top-4 left-4 z-10 bg-[#080808]/85 backdrop-blur-md hairline px-3.5 py-2 font-mono text-[10px] text-[#A1A1AA] flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-[#22C55E]" />
              <span>RADAR ACTIVE: {issues.length} LOCATIONS</span>
            </div>
          </div>

          {/* Issue Detail Inspector Panel */}
          <div className="lg:col-span-4 bg-[#0A0A0A] p-6 md:p-8 flex flex-col justify-between">
            {selectedIssue ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-[#71717A] font-mono text-[10px] uppercase mb-2">
                    <span>REPORT INSPECTOR</span>
                    <span>#{selectedIssue.id}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-medium text-white tracking-tight leading-snug">
                    {selectedIssue.title}
                  </h3>
                </div>

                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  {selectedIssue.description}
                </p>

                <div className="space-y-3 font-mono text-xs hairline-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">CATEGORY:</span>
                    <span className="text-white uppercase">{selectedIssue.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#71717A]">PRIORITY:</span>
                    <span
                      className={`px-2 py-0.5 uppercase text-[10px] font-medium border ${
                        selectedIssue.priority === "critical"
                          ? "border-[#EF4444] text-[#EF4444] bg-[#EF4444]/10"
                          : selectedIssue.priority === "high"
                          ? "border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/10"
                          : "border-[#22C55E] text-[#22C55E] bg-[#22C55E]/10"
                      }`}
                    >
                      {selectedIssue.priority}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">AI CONFIDENCE:</span>
                    <span className="text-[#818CF8]">
                      {Math.round(selectedIssue.ai_confidence * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">COORDINATES:</span>
                    <span className="text-white">
                      {selectedIssue.location_lat.toFixed(4)}, {selectedIssue.location_lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">LOCATION:</span>
                    <span className="text-white text-right max-w-[180px] truncate">
                      {selectedIssue.address}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">STATUS:</span>
                    <span className="text-[#38BDF8] uppercase">{selectedIssue.status}</span>
                  </div>
                </div>

                {selectedIssue.image_url && (
                  <div className="hairline-t pt-4">
                    <span className="font-mono text-[10px] uppercase text-[#71717A] block mb-2">
                      FORENSIC EVIDENCE
                    </span>
                    <img
                      src={selectedIssue.image_url}
                      alt="Issue Evidence"
                      className="w-full h-32 object-cover border border-white/10"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center font-mono text-xs text-[#71717A] py-12">
                SELECT A SIGNAL POINT ON THE RADAR
              </div>
            )}

            <div className="hairline-t pt-6 text-[10px] font-mono text-[#71717A] flex justify-between">
              <span>LAT/LNG WGS-84</span>
              <span>CARTO DARK MATTER</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
