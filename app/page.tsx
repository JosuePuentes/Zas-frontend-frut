'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import NewsBar from '@/components/NewsBar';
import PromoBanners from '@/components/PromoBanners';
import PanelesPublicidad from '@/components/PanelesPublicidad';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-frutal-fresa via-frutal-mora to-frutal-uva">
      <NewsBar />

      <header className="absolute top-12 right-0 p-6 z-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-frutal-mora font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
        >
          <LogIn className="w-5 h-5" />
          Iniciar sesión
        </Link>
      </header>

      <main className="min-h-screen flex flex-col items-center px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg">
            Zas! Frut
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mt-4 font-medium">
            Batidos frescos, naturales y deliciosos
          </p>
          <p className="text-white/80 mt-2">
            Tu tienda de batidos de frutas favorita
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full mb-12"
        >
          <PromoBanners />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full mb-12"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-6 drop-shadow-md">
            Promociones
          </h2>
          <PanelesPublicidad />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/registro"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-frutal-fresa font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <UserPlus className="w-6 h-6" />
            Registrarse
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
