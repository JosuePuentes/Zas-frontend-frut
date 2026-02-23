'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { Search, Plus, Minus, Trash2, Loader2, ShoppingCart } from 'lucide-react';
import type { BatidoDisponible, MateriaPrima } from '@/lib/types';

interface CartItem {
  recipe_id: string;
  nombre_batido: string;
  cantidad: number;
  precio_unitario: number;
  extras: { materia_prima_id: string; nombre: string; cantidad: number; precio_extra: number }[];
  costo_envase: number;
  envase_items: { materia_prima_id: string; cantidad: number }[];
}

export default function POSPage() {
  const [batidos, setBatidos] = useState<BatidoDisponible[]>([]);
  const [materiaPrima, setMateriaPrima] = useState<MateriaPrima[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [vendiendo, setVendiendo] = useState(false);
  const [modalBatido, setModalBatido] = useState<BatidoDisponible | null>(null);
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<{ id: string; nombre: string; cantidad: number; precio: number }[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [b, m] = await Promise.all([
          api.getAvailability(),
          api.getInventoryRaw().catch(() => []),
        ]);
        setBatidos(Array.isArray(b) ? b : []);
        setMateriaPrima(Array.isArray(m) ? m : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredBatidos = batidos.filter((b) =>
    b.nombre_batido?.toLowerCase().includes(search.toLowerCase())
  );

  const desechables = materiaPrima.filter((m) => m.es_desechable);
  const vaso = desechables.find((d) => /vaso|cup/i.test(d.nombre));
  const tapa = desechables.find((d) => /tapa|lid/i.test(d.nombre));
  const pitillo = desechables.find((d) => /pitillo|straw|sorbeto/i.test(d.nombre));
  const extrasDisponibles = materiaPrima.filter((m) => m.es_desechable === false || !m.es_desechable);

  const addToCart = () => {
    if (!modalBatido) return;
    const costoEnvase = (vaso?.costo_por_unidad ?? 0) + (tapa?.costo_por_unidad ?? 0) + (pitillo?.costo_por_unidad ?? 0);
    const envaseItems: { materia_prima_id: string; cantidad: number }[] = [];
    if (vaso) envaseItems.push({ materia_prima_id: vaso._id, cantidad: 1 });
    if (tapa) envaseItems.push({ materia_prima_id: tapa._id, cantidad: 1 });
    if (pitillo) envaseItems.push({ materia_prima_id: pitillo._id, cantidad: 1 });

    const item: CartItem = {
      recipe_id: modalBatido.recipe_id,
      nombre_batido: modalBatido.nombre_batido,
      cantidad: 1,
      precio_unitario: modalBatido.precio_sugerido,
      extras: extrasSeleccionados.map((e) => ({
        materia_prima_id: e.id,
        nombre: e.nombre,
        cantidad: e.cantidad,
        precio_extra: e.precio,
      })),
      costo_envase: costoEnvase,
      envase_items: envaseItems,
    };

    const existing = cart.find((c) => c.recipe_id === item.recipe_id && JSON.stringify(c.extras) === JSON.stringify(item.extras));
    if (existing) {
      setCart(cart.map((c) => (c === existing ? { ...c, cantidad: c.cantidad + 1 } : c)));
    } else {
      setCart([...cart, item]);
    }
    setModalBatido(null);
    setExtrasSeleccionados([]);
  };

  const updateCantidad = (idx: number, delta: number) => {
    const newCart = [...cart];
    newCart[idx].cantidad = Math.max(0, newCart[idx].cantidad + delta);
    if (newCart[idx].cantidad === 0) newCart.splice(idx, 1);
    setCart(newCart);
  };

  const total = cart.reduce(
    (s, i) => s + (i.precio_unitario * i.cantidad) + i.extras.reduce((e, x) => e + x.precio_extra * x.cantidad * i.cantidad, 0),
    0
  );

  const cerrarVenta = async () => {
    if (cart.length === 0) return;
    setVendiendo(true);
    try {
      const items = cart.map((c) => ({
        recipe_id: c.recipe_id,
        nombre_batido: c.nombre_batido,
        cantidad: c.cantidad,
        precio_unitario: c.precio_unitario,
        extras: c.extras,
        costo_envase: c.costo_envase,
        envase_items: c.envase_items,
      }));
      await api.createSale(items);
      setCart([]);
      alert('Venta registrada correctamente');
    } catch (e) {
      alert('Error al cerrar venta: ' + (e as Error).message);
    } finally {
      setVendiendo(false);
    }
  };

  const toggleExtra = (id: string, nombre: string, precio: number) => {
    const idx = extrasSeleccionados.findIndex((e) => e.id === id);
    if (idx >= 0) {
      const next = [...extrasSeleccionados];
      next[idx].cantidad++;
      setExtrasSeleccionados(next);
    } else {
      setExtrasSeleccionados([...extrasSeleccionados, { id, nombre, cantidad: 1, precio }]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-frutal-mora animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 overflow-hidden flex flex-col bg-white rounded-2xl shadow-xl border border-frutal-mango/20"
      >
        <div className="p-4 border-b border-frutal-mango/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-frutal-mora/60" />
            <input
              type="text"
              placeholder="Buscar batidos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-frutal-mango/30 focus:ring-2 focus:ring-frutal-mora/30 outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredBatidos.map((b, i) => (
              <motion.button
                key={b.recipe_id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setModalBatido(b)}
                disabled={b.total_disponible <= 0}
                className="p-4 rounded-xl bg-gradient-to-br from-frutal-kiwi/20 to-frutal-limon/20 border border-frutal-kiwi/30 hover:from-frutal-kiwi/30 hover:to-frutal-limon/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-left"
              >
                <p className="font-semibold text-gray-800 truncate">{b.nombre_batido}</p>
                <p className="text-sm text-frutal-mora font-medium">${b.precio_sugerido?.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Disponible: {b.total_disponible}</p>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-96 flex flex-col bg-white rounded-2xl shadow-xl border border-frutal-mango/20 overflow-hidden"
      >
        <div className="p-4 border-b border-frutal-mango/20 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-frutal-mora" />
          <h2 className="font-bold text-gray-800">Carrito</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {cart.map((item, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between p-3 rounded-xl bg-frutal-mango/10 border border-frutal-mango/20"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.nombre_batido}</p>
                  <p className="text-sm text-gray-600">
                    ${item.precio_unitario.toFixed(2)} x {item.cantidad}
                    {item.extras.length > 0 && ` + extras`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCantidad(idx, -1)}
                    className="p-1 rounded-lg bg-frutal-fresa/20 text-frutal-fresa hover:bg-frutal-fresa/30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold w-6 text-center">{item.cantidad}</span>
                  <button
                    onClick={() => updateCantidad(idx, 1)}
                    className="p-1 rounded-lg bg-frutal-kiwi/20 text-frutal-kiwi hover:bg-frutal-kiwi/30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateCantidad(idx, -item.cantidad)}
                    className="p-1 rounded-lg text-red-500 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="p-4 border-t border-frutal-mango/20 space-y-3">
          <p className="text-xl font-bold text-gray-800">Total: ${total.toFixed(2)}</p>
          <button
            onClick={cerrarVenta}
            disabled={cart.length === 0 || vendiendo}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-frutal-fresa to-frutal-mora text-white font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {vendiendo ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
            Cerrar venta
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {modalBatido && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setModalBatido(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{modalBatido.nombre_batido}</h3>
              <p className="text-frutal-mora font-medium mb-4">${modalBatido.precio_sugerido?.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mb-4">Añadir extras:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {extrasDisponibles.slice(0, 10).map((m) => (
                  <button
                    key={m._id}
                    onClick={() => toggleExtra(m._id, m.nombre, m.costo_por_unidad)}
                    className="px-3 py-1.5 rounded-lg bg-frutal-mango/20 text-gray-700 hover:bg-frutal-mango/30 text-sm"
                  >
                    {m.nombre} +${m.costo_por_unidad?.toFixed(2)}
                  </button>
                ))}
              </div>
              {extrasSeleccionados.length > 0 && (
                <div className="mb-4 p-2 bg-frutal-kiwi/10 rounded-lg">
                  {extrasSeleccionados.map((e) => (
                    <span key={e.id} className="inline-block mr-2 mb-1 px-2 py-0.5 bg-frutal-kiwi/30 rounded text-sm">
                      {e.nombre} x{e.cantidad}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setModalBatido(null)}
                  className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={addToCart}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-frutal-fresa to-frutal-mora text-white font-bold"
                >
                  Añadir al carrito
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
