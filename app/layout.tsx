import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { HomeConfigProvider } from '@/context/HomeConfigContext';
import { SupportProvider } from '@/context/SupportContext';
import { CartProvider } from '@/context/CartContext';
import { SucursalProvider } from '@/context/SucursalContext';

export const metadata: Metadata = {
  title: 'Super Fruty - Tienda de Batidos',
  description: 'Super Fruty - Batidos frescos, naturales y deliciosos',
  icons: {
    icon: '/logo-super-fruty.png',
    apple: '/logo-super-fruty.png',
  },
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
                <SucursalProvider>
                  <CartProvider>
                    {children}
                  </CartProvider>
                </SucursalProvider>
              </AuthProvider>
            </HomeConfigProvider>
          </SupportProvider>
        </NotificationsProvider>
      </body>
    </html>
  );
}
