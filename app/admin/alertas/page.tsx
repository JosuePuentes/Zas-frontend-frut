'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function AlertasPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCaducidad().then((d) => setItems(Array.isArray(d) ? d : [])).catch(() => setItems([])).finally(() => setLoading(false));
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
        Alertas de Caducidad
      </motion.h1>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
        Materia prima ordenada por antigüedad (usar primero la más antigua)
      </motion.p>

      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl shadow-xl border-2 border-frutal-mango/30 p-6 flex items-center gap-4"
          >
            <div className="p-3 rounded-xl bg-frutal-fresa/20">
              <AlertTriangle className="w-8 h-8 text-frutal-fresa" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{item.nombre}</h3>
              <p className="text-sm text-gray-600">Cantidad: {item.cantidad_total} {item.unidad_medida}</p>
              <p className="text-sm text-frutal-fresa font-medium">
                Fecha ingreso: {item.fecha_ingreso ? new Date(item.fecha_ingreso).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-gray-500 bg-white rounded-2xl shadow-lg">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-frutal-kiwi" />
          <p>No hay alertas de caducidad</p>
        </motion.div>
      )}
    </div>
  );
}
