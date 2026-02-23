'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInventario } from '@/context/InventarioContext';
import type { ProductoInventarioVenta, IngredienteReceta } from '@/context/InventarioContext';
import { BarChart3, Plus, X, Trash2 } from 'lucide-react';

export default function InventarioVentaPage() {
  const { inventarioVenta, productos, addProductoVenta, updateProductoVenta, removeProductoVenta, getCostoPromedioMateriaPrima } = useInventario();
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState<ProductoInventarioVenta | null>(null);
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [tamanioVaso, setTamanioVaso] = useState('');
  const [tieneEtiqueta, setTieneEtiqueta] = useState(false);
  const [ingredientes, setIngredientes] = useState<IngredienteReceta[]>([]);
  const [vasoId, setVasoId] = useState('');
  const [etiquetaId, setEtiquetaId] = useState('');

  const vasos = productos.filter((p) => /vaso|cup/i.test(p.descripcion));
  const etiquetas = productos.filter((p) => /etiqueta|label/i.test(p.descripcion));
  const ingredientesDisponibles = productos.filter((p) => !/vaso|cup|etiqueta|label/i.test(p.descripcion));

  const abrirModalAgregar = () => {
    setCodigo('');
    setDescripcion('');
    setPrecio(0);
    setTamanioVaso('');
    setTieneEtiqueta(false);
    setIngredientes([]);
    setVasoId('');
    setEtiquetaId('');
    setModalAgregar(true);
  };


  const handleAgregar = () => {
    if (!codigo.trim() || !descripcion.trim()) return;
    addProductoVenta({
      codigo: codigo.trim(),
      descripcion: descripcion.trim(),
      precio,
      tamanioVaso,
      tieneEtiqueta,
      ingredientes,
      vasoId: vasoId || undefined,
      etiquetaId: tieneEtiqueta ? etiquetaId || undefined : undefined,
      costoVaso: vasoId ? getCostoPromedioMateriaPrima(vasoId) : 0,
      costoEtiqueta: tieneEtiqueta && etiquetaId ? getCostoPromedioMateriaPrima(etiquetaId) : undefined,
      cantidad: 0,
    });
    setModalAgregar(false);
  };

  const handleEditar = () => {
    if (!modalEditar) return;
    updateProductoVenta(modalEditar.id, {
      descripcion,
      precio,
      tamanioVaso,
      tieneEtiqueta,
      ingredientes,
    });
    setModalEditar(null);
  };

  const abrirModalEditar = (p: ProductoInventarioVenta) => {
    setModalEditar(p);
    setDescripcion(p.descripcion);
    setPrecio(p.precio);
    setTamanioVaso(p.tamanioVaso);
    setTieneEtiqueta(p.tieneEtiqueta);
    setIngredientes(p.ingredientes);
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Inventario de Venta</h1>
        <button
          onClick={abrirModalAgregar}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Agregar producto
        </button>
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
              <th className="px-4 py-3 text-left font-bold text-gray-800">Vaso</th>
              <th className="px-4 py-3 text-left font-bold text-gray-800">Etiqueta</th>
              <th className="px-4 py-3 text-right font-bold text-gray-800">Precio</th>
              <th className="px-4 py-3 text-right font-bold text-gray-800">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventarioVenta.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-gray-100 hover:bg-superfruty-yellow/5"
              >
                <td className="px-4 py-3 font-medium text-gray-800">{p.codigo}</td>
                <td className="px-4 py-3 text-gray-700">{p.descripcion}</td>
                <td className="px-4 py-3 text-gray-700">{p.tamanioVaso || '-'}</td>
                <td className="px-4 py-3 text-gray-700">{p.tieneEtiqueta ? 'Sí' : 'No'}</td>
                <td className="px-4 py-3 text-right font-bold text-gray-800">${p.precio.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => abrirModalEditar(p)}
                    className="p-1 rounded-lg hover:bg-superfruty-yellow/30 text-superfruty-black"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => removeProductoVenta(p.id)}
                    className="p-1 rounded-lg hover:bg-red-100 text-red-600 ml-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {inventarioVenta.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-gray-500">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-superfruty-yellow" />
          <p>No hay productos en inventario de venta. Agrega productos con descripción, vaso, etiqueta y receta.</p>
        </motion.div>
      )}

      <AnimatePresence>
        {modalEditar && (
          <ModalProductoVenta
            titulo="Editar producto"
            codigo={modalEditar.codigo}
            setCodigo={() => {}}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            precio={precio}
            setPrecio={setPrecio}
            tamanioVaso={tamanioVaso}
            setTamanioVaso={setTamanioVaso}
            tieneEtiqueta={tieneEtiqueta}
            setTieneEtiqueta={setTieneEtiqueta}
            ingredientes={ingredientes}
            setIngredientes={setIngredientes}
            vasos={vasos}
            etiquetas={etiquetas}
            ingredientesDisponibles={ingredientesDisponibles}
            vasoId={modalEditar.vasoId || ''}
            setVasoId={() => {}}
            etiquetaId={modalEditar.etiquetaId || ''}
            setEtiquetaId={() => {}}
            onClose={() => setModalEditar(null)}
            onSave={handleEditar}
          />
        )}
        {modalAgregar && (
          <ModalProductoVenta
            titulo="Agregar producto"
            codigo={codigo}
            setCodigo={setCodigo}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            precio={precio}
            setPrecio={setPrecio}
            tamanioVaso={tamanioVaso}
            setTamanioVaso={setTamanioVaso}
            tieneEtiqueta={tieneEtiqueta}
            setTieneEtiqueta={setTieneEtiqueta}
            ingredientes={ingredientes}
            setIngredientes={setIngredientes}
            vasos={vasos}
            etiquetas={etiquetas}
            ingredientesDisponibles={ingredientesDisponibles}
            vasoId={vasoId}
            setVasoId={setVasoId}
            etiquetaId={etiquetaId}
            setEtiquetaId={setEtiquetaId}
            onClose={() => setModalAgregar(false)}
            onSave={handleAgregar}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalProductoVenta({
  titulo = 'Agregar producto',
  codigo,
  setCodigo,
  descripcion,
  setDescripcion,
  precio,
  setPrecio,
  tamanioVaso,
  setTamanioVaso,
  tieneEtiqueta,
  setTieneEtiqueta,
  ingredientes,
  setIngredientes,
  vasos,
  etiquetas,
  ingredientesDisponibles,
  vasoId,
  setVasoId,
  etiquetaId,
  setEtiquetaId,
  onClose,
  onSave,
}: any) {
  const [gramosIng, setGramosIng] = useState<Record<string, number>>({});

  const addIng = (id: string, nombre: string) => {
    const g = gramosIng[id] || 0;
    if (g <= 0) return;
    setIngredientes([...ingredientes, { materiaPrimaId: id, nombre, gramos: g }]);
    setGramosIng((p) => ({ ...p, [id]: 0 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border-2 border-superfruty-yellow/30 relative my-8"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100">
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="text-xl font-bold text-gray-800 mb-4">{titulo}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
            <input value={codigo} onChange={(e) => setCodigo(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none" placeholder="B001" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none" placeholder="Batido de melón con leche" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño vaso</label>
            <input value={tamanioVaso} onChange={(e) => setTamanioVaso(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none" placeholder="12 oz" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vaso (materia prima)</label>
            <select value={vasoId} onChange={(e) => setVasoId(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none">
              <option value="">Seleccionar</option>
              {vasos.map((v: any) => (
                <option key={v.id} value={v.id}>{v.descripcion}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={tieneEtiqueta} onChange={(e) => setTieneEtiqueta(e.target.checked)} />
            <label className="text-sm font-medium">Tiene etiqueta</label>
          </div>
          {tieneEtiqueta && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta</label>
              <select value={etiquetaId} onChange={(e) => setEtiquetaId(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none">
                <option value="">Seleccionar</option>
                {etiquetas.map((e: any) => (
                  <option key={e.id} value={e.id}>{e.descripcion}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ingredientes (gramos por batido)</label>
            <div className="space-y-2">
              {ingredientesDisponibles.map((p: any) => (
                <div key={p.id} className="flex items-center gap-2">
                  <span className="flex-1 text-sm">{p.descripcion}</span>
                  <input
                    type="number"
                    min={0}
                    value={gramosIng[p.id] || 0}
                    onChange={(e) => setGramosIng((prev) => ({ ...prev, [p.id]: parseFloat(e.target.value) || 0 }))}
                    className="w-20 px-2 py-1 rounded-lg border border-gray-200"
                    placeholder="g"
                  />
                  <button onClick={() => addIng(p.id, p.descripcion)} className="px-2 py-1 rounded-lg bg-superfruty-yellow text-superfruty-black text-sm font-medium">+</button>
                </div>
              ))}
            </div>
            {ingredientes.length > 0 && (
              <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                {ingredientes.map((i: IngredienteReceta) => (
                  <span key={i.materiaPrimaId} className="inline-block mr-2 mb-1 px-2 py-0.5 bg-superfruty-yellow/30 rounded text-sm">
                    {i.nombre}: {i.gramos}g
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
            <input type="number" min={0} step={0.01} value={precio} onChange={(e) => setPrecio(parseFloat(e.target.value) || 0)} className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-medium">Cancelar</button>
          <button onClick={onSave} className="flex-1 py-2 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold">Guardar</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
