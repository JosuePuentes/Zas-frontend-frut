'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

export default function CartFloatingButton() {
  const { user } = useAuth();
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (!user || user.rol !== 'cliente') return null;
  if (!pathname.startsWith('/cliente')) return null;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-frutal-fresa to-frutal-mora text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Ver carrito"
      >
        <ShoppingCart className="w-6 h-6" />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-white text-frutal-mora text-xs font-bold">
            {cart.reduce((s, i) => s + i.cantidad, 0)}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-36 right-4 z-50 w-80 max-h-[60vh] bg-white rounded-2xl shadow-2xl border-2 border-frutal-mango/30 overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b-2 border-frutal-mango/30 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">Carrito</h3>
              <span className="text-sm text-frutal-mora font-medium">{cart.length} items</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">Carrito vacío</p>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-frutal-mango/10 border border-frutal-mango/20"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 truncate">{item.nombre_batido}</p>
                      <p className="text-xs text-gray-600">
                        ${item.precio_unitario.toFixed(2)} x {item.cantidad}
                        {item.extras.length > 0 && ` + extras`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(idx, -1)}
                        className="p-1 rounded bg-frutal-fresa/30 text-frutal-fresa"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold w-6 text-center text-sm">{item.cantidad}</span>
                      <button
                        onClick={() => updateQuantity(idx, 1)}
                        className="p-1 rounded bg-frutal-kiwi/30 text-frutal-kiwi"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="p-1 rounded text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t-2 border-frutal-mango/30">
              <p className="text-lg font-bold text-gray-800 mb-2">Total: ${cartTotal.toFixed(2)}</p>
              <Link
                href="/cliente/checkout"
                onClick={() => setOpen(false)}
                className="block w-full py-3 rounded-xl bg-gradient-to-r from-frutal-fresa to-frutal-mora text-white font-bold text-center"
              >
                Ir a pagar
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
