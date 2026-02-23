'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '@/context/LayoutContext';
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
} from 'lucide-react';

const MODULOS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pos', label: 'Punto de Venta', icon: ShoppingCart },
  { href: '/inventario-materia-prima', label: 'Inventario Materia Prima', icon: Package },
  { href: '/inventario-preparacion', label: 'Inventario Preparación', icon: Utensils },
  { href: '/inventario-venta', label: 'Inventario de Venta', icon: BarChart3 },
  { href: '/produccion', label: 'Producción', icon: Package },
  { href: '/planificacion', label: 'Planificación', icon: ClipboardList },
  { href: '/alertas', label: 'Alertas Caducidad', icon: AlertTriangle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { sidebarCollapsed: collapsed, setSidebarCollapsed: setCollapsed } = useLayout();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const filteredModulos = MODULOS.filter((m) =>
    m.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border border-frutal-mango/30"
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6 text-frutal-mora" />
      </button>
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 280 }}
      className={`fixed left-0 top-0 z-40 h-screen bg-white/95 backdrop-blur shadow-xl border-r border-frutal-mango/30 flex flex-col transition-transform md:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="p-4 flex items-center justify-between border-b border-frutal-mango/20">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-frutal-fresa to-frutal-mora bg-clip-text text-transparent">
              Zas! Frut
            </span>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          className="p-2 rounded-lg hover:bg-frutal-mango/20 transition-colors"
        >
          <ChevronLeft
            className={`w-5 h-5 text-frutal-mora transition-transform ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-frutal-mora/60" />
            <input
              type="text"
              placeholder="Buscar módulos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-frutal-mango/30 focus:ring-2 focus:ring-frutal-mora/30 focus:border-frutal-mora outline-none text-sm"
            />
          </div>
        </motion.div>
      )}

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <AnimatePresence mode="wait">
          {filteredModulos.map((mod, i) => {
            const Icon = mod.icon;
            const isActive = pathname === mod.href || (mod.href !== '/' && pathname.startsWith(mod.href));
            return (
              <motion.div
                key={mod.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={mod.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-frutal-fresa to-frutal-mora text-white shadow-lg shadow-frutal-mora/30'
                      : 'hover:bg-frutal-mango/20 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium truncate">{mod.label}</span>}
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </nav>
    </motion.aside>
    </>
  );
}
