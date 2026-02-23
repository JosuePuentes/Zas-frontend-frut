'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useInventario } from '@/context/InventarioContext';
import { BarChart3, Printer } from 'lucide-react';

export default function VentasGeneralPage() {
  const { ventas } = useInventario();
  const [fechaInicio, setFechaInicio] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [fechaFin, setFechaFin] = useState(() => new Date().toISOString().slice(0, 10));

  const filtered = useMemo(() => {
    return ventas.filter((v) => {
      const f = new Date(v.fecha).getTime();
      return f >= new Date(fechaInicio).getTime() && f <= new Date(fechaFin + 'T23:59:59').getTime();
    });
  }, [ventas, fechaInicio, fechaFin]);

  const totalVentas = filtered.reduce((s, v) => s + v.subtotal, 0);
  const totalCosto = filtered.reduce((s, v) => s + (v.totalCosto ?? 0), 0);
  const totalUtilidad = totalVentas - totalCosto;

  const imprimir = () => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html><head><title>Reporte Ventas - Super Fruty</title></head><body style="font-family:sans-serif;padding:20px">
        <h1>Super Fruty - Reporte de Ventas</h1>
        <p>Periodo: ${fechaInicio} a ${fechaFin}</p>
        <p><strong>Total Ventas:</strong> $${totalVentas.toFixed(2)}</p>
        <p><strong>Total Costo:</strong> $${totalCosto.toFixed(2)}</p>
        <p><strong>Total Utilidad:</strong> $${totalUtilidad.toFixed(2)}</p>
        <hr/>
        <table style="width:100%;border-collapse:collapse;margin-top:20px">
          <tr><th style="text-align:left;border-bottom:2px solid">Factura</th><th style="text-align:left;border-bottom:2px solid">Cliente</th><th style="text-align:left;border-bottom:2px solid">Productos</th><th style="text-align:right;border-bottom:2px solid">Total</th></tr>
          ${filtered.map((v) => `<tr><td style="padding:8px 0">${v.numeroFactura}</td><td>${v.clienteNombre}</td><td>${v.items.map((i) => `${i.nombre} x${i.cantidad}`).join(', ')}</td><td style="text-align:right">$${v.subtotal.toFixed(2)}</td></tr>`).join('')}
        </table>
        </body></html>
      `);
      win.document.close();
      win.print();
      win.close();
    }
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-gray-800">
        Ventas General
      </motion.h1>

      <div className="flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none" />
        </div>
        <button onClick={imprimir} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold ml-auto">
          <Printer className="w-5 h-5" /> Imprimir
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-superfruty-yellow/20 border-2 border-superfruty-yellow/40 p-6">
          <p className="text-sm text-gray-600">Total Ventas</p>
          <p className="text-2xl font-bold text-gray-800">${totalVentas.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl bg-superfruty-yellow/20 border-2 border-superfruty-yellow/40 p-6">
          <p className="text-sm text-gray-600">Total Costo</p>
          <p className="text-2xl font-bold text-gray-800">${totalCosto.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl bg-superfruty-yellow/20 border-2 border-superfruty-yellow/40 p-6">
          <p className="text-sm text-gray-600">Total Utilidad</p>
          <p className="text-2xl font-bold text-green-600">${totalUtilidad.toFixed(2)}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-x-auto rounded-xl border-2 border-superfruty-yellow/30 bg-white shadow">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-superfruty-yellow/20 border-b-2 border-superfruty-yellow/40">
              <th className="px-4 py-3 text-left font-bold text-gray-800">Factura</th>
              <th className="px-4 py-3 text-left font-bold text-gray-800">Cliente</th>
              <th className="px-4 py-3 text-left font-bold text-gray-800">Productos</th>
              <th className="px-4 py-3 text-right font-bold text-gray-800">Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => (
              <motion.tr key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-gray-100 hover:bg-superfruty-yellow/5">
                <td className="px-4 py-3 font-medium text-gray-800">{v.numeroFactura}</td>
                <td className="px-4 py-3 text-gray-700">{v.clienteNombre}</td>
                <td className="px-4 py-3 text-gray-700">{v.items.map((i) => `${i.nombre} x${i.cantidad}`).join(', ')}</td>
                <td className="px-4 py-3 text-right font-bold text-gray-800">${v.subtotal.toFixed(2)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-gray-500">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-superfruty-yellow" />
          <p>No hay ventas en el periodo seleccionado.</p>
        </motion.div>
      )}
    </div>
  );
}
