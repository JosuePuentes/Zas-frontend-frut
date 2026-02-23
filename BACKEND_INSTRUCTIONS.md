# Instrucciones para el Backend - Zas! Frut

El frontend usa **localStorage** para usuarios, anuncios, banners y mensajes de soporte. Para producción, implementa estos endpoints en tu backend.

---

## 1. Modelo de Usuario/Cliente

```javascript
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  usuario: { type: String, sparse: true }, // Solo para admin - nombre de usuario para login
  password: { type: String, required: true }, // hash con bcrypt
  nombre: { type: String, required: true },
  telefono: { type: String, default: '' },
  rol: { type: String, enum: ['cliente', 'admin', 'super_admin'], required: true },
  permisos: [{ type: String }], // para admin
  createdAt: { type: Date, default: Date.now }
});
```

**Importante:** 
- **Clientes** inician sesión con **correo (email)** + contraseña
- **Administradores** inician sesión con **usuario** + contraseña
- El campo `usuario` es obligatorio para admin/super_admin, opcional para cliente

---

## 2. Login diferenciado

### POST /auth/login

**Body (admin):**
```json
{
  "identificador": "admin",
  "password": "password123",
  "tipo": "admin"
}
```

**Body (cliente):**
```json
{
  "identificador": "cliente@email.com",
  "password": "password123",
  "tipo": "cliente"
}
```

- Si `tipo: "admin"` → buscar por `usuario` (o email como fallback)
- Si `tipo: "cliente"` → buscar por `email`
- Response: `{ user: {...}, token: "jwt..." }`

---

## 3. Registro

### POST /auth/register

**Body:**
```json
{
  "email": "cliente@ejemplo.com",
  "password": "password123",
  "nombre": "Juan Pérez",
  "telefono": "+58 412 1234567",
  "rol": "cliente",
  "usuario": "admin"  // Solo si rol es "admin"
}
```

- Si `rol: "cliente"` → redirigir a `/cliente`
- Si `rol: "admin"` → crear con `usuario`, redirigir a `/admin/dashboard`

---

## 4. Anuncios y Banners del Home

### Modelos

```javascript
const anuncioSchema = new Schema({
  texto: { type: String, required: true },
  orden: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const bannerSchema = new Schema({
  imagen: { type: String, required: true },
  titulo: { type: String },
  subtitulo: { type: String },
  enlace: { type: String },
  orden: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
```

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /home/anuncios | Listar anuncios (público) |
| GET | /home/banners | Listar banners (público) |
| GET | /home/paneles | Listar paneles publicidad (público) |
| POST | /admin/anuncios | Crear anuncio (protegido) |
| PUT | /admin/anuncios/:id | Actualizar anuncio |
| DELETE | /admin/anuncios/:id | Eliminar anuncio |
| POST | /admin/banners | Crear banner |
| PUT | /admin/banners/:id | Actualizar banner |
| DELETE | /admin/banners/:id | Eliminar banner |
| POST | /admin/paneles | Crear panel |
| PUT | /admin/paneles/:id | Actualizar panel |
| DELETE | /admin/paneles/:id | Eliminar panel |

---

## 5. Mensajes de Soporte

### Modelo

```javascript
const supportMessageSchema = new Schema({
  clienteId: { type: ObjectId, ref: 'User', required: true },
  clienteNombre: { type: String, required: true },
  clienteEmail: { type: String, required: true },
  mensaje: { type: String, required: true },
  leido: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
```

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /soporte | Cliente envía mensaje (requiere token de cliente) |
| GET | /admin/soporte | Listar mensajes (protegido, solo admin) |
| PATCH | /admin/soporte/:id/read | Marcar como leído |

---

## 6. Compras del Cliente

Para "Mis compras" en el área cliente, asociar cada venta con el `clienteId` cuando el cliente esté logueado.

### Modificar POST /sales

**Body actual:**
```json
{
  "items": [...],
  "clienteId": "id_del_cliente"  // Añadir cuando el cliente hace un pedido
}
```

### GET /cliente/compras

Listar ventas donde `clienteId` coincide con el usuario logueado.

**Headers:** `Authorization: Bearer <token>` (token de cliente)

**Response:** `[{ id, fecha, total, items: [...] }]`

---

