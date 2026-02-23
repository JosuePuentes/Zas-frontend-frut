# Zas! Frut - Frontend

Frontend Next.js para tienda de batidos. Conectado al backend en `https://zas-backend-frut.onrender.com`.

## Stack

- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion (animaciones)
- Recharts (gráficos)
- Lucide React (iconos)

## Variables de entorno

Crear `.env.local`:

```
NEXT_PUBLIC_API_URL=https://zas-backend-frut.onrender.com
```

## Desarrollo

```bash
npm install
npm run dev
```

## Build y deploy (Vercel)

```bash
npm run build
```

En Vercel, configurar la variable `NEXT_PUBLIC_API_URL` en el proyecto.

## Módulos

- **Dashboard**: Cifras financieras, ventas, utilidad, batidos más vendidos
- **Punto de Venta (POS)**: Buscador, extras, carrito, cerrar venta
- **Inventario Materia Prima**: Listado con animaciones
- **Inventario Preparación**: Stock de batidos listos
- **Inventario Venta**: Datos de ventas
- **Producción**: Procesar dosis de recetas
- **Planificación**: Lista de compras (stock bajo mínimo)
- **Alertas**: Caducidad de materia prima
