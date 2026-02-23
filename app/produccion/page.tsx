'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Package, Loader2, Check } from 'lucide-react';

export default function ProduccionPage() {
  const [recetas, setRecetas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [dosis, setDosis] = useState<Record<string, number>>({});

  useEffect(() => {
    api
      .getRecipes()
      .then((d) => setRecetas(Array.isArray(d) ? d : []))
      .catch(() => setRecetas([]))
      .finally(() => setLoading(false));
  }, []);

  const procesar = async (recipeId: string) => {
    const cant = dosis[recipeId] ?? 1;
    if (cant < 1) return;
    setProcesando(recipeId);
    try {
      await api.procesarDosis(recipeId, cant);
      alert('Producción procesada correctamente');
      setDosis((prev) => ({ ...prev, [recipeId]: 1 }));
    } catch (e) {
      alert('Error: ' + (e as Error).message);
    } finally {
      setProcesando(null);
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
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold text-gray-800"
      >
        Producción
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recetas.map((r, i) => (
          <motion.div
            key={r._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl shadow-xl border border-frutal-mango/20 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-10 h-10 text-frutal-kiwi" />
              <h3 className="font-bold text-gray-800">{r.nombre_batido}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Procesar dosis de materia prima en bolsitas</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={dosis[r._id] ?? 1}
                onChange={(e) => setDosis((p) => ({ ...p, [r._id]: parseInt(e.target.value) || 1 }))}
                className="w-20 px-3 py-2 rounded-lg border border-frutal-mango/30 focus:ring-2 focus:ring-frutal-mora/30"
              />
              <span className="text-sm text-gray-600">dosis</span>
              <button
                onClick={() => procesar(r._id)}
                disabled={!!procesando}
                className="ml-auto px-4 py-2 rounded-xl bg-gradient-to-r from-frutal-kiwi to-frutal-limon text-white font-bold hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {procesando === r._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Procesar
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {recetas.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-gray-500"
        >
          <Package className="w-16 h-16 mx-auto mb-4 text-frutal-kiwi/50" />
          <p>No hay recetas configuradas</p>
        </motion.div>
      )}
    </div>
  );
}
