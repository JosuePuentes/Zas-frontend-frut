'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInventario } from '@/context/InventarioContext';
import type { ProductoMateriaPrima, CategoriaProducto } from '@/context/InventarioContext';
import { Package, Plus, ShoppingCart, Upload, X, FileSpreadsheet } from 'lucide-react';

export default function InventarioMateriaPrimaPage() {
  const { productos, compras, addProducto, addCompra, getStockMateriaPrima } = useInventario();
  const [modalProducto, setModalProducto] = useState(false);
  const [modalCompra, setModalCompra] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoMateriaPrima | null>(null);
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState<CategoriaProducto>('fruta');
  const [cantidadCompra, setCantidadCompra] = useState(1);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const unidad = categoria === 'fruta' ? 'kg' : 'unidad';

  const handleAgregarProducto = () => {
    if (!codigo.trim() || !descripcion.trim()) return;
    addProducto({ codigo: codigo.trim(), descripcion: descripcion.trim(), categoria, unidad });
    setCodigo('');
    setDescripcion('');
    setModalProducto(false);
  };

  const handleCompra = () => {
    if (!productoSeleccionado) return;
    addCompra({
      productoId: productoSeleccionado.id,
      cantidad: cantidadCompra,
      precioUnitario,
    });
    setModalCompra(false);
    setProductoSeleccionado(null);
    setCantidadCompra(1);
    setPrecioUnitario(0);
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(/[,\t]/).map((c) => c.trim());
        if (cols.length >= 3) {
          const cat = (cols[2] || 'fruta').toLowerCase().includes('adicional') ? 'adicionales' : 'fruta';
          addProducto({
            codigo: cols[0] || `P${i}`,
            descripcion: cols[1] || '',
            categoria: cat as CategoriaProducto,
            unidad: cat === 'fruta' ? 'kg' : 'unidad',
          });
        }
      }
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Inventario Materia Prima</h1>
        <div className="flex gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold shadow-lg hover:shadow-xl"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Importar Excel
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleExcelUpload}
            className="hidden"
          />
          <button
            onClick={() => setModalProducto(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Agregar producto
          </button>
          <button
            onClick={() => setModalCompra(true)}
            disabled={productos.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-superfruty-black text-superfruty-yellow font-bold shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            <ShoppingCart className="w-5 h-5" />
            Registrar compra
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-x-auto rounded-xl border-2 border-superfruty-yellow/30 bg-white shadow"
      >
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-superfruty-yellow/20 border-b-2 border-superfruty-yellow/40">
              <th className="px-4 py-3 text-left font-bold text-gray-800">Código</th>
              <th className="px-4 py-3 text-left font-bold text-gray-800">Descripción</th>
              <th className="px-4 py-3 text-left font-bold text-gray-800">Categoría</th>
              <th className="px-4 py-3 text-left font-bold text-gray-800">Unidad</th>
              <th className="px-4 py-3 text-right font-bold text-gray-800">Stock</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-gray-100 hover:bg-superfruty-yellow/5"
              >
                <td className="px-4 py-3 font-medium text-gray-800">{p.codigo}</td>
                <td className="px-4 py-3 text-gray-700">{p.descripcion}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-sm font-medium ${p.categoria === 'fruta' ? 'bg-frutal-kiwi/30 text-frutal-kiwi' : 'bg-frutal-mango/30 text-frutal-fresa'}`}>
                    {p.categoria === 'fruta' ? 'Fruta' : 'Adicionales'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">{p.unidad === 'kg' ? 'kg' : 'unidad'}</td>
                <td className="px-4 py-3 text-right font-bold text-gray-800">{getStockMateriaPrima(p.id)} {p.unidad}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {productos.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-gray-500">
          <Package className="w-16 h-16 mx-auto mb-4 text-superfruty-yellow" />
          <p>No hay productos. Agrega productos o importa desde Excel.</p>
        </motion.div>
      )}

      <AnimatePresence>
        {modalProducto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setModalProducto(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-superfruty-yellow/30"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Agregar producto</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                  <input
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none"
                    placeholder="Ej: M001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <input
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none"
                    placeholder="Ej: Mango"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as CategoriaProducto)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none"
                  >
                    <option value="fruta">Fruta (kg)</option>
                    <option value="adicionales">Adicionales (unidad)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModalProducto(false)} className="flex-1 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-medium">
                  Cancelar
                </button>
                <button onClick={handleAgregarProducto} className="flex-1 py-2 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold">
                  Registrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalCompra && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setModalCompra(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-superfruty-yellow/30 relative"
            >
              <button onClick={() => setModalCompra(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Registrar compra</h3>
              {!productoSeleccionado ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {productos.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setProductoSeleccionado(p)}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 hover:border-superfruty-yellow text-left flex justify-between items-center"
                    >
                      <span className="font-medium">{p.descripcion}</span>
                      <span className="text-sm text-gray-600">{p.codigo}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="font-medium text-gray-800">{productoSeleccionado.descripcion} ({productoSeleccionado.codigo})</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad ({productoSeleccionado.unidad})</label>
                    <input
                      type="number"
                      min={0.01}
                      step={productoSeleccionado.unidad === 'kg' ? 0.1 : 1}
                      value={cantidadCompra}
                      onChange={(e) => setCantidadCompra(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio por unidad ($)</label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={precioUnitario}
                      onChange={(e) => setPrecioUnitario(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setProductoSeleccionado(null)} className="flex-1 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-medium">
                      Cambiar producto
                    </button>
                    <button onClick={handleCompra} className="flex-1 py-2 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold">
                      Registrar compra
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
