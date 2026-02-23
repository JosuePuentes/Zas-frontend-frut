'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { Truck, Check, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function EnvioPage() {
  const { user, isMaster } = useAuth();
  const { getAllOrders, updateOrderStatus } = useCart();
  const pedidos = getAllOrders(isMaster() ? undefined : user?.sucursalId).filter((o) => o.estado === 'envio');

  const marcarEntregado = (id: string) => {
    updateOrderStatus(id, 'entregado');
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-gray-800"
      >
        Envío
      </motion.h1>
      <p className="text-gray-600">Pedidos listos para entregar</p>
      <Link
        href="/admin/envio/mapa"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-frutal-mora text-white font-medium"
      >
        Ver mapa de entregas
      </Link>

      {pedidos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl"
        >
          <Truck className="w-16 h-16 mx-auto mb-4 text-frutal-mango/50" />
          <p className="text-gray-600">No hay pedidos en envío</p>
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
              <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-frutal-kiwi" />
                  Ubicación de entrega
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {p.direccionEntrega || (p.ubicacionEntrega ? `${p.ubicacionEntrega.lat}, ${p.ubicacionEntrega.lng}` : 'Sin dirección')}
                </p>
                {p.ubicacionEntrega && (
                  <a
                    href={`https://www.google.com/maps?q=${p.ubicacionEntrega.lat},${p.ubicacionEntrega.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-frutal-mora font-medium mt-1 inline-block"
                  >
                    Abrir en Google Maps →
                  </a>
                )}
              </div>
              {p.horaEstimadaEntrega && (
                <p className="text-sm text-gray-600 mt-2">Hora estimada: {p.horaEstimadaEntrega}</p>
              )}
              <button
                onClick={() => marcarEntregado(p.id)}
                className="mt-3 px-4 py-2 rounded-xl bg-frutal-kiwi text-white font-bold flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Marcar entregado
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
