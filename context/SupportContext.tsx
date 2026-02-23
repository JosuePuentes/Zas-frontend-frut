'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SupportMessage {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  mensaje: string;
  leido: boolean;
  createdAt: string;
}

const SUPPORT_KEY = 'zas_support_messages';

function loadMessages(): SupportMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const s = localStorage.getItem(SUPPORT_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function saveMessages(m: SupportMessage[]) {
  localStorage.setItem(SUPPORT_KEY, JSON.stringify(m));
}

const SupportContext = createContext<{
  messages: SupportMessage[];
  sendMessage: (clienteId: string, clienteNombre: string, clienteEmail: string, mensaje: string) => void;
  markAsRead: (id: string) => void;
  unreadCount: number;
}>(null as any);

export function SupportProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<SupportMessage[]>(() => loadMessages());

  useEffect(() => {
    const handler = (e: CustomEvent<{ clienteId: string; clienteNombre: string; clienteEmail: string; mensaje: string }>) => {
      if (typeof e.detail === 'undefined') return;
      const { clienteId, clienteNombre, clienteEmail, mensaje } = e.detail;
      const newMsg: SupportMessage = {
        id: crypto.randomUUID(),
        clienteId,
        clienteNombre,
        clienteEmail,
        mensaje,
        leido: false,
        createdAt: new Date().toISOString(),
      };
      setMessages((p) => {
        const next = [newMsg, ...p];
        saveMessages(next);
        return next;
      });
    };
    window.addEventListener('zas:soporte-mensaje', handler as EventListener);
    return () => window.removeEventListener('zas:soporte-mensaje', handler as EventListener);
  }, []);

  const sendMessage = (clienteId: string, clienteNombre: string, clienteEmail: string, mensaje: string) => {
    const newMsg: SupportMessage = {
      id: crypto.randomUUID(),
      clienteId,
      clienteNombre,
      clienteEmail,
      mensaje,
      leido: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((p) => {
      const next = [newMsg, ...p];
      saveMessages(next);
      return next;
    });
  };

  const markAsRead = (id: string) => {
    setMessages((p) => {
      const next = p.map((m) => (m.id === id ? { ...m, leido: true } : m));
      saveMessages(next);
      return next;
    });
  };

  const unreadCount = messages.filter((m) => !m.leido).length;

  return (
    <SupportContext.Provider value={{ messages, sendMessage, markAsRead, unreadCount }}>
      {children}
    </SupportContext.Provider>
  );
}

export function useSupport() {
  const ctx = useContext(SupportContext);
  if (!ctx) throw new Error('useSupport must be used within SupportProvider');
  return ctx;
}
