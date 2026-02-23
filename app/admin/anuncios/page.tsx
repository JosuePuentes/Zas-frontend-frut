'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useHomeConfig } from '@/context/HomeConfigContext';
import { useAuth } from '@/context/AuthContext';
import { Megaphone, Plus, Trash2, Save } from 'lucide-react';

export default function AnunciosPage() {
  const { anuncios, banners, paneles, addAnuncio, removeAnuncio, updateAnuncio, addBanner, updateBanner, removeBanner, addPanel, updatePanel, removePanel } = useHomeConfig();
  const { hasPermission } = useAuth();
  const [nuevoAnuncio, setNuevoAnuncio] = useState('');
  const [tab, setTab] = useState<'anuncios' | 'banners' | 'paneles'>('anuncios');
  const [nuevoBanner, setNuevoBanner] = useState({ imagen: '', titulo: '', subtitulo: '', enlace: '' });
  const [nuevoPanel, setNuevoPanel] = useState({ imagen: '', titulo: '', subtitulo: '' });
  const [draftAnuncios, setDraftAnuncios] = useState<Record<number, string>>({});
  const [draftBanners, setDraftBanners] = useState<Record<string, Partial<{ imagen: string; titulo: string; subtitulo: string; enlace: string }>>>({});
  const [draftPaneles, setDraftPaneles] = useState<Record<string, Partial<{ imagen: string; titulo: string; subtitulo: string }>>>({});

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
                <Megaphone className="w-5 h-5 text-frutal-mora flex-shrink-0" />
                <input
                  value={draftAnuncios[i] ?? a}
                  onChange={(e) => setDraftAnuncios((p) => ({ ...p, [i]: e.target.value }))}
                  className="flex-1 px-2 py-1 border rounded"
                />
                <button
                  onClick={() => {
                    updateAnuncio(i, draftAnuncios[i] ?? a);
                    setDraftAnuncios((p) => {
                      const n = { ...p };
                      delete n[i];
                      return n;
                    });
                  }}
                  className="px-3 py-1 rounded-lg bg-frutal-kiwi text-white font-medium flex items-center gap-1"
                >
                  <Save className="w-4 h-4" /> Guardar
                </button>
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
            {banners.map((b) => {
              const d = draftBanners[b.id] ?? {};
              const img = d.imagen ?? b.imagen;
              const tit = d.titulo ?? b.titulo;
              const sub = d.subtitulo ?? b.subtitulo;
              const enl = d.enlace ?? b.enlace ?? '';
              return (
                <div key={b.id} className="p-4 bg-white rounded-xl border-2 border-frutal-mango/20 flex flex-col md:flex-row gap-4">
                  <img src={img || b.imagen} alt={tit} className="w-full md:w-48 h-24 object-cover rounded" />
                  <div className="flex-1 space-y-2">
                    <input
                      value={tit}
                      onChange={(e) => setDraftBanners((p) => ({ ...p, [b.id]: { ...d, titulo: e.target.value } }))}
                      placeholder="Título"
                      className="w-full px-2 py-1 border rounded"
                    />
                    <input
                      value={sub}
                      onChange={(e) => setDraftBanners((p) => ({ ...p, [b.id]: { ...d, subtitulo: e.target.value } }))}
                      placeholder="Subtítulo"
                      className="w-full px-2 py-1 border rounded"
                    />
                    <input
                      value={enl}
                      onChange={(e) => setDraftBanners((p) => ({ ...p, [b.id]: { ...d, enlace: e.target.value } }))}
                      placeholder="Enlace"
                      className="w-full px-2 py-1 border rounded"
                    />
                    <input
                      value={d.imagen ?? b.imagen}
                      onChange={(e) => setDraftBanners((p) => ({ ...p, [b.id]: { ...d, imagen: e.target.value } }))}
                      placeholder="URL imagen"
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        updateBanner(b.id, { imagen: img, titulo: tit, subtitulo: sub, enlace: enl || undefined });
                        setDraftBanners((p) => {
                          const n = { ...p };
                          delete n[b.id];
                          return n;
                        });
                      }}
                      className="px-3 py-2 rounded-lg bg-frutal-kiwi text-white font-medium flex items-center gap-1"
                    >
                      <Save className="w-4 h-4" /> Guardar
                    </button>
                    <button onClick={() => removeBanner(b.id)} className="p-2 text-red-600 hover:bg-red-100 rounded">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
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
            {paneles.map((p) => {
              const d = draftPaneles[p.id] ?? {};
              const img = d.imagen ?? p.imagen;
              const tit = d.titulo ?? p.titulo;
              const sub = d.subtitulo ?? p.subtitulo ?? '';
              return (
                <div key={p.id} className="p-4 bg-white rounded-xl border-2 border-frutal-mango/20">
                  <img src={img || p.imagen} alt={tit} className="w-full h-32 object-cover rounded mb-2" />
                  <input
                    value={tit}
                    onChange={(e) => setDraftPaneles((prev) => ({ ...prev, [p.id]: { ...d, titulo: e.target.value } }))}
                    placeholder="Título"
                    className="w-full px-2 py-1 border rounded mb-1"
                  />
                  <input
                    value={sub}
                    onChange={(e) => setDraftPaneles((prev) => ({ ...prev, [p.id]: { ...d, subtitulo: e.target.value } }))}
                    placeholder="Subtítulo"
                    className="w-full px-2 py-1 border rounded mb-1"
                  />
                  <input
                    value={d.imagen ?? p.imagen}
                    onChange={(e) => setDraftPaneles((prev) => ({ ...prev, [p.id]: { ...d, imagen: e.target.value } }))}
                    placeholder="URL imagen"
                    className="w-full px-2 py-1 border rounded mb-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        updatePanel(p.id, { imagen: img, titulo: tit, subtitulo: sub });
                        setDraftPaneles((prev) => {
                          const n = { ...prev };
                          delete n[p.id];
                          return n;
                        });
                      }}
                      className="px-3 py-1 rounded-lg bg-frutal-kiwi text-white font-medium flex items-center gap-1 text-sm"
                    >
                      <Save className="w-4 h-4" /> Guardar
                    </button>
                    <button onClick={() => removePanel(p.id)} className="text-red-600 text-sm flex items-center gap-1">
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
