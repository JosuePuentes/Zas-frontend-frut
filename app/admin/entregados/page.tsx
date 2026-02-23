'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { PackageCheck } from 'lucide-react';

export default function EntregadosPage() {
  const { user, isMaster } = useAuth();
  const { getAllOrders } = useCart();
  const pedidos = getAllOrders(isMaster() ? undefined : user?.sucursalId).filter((o) => o.estado === 'entregado');

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-gray-800"
      >
        Pedidos entregados
      </motion.h1>
      <p className="text-gray-600">Historial de pedidos completados</p>

      {pedidos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl"
        >
          <PackageCheck className="w-16 h-16 mx-auto mb-4 text-frutal-mango/50" />
          <p className="text-gray-600">No hay pedidos entregados aún</p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {pedidos.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 bg-white rounded-xl shadow-lg border-2 border-green-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800">{p.clienteNombre}</p>
                  <p className="text-sm text-gray-600">{new Date(p.createdAt).toLocaleString()}</p>
                </div>
                <p className="font-bold text-green-600">${p.total.toFixed(2)} ✓</p>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {p.items.map((it) => (
                  <p key={it.recipe_id}>
                    {it.nombre_batido} x{it.cantidad}
                    {it.extras?.length ? ` + ${it.extras.map((e) => e.nombre).join(', ')}` : ''}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
