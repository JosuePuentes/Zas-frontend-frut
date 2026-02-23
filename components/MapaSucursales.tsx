'use client';

import { useEffect, useState } from 'react';
import { useSucursal } from '@/context/SucursalContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ZULIA_CENTER: [number, number] = [10.6427, -71.6125];

const storeIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapaSucursales() {
  const { sucursales } = useSucursal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activas = sucursales.filter((s) => s.activa);

  if (!mounted) {
    return (
      <div className="h-[400px] rounded-2xl bg-gray-100 flex items-center justify-center">
        Cargando mapa...
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-frutal-mango/30 h-[400px]">
      <MapContainer
        center={activas.length > 0 ? [activas[0].lat, activas[0].lng] : ZULIA_CENTER}
        zoom={activas.length > 1 ? 11 : 13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {activas.map((s) => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={storeIcon}>
            <Popup>
              <div className="p-2 min-w-[180px]">
                <p className="font-bold text-frutal-mora">{s.nombre}</p>
                <p className="text-sm text-gray-600">{s.direccion}</p>
                {s.telefono && (
                  <p className="text-sm text-gray-600 mt-1">Tel: {s.telefono}</p>
                )}
                <a
                  href={`https://www.google.com/maps?q=${s.lat},${s.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 mt-1 inline-block"
                >
                  Cómo llegar →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
