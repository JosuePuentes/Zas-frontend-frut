'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, User, Users, Mail, Sparkles, X } from 'lucide-react';
import NewsBar from '@/components/NewsBar';
import PromoBanners from '@/components/PromoBanners';
import PanelesPublicidad from '@/components/PanelesPublicidad';
import { useAuth } from '@/context/AuthContext';

function FruitPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.08]">
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="fruit-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="40" r="12" fill="white" />
            <ellipse cx="80" cy="25" rx="15" ry="18" fill="white" />
            <path d="M120 60 Q140 50 160 60 Q150 75 120 75 Z" fill="white" />
            <circle cx="50" cy="120" r="10" fill="white" />
            <ellipse cx="150" cy="100" rx="12" ry="14" fill="white" />
            <path d="M20 150 Q35 140 50 150 Q40 165 20 165 Z" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fruit-pattern)" />
      </svg>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [modalQuienes, setModalQuienes] = useState(false);
  const [modalContacto, setModalContacto] = useState(false);

  return (
    <div className="min-h-screen bg-superfruty-black relative">
      <div className="absolute inset-0 bg-gradient-to-b from-superfruty-yellow/15 via-transparent to-superfruty-black pointer-events-none" />
      <FruitPattern />
      <NewsBar />

      <header className="absolute top-12 right-0 p-6 z-20 flex items-center gap-3">
        {user?.rol === 'cliente' ? (
          <Link
            href="/cliente"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <User className="w-5 h-5" />
            Mi área
          </Link>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <LogIn className="w-5 h-5" />
            Iniciar sesión
          </Link>
        )}
      </header>

      <main className="min-h-screen flex flex-col items-center px-6 pt-24 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 flex flex-col items-center"
        >
          <div className="relative w-40 h-40 md:w-52 md:h-52 mb-4">
            <Image
              src="/logo-super-fruty.png"
              alt="Super Fruty"
              fill
              className="object-contain drop-shadow-2xl"
              priority
              sizes="(max-width: 768px) 160px, 208px"
            />
          </div>
          <p className="text-xl md:text-2xl text-superfruty-yellow mt-2 font-medium">
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
          <h2 className="text-2xl font-bold text-superfruty-yellow text-center mb-6">
            Promociones
          </h2>
          <PanelesPublicidad />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <button
            onClick={() => setModalQuienes(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Users className="w-5 h-5" />
            Quiénes somos
          </button>
          <button
            onClick={() => setModalContacto(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <Mail className="w-5 h-5" />
            Contacto
          </button>
          <Link
            href="/registro"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-superfruty-yellow text-superfruty-black font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <UserPlus className="w-6 h-6" />
            Registrarse
          </Link>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-4xl mt-8 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-superfruty-yellow/30"
        >
          <h2 className="text-xl font-bold text-superfruty-yellow text-center mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6" />
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/95 text-center">
            <div className="p-4 rounded-xl bg-superfruty-yellow/10 border border-superfruty-yellow/20">
              <p className="font-bold text-white">Frescura garantizada</p>
              <p className="text-sm mt-1 text-white/80">Ingredientes naturales y de primera calidad</p>
            </div>
            <div className="p-4 rounded-xl bg-superfruty-yellow/10 border border-superfruty-yellow/20">
              <p className="font-bold text-white">Entrega a domicilio</p>
              <p className="text-sm mt-1 text-white/80">Llevamos tus batidos hasta tu puerta en Zulia</p>
            </div>
            <div className="p-4 rounded-xl bg-superfruty-yellow/10 border border-superfruty-yellow/20">
              <p className="font-bold text-white">Variedad de sabores</p>
              <p className="text-sm mt-1 text-white/80">Múltiples combinaciones para todos los gustos</p>
            </div>
          </div>
        </motion.section>
      </main>

      {modalQuienes && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setModalQuienes(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative"
          >
            <button onClick={() => setModalQuienes(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-2xl font-bold text-superfruty-black mb-4">Quiénes somos</h3>
            <p className="text-gray-700 leading-relaxed">
              <strong>Super Fruty</strong> es tu tienda de batidos de frutas frescas en el estado Zulia, Venezuela.
              Nos dedicamos a preparar batidos naturales con ingredientes de calidad, sin conservantes artificiales.
              Nuestra misión es llevar la frescura de las frutas a tu mesa, ya sea que nos visites o te llevemos
              el pedido hasta tu hogar con nuestro servicio de delivery.
            </p>
            <p className="text-gray-600 mt-4 text-sm">
              ¡Únete a nuestra comunidad y disfruta de los mejores batidos de la región!
            </p>
          </motion.div>
        </motion.div>
      )}

      {modalContacto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setModalContacto(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative"
          >
            <button onClick={() => setModalContacto(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-2xl font-bold text-superfruty-black mb-4">Contacto</h3>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-superfruty-yellow" />
                <span>Email: contacto@superfruty.com</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-superfruty-yellow font-bold">Tel:</span>
                <span>+58 412 123 4567</span>
              </p>
              <p className="text-sm text-gray-600 mt-4">
                Estamos en el estado Zulia, Venezuela. Horario de atención: Lunes a Domingo.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
