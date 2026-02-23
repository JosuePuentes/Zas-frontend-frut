'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: string;
  mensaje: string;
  data?: any;
  leida: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'zas_notifications';

function getStoredNotifications(): Notification[] {
  if (typeof window === 'undefined') return [];
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function saveNotifications(n: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(n));
}

const NotificationsContext = createContext<{
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: { type: string; mensaje: string; data?: any }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}>(null as any);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(getStoredNotifications());
    const handler = (e: CustomEvent<{ nombre: string; user: any }>) => {
      setNotifications((prev) => [
        {
          id: crypto.randomUUID(),
          type: 'nuevo_cliente',
          mensaje: `Nuevo cliente registrado: ${e.detail.nombre}`,
          data: e.detail.user,
          leida: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    };
    window.addEventListener('zas:cliente-registrado', handler as EventListener);
    return () => window.removeEventListener('zas:cliente-registrado', handler as EventListener);
  }, []);

  const addNotification = (n: { type: string; mensaje: string; data?: any }) => {
    const newNotif: Notification = {
      id: crypto.randomUUID(),
      type: n.type,
      mensaje: n.mensaje,
      data: n.data,
      leida: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.filter((n) => !n.leida).length;

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
