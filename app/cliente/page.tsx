'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useHomeConfig } from '@/context/HomeConfigContext';
import { Search, Plus, Loader2, Coffee } from 'lucide-react';
import type { BatidoDisponible, MateriaPrima } from '@/lib/types';
import type { CartItem, CartExtra } from '@/context/CartContext';

const FRUTAL_GRADIENTS = [
  'from-frutal-fresa to-frutal-sandia',
  'from-frutal-mora to-frutal-uva',
  'from-frutal-kiwi to-frutal-limon',
  'from-frutal-mango to-frutal-naranja',
  'from-frutal-banana to-frutal-mango',
];

export default function ClientePage() {
  const [batidos, setBatidos] = useState<BatidoDisponible[]>([]);
  const [materiaPrima, setMateriaPrima] = useState<MateriaPrima[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalProducto, setModalProducto] = useState<BatidoDisponible | null>(null);
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<{ id: string; nombre: string; cantidad: number; precio: number }[]>([]);
  const [cantidad, setCantidad] = useState(1);
  const { addToCart } = useCart();
  const { banners } = useHomeConfig();

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
  const extrasDisponibles = materiaPrima.filter((m) => !m.es_desechable);

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

  const quitarExtra = (id: string) => {
    const idx = extrasSeleccionados.findIndex((e) => e.id === id);
    if (idx >= 0) {
      const next = [...extrasSeleccionados];
      next[idx].cantidad--;
      if (next[idx].cantidad <= 0) next.splice(idx, 1);
      setExtrasSeleccionados(next);
    }
  };

  const precioConExtras = modalProducto
    ? modalProducto.precio_sugerido +
      extrasSeleccionados.reduce((s, e) => s + e.precio * e.cantidad, 0)
    : 0;

  const addToCartFromModal = () => {
    if (!modalProducto) return;
    const costoEnvase =
      (vaso?.costo_por_unidad ?? 0) + (tapa?.costo_por_unidad ?? 0) + (pitillo?.costo_por_unidad ?? 0);
    const envaseItems: { materia_prima_id: string; cantidad: number }[] = [];
    if (vaso) envaseItems.push({ materia_prima_id: vaso._id, cantidad: 1 });
    if (tapa) envaseItems.push({ materia_prima_id: tapa._id, cantidad: 1 });
    if (pitillo) envaseItems.push({ materia_prima_id: pitillo._id, cantidad: 1 });

    const extras: CartExtra[] = extrasSeleccionados.map((e) => ({
      materia_prima_id: e.id,
      nombre: e.nombre,
      cantidad: e.cantidad,
      precio_extra: e.precio,
    }));

    const item: CartItem = {
      recipe_id: modalProducto.recipe_id,
      nombre_batido: modalProducto.nombre_batido,
      cantidad,
      precio_unitario: modalProducto.precio_sugerido,
      extras,
      costo_envase: costoEnvase,
      envase_items: envaseItems,
    };

    addToCart(item);
    setModalProducto(null);
    setExtrasSeleccionados([]);
    setCantidad(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-12 h-12 text-frutal-mora animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {banners.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl overflow-hidden shadow-lg border-2 border-frutal-mango/30"
        >
          <div className="relative h-24 bg-gradient-to-r from-frutal-fresa to-frutal-mora flex items-center justify-center">
            <p className="text-white font-bold text-lg">Promociones del día</p>
          </div>
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-gray-800"
      >
        Nuestros batidos
      </motion.h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-frutal-mora" />
        <input
          type="text"
          placeholder="Buscar batidos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-frutal-mango/40 focus:ring-2 focus:ring-frutal-mora focus:border-frutal-mora outline-none"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredBatidos.map((b, i) => (
            <motion.button
              key={b.recipe_id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => setModalProducto(b)}
              disabled={b.total_disponible <= 0}
              className="text-left rounded-xl overflow-hidden shadow-lg border-2 border-frutal-mango/30 hover:border-frutal-mora/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white"
            >
              <div
                className={`aspect-square bg-gradient-to-br ${FRUTAL_GRADIENTS[i % FRUTAL_GRADIENTS.length]} flex items-center justify-center`}
              >
                <Coffee className="w-16 h-16 text-white/80" />
              </div>
              <div className="p-3">
                <p className="font-bold text-gray-800 truncate">{b.nombre_batido}</p>
                <p className="text-frutal-mora font-bold">${b.precio_sugerido?.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Disponible: {b.total_disponible}</p>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {filteredBatidos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-500"
        >
          <Coffee className="w-16 h-16 mx-auto mb-4 text-frutal-mango/50" />
          <p>No hay batidos que coincidan con tu búsqueda</p>
        </motion.div>
      )}

      <AnimatePresence>
        {modalProducto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setModalProducto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-frutal-mora/30 max-h-[90vh] overflow-y-auto"
            >
              <div className={`aspect-video rounded-xl bg-gradient-to-br ${FRUTAL_GRADIENTS[0]} flex items-center justify-center mb-4`}>
                <Coffee className="w-20 h-20 text-white/80" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{modalProducto.nombre_batido}</h3>
              <p className="text-gray-600 text-sm mb-4">
                Batido fresco y natural. Disponible: {modalProducto.total_disponible} porciones.
              </p>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Precio base: ${modalProducto.precio_sugerido?.toFixed(2)}</p>
                <p className="text-sm text-gray-600 mb-2">Añadir extras:</p>
                <div className="flex flex-wrap gap-2">
                  {extrasDisponibles.slice(0, 8).map((m) => (
                    <button
                      key={m._id}
                      onClick={() => toggleExtra(m._id, m.nombre, m.costo_por_unidad)}
                      className="px-3 py-1.5 rounded-lg bg-frutal-mango/30 text-gray-800 hover:bg-frutal-mango/50 text-sm font-medium"
                    >
                      {m.nombre} +${m.costo_por_unidad?.toFixed(2)}
                    </button>
                  ))}
                </div>
                {extrasSeleccionados.length > 0 && (
                  <div className="mt-2 p-2 bg-frutal-kiwi/20 rounded-lg border border-frutal-kiwi/40 flex flex-wrap gap-2">
                    {extrasSeleccionados.map((e) => (
                      <span
                        key={e.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-frutal-kiwi/40 rounded text-sm font-medium"
                      >
                        {e.nombre} x{e.cantidad}
                        <button
                          type="button"
                          onClick={() => quitarExtra(e.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-gray-600">Cantidad:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                    className="w-8 h-8 rounded-lg bg-frutal-mango/30 font-bold"
                  >
                    −
                  </button>
                  <span className="font-bold w-8 text-center">{cantidad}</span>
                  <button
                    type="button"
                    onClick={() => setCantidad((c) => c + 1)}
                    className="w-8 h-8 rounded-lg bg-frutal-kiwi/30 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="text-lg font-bold text-frutal-mora mb-4">
                Total: ${(precioConExtras * cantidad).toFixed(2)}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setModalProducto(null)}
                  className="flex-1 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={addToCartFromModal}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-frutal-fresa to-frutal-mora text-white font-bold flex items-center justify-center gap-1"
                >
                  <Plus className="w-5 h-5" />
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
