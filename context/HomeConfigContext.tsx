'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PromoBanner {
  id: string;
  imagen: string;
  titulo: string;
  subtitulo?: string;
  enlace?: string;
}

const ANUNCIOS_KEY = 'zas_anuncios';
const BANNERS_KEY = 'zas_banners';
const PANELES_KEY = 'zas_paneles';

const DEFAULT_ANUNCIOS = [
  '¡Bienvenidos a Zas! Frut! Batidos frescos todos los días.',
  '🎉 2x1 en batidos de mango los martes',
  'Nuevos sabores: Maracuyá, Guanábana y Piña Colada',
  'Horario: Lunes a Sábado 8am - 8pm',
  'Síguenos en redes para más promociones',
];

const DEFAULT_BANNERS: PromoBanner[] = [
  { id: '1', imagen: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&q=80', titulo: '2x1 en Batidos', subtitulo: 'Martes y Jueves', enlace: '/registro' },
  { id: '2', imagen: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&q=80', titulo: 'Nuevos Sabores', subtitulo: 'Maracuyá, Guanábana, Piña Colada', enlace: '/registro' },
  { id: '3', imagen: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=800&q=80', titulo: 'Batidos Naturales', subtitulo: '100% fruta fresca', enlace: '/registro' },
];

const DEFAULT_PANELES: PromoBanner[] = [
  { id: 'p1', imagen: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&q=80', titulo: 'Promo Mango', subtitulo: '¡Pruébalo hoy!' },
  { id: 'p2', imagen: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&q=80', titulo: 'Combo Familiar', subtitulo: '4 batidos al precio de 3' },
  { id: 'p3', imagen: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=600&q=80', titulo: 'Fresas de Temporada', subtitulo: 'Batido especial' },
];

function loadAnuncios(): string[] {
  if (typeof window === 'undefined') return DEFAULT_ANUNCIOS;
  try {
    const s = localStorage.getItem(ANUNCIOS_KEY);
    return s ? JSON.parse(s) : DEFAULT_ANUNCIOS;
  } catch {
    return DEFAULT_ANUNCIOS;
  }
}

function loadBanners(): PromoBanner[] {
  if (typeof window === 'undefined') return DEFAULT_BANNERS;
  try {
    const s = localStorage.getItem(BANNERS_KEY);
    return s ? JSON.parse(s) : DEFAULT_BANNERS;
  } catch {
    return DEFAULT_BANNERS;
  }
}

function loadPaneles(): PromoBanner[] {
  if (typeof window === 'undefined') return DEFAULT_PANELES;
  try {
    const s = localStorage.getItem(PANELES_KEY);
    return s ? JSON.parse(s) : DEFAULT_PANELES;
  } catch {
    return DEFAULT_PANELES;
  }
}

const HomeConfigContext = createContext<{
  anuncios: string[];
  banners: PromoBanner[];
  paneles: PromoBanner[];
  setAnuncios: (a: string[]) => void;
  setBanners: (b: PromoBanner[]) => void;
  setPaneles: (p: PromoBanner[]) => void;
  addAnuncio: (text: string) => void;
  removeAnuncio: (i: number) => void;
  updateAnuncio: (i: number, text: string) => void;
  addBanner: (b: Omit<PromoBanner, 'id'>) => void;
  updateBanner: (id: string, b: Partial<PromoBanner>) => void;
  removeBanner: (id: string) => void;
  addPanel: (p: Omit<PromoBanner, 'id'>) => void;
  updatePanel: (id: string, p: Partial<PromoBanner>) => void;
  removePanel: (id: string) => void;
}>(null as any);

export function HomeConfigProvider({ children }: { children: ReactNode }) {
  const [anuncios, setAnunciosState] = useState<string[]>(() => loadAnuncios());
  const [banners, setBannersState] = useState<PromoBanner[]>(() => loadBanners());
  const [paneles, setPanelesState] = useState<PromoBanner[]>(() => loadPaneles());

  useEffect(() => {
    if (anuncios.length > 0) localStorage.setItem(ANUNCIOS_KEY, JSON.stringify(anuncios));
  }, [anuncios]);

  useEffect(() => {
    if (banners.length > 0) localStorage.setItem(BANNERS_KEY, JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    if (paneles.length > 0) localStorage.setItem(PANELES_KEY, JSON.stringify(paneles));
  }, [paneles]);

  const setAnuncios = (a: string[]) => setAnunciosState(a.length ? a : DEFAULT_ANUNCIOS);
  const setBanners = (b: PromoBanner[]) => setBannersState(b.length ? b : DEFAULT_BANNERS);
  const setPaneles = (p: PromoBanner[]) => setPanelesState(p.length ? p : DEFAULT_PANELES);

  const addAnuncio = (text: string) => setAnunciosState((p) => [...p, text]);
  const removeAnuncio = (i: number) => setAnunciosState((p) => p.filter((_, idx) => idx !== i));
  const updateAnuncio = (i: number, text: string) =>
    setAnunciosState((p) => p.map((t, idx) => (idx === i ? text : t)));

  const addBanner = (b: Omit<PromoBanner, 'id'>) =>
    setBannersState((p) => [...p, { ...b, id: crypto.randomUUID() }]);
  const updateBanner = (id: string, b: Partial<PromoBanner>) =>
    setBannersState((p) => p.map((x) => (x.id === id ? { ...x, ...b } : x)));
  const removeBanner = (id: string) => setBannersState((p) => p.filter((x) => x.id !== id));

  const addPanel = (p: Omit<PromoBanner, 'id'>) =>
    setPanelesState((prev) => [...prev, { ...p, id: crypto.randomUUID() }]);
  const updatePanel = (id: string, p: Partial<PromoBanner>) =>
    setPanelesState((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));
  const removePanel = (id: string) => setPanelesState((prev) => prev.filter((x) => x.id !== id));

  return (
    <HomeConfigContext.Provider
      value={{
        anuncios,
        banners,
        paneles,
        setAnuncios,
        setBanners,
        setPaneles,
        addAnuncio,
        removeAnuncio,
        updateAnuncio,
        addBanner,
        updateBanner,
        removeBanner,
        addPanel,
        updatePanel,
        removePanel,
      }}
    >
      {children}
    </HomeConfigContext.Provider>
  );
}

export function useHomeConfig() {
  const ctx = useContext(HomeConfigContext);
  if (!ctx) throw new Error('useHomeConfig must be used within HomeConfigProvider');
  return ctx;
}
