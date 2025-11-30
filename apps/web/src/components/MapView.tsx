import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import of Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix for default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      // Initialize map - Coordinates for Ferme du Temple, Frameries
      const map = L.map(mapRef.current!).setView([50.3993, 3.9047], 9);

      // Add minimalist Carto tiles with custom styling
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Create custom marker icon with brand colors
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="
          width: 24px;
          height: 24px;
          background-color: hsl(330, 90%, 50%);
          border: 3px solid hsl(0, 0%, 5%);
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      // Add marker for Ferme du Temple
      const marker = L.marker([50.3993, 3.9047], {
        icon: customIcon,
        alt: 'La Ferme du Temple - Location marker'
      }).addTo(map);

      // Add accessibility attributes to the marker element
      marker.on('add', () => {
        const markerElement = marker.getElement();
        if (markerElement) {
          markerElement.setAttribute('aria-label', 'La Ferme du Temple - 227 rue Joseph Wauters, 7080 Frameries, Belgique');
          markerElement.setAttribute('title', 'La Ferme du Temple - Click for details');
        }
      });

      marker.bindPopup(
        `<div style="font-family: system-ui; padding: 8px;">
          <strong style="color: hsl(330, 90%, 50%); font-size: 14px;">La Ferme du Temple</strong><br/>
          <span style="color: hsl(0, 0%, 10%); font-size: 12px;">227 rue Joseph Wauters<br/>7080 Frameries, Belgique</span>
        </div>`
      );

      mapInstanceRef.current = map;
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-full border-4 border-rich-black"
      style={{ 
        minHeight: "450px",
        filter: "grayscale(20%) contrast(1.1)"
      }}
    />
  );
};
