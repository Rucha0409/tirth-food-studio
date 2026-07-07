'use client';

import React, { useEffect, useRef } from 'react';

interface DeliveryMapProps {
  customerAddress?: string;
  customerLat?: number | null;
  customerLng?: number | null;
  distanceKm?: number | null;
}

export default function DeliveryMap({
  customerAddress,
  customerLat,
  customerLng,
  distanceKm,
}: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<any>(null);
  const storeMarker = useRef<any>(null);
  const customerMarker = useRef<any>(null);
  const routeLine = useRef<any>(null);

  // Tarangan Residency, Dhayari, Pune
  const STORE_LAT = 18.4505;
  const STORE_LNG = 73.8085;

  useEffect(() => {
    // Load Leaflet CSS dynamically
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS dynamically
    const initMap = () => {
      const L = (window as any).L;
      if (!L || !mapRef.current || leafletInstance.current) return;

      // Initialize map centered at Dhayari central kitchen
      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
      }).setView([STORE_LAT, STORE_LNG], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Custom green icon for the central kitchen
      const storeIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      storeMarker.current = L.marker([STORE_LAT, STORE_LNG], { icon: storeIcon })
        .addTo(map)
        .bindPopup('<b>तीर्थ – Central Satvik Kitchen</b><br>Tarangan Residency, Dhayari')
        .openPopup();

      leafletInstance.current = map;
    };

    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      // Clean up map instance on unmount
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, []);

  // Update map when customer coordinates change
  useEffect(() => {
    const L = (window as any).L;
    const map = leafletInstance.current;
    if (!L || !map) return;

    // Remove old markers/lines
    if (customerMarker.current) {
      map.removeLayer(customerMarker.current);
      customerMarker.current = null;
    }
    if (routeLine.current) {
      map.removeLayer(routeLine.current);
      routeLine.current = null;
    }

    if (customerLat && customerLng) {
      // Custom saffron/orange icon for customer
      const customerIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      customerMarker.current = L.marker([customerLat, customerLng], { icon: customerIcon })
        .addTo(map)
        .bindPopup(`<b>Your Address</b><br>Distance: ${distanceKm || '?'} km`);

      // Draw connecting route line
      routeLine.current = L.polyline(
        [
          [STORE_LAT, STORE_LNG],
          [customerLat, customerLng],
        ],
        {
          color: '#E53E3E',
          weight: 3,
          opacity: 0.7,
          dashArray: '5, 10',
        }
      ).addTo(map);

      // Fit map to contain both points
      const bounds = L.latLngBounds([
        [STORE_LAT, STORE_LNG],
        [customerLat, customerLng],
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // Center back on central kitchen
      map.setView([STORE_LAT, STORE_LNG], 13);
      if (storeMarker.current) {
        storeMarker.current.openPopup();
      }
    }
  }, [customerLat, customerLng, distanceKm]);

  return (
    <div className="w-full bg-[#FAF8F5] border-2 border-leaf/10 rounded-[24px] overflow-hidden shadow-sm relative">
      <div className="bg-[#FAF8F5] p-3 px-4 flex items-center justify-between border-b border-leaf/10">
        <div>
          <span className="text-[9px] uppercase font-black text-saffron tracking-wider block">Live Delivery Zone Router</span>
          <span className="text-xs font-bold text-leaf-dark">Kitchen & Delivery Map</span>
        </div>
        {distanceKm !== null && (
          <span className="p-1 px-2.5 bg-saffron text-white text-[9px] font-black rounded-lg uppercase tracking-wider">
            {distanceKm} km distance
          </span>
        )}
      </div>
      <div ref={mapRef} className="w-full h-[220px] z-0" />
      <div className="bg-cream/40 p-2.5 px-4 text-center border-t border-leaf/5 text-[9px] font-bold text-charcoal/50">
        📍 Base: Raikar Vasti, Dhayari, Pune. Delivers up to 15km+ radius.
      </div>
    </div>
  );
}
