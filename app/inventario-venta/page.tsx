'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { BarChart3, Loader2 } from 'lucide-react';

const FRUTAL_COLORS = [
  'from-frutal-fresa to-frutal-sandia',
  'from-frutal-mora to-frutal-uva',
  'from-frutal-kiwi to-frutal-limon',
  'from-frutal-mango to-frutal-naranja',
  'from-frutal-banana to-frutal-mango',
];

export default function InventarioVentaPage() {
  const [masVendidos, setMasVendidos] = useState<any[]>([]);
  const [utilidad, setUtilidad] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMasVendidos(15).catch(() => []),
      api.getUtilidad().catch(() => null),
    ]).then(([v, u]) => {
      setMasVendidos(Array.isArray(v) ? v : []);
      setUtilidad(u);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-frutal-mora animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-gray-800"
      >
        Inventario de Venta
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="rounded-2xl bg-gradient-to-br from-frutal-fresa to-frutal-sandia p-6 shadow-xl text-white">
          <p className="text-white/90 text-sm">Ventas Totales</p>
          <p className="text-2xl font-bold">${(utilidad?.ventas_totales ?? 0).toFixed(2)}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-frutal-kiwi to-frutal-limon p-6 shadow-xl text-white">
          <p className="text-white/90 text-sm">Unidades Vendidas</p>
          <p className="text-2xl font-bold">{utilidad?.cantidad_vendida ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-frutal-mora to-frutal-uva p-6 shadow-xl text-white">
          <p className="text-white/90 text-sm">Utilidad</p>
          <p className="text-2xl font-bold">${(utilidad?.utilidad ?? 0).toFixed(2)}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {masVendidos.map((item, i) => (
            <motion.div
              key={item.nombre_batido || i}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className={`rounded-2xl bg-gradient-to-br ${FRUTAL_COLORS[i % FRUTAL_COLORS.length]} p-6 shadow-xl text-white`}
            >
              <div className="flex items-start justify-between">
                <BarChart3 className="w-10 h-10 opacity-80" />
                <span className="px-2 py-0.5 rounded-full bg-white/30 text-xs font-bold">
                  #{i + 1}
                </span>
              </div>
              <h3 className="font-bold text-lg mt-2">{item.nombre_batido}</h3>
              <p className="text-white/90 text-sm mt-1">
                Vendidos: {item.cantidad_vendida ?? 0}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {masVendidos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-gray-500"
        >
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-frutal-fresa/50" />
          <p>No hay datos de ventas aún</p>
        </motion.div>
      )}
    </div>
  );
}
