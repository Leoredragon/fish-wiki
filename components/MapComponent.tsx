'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom active icon
const ActiveIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Region {
  id: string;
  nameTr: string;
  nameEn: string;
  waterType: string;
  pinCoordinates: { lat: number; lng: number };
}

interface MapComponentProps {
  regions: Region[];
  selectedRegionId: string;
  onSelectRegion: (id: string) => void;
  isTr: boolean;
}

// Component to dynamically recenter map when selected region changes
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

export default function MapComponent({ regions, selectedRegionId, onSelectRegion, isTr }: MapComponentProps) {
  const selectedRegion = regions.find(r => r.id === selectedRegionId) || regions[0];
  const center: [number, number] = [selectedRegion.pinCoordinates.lat, selectedRegion.pinCoordinates.lng];

  return (
    <MapContainer
      center={center}
      zoom={6}
      scrollWheelZoom={false}
      className="w-full h-[400px] rounded-2xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapRecenter center={center} />

      {regions.map((reg) => {
        const isSelected = reg.id === selectedRegionId;
        return (
          <Marker
            key={reg.id}
            position={[reg.pinCoordinates.lat, reg.pinCoordinates.lng]}
            icon={isSelected ? ActiveIcon : DefaultIcon}
            eventHandlers={{
              click: () => onSelectRegion(reg.id),
            }}
          >
            <Popup className="font-sans">
              <div className="font-bold text-sm text-[#0F172A] mb-1">
                {isTr ? reg.nameTr : reg.nameEn}
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                {reg.waterType}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
