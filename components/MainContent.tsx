'use client';

import { useLayout } from '@/context/LayoutContext';
import AdminHeader from './AdminHeader';

export default function MainContent({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useLayout();
  return (
    <main
      className={`min-h-screen transition-all duration-300 bg-gray-100 ${
        sidebarCollapsed ? 'ml-[72px]' : 'ml-[280px]'
      } max-md:ml-0 max-md:pt-16`}
    >
      <header className="sticky top-0 z-30 flex items-center justify-end gap-4 px-4 sm:px-6 py-3 bg-white/95 backdrop-blur border-b-2 border-frutal-mango/20">
        <AdminHeader />
      </header>
      <div className="p-4 sm:p-6">{children}</div>
    </main>
  );
}
