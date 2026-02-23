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
  rol: { type: String, enum: ['cliente', 'admin', 'super_admin', 'master'], required: true },
  permisos: [{ type: String }], // para admin
  sucursalId: { type: ObjectId, ref: 'Sucursal' }, // admin/super_admin: sucursal asignada; master no tiene
  ubicacion: { lat: Number, lng: Number, direccion: String }, // clientes: para delivery
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

## 3. Registro de clientes

### POST /auth/register

**Solo para clientes.** La página pública de registro (/registro) únicamente crea cuentas de cliente. Los usuarios administrativos se crean desde el área admin (Usuarios y Clientes).

**Body:**
```json
{
  "email": "cliente@ejemplo.com",
  "password": "password123",
  "nombre": "Juan Pérez",
  "telefono": "+58 412 1234567",
  "ubicacion": { "lat": 10.64, "lng": -71.61, "direccion": "..." }
}
```

- `ubicacion` es **obligatorio** para poder hacer pedidos con delivery
- Response: `{ user: {...}, token: "jwt..." }`
- Redirigir a `/cliente` tras registro exitoso

---

## 3b. Crear usuarios (área administrativa)

Los administradores crean tanto **clientes** como **usuarios administrativos** desde el módulo Usuarios y Clientes.

### POST /users (protegido, solo admin)

**Body (crear cliente):**
```json
{
  "email": "cliente@ejemplo.com",
  "password": "password123",
  "nombre": "Juan Pérez",
  "telefono": "+58 412 1234567",
  "rol": "cliente",
  "ubicacion": { "lat": 10.64, "lng": -71.61, "direccion": "..." }
}
```

**Body (crear administrador):**
```json
{
  "email": "admin@ejemplo.com",
  "password": "password123",
  "nombre": "María Admin",
  "telefono": "+58 412 1234567",
  "rol": "admin",
  "usuario": "maria_admin",
  "permisos": ["dashboard", "pos", "pedidos", "inventario-materia-prima", ...],
  "sucursalId": "id_de_la_sucursal"
}
```

**Body (crear master):**
```json
{
  "rol": "master",
  "usuario": "nuevo_master",
  ...
}
```
- El rol `master` no tiene `sucursalId`
- Solo un master/super_admin puede crear otro master

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

## 6. Pedidos Online (área cliente)

El cliente hace pedidos desde el catálogo, selecciona delivery o recoger, elige método de pago y envía comprobante.

### Modelo Pedido

```javascript
const orderSchema = new Schema({
  clienteId: { type: ObjectId, ref: 'User', required: true },
  clienteNombre: { type: String, required: true },
  clienteEmail: { type: String, required: true },
  clienteTelefono: { type: String },
  items: [{
    recipe_id: String,
    nombre_batido: String,
    cantidad: Number,
    precio_unitario: Number,
    extras: [{ materia_prima_id: String, nombre: String, cantidad: Number, precio_extra: Number }],
    costo_envase: Number
  }],
  subtotal: Number,
  delivery: Boolean,
  montoDelivery: Number,
  total: Number,
  direccionEntrega: String,
  ubicacionEntrega: { lat: Number, lng: Number },
  sucursalId: { type: ObjectId, ref: 'Sucursal' },
  metodoPago: { type: String, enum: ['zelle', 'pago_movil', 'transferencia', 'binance'] },
  referenciaPago: String,
  bancoEmisor: String,
  comprobanteUrl: String,
  estado: { type: String, enum: ['pendiente', 'verificado', 'preparacion', 'envio', 'entregado'], default: 'pendiente' },
  horaEstimadaEntrega: String,
  createdAt: { type: Date, default: Date.now }
});
```

### POST /pedidos (crear pedido online)

**Headers:** `Authorization: Bearer <token>` (token de cliente)

**Body:**
```json
{
  "items": [{ "recipe_id": "...", "nombre_batido": "...", "cantidad": 1, "precio_unitario": 5, "extras": [], "costo_envase": 0.5 }],
  "subtotal": 10,
  "delivery": true,
  "montoDelivery": 2.5,
  "total": 12.5,
  "direccionEntrega": "Av. 5 de Julio",
  "ubicacionEntrega": { "lat": 10.64, "lng": -71.61 },
  "metodoPago": "zelle",
  "referenciaPago": "123456",
  "bancoEmisor": "Banco de Venezuela"
}
```

