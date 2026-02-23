'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '@/lib/api';
import AnimatedCard from '@/components/AnimatedCard';
import { DollarSign, ShoppingBag, TrendingDown, TrendingUp, Loader2 } from 'lucide-react';

const CARD_GRADIENTS = [
  'from-frutal-fresa to-frutal-sandia',
  'from-frutal-kiwi to-frutal-limon',
  'from-frutal-mora to-frutal-uva',
  'from-frutal-naranja to-frutal-mango',
  'from-frutal-banana to-frutal-mango',
];

export default function DashboardPage() {
  const [utilidad, setUtilidad] = useState<any>(null);
  const [masVendidos, setMasVendidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [u, v] = await Promise.all([
          api.getUtilidad().catch(() => null),
          api.getMasVendidos(10).catch(() => []),
        ]);
        setUtilidad(u);
        setMasVendidos(Array.isArray(v) ? v : []);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-12 h-12 text-frutal-mora" />
        </motion.div>
      </div>
    );
  }

  const ventasTotales = utilidad?.ventas_totales ?? 0;
  const gastos = utilidad?.costos_totales ?? 0;
  const ganancia = utilidad?.utilidad ?? 0;
  const batidosVendidos = utilidad?.cantidad_vendida ?? masVendidos.reduce((s, i) => s + (i.cantidad_vendida || 0), 0);
  const inversion = gastos;

  const financialCards = [
    { title: 'Ventas Totales', value: `$${ventasTotales.toFixed(2)}`, icon: DollarSign, gradient: CARD_GRADIENTS[0] },
    { title: 'Batidos Vendidos', value: batidosVendidos.toString(), icon: ShoppingBag, gradient: CARD_GRADIENTS[1] },
    { title: 'Gastos', value: `$${gastos.toFixed(2)}`, icon: TrendingDown, gradient: CARD_GRADIENTS[2] },
    { title: 'Inversión', value: `$${inversion.toFixed(2)}`, icon: TrendingUp, gradient: CARD_GRADIENTS[3] },
    { title: 'Utilidad', value: `$${ganancia.toFixed(2)}`, icon: TrendingUp, gradient: CARD_GRADIENTS[4] },
  ];

  const COLORS = ['#E53935', '#558B2F', '#7B1FA2', '#E65100', '#E89500', '#4A148C', '#E91E63', '#8BC34A'];

  return (
    <div className="space-y-8 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-gray-800">
        Dashboard
      </motion.h1>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-100 text-red-700 rounded-xl">
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {financialCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <AnimatedCard key={card.title} delay={i * 0.1} gradient={card.gradient}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/90 text-sm font-medium">{card.title}</p>
                  <p className="text-2xl font-bold mt-1">{card.value}</p>
                </div>
                <Icon className="w-10 h-10 text-white/80" />
              </div>
            </AnimatedCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-frutal-mango/30"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Batidos más vendidos</h2>
          {masVendidos.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={masVendidos}>
                  <XAxis dataKey="nombre_batido" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cantidad_vendida" fill="#7B1FA2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 py-8 text-center">No hay datos de ventas aún</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6 border-2 border-frutal-mango/30"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Distribución de ventas</h2>
          {masVendidos.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={masVendidos}
                    dataKey="cantidad_vendida"
                    nameKey="nombre_batido"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ nombre_batido, cantidad_vendida }) => `${nombre_batido}: ${cantidad_vendida}`}
                  >
                    {masVendidos.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 py-8 text-center">No hay datos de ventas aún</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
