'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInventario } from '@/context/InventarioContext';
import { Search, Plus, Minus, Trash2, ShoppingCart, Camera, Upload, Printer, FileDown } from 'lucide-react';

interface CartItem {
  productoId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

type MetodoPago = 'efectivo_bs' | 'efectivo_usd' | 'zelle' | 'pago_movil' | 'transferencia' | 'binance';

export default function POSPage() {
  const { inventarioVenta, addVenta, addCliente } = useInventario();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [modalCheckout, setModalCheckout] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cedula, setCedula] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo_usd');
  const [montoRecibido, setMontoRecibido] = useState('');
  const [comprobanteUrl, setComprobanteUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productos = inventarioVenta.filter((p) =>
    p.descripcion.toLowerCase().includes(search.toLowerCase()) || p.codigo.toLowerCase().includes(search.toLowerCase())
  );

  const total = cart.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0);
  const montoNum = parseFloat(montoRecibido) || 0;
  const vuelto = metodoPago.startsWith('efectivo') ? Math.max(0, montoNum - total) : 0;

  const addToCart = (p: typeof inventarioVenta[0]) => {
    const existing = cart.find((c) => c.productoId === p.id);
    if (existing) {
      setCart(cart.map((c) => (c.productoId === p.id ? { ...c, cantidad: c.cantidad + 1 } : c)));
    } else {
      setCart([...cart, { productoId: p.id, nombre: p.descripcion, cantidad: 1, precioUnitario: p.precio }]);
    }
  };

  const updateCantidad = (idx: number, delta: number) => {
    const newCart = [...cart];
    newCart[idx].cantidad = Math.max(0, newCart[idx].cantidad + delta);
    if (newCart[idx].cantidad === 0) newCart.splice(idx, 1);
    setCart(newCart);
  };

