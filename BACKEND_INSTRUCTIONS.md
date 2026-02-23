# Instrucciones para el Backend - Zas! Frut

El frontend actualmente usa **localStorage** para usuarios, clientes y notificaciones. Para producción, necesitas implementar estos endpoints en tu backend.

---

## 1. Modelo de Usuario/Cliente

```javascript
// Ejemplo en MongoDB/Mongoose
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hash con bcrypt
  nombre: { type: String, required: true },
  telefono: { type: String, default: '' },
  rol: { type: String, enum: ['cliente', 'admin', 'super_admin'], required: true },
  permisos: [{ type: String }], // para admin: ['dashboard', 'pos', 'inventario-materia-prima', ...]
  createdAt: { type: Date, default: Date.now }
});
```

---

## 2. Endpoints de Autenticación

### POST /auth/register
Registro de clientes y administradores.

**Body:**
```json
{
  "email": "cliente@ejemplo.com",
  "password": "password123",
  "nombre": "Juan Pérez",
  "telefono": "+58 412 1234567",
  "rol": "cliente"  // o "admin"
}
```

**Response:** `{ "user": {...}, "token": "jwt..." }` o `{ "ok": true }`

**Al registrar un cliente:** Emitir evento/crear notificación para que los admins la vean.

---

### POST /auth/login
Inicio de sesión (solo admin/super_admin).

**Body:**
```json
{
  "email": "admin@zas.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { "id", "email", "nombre", "rol", "permisos" },
  "token": "jwt..."
}
```

---

### POST /auth/logout (opcional)
Invalidar token.

---

## 3. Endpoints de Usuarios (protegidos, solo admin)

### GET /users
Listar todos los usuarios (clientes y admins).

**Headers:** `Authorization: Bearer <token>`

**Response:** `[{ id, email, nombre, telefono, rol, permisos, createdAt }]`

---

### POST /users
Crear usuario o cliente (desde el módulo admin).

**Body:**
```json
{
  "email": "nuevo@ejemplo.com",
  "password": "password123",
  "nombre": "María García",
  "telefono": "+58 414 9876543",
  "rol": "cliente",  // o "admin" o "super_admin"
  "permisos": ["dashboard", "pos", "usuarios"]  // solo si rol es admin
}
```

### GET /users/:id
Obtener un usuario por ID.

---

## 4. Notificaciones

### Modelo de Notificación
```javascript
const notificationSchema = new Schema({
  tipo: { type: String }, // 'nuevo_cliente', etc.
  mensaje: { type: String },
  adminId: { type: ObjectId }, // a quién le llega (opcional)
  leida: { type: Boolean, default: false },
  data: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});
```

### GET /notifications
Obtener notificaciones del admin logueado.

**Headers:** `Authorization: Bearer <token>`

**Query:** `?leidas=false` (opcional, para filtrar no leídas)

**Response:** `[{ id, tipo, mensaje, leida, data, createdAt }]`

---

### PATCH /notifications/:id/read
Marcar notificación como leída.

---

### PATCH /notifications/read-all
Marcar todas como leídas.

---

### Lógica al registrar cliente
Cuando se llame `POST /auth/register` con `rol: "cliente"`:

1. Crear el usuario en la base de datos
2. Crear una notificación: `{ tipo: 'nuevo_cliente', mensaje: 'Nuevo cliente registrado: Juan Pérez', data: { userId, nombre, email } }`
3. Opcional: usar WebSockets o Server-Sent Events para enviar la notificación en tiempo real a los admins conectados

---

## 5. Integración en el Frontend

### Variables de entorno
```
NEXT_PUBLIC_API_URL=https://zas-backend-frut.onrender.com
```

### Cambios necesarios en el frontend
1. Reemplazar las llamadas a localStorage en `AuthContext` por `fetch` a los endpoints arriba
2. Reemplazar `NotificationsContext` para que consuma `GET /notifications` y `PATCH /notifications/:id/read`
3. En `register()` y `createUser()`: enviar `telefono` en el body
4. Guardar el token JWT en localStorage o cookie y enviarlo en el header `Authorization` en todas las peticiones al backend

---

## 6. Resumen de endpoints nuevos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /auth/register | Registro |
| POST | /auth/login | Login |
| GET | /users | Listar usuarios |
| POST | /users | Crear usuario |
| GET | /notifications | Listar notificaciones |
| PATCH | /notifications/:id/read | Marcar leída |
| PATCH | /notifications/read-all | Marcar todas leídas |

---

## 7. Permisos por módulo

Los módulos que pueden asignarse a un admin son:
- `dashboard`
- `pos`
- `inventario-materia-prima`
- `inventario-preparacion`
- `inventario-venta`
- `produccion`
- `planificacion`
- `alertas`
- `usuarios`

En el backend, validar que el usuario tenga el permiso correspondiente antes de permitir acceso a cada módulo/funcionalidad.
