'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInventario } from '@/context/InventarioContext';
import { Search, Users } from 'lucide-react';

export default function ClientesPOSPage() {
  const { clientes } = useInventario();
  const [search, setSearch] = useState('');
  const [filtroPOS, setFiltroPOS] = useState<boolean | null>(null);

  const filtered = clientes.filter((c) => {
    const matchSearch =
      c.cedula.toLowerCase().includes(search.toLowerCase()) ||
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.apellido.toLowerCase().includes(search.toLowerCase()) ||
      (c.telefono || '').includes(search) ||
      c.direccion.toLowerCase().includes(search.toLowerCase());
    const matchPOS = filtroPOS === null || c.esPuntoVenta === filtroPOS;
    return matchSearch && matchPOS;
  });

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-gray-800">
        Clientes Punto de Venta
      </motion.h1>
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-superfruty-black" />
          <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-superfruty-yellow/40" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFiltroPOS(null)} className={`px-4 py-2 rounded-xl font-medium ${filtroPOS === null ? 'bg-superfruty-yellow text-superfruty-black' : 'bg-gray-200'}`}>Todos</button>
          <button onClick={() => setFiltroPOS(true)} className={`px-4 py-2 rounded-xl font-medium ${filtroPOS === true ? 'bg-superfruty-yellow text-superfruty-black' : 'bg-gray-200'}`}>POS</button>
          <button onClick={() => setFiltroPOS(false)} className={`px-4 py-2 rounded-xl font-medium ${filtroPOS === false ? 'bg-superfruty-yellow text-superfruty-black' : 'bg-gray-200'}`}>Web</button>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-x-auto rounded-xl border-2 border-superfruty-yellow/30 bg-white shadow">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-superfruty-yellow/20 border-b-2 border-superfruty-yellow/40">
              <th className="px-4 py-3 text-left font-bold">Cedula</th>
              <th className="px-4 py-3 text-left font-bold">Nombres</th>
              <th className="px-4 py-3 text-left font-bold">Direccion</th>
              <th className="px-4 py-3 text-left font-bold">Telefono</th>
              <th className="px-4 py-3 text-center font-bold">Origen</th>
              <th className="px-4 py-3 text-right font-bold">Compras</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-gray-100">
                <td className="px-4 py-3">{c.cedula}</td>
                <td className="px-4 py-3">{c.nombre} {c.apellido}</td>
                <td className="px-4 py-3">{c.direccion || '-'}</td>
                <td className="px-4 py-3">{c.telefono || '-'}</td>
                <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-sm ${c.esPuntoVenta ? 'bg-superfruty-yellow/30' : 'bg-blue-100'}`}>{c.esPuntoVenta ? 'POS' : 'Web'}</span></td>
                <td className="px-4 py-3 text-right font-bold">{c.vecesComprado}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 text-superfruty-yellow" />
          <p>No hay clientes.</p>
        </motion.div>
      )}
    </div>
  );
}
