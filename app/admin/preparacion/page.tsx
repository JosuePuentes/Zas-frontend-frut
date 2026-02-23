'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { ChefHat, Check, MapPin, Clock } from 'lucide-react';

export default function PreparacionPage() {
  const { user, isMaster } = useAuth();
  const { getAllOrders, updateOrderStatus } = useCart();
  const pedidos = getAllOrders(isMaster() ? undefined : user?.sucursalId).filter((o) => o.estado === 'verificado' || o.estado === 'preparacion');

  const marcarEnPreparacion = (id: string) => {
    updateOrderStatus(id, 'preparacion');
  };

  const marcarListoParaEnvio = (id: string) => {
    const hora = new Date();
    hora.setMinutes(hora.getMinutes() + 30);
    updateOrderStatus(id, 'envio', hora.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-gray-800"
      >
        Preparación
      </motion.h1>
      <p className="text-gray-600">Pedidos verificados listos para preparar</p>

      {pedidos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl"
        >
          <ChefHat className="w-16 h-16 mx-auto mb-4 text-frutal-mango/50" />
          <p className="text-gray-600">No hay pedidos en preparación</p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {pedidos.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 bg-white rounded-xl shadow-lg border-2 border-frutal-mango/20"
            >
              <div className="flex justify-between items-start">
                <p className="font-bold text-gray-800">{p.clienteNombre}</p>
                <p className="font-bold text-frutal-mora">${p.total.toFixed(2)}</p>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <Clock className="w-4 h-4" />
                {new Date(p.createdAt).toLocaleString()}
              </p>
              <div className="mt-3 p-3 bg-frutal-kiwi/10 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">Productos:</p>
                {p.items.map((it) => (
                  <div key={it.recipe_id} className="text-sm text-gray-700">
                    <p className="font-medium">{it.nombre_batido} x{it.cantidad}</p>
                    {it.extras?.length ? (
                      <p className="text-gray-600 ml-2">Adicionales: {it.extras.map((e) => `${e.nombre} x${e.cantidad}`).join(', ')}</p>
                    ) : null}
                  </div>
                ))}
              </div>
              {p.delivery && p.direccionEntrega && (
                <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-frutal-kiwi" />
                  Entrega: {p.direccionEntrega}
                </p>
              )}
              <div className="mt-3 flex gap-2">
                {p.estado === 'verificado' && (
                  <button
                    onClick={() => marcarEnPreparacion(p.id)}
                    className="px-4 py-2 rounded-xl bg-frutal-mango text-white font-medium"
                  >
                    Comenzar preparación
                  </button>
                )}
                <button
                  onClick={() => marcarListoParaEnvio(p.id)}
                  className="px-4 py-2 rounded-xl bg-frutal-kiwi text-white font-bold flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Terminado - Enviar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
