'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ZULIA_CENTER: [number, number] = [10.6427, -71.6125];

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapaZulia() {
  const { user, isMaster } = useAuth();
  const { getAllOrders } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const allOrders = getAllOrders(isMaster() ? undefined : user?.sucursalId);
  const pedidos = allOrders.filter((o) => o.estado === 'envio' && o.ubicacionEntrega);

  if (!mounted) {
    return (
      <div className="h-[600px] rounded-2xl bg-gray-100 flex items-center justify-center">
        Cargando mapa...
      </div>
    );
  }

  return (
    <MapContainer
      center={ZULIA_CENTER}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
      className="rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pedidos.map((p) => (
        <Marker
          key={p.id}
          position={[p.ubicacionEntrega!.lat, p.ubicacionEntrega!.lng]}
          icon={icon}
        >
          <Popup>
            <div className="p-2 min-w-[180px]">
              <p className="font-bold">{p.clienteNombre}</p>
              <p className="text-sm text-gray-600">{p.direccionEntrega || `${p.ubicacionEntrega!.lat.toFixed(4)}, ${p.ubicacionEntrega!.lng.toFixed(4)}`}</p>
              <p className="text-sm text-superfruty-yellow font-medium mt-1">${p.total.toFixed(2)}</p>
              <a
                href={`https://www.google.com/maps?q=${p.ubicacionEntrega!.lat},${p.ubicacionEntrega!.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 mt-1 inline-block"
              >
                Abrir en Google Maps →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
