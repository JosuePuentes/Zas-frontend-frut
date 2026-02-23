'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SupportButton from '@/components/SupportButton';
import Link from 'next/link';
import { LogOut, Gift, ShoppingBag } from 'lucide-react';

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, ready, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user) {
      router.push('/login');
      return;
    }
    if (ready && user && user.rol !== 'cliente') {
      router.push('/admin/dashboard');
    }
  }, [user, ready, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!ready || !user) return null;
  if (user.rol !== 'cliente') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-frutal-kiwi/20 via-white to-frutal-mango/20">
      <header className="bg-white shadow-md border-b-2 border-frutal-mango/20">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/cliente" className="text-xl font-bold text-frutal-mora">
            Zas! Frut
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:inline">{user.nombre}</span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-100 text-red-600"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-frutal-mango/20 flex justify-around py-2 z-40">
        <Link
          href="/cliente"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl ${pathname === '/cliente' ? 'bg-frutal-kiwi/20 text-frutal-kiwi' : 'text-gray-600'}`}
        >
          <Gift className="w-6 h-6" />
          <span className="text-xs font-medium">Promociones</span>
        </Link>
        <Link
          href="/cliente/compras"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl ${pathname === '/cliente/compras' ? 'bg-frutal-kiwi/20 text-frutal-kiwi' : 'text-gray-600'}`}
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-xs font-medium">Mis compras</span>
        </Link>
      </nav>

      <SupportButton />
    </div>
  );
}
