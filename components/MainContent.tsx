'use client';

import { useLayout } from '@/context/LayoutContext';

export default function MainContent({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useLayout();
  return (
    <main
      className={`min-h-screen p-4 sm:p-6 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-[72px]' : 'ml-[280px]'
      } max-md:ml-0 max-md:pt-16`}
    >
      {children}
    </main>
  );
}
