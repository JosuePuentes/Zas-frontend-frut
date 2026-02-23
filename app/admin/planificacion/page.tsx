'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { ClipboardList, Loader2, AlertTriangle } from 'lucide-react';

export default function PlanificacionPage() {
  const [lista, setLista] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getListaCompras().then((d) => setLista(Array.isArray(d) ? d : [])).catch(() => setLista([])).finally(() => setLoading(false));
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
        Planificación - Lista de Compras
      </motion.h1>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
        Items con stock actual por debajo del mínimo
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lista.map((item, i) => (
          <motion.div
            key={item._id || item.nombre || i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl shadow-xl border-l-4 border-frutal-fresa p-6 flex items-start gap-3"
          >
            <AlertTriangle className="w-8 h-8 text-frutal-fresa flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-800">{item.nombre}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Actual: {item.stock_actual ?? item.cantidad_total ?? 0} | Mínimo: {item.stock_minimo ?? 0}
              </p>
              <p className="text-sm text-frutal-fresa font-medium mt-1">
                Comprar: {Math.max(0, (item.stock_minimo ?? 0) - (item.stock_actual ?? item.cantidad_total ?? 0))} {item.unidad_medida ?? 'unidades'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {lista.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-gray-500 bg-white rounded-2xl shadow-lg">
          <ClipboardList className="w-16 h-16 mx-auto mb-4 text-frutal-kiwi" />
          <p>Todo el stock está en niveles adecuados</p>
        </motion.div>
      )}
    </div>
  );
}
