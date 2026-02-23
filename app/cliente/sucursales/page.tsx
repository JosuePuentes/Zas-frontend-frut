'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSucursal } from '@/context/SucursalContext';
import { motion } from 'framer-motion';
import { MapPin, Phone, Building2 } from 'lucide-react';

const MapaSucursales = dynamic(() => import('@/components/MapaSucursales'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] rounded-2xl bg-gray-100 flex items-center justify-center">
      Cargando mapa...
    </div>
  ),
});

export default function SucursalesPage() {
  const { sucursales } = useSucursal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activas = sucursales.filter((s) => s.activa);

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-gray-800"
      >
        Nuestros puntos de venta
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-600"
      >
        Encuentra la sucursal más cercana a ti
      </motion.p>

      {mounted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MapaSucursales />
        </motion.div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Sucursales</h2>
        {activas.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 bg-white rounded-xl shadow-lg border-2 border-frutal-mango/20"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-frutal-kiwi/20">
                <Building2 className="w-6 h-6 text-frutal-kiwi" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{s.nombre}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 text-frutal-mora" />
                  {s.direccion}
                </p>
                {s.telefono && (
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Phone className="w-4 h-4" />
                    {s.telefono}
                  </p>
                )}
                <a
                  href={`https://www.google.com/maps?q=${s.lat},${s.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-frutal-mora font-medium mt-2 inline-block"
                >
                  Ver en mapa →
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
