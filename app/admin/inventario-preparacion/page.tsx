'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { Loader2, Utensils } from 'lucide-react';

const FRUTAL_COLORS = [
  'from-frutal-kiwi to-frutal-limon',
  'from-frutal-fresa to-frutal-sandia',
  'from-frutal-mora to-frutal-uva',
  'from-frutal-mango to-frutal-naranja',
  'from-frutal-banana to-frutal-mango',
];

export default function InventarioPreparacionPage() {
  const [batidos, setBatidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAvailability().then((d) => setBatidos(Array.isArray(d) ? d : [])).catch(() => setBatidos([])).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-frutal-mora animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-gray-800">
        Inventario Preparación
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {batidos.map((item, i) => (
            <motion.div
              key={item.recipe_id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className={`rounded-2xl bg-gradient-to-br ${FRUTAL_COLORS[i % FRUTAL_COLORS.length]} p-6 shadow-xl text-white`}
            >
              <div className="flex items-start justify-between">
                <Utensils className="w-10 h-10 opacity-90" />
                {item.total_disponible <= 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-xs font-bold">Sin stock</span>
                )}
              </div>
              <h3 className="font-bold text-lg mt-2">{item.nombre_batido}</h3>
              <p className="text-white/95 text-sm mt-1">Stock dosis: {item.stock_dosis ?? 0}</p>
              <p className="text-white/95 text-sm">Producibles: {item.producibles_con_materia_prima ?? 0}</p>
              <p className="text-white/95 text-sm font-medium">Total disponible: {item.total_disponible ?? 0}</p>
              <p className="text-white/90 text-sm mt-2">${item.precio_sugerido?.toFixed(2)}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {batidos.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-gray-500">
          <Utensils className="w-16 h-16 mx-auto mb-4 text-frutal-kiwi" />
          <p>No hay batidos en preparación</p>
        </motion.div>
      )}
    </div>
  );
}
