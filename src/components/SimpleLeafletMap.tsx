import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MOCK_MERCHANTS, MOCK_POIS, MOCK_COMPETITORS, BRI_BRANCH } from '../mockData';

// Fix Leaflet default icon issue
const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

const SimpleLeafletMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Prevent double initialization
    if (mapRef.current) return;

    console.log('Initializing map...');

    try {
      // Create map
      const map = L.map(mapContainerRef.current, {
        center: [-6.1812, 106.8378],
        zoom: 13,
        zoomControl: true,
      });

      console.log('Map created');

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      console.log('Tile layer added');

      // Create custom icons
      const acquiredIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #4f46e5; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      const potentialIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #f97316; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      const branchIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #9333ea; width: 32px; height: 32px; border-radius: 8px; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const poiIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #06b6d4; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 20],
      });

      const competitorIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #dc2626; width: 20px; height: 20px; border-radius: 4px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 20],
      });

      // Add BRI Branch
      L.marker([BRI_BRANCH.lat, BRI_BRANCH.lng], { icon: branchIcon })
        .bindPopup(`
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${BRI_BRANCH.name}</div>
            <div style="font-size: 12px; color: #64748b;">Type: Main Branch</div>
          </div>
        `)
        .addTo(map);

      console.log('BRI Branch added');

      // Add acquired merchants
      MOCK_MERCHANTS.filter(m => m.status === 'acquired').forEach(merchant => {
        L.marker([merchant.lat, merchant.lng], { icon: acquiredIcon })
          .bindPopup(`
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${merchant.name}</div>
              <div style="font-size: 12px; color: #64748b;">Status: <span style="color: #4f46e5; font-weight: bold;">Acquired</span></div>
              <div style="font-size: 12px; color: #64748b;">CASA: Rp ${merchant.casa}M</div>
              <div style="font-size: 12px; color: #64748b;">RM: ${merchant.rm}</div>
              <div style="font-size: 12px; color: #64748b;">Category: ${merchant.category}</div>
            </div>
          `)
          .addTo(map);
      });

      console.log('Acquired merchants added:', MOCK_MERCHANTS.filter(m => m.status === 'acquired').length);

      // Add potential merchants
      MOCK_MERCHANTS.filter(m => m.status === 'potential').forEach(merchant => {
        L.marker([merchant.lat, merchant.lng], { icon: potentialIcon })
          .bindPopup(`
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${merchant.name}</div>
              <div style="font-size: 12px; color: #64748b;">Status: <span style="color: #f97316; font-weight: bold;">Potential TAM</span></div>
              <div style="font-size: 12px; color: #64748b;">Category: ${merchant.category}</div>
            </div>
          `)
          .addTo(map);
      });

      console.log('Potential merchants added:', MOCK_MERCHANTS.filter(m => m.status === 'potential').length);

      // Add POIs
      MOCK_POIS.forEach(poi => {
        L.marker([poi.lat, poi.lng], { icon: poiIcon })
          .bindPopup(`
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${poi.name}</div>
              <div style="font-size: 12px; color: #64748b;">Type: ${poi.category}</div>
              <div style="font-size: 12px; color: #64748b;">Traffic: ${poi.traffic}</div>
            </div>
          `)
          .addTo(map);
      });

      console.log('POIs added:', MOCK_POIS.length);

      // Add competitors
      MOCK_COMPETITORS.forEach(comp => {
        L.marker([comp.lat, comp.lng], { icon: competitorIcon })
          .bindPopup(`
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${comp.name}</div>
              <div style="font-size: 12px; color: #64748b;">Type: ${comp.type}</div>
            </div>
          `)
          .addTo(map);
      });

      console.log('Competitors added:', MOCK_COMPETITORS.length);

      // Add heatmap circles
      const heatmapData = [
        { lat: -6.1944, lng: 106.8294, value: 0.8, radius: 800 },
        { lat: -6.1856, lng: 106.8145, value: 0.6, radius: 700 },
        { lat: -6.1753, lng: 106.8267, value: 0.7, radius: 600 },
        { lat: -6.1589, lng: 106.8234, value: 0.5, radius: 500 },
        { lat: -6.1678, lng: 106.8456, value: 0.4, radius: 600 },
        { lat: -6.1734, lng: 106.8512, value: 0.3, radius: 500 },
      ];

      heatmapData.forEach(point => {
        const color = point.value > 0.7 ? '#22c55e' : point.value > 0.5 ? '#eab308' : '#ef4444';
        L.circle([point.lat, point.lng], {
          radius: point.radius,
          fillColor: color,
          fillOpacity: 0.2,
          color: color,
          weight: 1,
          opacity: 0.4,
        }).addTo(map);
      });

      console.log('Heatmap circles added');

      mapRef.current = map;

      // Force resize after a delay
      setTimeout(() => {
        map.invalidateSize();
        console.log('Map size invalidated');
      }, 100);

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      if (mapRef.current) {
        console.log('Cleaning up map');
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative h-full min-h-[400px]">
      <div 
        ref={mapContainerRef} 
        style={{ 
          height: '100%', 
          width: '100%', 
          minHeight: '400px',
          position: 'relative',
          zIndex: 0
        }}
      />
      
      {/* Simple Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-auto">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Map Legend</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-600" />
            <span className="text-xs font-bold text-slate-600">Acquired Merchants</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-xs font-bold text-slate-600">Potential TAM</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-600" />
            <span className="text-xs font-bold text-slate-600">BRI Branch</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span className="text-xs font-bold text-slate-600">POI</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-600" />
            <span className="text-xs font-bold text-slate-600">Competitors</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLeafletMap;
