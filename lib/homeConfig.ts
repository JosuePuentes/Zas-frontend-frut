/**
 * Configuración de banners y promociones del home.
 * Edita las URLs de las imágenes para agregar tus propias fotos de promociones.
 */

/** Noticias/notificaciones para la barra superior (editar en NewsBar o pasar como prop) */
export const NOTICIAS_DIARIA = [
  '¡Bienvenidos a Super Fruty! Batidos frescos todos los días.',
  '🎉 2x1 en batidos de mango los martes',
  'Nuevos sabores: Maracuyá, Guanábana y Piña Colada',
  'Horario: Lunes a Sábado 8am - 8pm',
  'Síguenos en redes para más promociones',
];

export interface PromoBanner {
  id: string;
  imagen: string;
  titulo: string;
  subtitulo?: string;
  enlace?: string;
}

export const BANNERS_PROMO: PromoBanner[] = [
  {
    id: '1',
    imagen: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&q=80',
    titulo: '2x1 en Batidos',
    subtitulo: 'Martes y Jueves',
    enlace: '/registro',
  },
  {
    id: '2',
    imagen: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&q=80',
    titulo: 'Nuevos Sabores',
    subtitulo: 'Maracuyá, Guanábana, Piña Colada',
    enlace: '/registro',
  },
  {
    id: '3',
    imagen: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=800&q=80',
    titulo: 'Batidos Naturales',
    subtitulo: '100% fruta fresca',
    enlace: '/registro',
  },
];

export const PANELES_PUBLICIDAD: PromoBanner[] = [
  {
    id: 'p1',
    imagen: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&q=80',
    titulo: 'Promo Mango',
    subtitulo: '¡Pruébalo hoy!',
  },
  {
    id: 'p2',
    imagen: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&q=80',
    titulo: 'Combo Familiar',
    subtitulo: '4 batidos al precio de 3',
  },
  {
    id: 'p3',
    imagen: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=600&q=80',
    titulo: 'Fresas de Temporada',
    subtitulo: 'Batido especial',
  },
];
