'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useSucursal } from '@/context/SucursalContext';
import { MapPin, Truck, CreditCard, Upload, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const MONTO_DELIVERY = 2.5;
const METODOS_PAGO = [
  { id: 'zelle', label: 'Zelle', icon: '💳' },
  { id: 'pago_movil', label: 'Pago Móvil', icon: '📱' },
  { id: 'transferencia', label: 'Transferencia Bancaria', icon: '🏦' },
  { id: 'binance', label: 'Binance', icon: '₿' },
] as const;

const DATOS_BANCO: Record<string, { titulo: string; datos: string }> = {
  zelle: {
    titulo: 'Datos Zelle',
    datos: 'Email: pagos@zasfrut.com\nTeléfono: +58 412 123 4567',
  },
  pago_movil: {
    titulo: 'Datos Pago Móvil',
    datos: 'CI: V-12345678\nTeléfono: 0412 123 4567\nBanco: Banco de Venezuela',
  },
  transferencia: {
    titulo: 'Datos Transferencia',
    datos: 'Banco: Banco de Venezuela\nCuenta: 0102-0123-45678901234\nRIF: J-12345678-9',
  },
  binance: {
    titulo: 'Datos Binance',
    datos: 'ID Binance Pay: 123456789\nO escanea el código QR en la app',
  },
};

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, cartTotal, clearCart, createOrder } = useCart();
  const { getSucursalMasCercana, sucursales } = useSucursal();
  const router = useRouter();
  const [delivery, setDelivery] = useState(false);
  const [ubicacionConfirmada, setUbicacionConfirmada] = useState(false);
  const [metodoPago, setMetodoPago] = useState<string | null>(null);
  const [referencia, setReferencia] = useState('');
  const [bancoEmisor, setBancoEmisor] = useState('');
  const [comprobanteFile, setComprobanteFile] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  const subtotal = cartTotal;
  const montoDelivery = delivery ? MONTO_DELIVERY : 0;
  const total = subtotal + montoDelivery;

  const handleConfirmarUbicacion = () => {
    if (!user?.ubicacion && delivery) {
      alert('Necesitas tener ubicación activada. Ve a tu perfil o regístrate con ubicación.');
      return;
    }
    setUbicacionConfirmada(true);
  };

  const handlePagar = async () => {
    if (!metodoPago || !referencia.trim() || !bancoEmisor.trim()) {
      alert('Completa referencia, banco emisor y adjunta el comprobante.');
      return;
    }
    if (!comprobanteFile && !user) {
      alert('Adjunta el comprobante de pago.');
      return;
    }

    setEnviando(true);
    try {
      const comprobanteUrl = comprobanteFile
        ? URL.createObjectURL(comprobanteFile)
        : undefined;

      let sucursalId: string | undefined;
      if (delivery && user?.ubicacion) {
        const nearest = getSucursalMasCercana(user.ubicacion.lat, user.ubicacion.lng);
        sucursalId = nearest?.id;
      } else if (sucursales.length > 0) {
        sucursalId = sucursales[0].id;
      }

      createOrder({
        clienteId: user!.id,
        clienteNombre: user!.nombre,
        clienteEmail: user!.email,
        clienteTelefono: user!.telefono,
        items: cart.map((c) => ({
          recipe_id: c.recipe_id,
          nombre_batido: c.nombre_batido,
          cantidad: c.cantidad,
          precio_unitario: c.precio_unitario,
          extras: c.extras,
          costo_envase: c.costo_envase,
        })),
        subtotal,
        delivery,
        montoDelivery: delivery ? MONTO_DELIVERY : undefined,
        total,
        direccionEntrega: user?.ubicacion?.direccion,
        ubicacionEntrega: user?.ubicacion ? { lat: user.ubicacion.lat, lng: user.ubicacion.lng } : undefined,
        metodoPago: metodoPago as any,
        referenciaPago: referencia,
        bancoEmisor,
        comprobanteUrl,
      }, sucursalId);

      clearCart();
      router.push('/cliente/pedidos');
    } catch (e) {
      alert('Error al enviar: ' + (e as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  if (!user || user.rol !== 'cliente') {
    router.push('/login');
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
        <Link href="/cliente" className="text-frutal-kiwi font-bold">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link href="/cliente" className="inline-flex items-center gap-2 text-gray-600 hover:text-frutal-mora">
        <ArrowLeft className="w-4 h-4" />
        Volver al catálogo
      </Link>

      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-gray-800"
      >
        Checkout
      </motion.h1>

      {/* Delivery */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-white border-2 border-frutal-mango/30"
      >
        <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Truck className="w-5 h-5 text-frutal-mora" />
          ¿Necesitas delivery?
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => setDelivery(false)}
            className={`flex-1 py-3 rounded-xl font-medium ${
              !delivery ? 'bg-frutal-kiwi text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Recoger en tienda
          </button>
          <button
            onClick={() => setDelivery(true)}
            className={`flex-1 py-3 rounded-xl font-medium ${
              delivery ? 'bg-frutal-kiwi text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Delivery (+${MONTO_DELIVERY.toFixed(2)})
          </button>
        </div>
        {delivery && (
          <div className="mt-3 p-3 rounded-lg bg-frutal-kiwi/10">
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-frutal-kiwi" />
              {user.ubicacion
                ? `Ubicación: ${user.ubicacion.direccion || `${user.ubicacion.lat}, ${user.ubicacion.lng}`}`
                : 'Activa tu ubicación en el registro para delivery'}
            </p>
            {user.ubicacion && !ubicacionConfirmada && (
              <button
                onClick={handleConfirmarUbicacion}
                className="mt-2 px-4 py-2 rounded-lg bg-frutal-kiwi text-white text-sm font-medium"
              >
                Confirmar ubicación
              </button>
            )}
            {ubicacionConfirmada && (
              <p className="mt-2 text-xs text-frutal-kiwi font-medium">✓ Ubicación confirmada</p>
            )}
          </div>
        )}
      </motion.div>

      {/* Resumen y método de pago */}
      <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-white border-2 border-frutal-mango/30"
        >
          <h2 className="font-bold text-gray-800 mb-3">Resumen</h2>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            {delivery && <p>Delivery: ${montoDelivery.toFixed(2)}</p>}
            <p className="font-bold text-gray-800 text-lg">Total: ${total.toFixed(2)}</p>
          </div>

          <h2 className="font-bold text-gray-800 mt-4 mb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-frutal-mora" />
            Método de pago
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {METODOS_PAGO.map((m) => (
              <button
                key={m.id}
                onClick={() => setMetodoPago(m.id)}
                className={`p-3 rounded-xl border-2 text-left ${
                  metodoPago === m.id ? 'border-frutal-mora bg-frutal-mora/10' : 'border-gray-200'
                }`}
              >
                <span className="text-xl">{m.icon}</span>
                <p className="font-medium text-sm">{m.label}</p>
              </button>
            ))}
          </div>

          {metodoPago && DATOS_BANCO[metodoPago] && (
            <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <p className="font-bold text-sm text-gray-800">{DATOS_BANCO[metodoPago].titulo}</p>
              <pre className="text-xs text-gray-600 mt-1 whitespace-pre-wrap font-sans">
                {DATOS_BANCO[metodoPago].datos}
              </pre>
            </div>
          )}

      </motion.div>

      {/* Comprobante */}
      <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-white border-2 border-frutal-mango/30"
        >
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Upload className="w-5 h-5 text-frutal-mora" />
            Datos del pago
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de referencia</label>
              <input
                type="text"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                placeholder="Ej: 123456789"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-frutal-mora outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banco emisor</label>
              <input
                type="text"
                value={bancoEmisor}
                onChange={(e) => setBancoEmisor(e.target.value)}
                placeholder="Ej: Banco de Venezuela"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-frutal-mora outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto del comprobante</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setComprobanteFile(e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
            </div>
          </div>
          <button
            onClick={handlePagar}
            disabled={enviando || !referencia.trim() || !bancoEmisor.trim() || (delivery && (!user.ubicacion || !ubicacionConfirmada)) || !metodoPago}
            className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-frutal-fresa to-frutal-mora text-white font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {enviando ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Enviar pedido'
            )}
          </button>
      </motion.div>
    </div>
  );
}
