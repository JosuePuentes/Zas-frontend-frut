'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSupport } from '@/context/SupportContext';
import { useAuth } from '@/context/AuthContext';
import { MessageCircle, Mail, User, Check } from 'lucide-react';

export default function SoportePage() {
  const { messages, markAsRead, unreadCount } = useSupport();
  const { hasPermission } = useAuth();

  if (!hasPermission('usuarios')) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-600 font-medium">No tienes permiso para acceder</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-gray-800">
        Mensajes de Soporte
      </motion.h1>
      <p className="text-gray-600">Mensajes enviados por clientes desde el área de cliente.</p>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-frutal-mora/50" />
            <p>No hay mensajes de soporte</p>
          </div>
        ) : (
          messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border-2 ${m.leido ? 'bg-white border-gray-200' : 'bg-frutal-kiwi/10 border-frutal-kiwi/40'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-frutal-mora" />
                    <span className="font-bold text-gray-800">{m.clienteNombre}</span>
                    {!m.leido && <span className="px-2 py-0.5 rounded-full bg-frutal-fresa text-white text-xs">Nuevo</span>}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Mail className="w-4 h-4" />
                    {m.clienteEmail}
                  </div>
                  <p className="text-gray-700">{m.mensaje}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(m.createdAt).toLocaleString()}</p>
                </div>
                {!m.leido && (
                  <button onClick={() => markAsRead(m.id)} className="p-2 rounded-lg bg-frutal-kiwi/30 text-frutal-kiwi hover:bg-frutal-kiwi/50 flex items-center gap-1 text-sm">
                    <Check className="w-4 h-4" /> Marcar leído
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
