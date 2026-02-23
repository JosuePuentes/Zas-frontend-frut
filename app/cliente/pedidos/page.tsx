'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, MapPin } from 'lucide-react';
import type { Order, OrderStatus } from '@/context/CartContext';

const ESTADOS: { key: OrderStatus; label: string }[] = [
  { key: 'pendiente', label: 'Pendiente' },
  { key: 'verificado', label: 'Verificado' },
  { key: 'preparacion', label: 'Preparando' },
  { key: 'envio', label: 'En envío' },
  { key: 'entregado', label: 'Entregado' },
];

function OrderStatusBarSimple({ estado }: { estado: OrderStatus }) {
  const idx = ESTADOS.findIndex((e) => e.key === estado);
  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex justify-between items-start">
        {ESTADOS.map((e, i) => (
          <div key={e.key} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i <= idx ? 'bg-frutal-kiwi text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i < idx ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] mt-1 text-center ${i <= idx ? 'text-frutal-kiwi font-medium' : 'text-gray-400'}`}>
              {e.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PedidosPage() {
  const { user } = useAuth();
  const { getOrdersByCliente } = useCart();
  const pedidos = user ? getOrdersByCliente(user.id) : [];

  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-gray-800"
      >
        Mis pedidos
      </motion.h1>

      {pedidos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl shadow-lg"
        >
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-frutal-mango/50" />
          <p className="text-gray-600">Aún no tienes pedidos</p>
          <p className="text-sm text-gray-500 mt-1">Tus pedidos aparecerán aquí cuando realices una compra</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 bg-white rounded-xl shadow-lg border-2 border-frutal-mango/20"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800">${p.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{new Date(p.createdAt).toLocaleString()}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    p.estado === 'entregado'
                      ? 'bg-green-100 text-green-800'
                      : p.estado === 'envio'
                      ? 'bg-blue-100 text-blue-800'
                      : p.estado === 'preparacion'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {ESTADOS.find((e) => e.key === p.estado)?.label}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {p.items.map((it) => (
                  <p key={it.recipe_id}>
                    {it.nombre_batido} x{it.cantidad}
                    {it.extras?.length ? ` + ${it.extras.map((e) => e.nombre).join(', ')}` : ''}
                  </p>
                ))}
              </div>
              {p.delivery && p.direccionEntrega && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {p.direccionEntrega}
                </p>
              )}
              {p.horaEstimadaEntrega && (
                <p className="text-sm text-frutal-kiwi font-medium mt-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Hora estimada de entrega: {p.horaEstimadaEntrega}
                </p>
              )}
              <OrderStatusBarSimple estado={p.estado} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
