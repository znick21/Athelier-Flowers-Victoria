# Guía del Sistema — Atelier Flowers Victoria

## ¿Qué es este sistema?
Sistema web de gestión para una florería. Permite administrar productos, clientes, pedidos y pagos desde un panel con roles diferenciados.

---

## Tecnologías usadas

| Capa | Tecnología |
|---|---|
| Frontend | Angular 19 (Standalone Components) |
| Estilos | Bootstrap 5 |
| Backend | Node.js + Express |
| Base de datos | MySQL (Laragon + HeidiSQL) |
| Autenticación | JWT (JSON Web Token) |
| Comunicación | HTTP REST con RxJS |

---

## Arquitectura MVC

```
Floreria/
│
├── backend/                    ← MODELO + CONTROLADOR (servidor)
│   ├── server.js               ← Punto de entrada Express
│   ├── db.js                   ← Conexión a MySQL
│   ├── middleware/
│   │   └── auth.js             ← Verifica token JWT en cada petición
│   └── routes/                 ← Controladores REST
│       ├── auth.routes.js      ← Login, Register, Usuarios
│       ├── categorias.routes.js
│       ├── productos.routes.js
│       ├── clientes.routes.js
│       ├── pedidos.routes.js
│       └── pagos.routes.js
│
├── src/app/                    ← VISTA (Angular)
│   ├── core/
│   │   ├── models/             ← Interfaces TypeScript (estructura de datos)
│   │   ├── services/           ← Llamadas HTTP al backend
│   │   ├── guards/             ← Protección de rutas por rol
│   │   └── interceptors/       ← Agrega el token JWT a cada request
│   └── features/               ← Pantallas de la aplicación
│       ├── auth/               ← Login y Registro
│       ├── dashboard/          ← Pantalla principal con carrusel
│       ├── categorias/         ← CRUD categorías
│       ├── productos/          ← CRUD productos
│       ├── clientes/           ← CRUD clientes
│       ├── pedidos/            ← CRUD pedidos
│       ├── pagos/              ← CRUD pagos + Factura
│       └── usuarios/           ← Gestión de usuarios (admin)
│
├── public/
│   ├── Logo.png                ← Logo de la florería
│   └── img/                    ← Fotos de productos
│
├── floreria.sql                ← Script de base de datos
└── db.json                     ← (solo referencia, ya no se usa)
```

---

## Cómo iniciar el sistema

### 1. Asegúrate de tener Laragon corriendo (MySQL activo)

### 2. Abre DOS terminales en la carpeta `Floreria/`

**Terminal 1 — Backend:**
```bash
npm run backend
# Servidor corriendo en http://localhost:3000
```

**Terminal 2 — Frontend:**
```bash
ng serve
# App disponible en http://localhost:4200
```

### 3. Abre el navegador en `http://localhost:4200`

---

## Credenciales de acceso

| Nombre | Email | Contraseña | Rol |
|---|---|---|---|
| Victoria López | admin@flores.com | admin123 | Admin |
| Carlos Mendoza | vendedor@flores.com | vend123 | Vendedor |
| María Quispe | cliente@flores.com | cli123 | Cliente |

---

## Roles y permisos

| Módulo | Admin | Vendedor | Cliente |
|---|---|---|---|
| Dashboard (carrusel) | ✅ | ✅ | ✅ |
| Productos (ver) | ✅ | ✅ | — |
| Productos (crear/editar) | ✅ | — | — |
| Clientes | ✅ | ✅ | — |
| Categorías | ✅ | — | — |
| Usuarios | ✅ | — | — |
| Pedidos y Pagos | ✅ (acceso directo por URL) | ✅ | ✅ |

---

## Base de datos — Tablas

| Tabla | Descripción |
|---|---|
| `users` | Usuarios del sistema (con campo `activo` para borrado lógico) |
| `categorias` | Tipos de flores/productos |
| `productos` | Catálogo con precio, stock, imagen y descripción |
| `clientes` | Datos de clientes vinculados a un usuario |
| `pedidos` | Órdenes de compra |
| `pagos` | Pagos registrados por pedido, genera factura imprimible |

---

## Flujo de autenticación

```
1. Usuario ingresa email + contraseña en /login
2. Angular envía POST /login al backend (puerto 3000)
3. Backend verifica contraseña con bcrypt contra MySQL
4. Si es correcto → devuelve JWT token + datos del usuario
5. Angular guarda el token en localStorage
6. Cada petición HTTP incluye el token en el header:
   Authorization: Bearer <token>
7. El backend verifica el token antes de responder datos
8. Al cerrar sesión → se borra el localStorage
```

---

## Registro de nuevo cliente

- Ir a `http://localhost:4200/register`
- Completar nombre, email, teléfono y contraseña
- El sistema crea automáticamente el usuario (rol cliente) y su ficha en la tabla `clientes`
- Luego puede iniciar sesión normalmente

---

## Factura

Cuando un pedido tiene un pago registrado:
1. Ir a **Pagos** (acceso por URL: `/pagos`)
2. Click en **Factura** del pago correspondiente
3. Se genera una vista de impresión con los datos del cliente, producto y token de verificación
4. Click en **Imprimir** → se oculta el botón al imprimir

---

## ¿Es clean este código?

Sí. Sigue el patrón **MVC** adaptado a Angular + Express:

- **Model** → `core/models/` (interfaces) + tablas MySQL
- **View** → `features/*/**.component.ts` (templates HTML)
- **Controller** → `backend/routes/` (lógica de negocio) + `core/services/` (llamadas HTTP)
- **Guards** → protegen rutas según rol
- **Interceptor** → centraliza el envío del token JWT
- Cada entidad tiene su propio archivo de rutas, servicio y componentes → **separación de responsabilidades**