- Asignar `sucursalId` automáticamente: sucursal más cercana a `ubicacionEntrega` (si delivery) o primera sucursal (si recoger).
- Si no hay ubicación, `sucursalId` puede ser null; el admin master lo asigna manualmente después.

### GET /cliente/pedidos

Listar pedidos del cliente logueado.

**Headers:** `Authorization: Bearer <token>`

**Response:** `[{ id, estado, total, items, horaEstimadaEntrega, createdAt, ... }]`

### PATCH /admin/pedidos/:id/estado

Cambiar estado: `verificado`, `preparacion`, `envio`, `entregado`. Al pasar a `envio`, opcional `horaEstimadaEntrega`.

### PATCH /admin/pedidos/:id/sucursal

Asignar sucursal (body: `{ sucursalId: "..." }`). Solo para pedidos sin sucursal.

### GET /admin/pedidos

Listar pedidos. Query params: `estado`, `sucursalId`. Master ve todos; admin de sucursal solo los de su `sucursalId`.

---

## 7. Resumen de endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /auth/register | Registro de clientes (ubicacion obligatoria) |
| POST | /auth/login | Login (tipo: admin o cliente) |
| GET | /users | Listar usuarios |
| POST | /users | Crear cliente o admin (desde área admin; sucursalId si admin) |
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
| POST | /pedidos | Crear pedido online (cliente) |
| GET | /cliente/pedidos | Mis pedidos (cliente) |
| GET | /admin/pedidos | Listar pedidos (filtro estado, sucursalId) |
| PATCH | /admin/pedidos/:id/estado | Cambiar estado pedido |
| PATCH | /admin/pedidos/:id/sucursal | Asignar sucursal a pedido |
| GET | /sucursales | Listar sucursales activas (público) |
| GET | /admin/sucursales | Listar todas (master) |
| POST | /admin/sucursales | Crear sucursal (master + PIN) |
| PUT | /admin/sucursales/:id | Actualizar sucursal |
| GET | /admin/finanzas-global | Finanzas consolidadas (master) |

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

1. **AuthContext**: `POST /auth/login` con `identificador`, `password`, `tipo`. Registro público solo clientes (con `ubicacion` obligatoria).
2. **HomeConfigContext**: fetch a `/home/anuncios`, `/home/banners`, `/home/paneles`
3. **SupportContext**: `POST /soporte` y `GET /admin/soporte`
4. **SucursalContext**: `GET /sucursales`, `GET /admin/sucursales`, `POST /admin/sucursales` (con PIN)
5. **CartContext**: `POST /pedidos` al crear orden; `GET /cliente/pedidos` para mis pedidos; `PATCH` para estado y sucursal
6. **Ventas POS**: enviar `clienteId` si hay cliente logueado
7. **Usuarios**: crear clientes y admins desde `/admin/usuarios`; incluir `sucursalId` al crear admin (excepto master)

---

## 11. Resumen de cambios implementados en el frontend

| Área | Funcionalidad |
|------|---------------|
| **Home** | Quiénes somos, Contacto, ¿Por qué elegirnos? |
| **Registro** | Cliente: activar ubicación obligatoria para delivery |
| **Login** | Admin con usuario, cliente con correo |
| **Área cliente** | Catálogo batidos, buscador, modal adicionales, carrito flotante |
| **Checkout** | Delivery/recoger, ubicación, métodos pago (Zelle, Pago Móvil, Transferencia, Binance), referencia, banco, comprobante |
| **Mis pedidos** | Lista con barra de estado (Pendiente→Verificado→Preparando→Envío→Entregado), hora estimada |
| **Sucursales (cliente)** | Mapa con puntos de venta, lista de sucursales |
| **Admin pedidos** | Pendientes, asignar sucursal, verificar |
| **Admin preparación** | Ver productos, adicionales, ubicación; marcar terminado |
| **Admin envío** | Ubicación entrega, marcar entregado, mapa Zulia |
| **Admin entregados** | Historial |
| **Admin sucursales** | CRUD (master + PIN) |
| **Admin finanzas global** | Total todas sucursales (master) |
| **Admin usuarios** | Crear con sucursal asignada |
