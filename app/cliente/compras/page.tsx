'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag } from 'lucide-react';

const COMPRAS_KEY = 'zas_compras_cliente';

interface CompraItem {
  id: string;
  fecha: string;
  total: number;
  items: string[];
}

export default function ComprasPage() {
  const { user } = useAuth();
  const [compras, setCompras] = useState<CompraItem[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !user) return;
    try {
      const stored = localStorage.getItem(COMPRAS_KEY);
      const all = stored ? JSON.parse(stored) : [];
      const delCliente = all.filter((c: any) => c.clienteId === user.id);
      setCompras(delCliente);
    } catch {
      setCompras([]);
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-gray-800"
      >
        Mis compras
      </motion.h1>

      {compras.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl shadow-lg"
        >
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-frutal-mango/50" />
          <p className="text-gray-600">Aún no tienes compras registradas</p>
          <p className="text-sm text-gray-500 mt-1">Tus compras aparecerán aquí cuando realices un pedido</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {compras.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 bg-white rounded-xl shadow-lg border-2 border-frutal-mango/20"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800">${c.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">{new Date(c.fecha).toLocaleDateString()}</p>
                </div>
              </div>
              {c.items?.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  {c.items.join(', ')}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
