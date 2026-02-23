'use client';

import { motion } from 'framer-motion';
import { useHomeConfig } from '@/context/HomeConfigContext';
import Image from 'next/image';
import { Gift } from 'lucide-react';

export default function ClientePage() {
  const { banners, paneles } = useHomeConfig();

  return (
    <div className="space-y-8">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-gray-800"
      >
        Promociones diarias
      </motion.h1>

      <div className="space-y-4">
        {banners.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl overflow-hidden shadow-xl border-2 border-frutal-mango/30"
          >
            <div className="relative aspect-[21/9]">
              <Image
                src={b.imagen}
                alt={b.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h2 className="text-xl font-bold text-white">{b.titulo}</h2>
                {b.subtitulo && <p className="text-white/95 text-sm">{b.subtitulo}</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Gift className="w-6 h-6 text-frutal-mora" />
          Otras promociones
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paneles.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="rounded-xl overflow-hidden shadow-lg border-2 border-frutal-kiwi/30"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={p.imagen}
                  alt={p.titulo}
                  fill
                  className="object-cover"
                  sizes="336px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                  <h3 className="font-bold text-white">{p.titulo}</h3>
                  {p.subtitulo && <p className="text-white/90 text-sm">{p.subtitulo}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
