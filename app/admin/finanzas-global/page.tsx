'use client';

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useSucursal } from '@/context/SucursalContext';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { DollarSign, Building2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FinanzasGlobalPage() {
  const { user, isMaster } = useAuth();
  const { getAllOrders } = useCart();
  const { sucursales, getSucursal } = useSucursal();
  const [utilidad, setUtilidad] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUtilidad().then(setUtilidad).catch(() => null).finally(() => setLoading(false));
  }, []);

  const orders = getAllOrders();
  const ventasPorSucursal = sucursales.map((s) => {
    const ords = orders.filter((o) => o.sucursalId === s.id && o.estado === 'entregado');
    const total = ords.reduce((sum, o) => sum + o.total, 0);
    return { sucursal: s, total, cantidad: ords.length };
  });
  const totalGlobal = ventasPorSucursal.reduce((s, x) => s + x.total, 0);

  if (!user || !isMaster()) {
    return (
      <div className="p-6 text-center text-gray-600">
        Solo el usuario master puede ver las finanzas globales.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-12 h-12 text-frutal-mora animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-gray-800"
      >
        Finanzas globales
      </motion.h1>
      <p className="text-gray-600">Vista consolidada de todas las sucursales</p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-br from-frutal-mora to-frutal-uva rounded-2xl text-white shadow-xl"
      >
        <div className="flex items-center gap-3">
          <DollarSign className="w-12 h-12" />
          <div>
            <p className="text-white/90 text-sm">Total ventas (pedidos entregados)</p>
            <p className="text-3xl font-bold">${totalGlobal.toFixed(2)}</p>
          </div>
        </div>
      </motion.div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Por sucursal</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ventasPorSucursal.map(({ sucursal, total, cantidad }, i) => (
            <motion.div
              key={sucursal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 bg-white rounded-xl shadow-lg border-2 border-frutal-mango/20"
            >
              <div className="flex items-start gap-3">
                <Building2 className="w-8 h-8 text-frutal-kiwi" />
                <div>
                  <h3 className="font-bold text-gray-800">{sucursal.nombre}</h3>
                  <p className="text-lg font-bold text-frutal-mora">${total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{cantidad} pedidos entregados</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {utilidad && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white rounded-xl border-2 border-frutal-mango/20"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-2">Datos del sistema (API)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Ventas totales</p>
              <p className="font-bold">${(utilidad.ventas_totales ?? 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Cantidad vendida</p>
              <p className="font-bold">{utilidad.cantidad_vendida ?? 0}</p>
            </div>
            <div>
              <p className="text-gray-600">Utilidad</p>
              <p className="font-bold text-green-600">${(utilidad.utilidad ?? 0).toFixed(2)}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
