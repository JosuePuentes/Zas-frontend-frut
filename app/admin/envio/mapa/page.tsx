'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';

const MapaZulia = dynamic(() => import('@/components/MapaZulia'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-2xl bg-gray-100 flex items-center justify-center">
      Cargando mapa...
    </div>
  ),
});

export default function MapaEnvioPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link
          href="/admin/envio"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-frutal-mora"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a envíos
        </Link>
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-frutal-kiwi" />
          Mapa - Estado Zulia
        </h1>
      </div>

      <div className="h-[600px] rounded-2xl overflow-hidden border-2 border-frutal-mango/30">
        <MapaZulia />
      </div>

      <p className="text-sm text-gray-600">
        Los marcadores muestran las ubicaciones de entrega de los pedidos en envío. Haz clic en cada marcador para ver los detalles.
      </p>
    </div>
  );
}
