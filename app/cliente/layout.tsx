'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SupportButton from '@/components/SupportButton';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, Coffee, ShoppingBag, MapPin } from 'lucide-react';
import CartFloatingButton from '@/components/CartFloatingButton';

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
    <div className="min-h-screen bg-gradient-to-br from-superfruty-yellow/10 via-white to-superfruty-black/5">
      <header className="bg-white shadow-md border-b-2 border-superfruty-yellow">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/cliente" className="flex items-center gap-2">
            <Image src="/logo-super-fruty.png" alt="Super Fruty" width={40} height={40} className="object-contain" />
            <span className="text-xl font-bold text-superfruty-black">Super Fruty</span>
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

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-superfruty-yellow flex justify-around py-2 z-40">
        <Link
          href="/cliente"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl ${pathname === '/cliente' ? 'bg-superfruty-yellow/20 text-superfruty-black' : 'text-gray-600'}`}
        >
          <Coffee className="w-6 h-6" />
          <span className="text-xs font-medium">Catálogo</span>
        </Link>
        <Link
          href="/cliente/pedidos"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl ${pathname === '/cliente/pedidos' ? 'bg-superfruty-yellow/20 text-superfruty-black' : 'text-gray-600'}`}
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-xs font-medium">Mis pedidos</span>
        </Link>
        <Link
          href="/cliente/sucursales"
          className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl ${pathname === '/cliente/sucursales' ? 'bg-superfruty-yellow/20 text-superfruty-black' : 'text-gray-600'}`}
        >
          <MapPin className="w-6 h-6" />
          <span className="text-xs font-medium">Sucursales</span>
        </Link>
      </nav>

      <CartFloatingButton />
      <SupportButton />
    </div>
  );
}
