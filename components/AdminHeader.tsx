'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useNotifications } from '@/context/NotificationsContext';
import { Bell } from 'lucide-react';

export default function AdminHeader() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-frutal-mango/20 transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-6 h-6 text-frutal-mora" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-frutal-fresa text-white text-xs font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-white rounded-2xl shadow-2xl border-2 border-frutal-mango/30 overflow-hidden z-50">
          <div className="p-4 border-b-2 border-frutal-mango/20 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-frutal-mora font-medium hover:underline"
              >
                Marcar todas leídas
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-500 text-sm text-center">No hay notificaciones</p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href="/admin/usuarios"
                  onClick={() => {
                    markAsRead(n.id);
                    setOpen(false);
                  }}
                  className={`block p-4 border-b border-gray-100 hover:bg-frutal-mango/10 transition-colors ${!n.leida ? 'bg-frutal-kiwi/5' : ''}`}
                >
                  <p className="font-medium text-gray-800">{n.mensaje}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(n.createdAt).toLocaleString('es')}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
