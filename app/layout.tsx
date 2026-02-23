import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { HomeConfigProvider } from '@/context/HomeConfigContext';
import { SupportProvider } from '@/context/SupportContext';

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
        <NotificationsProvider>
          <SupportProvider>
            <HomeConfigProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </HomeConfigProvider>
          </SupportProvider>
        </NotificationsProvider>
      </body>
    </html>
  );
}
