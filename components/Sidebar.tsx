'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '@/context/LayoutContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  ClipboardList,
  AlertTriangle,
  Utensils,
  BarChart3,
  Search,
  ChevronLeft,
  Menu,
  Users,
  LogOut,
} from 'lucide-react';

const MODULOS: { href: string; label: string; icon: any; permission: string }[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard' },
  { href: '/admin/pos', label: 'Punto de Venta', icon: ShoppingCart, permission: 'pos' },
  { href: '/admin/inventario-materia-prima', label: 'Inventario Materia Prima', icon: Package, permission: 'inventario-materia-prima' },
  { href: '/admin/inventario-preparacion', label: 'Inventario Preparación', icon: Utensils, permission: 'inventario-preparacion' },
  { href: '/admin/inventario-venta', label: 'Inventario de Venta', icon: BarChart3, permission: 'inventario-venta' },
  { href: '/admin/produccion', label: 'Producción', icon: Package, permission: 'produccion' },
  { href: '/admin/planificacion', label: 'Planificación', icon: ClipboardList, permission: 'planificacion' },
  { href: '/admin/alertas', label: 'Alertas Caducidad', icon: AlertTriangle, permission: 'alertas' },
  { href: '/admin/usuarios', label: 'Usuarios y Clientes', icon: Users, permission: 'usuarios' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useLayout();
  const { user, logout, hasPermission } = useAuth();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const filteredModulos = MODULOS.filter((m) => {
    if (!hasPermission(m.permission as any)) return false;
    return m.label.toLowerCase().includes(search.toLowerCase());
  });

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border-2 border-frutal-mango/50"
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6 text-frutal-mora" />
      </button>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 280 }}
        className={`fixed left-0 top-0 z-40 h-screen bg-white shadow-xl border-r-2 border-frutal-mango/40 flex flex-col transition-transform md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b-2 border-frutal-mango/30">
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-frutal-fresa to-frutal-mora bg-clip-text text-transparent">
                Zas! Frut
              </span>
            </motion.div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
            className="p-2 rounded-lg hover:bg-frutal-mango/30 transition-colors"
          >
            <ChevronLeft className={`w-5 h-5 text-frutal-mora transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-frutal-mora" />
              <input
                type="text"
                placeholder="Buscar módulos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border-2 border-frutal-mango/40 focus:ring-2 focus:ring-frutal-mora/30 focus:border-frutal-mora outline-none text-sm"
              />
            </div>
          </motion.div>
        )}

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <AnimatePresence mode="wait">
            {filteredModulos.map((mod, i) => {
              const Icon = mod.icon;
              const isActive = pathname === mod.href || pathname.startsWith(mod.href + '/');
              const showBadge = mod.permission === 'usuarios' && unreadCount > 0;
              return (
                <motion.div key={mod.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link
                    href={mod.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative ${
                      isActive
                        ? 'bg-gradient-to-r from-frutal-fresa to-frutal-mora text-white shadow-lg'
                        : 'hover:bg-frutal-mango/30 text-gray-700'
                    }`}
                  >
                    <span className="relative">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {showBadge && (
                        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-frutal-fresa text-white text-[10px] font-bold">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </span>
                    {!collapsed && <span className="font-medium truncate">{mod.label}</span>}
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </nav>

        {!collapsed && user && (
          <div className="p-3 border-t-2 border-frutal-mango/30">
            <p className="text-xs text-gray-500 truncate px-2">{user.email}</p>
            <button
              onClick={handleLogout}
              className="w-full mt-2 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-100 text-red-600 font-medium"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
}