## 7. Resumen de endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /auth/register | Registro (incluir usuario si rol admin) |
| POST | /auth/login | Login (tipo: admin o cliente) |
| GET | /users | Listar usuarios |
| POST | /users | Crear usuario |
| GET | /notifications | Notificaciones admin |
| PATCH | /notifications/:id/read | Marcar leída |
| GET | /home/anuncios | Anuncios barra superior |
| GET | /home/banners | Banners carrusel |
| GET | /home/paneles | Paneles publicidad |
| POST | /admin/anuncios | Crear anuncio |
| POST | /admin/banners | Crear banner |
| POST | /admin/paneles | Crear panel |
| POST | /soporte | Mensaje de soporte (cliente) |
| GET | /admin/soporte | Mensajes soporte |
| PATCH | /admin/soporte/:id/read | Marcar leído |
| GET | /cliente/compras | Compras del cliente |

---

## 8. Permisos por módulo

- `dashboard`, `pos`, `inventario-materia-prima`, `inventario-preparacion`, `inventario-venta`
- `produccion`, `planificacion`, `alertas`, `usuarios`, `anuncios`

---

## 9. Sucursales (Multi-sucursal)

### Modelo Sucursal

```javascript
const sucursalSchema = new Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  telefono: { type: String },
  activa: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
```

### Modelo Usuario (actualizado)

Añadir a User:
- `sucursalId: { type: ObjectId, ref: 'Sucursal' }` - Para admin/super_admin, indica a qué sucursal pertenecen
- `rol: { enum: ['cliente', 'admin', 'super_admin', 'master'] }` - Nuevo rol `master`
- `ubicacion: { lat, lng, direccion }` - Para clientes (geolocalización para delivery)

El **usuario master** no tiene `sucursalId` y puede ver todas las sucursales, agregar sucursales (con PIN) y ver finanzas globales.

### PIN de verificación para sucursales

- Almacenar `masterPin` (hash) en configuración global
- Solo el usuario master puede agregar sucursales
- POST /admin/sucursales requiere header `X-Master-PIN` o body `{ pin: "1234", ...sucursal }`

### Endpoints Sucursales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /sucursales | Listar sucursales activas (público para mapa cliente) |
| GET | /admin/sucursales | Listar todas (solo master) |
| POST | /admin/sucursales | Crear sucursal (solo master, requiere PIN) |
| PUT | /admin/sucursales/:id | Actualizar sucursal |
| PATCH | /admin/sucursales/:id/activa | Activar/desactivar |

### Pedidos con sucursal

- Cada pedido tiene `sucursalId` (asignado automáticamente por cercanía o manualmente por admin)
- Al crear pedido online: calcular sucursal más cercana a `ubicacionEntrega` del cliente
- GET /admin/pedidos?estado=pendiente&sucursalId=xxx - Filtrar por sucursal para admins no-master
- Master ve todos los pedidos; admin de sucursal solo los de su sucursal

### Inventario, ventas y finanzas por sucursal

- Inventario materia prima, preparación, ventas: asociar a `sucursalId`
- Cada sucursal tiene su propio inventario
- GET /admin/finanzas-global - Solo master: suma de ventas/finanzas de todas las sucursales
- GET /reports/utilidad?sucursalId=xxx - Finanzas de una sucursal

### Algoritmo sucursal más cercana

```javascript
function sucursalMasCercana(latCliente, lngCliente, sucursales) {
  let minDist = Infinity, nearest = null;
  for (const s of sucursales) {
    const d = haversine(latCliente, lngCliente, s.lat, s.lng);
    if (d < minDist) { minDist = d; nearest = s; }
  }
  return nearest;
}
```

---

## 10. Integración Frontend

1. Reemplazar `AuthContext` login: llamar `POST /auth/login` con `identificador`, `password`, `tipo`
2. Reemplazar `HomeConfigContext` por fetch a `/home/anuncios`, `/home/banners`, `/home/paneles`
3. Reemplazar `SupportContext` por `POST /soporte` y `GET /admin/soporte`
4. Reemplazar `SucursalContext` por fetch a `/sucursales` y `/admin/sucursales`
5. En ventas POS: si hay cliente logueado, enviar `clienteId` en el body
6. Área cliente: consumir `GET /cliente/compras` para "Mis compras"
7. Pedidos: incluir `sucursalId` al crear; backend asigna por cercanía o admin asigna manualmente
8. Usuarios admin: incluir `sucursalId` al crear (excepto master)
