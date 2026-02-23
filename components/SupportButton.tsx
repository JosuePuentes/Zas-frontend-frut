'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSupport } from '@/context/SupportContext';

export default function SupportButton() {
  const { user } = useAuth();
  const { sendMessage } = useSupport();
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!mensaje.trim() || !user) return;
    sendMessage(user.id, user.nombre, user.email, mensaje.trim());
    setMensaje('');
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
  };

  if (!user || user.rol !== 'cliente') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={ref}>
      {open && (
        <div className="absolute bottom-16 right-0 w-80 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border-2 border-superfruty-yellow/30 overflow-hidden">
          <div className="p-4 bg-superfruty-yellow text-superfruty-black font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Soporte
            </span>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-2">Escribe tu mensaje y lo recibiremos en el área administrativa.</p>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="¿En qué podemos ayudarte?"
              rows={3}
              className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-superfruty-yellow outline-none text-sm resize-none"
            />
            <button
              onClick={handleSend}
              disabled={!mensaje.trim()}
              className="mt-2 w-full py-2 rounded-xl bg-frutal-mora text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {enviado ? 'Enviado' : 'Enviar'}
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-superfruty-yellow text-superfruty-black shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
        aria-label="Abrir soporte"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
}
