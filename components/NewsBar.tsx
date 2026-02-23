'use client';

import { Megaphone } from 'lucide-react';
import { useHomeConfig } from '@/context/HomeConfigContext';

export default function NewsBar() {
  const { anuncios } = useHomeConfig();
  const items = [...anuncios, ...anuncios];

  return (
    <div className="bg-superfruty-yellow text-superfruty-black py-2 overflow-hidden border-b-2 border-superfruty-yellowDark">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex-shrink-0 flex items-center gap-2 px-4 py-1 bg-superfruty-black text-superfruty-yellow rounded-r-xl">
          <Megaphone className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-sm whitespace-nowrap">Noticias del día</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap inline-block">
            {items.map((text, i) => (
              <span key={i} className="inline-block mx-8 text-sm md:text-base">
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
