'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useSucursal } from '@/context/SucursalContext';
import { motion } from 'framer-motion';
import { ClipboardCheck, Check, MapPin, Phone, Building2 } from 'lucide-react';

export default function PedidosPage() {
  const { user, isMaster } = useAuth();
  const { getAllOrders, updateOrderStatus, assignOrderToSucursal } = useCart();
  const { sucursales, getSucursal } = useSucursal();

  const pedidos = getAllOrders(isMaster() ? undefined : user?.sucursalId).filter((o) => o.estado === 'pendiente');

  const verificar = (id: string) => {
    updateOrderStatus(id, 'verificado');
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-gray-800"
      >
        Pedidos en línea
      </motion.h1>
      <p className="text-gray-600">Pedidos pendientes de verificación</p>

      {pedidos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl"
        >
          <ClipboardCheck className="w-16 h-16 mx-auto mb-4 text-frutal-mango/50" />
          <p className="text-gray-600">No hay pedidos pendientes</p>
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
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="font-bold text-gray-800">{p.clienteNombre}</p>
                  <p className="text-sm text-gray-600">{p.clienteEmail}</p>
                  {p.clienteTelefono && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {p.clienteTelefono}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-frutal-mora">${p.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-700">
                {p.items.map((it) => (
                  <p key={it.recipe_id}>
                    • {it.nombre_batido} x{it.cantidad}
                    {it.extras?.length ? ` + ${it.extras.map((e) => e.nombre).join(', ')}` : ''}
                  </p>
                ))}
              </div>
              {p.delivery && p.direccionEntrega && (
                <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-frutal-kiwi" />
                  {p.direccionEntrega}
                </p>
              )}
              {p.sucursalId && (
                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  {getSucursal(p.sucursalId)?.nombre || p.sucursalId}
                </p>
              )}
              {!p.sucursalId && isMaster() && (
                <div className="mt-2">
                  <label className="text-xs text-gray-600 block mb-1">Asignar a sucursal:</label>
                  <select
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v) assignOrderToSucursal(p.id, v);
                    }}
                    className="text-sm border rounded-lg px-2 py-1"
                  >
                    <option value="">Seleccionar...</option>
                    {sucursales.filter((s) => s.activa).map((s) => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">
                  Pago: {p.metodoPago} | Ref: {p.referenciaPago} | Banco: {p.bancoEmisor}
                </p>
                <button
                  onClick={() => verificar(p.id)}
                  disabled={!p.sucursalId && isMaster()}
                  className="mt-2 px-4 py-2 rounded-xl bg-frutal-kiwi text-white font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  Verificar pedido
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
