'use client';

import { useInventario } from '@/context/InventarioContext';
import { motion } from 'framer-motion';
import { Utensils } from 'lucide-react';

export default function InventarioPreparacionPage() {
  const { getInventarioPreparacion } = useInventario();
  const items = getInventarioPreparacion();

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-gray-800">
        Inventario Preparación
      </motion.h1>
      <p className="text-gray-600">Cálculo automático según materia prima y recetas de inventario de venta.</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-x-auto rounded-xl border-2 border-superfruty-yellow/30 bg-white shadow"
      >
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="bg-superfruty-yellow/20 border-b-2 border-superfruty-yellow/40">
              <th className="px-4 py-3 text-left font-bold text-gray-800">Código</th>
              <th className="px-4 py-3 text-left font-bold text-gray-800">Descripción</th>
              <th className="px-4 py-3 text-right font-bold text-gray-800">Cantidad</th>
              <th className="px-4 py-3 text-right font-bold text-gray-800">Costo unit.</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-gray-100 hover:bg-superfruty-yellow/5"
              >
                <td className="px-4 py-3 font-medium text-gray-800">{item.codigo}</td>
                <td className="px-4 py-3 text-gray-700">{item.descripcion}</td>
                <td className="px-4 py-3 text-right font-bold text-gray-800">{item.cantidad}</td>
                <td className="px-4 py-3 text-right text-gray-700">${(item.costoUnitario ?? 0).toFixed(2)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {items.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-gray-500">
          <Utensils className="w-16 h-16 mx-auto mb-4 text-superfruty-yellow" />
          <p>Configura productos en Inventario de Venta con sus recetas para ver el inventario de preparación.</p>
        </motion.div>
      )}
    </div>
  );
}
