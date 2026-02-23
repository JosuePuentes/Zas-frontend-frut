'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useHomeConfig } from '@/context/HomeConfigContext';
import { useAuth } from '@/context/AuthContext';
import { Megaphone, Image, Plus, Trash2, Loader2 } from 'lucide-react';

export default function AnunciosPage() {
  const { anuncios, banners, paneles, addAnuncio, removeAnuncio, updateAnuncio, addBanner, updateBanner, removeBanner, addPanel, updatePanel, removePanel } = useHomeConfig();
  const { hasPermission } = useAuth();
  const [nuevoAnuncio, setNuevoAnuncio] = useState('');
  const [tab, setTab] = useState<'anuncios' | 'banners' | 'paneles'>('anuncios');
  const [nuevoBanner, setNuevoBanner] = useState({ imagen: '', titulo: '', subtitulo: '', enlace: '' });
  const [nuevoPanel, setNuevoPanel] = useState({ imagen: '', titulo: '', subtitulo: '' });

  if (!hasPermission('anuncios')) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-600 font-medium">No tienes permiso para acceder a este módulo</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-gray-800">
        Anuncios y Banners del Home
      </motion.h1>

      <div className="flex gap-2 border-b-2 border-frutal-mango/20">
        <button onClick={() => setTab('anuncios')} className={`px-4 py-2 font-medium rounded-t-xl ${tab === 'anuncios' ? 'bg-frutal-mora text-white' : 'bg-gray-200'}`}>
          Anuncios diarios
        </button>
        <button onClick={() => setTab('banners')} className={`px-4 py-2 font-medium rounded-t-xl ${tab === 'banners' ? 'bg-frutal-mora text-white' : 'bg-gray-200'}`}>
          Banners
        </button>
        <button onClick={() => setTab('paneles')} className={`px-4 py-2 font-medium rounded-t-xl ${tab === 'paneles' ? 'bg-frutal-mora text-white' : 'bg-gray-200'}`}>
          Paneles publicidad
        </button>
      </div>

      {tab === 'anuncios' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              value={nuevoAnuncio}
              onChange={(e) => setNuevoAnuncio(e.target.value)}
              placeholder="Nueva noticia o anuncio..."
              className="flex-1 px-4 py-2 rounded-xl border-2 border-frutal-mango/40"
              onKeyDown={(e) => e.key === 'Enter' && (addAnuncio(nuevoAnuncio), setNuevoAnuncio(''))}
            />
            <button onClick={() => (addAnuncio(nuevoAnuncio), setNuevoAnuncio(''))} className="px-4 py-2 rounded-xl bg-frutal-mora text-white font-bold flex items-center gap-2">
              <Plus className="w-4 h-4" /> Añadir
            </button>
          </div>
          <div className="space-y-2">
            {anuncios.map((a, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-white rounded-xl border-2 border-frutal-mango/20">
                <Megaphone className="w-5 h-5 text-frutal-mora" />
                <input value={a} onChange={(e) => updateAnuncio(i, e.target.value)} className="flex-1 px-2 py-1 border rounded" />
                <button onClick={() => removeAnuncio(i)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'banners' && (
        <div className="space-y-6">
          <div className="p-4 bg-white rounded-xl border-2 border-frutal-mango/20 space-y-3">
            <h3 className="font-bold">Nuevo banner</h3>
            <input placeholder="URL imagen" value={nuevoBanner.imagen} onChange={(e) => setNuevoBanner((p) => ({ ...p, imagen: e.target.value }))} className="w-full px-4 py-2 rounded border" />
            <input placeholder="Título" value={nuevoBanner.titulo} onChange={(e) => setNuevoBanner((p) => ({ ...p, titulo: e.target.value }))} className="w-full px-4 py-2 rounded border" />
            <input placeholder="Subtítulo" value={nuevoBanner.subtitulo} onChange={(e) => setNuevoBanner((p) => ({ ...p, subtitulo: e.target.value }))} className="w-full px-4 py-2 rounded border" />
            <input placeholder="Enlace (opcional)" value={nuevoBanner.enlace} onChange={(e) => setNuevoBanner((p) => ({ ...p, enlace: e.target.value }))} className="w-full px-4 py-2 rounded border" />
            <button onClick={() => (addBanner(nuevoBanner), setNuevoBanner({ imagen: '', titulo: '', subtitulo: '', enlace: '' }))} className="px-4 py-2 rounded-xl bg-frutal-mora text-white font-bold">
              Añadir banner
            </button>
          </div>
          <div className="grid gap-4">
            {banners.map((b) => (
              <div key={b.id} className="p-4 bg-white rounded-xl border-2 border-frutal-mango/20 flex flex-col md:flex-row gap-4">
                <img src={b.imagen} alt={b.titulo} className="w-full md:w-48 h-24 object-cover rounded" />
                <div className="flex-1 space-y-2">
                  <input value={b.titulo} onChange={(e) => updateBanner(b.id, { titulo: e.target.value })} className="w-full px-2 py-1 border rounded" />
                  <input value={b.subtitulo} onChange={(e) => updateBanner(b.id, { subtitulo: e.target.value })} className="w-full px-2 py-1 border rounded" />
                  <input value={b.enlace} onChange={(e) => updateBanner(b.id, { enlace: e.target.value })} placeholder="Enlace" className="w-full px-2 py-1 border rounded" />
                </div>
                <button onClick={() => removeBanner(b.id)} className="p-2 text-red-600 hover:bg-red-100 rounded self-start">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'paneles' && (
        <div className="space-y-6">
          <div className="p-4 bg-white rounded-xl border-2 border-frutal-mango/20 space-y-3">
            <h3 className="font-bold">Nuevo panel</h3>
            <input placeholder="URL imagen" value={nuevoPanel.imagen} onChange={(e) => setNuevoPanel((p) => ({ ...p, imagen: e.target.value }))} className="w-full px-4 py-2 rounded border" />
            <input placeholder="Título" value={nuevoPanel.titulo} onChange={(e) => setNuevoPanel((p) => ({ ...p, titulo: e.target.value }))} className="w-full px-4 py-2 rounded border" />
            <input placeholder="Subtítulo" value={nuevoPanel.subtitulo} onChange={(e) => setNuevoPanel((p) => ({ ...p, subtitulo: e.target.value }))} className="w-full px-4 py-2 rounded border" />
            <button onClick={() => (addPanel(nuevoPanel), setNuevoPanel({ imagen: '', titulo: '', subtitulo: '' }))} className="px-4 py-2 rounded-xl bg-frutal-mora text-white font-bold">
              Añadir panel
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paneles.map((p) => (
              <div key={p.id} className="p-4 bg-white rounded-xl border-2 border-frutal-mango/20">
                <img src={p.imagen} alt={p.titulo} className="w-full h-32 object-cover rounded mb-2" />
                <input value={p.titulo} onChange={(e) => updatePanel(p.id, { titulo: e.target.value })} className="w-full px-2 py-1 border rounded mb-1" />
                <input value={p.subtitulo} onChange={(e) => updatePanel(p.id, { subtitulo: e.target.value })} className="w-full px-2 py-1 border rounded mb-2" />
                <button onClick={() => removePanel(p.id)} className="text-red-600 text-sm flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
