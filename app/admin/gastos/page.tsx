'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInventario } from '@/context/InventarioContext';
import { Plus, X, DollarSign } from 'lucide-react';

export default function GastosPage() {
  const { gastos, addGasto } = useInventario();
  const [modal, setModal] = useState(false);
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState(0);

  const handleAgregar = () => {
    if (!descripcion.trim() || monto <= 0) return;
    addGasto({ descripcion: descripcion.trim(), monto });
    setDescripcion('');
    setMonto(0);
    setModal(false);
  };

  const totalGastos = gastos.reduce((s, g) => s + g.monto, 0);

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Agregar Gastos</h1>
        <button
          onClick={() => setModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Nuevo gasto
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-superfruty-yellow/20 border-2 border-superfruty-yellow/40 p-6">
        <p className="text-sm text-gray-600">Total gastos</p>
        <p className="text-2xl font-bold text-gray-800">${totalGastos.toFixed(2)}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-x-auto rounded-xl border-2 border-superfruty-yellow/30 bg-white shadow"
      >
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="bg-superfruty-yellow/20 border-b-2 border-superfruty-yellow/40">
              <th className="px-4 py-3 text-left font-bold text-gray-800">Fecha</th>
              <th className="px-4 py-3 text-left font-bold text-gray-800">Descripción</th>
              <th className="px-4 py-3 text-right font-bold text-gray-800">Monto</th>
            </tr>
          </thead>
          <tbody>
            {[...gastos].reverse().map((g, i) => (
              <motion.tr
                key={g.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="border-b border-gray-100 hover:bg-superfruty-yellow/5"
              >
                <td className="px-4 py-3 text-gray-700">{new Date(g.fecha).toLocaleDateString('es')}</td>
                <td className="px-4 py-3 text-gray-800">{g.descripcion}</td>
                <td className="px-4 py-3 text-right font-bold text-gray-800">${g.monto.toFixed(2)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {gastos.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-gray-500">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-superfruty-yellow" />
          <p>No hay gastos registrados.</p>
        </motion.div>
      )}

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-superfruty-yellow/30 relative">
              <button onClick={() => setModal(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Nuevo gasto</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none" placeholder="Ej: Compra de frutas" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
                  <input type="number" min={0} step={0.01} value={monto || ''} onChange={(e) => setMonto(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModal(false)} className="flex-1 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-medium">Cancelar</button>
                <button onClick={handleAgregar} className="flex-1 py-2 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold">Registrar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
