'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, ArrowLeft, MapPin } from 'lucide-react';

export default function RegistroPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
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
    if (!ubicacionObtenida) {
      setError('Debes activar la ubicación para poder realizar pedidos con delivery');
      return;
    }
    setLoading(true);
    const res = await register(email, password, nombre, telefono, 'cliente', undefined, ubicacionObtenida || undefined);
    setLoading(false);
    if (res.ok) {
      router.push('/cliente');
    } else {
      setError(res.error || 'Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-superfruty-black via-superfruty-black to-superfruty-yellow/20 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-superfruty-yellow hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-6">
            <Image src="/logo-super-fruty.png" alt="Super Fruty" width={80} height={80} className="mb-4" />
            <div className="flex items-center gap-2">
              <UserPlus className="w-8 h-8 text-superfruty-yellow" />
              <h1 className="text-2xl font-bold text-gray-800">Registrarse</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow focus:ring-2 focus:ring-superfruty-yellow/20 outline-none"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow focus:ring-2 focus:ring-superfruty-yellow/20 outline-none"
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
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow focus:ring-2 focus:ring-superfruty-yellow/20 outline-none"
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
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow focus:ring-2 focus:ring-superfruty-yellow/20 outline-none"
              />
            </div>
            <div className="p-4 rounded-xl bg-superfruty-yellow/10 border-2 border-superfruty-yellow/30">
                <p className="text-sm text-gray-700 mb-2">
                  Para hacer pedidos con delivery necesitamos activar tu ubicación.
                </p>
                {ubicacionObtenida ? (
                  <p className="text-sm text-superfruty-yellow font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Ubicación activada correctamente
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={obtenerUbicacion}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-superfruty-yellow text-superfruty-black font-medium text-sm hover:bg-superfruty-yellowDark transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Activar ubicación
                  </button>
                )}
            </div>
            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold hover:shadow-lg disabled:opacity-70"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-superfruty-yellow font-bold hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
