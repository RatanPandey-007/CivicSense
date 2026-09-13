import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  popupContent?: string;
  title?: string;
  priority?: string;
  status?: string;
  category?: string;
}

interface LeafletMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (marker: MapMarker) => void;
  height?: string;
  className?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  markers,
  center = [26.8467, 80.9462], // Default UP center
  zoom = 12,
  onMarkerClick,
  height,
  className,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView(center, zoom);

      // High performance dark CartoDB tiles
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
          subdomains: "abcd",
        },
      ).addTo(mapInstance.current);

      markersLayer.current = L.layerGroup().addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markersLayer.current = null;
      }
    };
  }, [center, zoom]);

  useEffect(() => {
    if (!mapInstance.current || !markersLayer.current) return;

    markersLayer.current.clearLayers();

    markers.forEach((marker) => {
      // Color determine based on priority/status
      let markerColor = "#6366F1"; // indigo
      const status = (marker.status || "").toLowerCase();
      const priority = (marker.priority || "").toLowerCase();

      if (status === "resolved") {
        markerColor = "#22C55E"; // green
      } else if (priority === "urgent" || priority === "critical") {
        markerColor = "#EF4444"; // red
      } else if (priority === "high") {
        markerColor = "#F97316"; // orange
      } else if (status === "in_progress" || status === "in progress") {
        markerColor = "#06B6D4"; // cyan
      } else {
        markerColor = "#EAB308"; // amber
      }

      // Custom glowing SVG marker icon
      const customIcon = L.divIcon({
        className: "custom-leaflet-pin",
        html: `
          <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: ${markerColor}; opacity: 0.25; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 14px; height: 14px; border-radius: 50%; background: ${markerColor}; border: 2px solid #FFFFFF; box-shadow: 0 0 10px ${markerColor};"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      const leafletMarker = L.marker([marker.lat, marker.lng], {
        icon: customIcon,
      });

      if (marker.popupContent) {
        leafletMarker.bindPopup(`
          <div style="font-family: 'Inter', sans-serif; font-size: 13px; color: #EDEDED; min-width: 220px; padding: 2px;">
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #71717A; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">
              SIGNAL // ${marker.id.substring(0, 8)}
            </div>
            <div style="font-weight: 600; font-size: 14px; color: #FFFFFF; margin-bottom: 6px; line-height: 1.3;">
              ${marker.title || "Civic Incident"}
            </div>
            ${marker.popupContent}
          </div>
        `);
      }

      if (onMarkerClick) {
        leafletMarker.on("click", () => onMarkerClick(marker));
      }

      markersLayer.current?.addLayer(leafletMarker);
    });
  }, [markers, onMarkerClick]);

  return (
    <div
      ref={mapRef}
      className={`w-full relative ${className || "h-full"}`}
      style={{ minHeight: height || "350px", height: height || "100%", zIndex: 0 }}
    />
  );
};

export default LeafletMap;
