'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, ArrowLeft, MapPin } from 'lucide-react';

export default function RegistroPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState<'cliente' | 'admin'>('cliente');
  const [usuario, setUsuario] = useState('');
  const [ubicacionObtenida, setUbicacionObtenida] = useState<{ lat: number; lng: number; direccion?: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización');
      return;
    }
    const opts: PositionOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUbicacionObtenida({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          direccion: `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`,
        });
      },
      () => setError('No se pudo obtener la ubicación. Asegúrate de permitir el acceso.'),
      opts
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (rol === 'cliente' && !ubicacionObtenida) {
      setError('Debes activar la ubicación para poder realizar pedidos con delivery');
      return;
    }
    setLoading(true);
    const res = await register(email, password, nombre, telefono, rol, usuario, ubicacionObtenida || undefined);
    setLoading(false);
    if (res.ok) {
      if (rol === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/cliente');
      }
    } else {
      setError(res.error || 'Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-frutal-kiwi via-frutal-limon to-frutal-mango flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-800 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <UserPlus className="w-8 h-8 text-frutal-kiwi" />
            <h1 className="text-2xl font-bold text-gray-800">Registrarse</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-frutal-kiwi focus:ring-2 focus:ring-frutal-kiwi/20 outline-none"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-frutal-kiwi focus:ring-2 focus:ring-frutal-kiwi/20 outline-none"
                placeholder="+58 412 1234567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-frutal-kiwi focus:ring-2 focus:ring-frutal-kiwi/20 outline-none"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-frutal-kiwi focus:ring-2 focus:ring-frutal-kiwi/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de cuenta</label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value as 'cliente' | 'admin')}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-frutal-kiwi focus:ring-2 focus:ring-frutal-kiwi/20 outline-none"
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {rol === 'cliente' ? 'Acceso como cliente de la tienda' : 'Acceso al área administrativa con usuario'}
              </p>
            </div>
            {rol === 'admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuario (para iniciar sesión)</label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-frutal-kiwi focus:ring-2 focus:ring-frutal-kiwi/20 outline-none"
                  placeholder="admin"
                />
              </div>
            )}
            {rol === 'cliente' && (
              <div className="p-4 rounded-xl bg-frutal-kiwi/10 border-2 border-frutal-kiwi/30">
                <p className="text-sm text-gray-700 mb-2">
                  Para hacer pedidos con delivery necesitamos activar tu ubicación.
                </p>
                {ubicacionObtenida ? (
                  <p className="text-sm text-frutal-kiwi font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Ubicación activada correctamente
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={obtenerUbicacion}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-frutal-kiwi text-white font-medium text-sm hover:bg-frutal-limon transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Activar ubicación
                  </button>
                )}
              </div>
            )}
            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-frutal-kiwi to-frutal-limon text-white font-bold hover:shadow-lg disabled:opacity-70"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-frutal-kiwi font-bold hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
