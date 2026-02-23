'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useHomeConfig } from '@/context/HomeConfigContext';

export default function PanelesPublicidad() {
  const { paneles } = useHomeConfig();

  if (paneles.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
      {paneles.map((panel, i) => (
        <motion.div
          key={panel.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.03, y: -4 }}
          className="rounded-2xl overflow-hidden shadow-xl border-4 border-white/30 bg-white"
        >
          <div className="relative aspect-[4/3]">
            <Image
              src={panel.imagen}
              alt={panel.titulo}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-lg font-bold text-white drop-shadow-md">{panel.titulo}</h3>
              {panel.subtitulo && (
                <p className="text-white/90 text-sm mt-0.5">{panel.subtitulo}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
