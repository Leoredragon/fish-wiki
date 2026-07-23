'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom active region icon
const ActiveIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom User Spot Icon (Emerald Green)
const SpotIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl,
  iconSize: [28, 45],
  iconAnchor: [14, 45],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Temporary Picked Pin Icon (Red)
const TempPickedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl,
  iconSize: [30, 48],
  iconAnchor: [15, 48],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export interface FishingSpot {
  id: string;
  user_id?: string;
  creator_name: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  image_url?: string;
  created_at: string;
}

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
  fishingSpots: FishingSpot[];
  onSelectSpot: (spot: FishingSpot) => void;
  isPickingLocation: boolean;
  onLocationPicked: (location: { lat: number; lng: number }) => void;
  tempPickedLocation: { lat: number; lng: number } | null;
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

// Component to handle map clicks for coordinate selection
function MapClickHandler({ 
  isPickingLocation, 
  onLocationPicked 
}: { 
  isPickingLocation: boolean; 
  onLocationPicked: (location: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      if (isPickingLocation) {
        onLocationPicked({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    }
  });
  return null;
}

export default function MapComponent({ 
  regions, 
  selectedRegionId, 
  onSelectRegion, 
  fishingSpots,
  onSelectSpot,
  isPickingLocation,
  onLocationPicked,
  tempPickedLocation,
  isTr 
}: MapComponentProps) {
  const selectedRegion = regions.find(r => r.id === selectedRegionId) || regions[0];
  const center: [number, number] = [selectedRegion.pinCoordinates.lat, selectedRegion.pinCoordinates.lng];

  return (
    <MapContainer
      center={center}
      zoom={6}
      scrollWheelZoom={false}
      className="w-full h-[450px] sm:h-[500px] rounded-3xl z-0 overflow-hidden shadow-inner border border-slate-200"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapRecenter center={center} />
      <MapClickHandler isPickingLocation={isPickingLocation} onLocationPicked={onLocationPicked} />

      {/* Regional Base Markers */}
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

      {/* User Fishing Spot Markers (Emerald Green Pins) */}
      {fishingSpots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={SpotIcon}
          eventHandlers={{
            click: () => onSelectSpot(spot),
          }}
        >
          <Popup className="font-sans">
            <div className="font-bold text-sm text-[#0F172A] mb-0.5">
              {spot.title}
            </div>
            <div className="text-[11px] font-semibold text-emerald-600">
              Oluşturan: {spot.creator_name}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Temporary Picked Location Marker */}
      {tempPickedLocation && (
        <Marker
          position={[tempPickedLocation.lat, tempPickedLocation.lng]}
          icon={TempPickedIcon}
        >
          <Popup className="font-sans">
            <div className="font-bold text-xs text-rose-600">
              Seçilen Yeni Mera Konumu
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

