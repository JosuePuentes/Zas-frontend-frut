'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { LogIn, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { user, ready, login } = useAuth();
  const router = useRouter();
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) {
      if (user.rol === 'cliente') {
        router.replace('/cliente');
      } else {
        router.replace('/admin/dashboard');
      }
    }
  }, [ready, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const tipo = identificador.includes('@') ? 'cliente' : 'admin';
    const res = await login(identificador, password, tipo);
    setLoading(false);
    if (res.ok) {
      router.push(tipo === 'cliente' ? '/cliente' : '/admin/dashboard');
    } else {
      setError(res.error || 'Error al iniciar sesión');
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
          className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-6">
            <Image src="/logo-super-fruty.png" alt="Super Fruty" width={80} height={80} className="mb-4" />
            <div className="flex items-center gap-2">
              <LogIn className="w-8 h-8 text-superfruty-yellow" />
              <h1 className="text-2xl font-bold text-gray-800">Iniciar sesión</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow focus:ring-2 focus:ring-superfruty-yellow/20 outline-none"
                placeholder="Ingresa aquí"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow focus:ring-2 focus:ring-superfruty-yellow/20 outline-none"
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold hover:shadow-lg disabled:opacity-70"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600 text-sm">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-superfruty-yellow font-bold hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
