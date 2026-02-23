import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { LayoutProvider } from '@/context/LayoutContext';
import MainContent from '@/components/MainContent';

export const metadata: Metadata = {
  title: 'Zas! Frut - Tienda de Batidos',
  description: 'Sistema de gestión para tienda de batidos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <LayoutProvider>
          <Sidebar />
          <MainContent>{children}</MainContent>
        </LayoutProvider>
      </body>
    </html>
  );
}