  const imprimirFactura = (items: CartItem[], tot: number, montRec: number, vlt: number) => {
    const venta = {
      numeroFactura: `F-${Date.now()}`,
      cliente: `${nombre} ${apellido}`.trim() || 'Cliente',
      cedula,
      direccion,
      telefono,
      items,
      total: tot,
      metodoPago,
      vuelto: vlt,
    };
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`
        <html><head><title>Factura Super Fruty</title></head><body style="font-family:sans-serif;padding:20px">
        <div style="text-align:center;margin-bottom:20px">
          <h1>Super Fruty</h1>
          <p>Batidos frescos, naturales y deliciosos</p>
          <p>Zulia, Venezuela</p>
        </div>
        <hr/>
        <p><strong>Factura:</strong> ${venta.numeroFactura}</p>
        <p><strong>Cliente:</strong> ${venta.cliente}</p>
        <p><strong>Cédula:</strong> ${venta.cedula || '-'}</p>
        <p><strong>Dirección:</strong> ${venta.direccion || '-'}</p>
        <p><strong>Teléfono:</strong> ${venta.telefono || '-'}</p>
        <hr/>
        <table style="width:100%;border-collapse:collapse">
          <tr><th style="text-align:left">Producto</th><th>Cant</th><th>Precio</th><th>Total</th></tr>
          ${items.map((i) => `<tr><td>${i.nombre}</td><td>${i.cantidad}</td><td>$${i.precioUnitario.toFixed(2)}</td><td>$${(i.cantidad * i.precioUnitario).toFixed(2)}</td></tr>`).join('')}
        </table>
        <hr/>
        <p style="font-size:1.2em"><strong>Total: $${tot.toFixed(2)}</strong></p>
        ${metodoPago.startsWith('efectivo') ? `<p>Monto recibido: $${montRec.toFixed(2)}</p><p>Vuelto: $${vlt.toFixed(2)}</p>` : ''}
        <p style="margin-top:30px;font-size:0.9em;color:#666">Gracias por su compra - Super Fruty</p>
        </body></html>
      `);
      win.document.close();
      win.print();
      win.close();
    }
  };

  const totalizar = () => {
    if (cart.length === 0) return;
    if (metodoPago.startsWith('efectivo') && montoNum < total) {
      alert('El monto recibido debe ser mayor o igual al total');
      return;
    }
    const clienteId: string = addCliente({
      cedula: cedula || 'SIN-CEDULA',
      nombre: nombre || 'Cliente',
      apellido: apellido || 'POS',
      direccion: direccion || '',
      telefono: telefono || '',
      esPuntoVenta: true,
    });
    addVenta({
      clienteId,
      clienteNombre: `${nombre || 'Cliente'} ${apellido || ''}`.trim(),
      items: cart.map((c) => ({
        productoId: c.productoId,
        nombre: c.nombre,
        cantidad: c.cantidad,
        precioUnitario: c.precioUnitario,
        total: c.cantidad * c.precioUnitario,
      })),
      subtotal: total,
      metodoPago,
      montoRecibido: metodoPago.startsWith('efectivo') ? montoNum : undefined,
      vuelto: metodoPago.startsWith('efectivo') ? vuelto : undefined,
      comprobanteUrl: comprobanteUrl || undefined,
    });
    imprimirFactura([...cart], total, montoNum, vuelto);
    setCart([]);
    setModalCheckout(false);
    setMontoRecibido('');
    setComprobanteUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setComprobanteUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 overflow-hidden flex flex-col bg-white rounded-2xl shadow-xl border-2 border-superfruty-yellow/30">
        <div className="p-4 border-b-2 border-superfruty-yellow/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-superfruty-black" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-superfruty-yellow/40 focus:ring-2 focus:ring-superfruty-yellow outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {productos.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => addToCart(p)}
              className="p-4 rounded-xl bg-superfruty-yellow/20 border-2 border-superfruty-yellow/50 hover:bg-superfruty-yellow/40 transition-all text-left"
            >
              <p className="font-semibold text-gray-800 truncate">{p.descripcion}</p>
              <p className="text-sm text-superfruty-black font-medium">${p.precio.toFixed(2)}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-96 flex flex-col bg-white rounded-2xl shadow-xl border-2 border-superfruty-yellow/30 overflow-hidden">
        <div className="p-4 border-b-2 border-superfruty-yellow/30 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-superfruty-black" />
          <h2 className="font-bold text-gray-800">Carrito</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.map((item, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between p-3 rounded-xl bg-superfruty-yellow/10 border-2 border-superfruty-yellow/30"
            >
              <div>
                <p className="font-medium text-gray-800">{item.nombre}</p>
                <p className="text-sm text-gray-600">${item.precioUnitario.toFixed(2)} x {item.cantidad}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateCantidad(idx, -1)} className="p-1 rounded-lg bg-red-100 text-red-600"><Minus className="w-4 h-4" /></button>
                <span className="font-bold w-6 text-center">{item.cantidad}</span>
                <button onClick={() => updateCantidad(idx, 1)} className="p-1 rounded-lg bg-superfruty-yellow/50 text-superfruty-black"><Plus className="w-4 h-4" /></button>
                <button onClick={() => updateCantidad(idx, -item.cantidad)} className="p-1 rounded-lg text-red-600 hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="p-4 border-t-2 border-superfruty-yellow/30 space-y-3">
          <p className="text-xl font-bold text-gray-800">Total: ${total.toFixed(2)}</p>
          <button
            onClick={() => setModalCheckout(true)}
            disabled={cart.length === 0}
            className="w-full py-3 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Totalizar
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {modalCheckout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setModalCheckout(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border-2 border-superfruty-yellow/30 my-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Datos del cliente</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" className="px-3 py-2 rounded-lg border border-gray-200" />
                <input value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" className="px-3 py-2 rounded-lg border border-gray-200" />
                <input value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="Cédula" className="px-3 py-2 rounded-lg border border-gray-200 col-span-2" />
                <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección" className="px-3 py-2 rounded-lg border border-gray-200 col-span-2" />
                <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" className="px-3 py-2 rounded-lg border border-gray-200 col-span-2" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Método de pago</h3>
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value as MetodoPago)} className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 mb-4">
                <option value="efectivo_usd">Efectivo USD</option>
                <option value="efectivo_bs">Efectivo BS</option>
                <option value="zelle">Zelle</option>
                <option value="pago_movil">Pago Móvil</option>
                <option value="transferencia">Transferencia</option>
                <option value="binance">Binance</option>
              </select>
              {metodoPago.startsWith('efectivo') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Monto recibido ($)</label>
                  <input type="number" min={0} step={0.01} value={montoRecibido} onChange={(e) => setMontoRecibido(e.target.value)} className="w-full px-4 py-2 rounded-xl border-2 border-gray-200" />
                  {montoNum >= total && <p className="text-green-600 font-bold mt-1">Vuelto: ${vuelto.toFixed(2)}</p>}
                </div>
              )}
              {(metodoPago === 'zelle' || metodoPago === 'pago_movil' || metodoPago === 'binance') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Comprobante</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-superfruty-yellow text-superfruty-black font-medium">
                      <Upload className="w-4 h-4" /> Subir foto
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    {comprobanteUrl && <span className="text-green-600 text-sm">✓ Comprobante cargado</span>}
                  </div>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setModalCheckout(false)} className="flex-1 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-medium">Cancelar</button>
                <button onClick={totalizar} className="flex-1 py-2 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold">
                  Imprimir factura y cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
