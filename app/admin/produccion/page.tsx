'use client';

import { useInventario } from '@/context/InventarioContext';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

export default function ProduccionPage() {
  const { getInventarioPreparacion, inventarioVenta } = useInventario();
  const items = getInventarioPreparacion();

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-gray-800">
        Producción
      </motion.h1>
      <p className="text-gray-600">Bolsitas disponibles según inventario materia prima y recetas configuradas.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.08, type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="bg-white rounded-2xl shadow-xl border-2 border-superfruty-yellow/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-10 h-10 text-superfruty-yellow" />
              <h3 className="font-bold text-gray-800">{item.descripcion}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">Código: {item.codigo}</p>
            <p className="text-2xl font-bold text-superfruty-black">Disponibles: {item.cantidad}</p>
            <p className="text-sm text-gray-600 mt-2">Costo unit: ${(item.costoUnitario ?? 0).toFixed(2)}</p>
          </motion.div>
        ))}
      </div>

      {inventarioVenta.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-superfruty-yellow/30 bg-white p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recetas por producto</h2>
          <div className="space-y-4">
            {inventarioVenta.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl bg-superfruty-yellow/10 border border-superfruty-yellow/20"
              >
                <p className="font-bold text-gray-800">{p.descripcion}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.ingredientes.map((ing) => (
                    <span key={ing.materiaPrimaId} className="px-2 py-1 rounded-lg bg-white text-sm font-medium">
                      {ing.nombre}: {ing.gramos}g
                    </span>
                  ))}
                  {p.ingredientes.length === 0 && <span className="text-gray-500 text-sm">Sin ingredientes</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {items.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-gray-500">
          <Package className="w-16 h-16 mx-auto mb-4 text-superfruty-yellow" />
          <p>Configura productos en Inventario de Venta con recetas para ver la producción.</p>
        </motion.div>
      )}
    </div>
  );
}
