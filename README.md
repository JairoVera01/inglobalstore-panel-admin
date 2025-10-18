# InGlobalStore - Panel Admin

Sistema de gestión de productos para InGlobalStore construido con Next.js 15 y Supabase.

## 🚀 Características

- ✅ Next.js 15 con App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Supabase para base de datos PostgreSQL
- ✅ Server-Side Rendering (SSR)
- ✅ Gestión completa de productos (CRUD)

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta de Supabase configurada
- Base de datos de productos en Supabase

## 🛠️ Instalación

Las dependencias ya están instaladas. Si necesitas reinstalarlas:

```bash
npm install
```

## 🎯 Uso

### Modo Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Compilar para Producción

```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
inglobalstore-panel-admin/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout principal con navegación
│   │   ├── page.tsx                # Página de inicio (grid de productos)
│   │   ├── globals.css             # Estilos globales
│   │   └── products/
│   │       ├── page.tsx            # Lista de productos (tabla)
│   │       ├── new/
│   │       │   └── page.tsx        # Crear nuevo producto
│   │       └── [id]/
│   │           ├── page.tsx        # Ver detalle del producto
│   │           └── edit/
│   │               └── page.tsx    # Editar producto
│   ├── components/
│   │   ├── ProductForm.tsx         # Formulario reutilizable de productos
│   │   └── DeleteProductButton.tsx # Botón para eliminar productos
│   ├── lib/
│   │   ├── actions/
│   │   │   └── products.ts         # Server Actions para CRUD
│   │   └── utils/
│   │       └── supabase/
│   │           ├── client.ts       # Cliente de Supabase (navegador)
│   │           ├── server.ts       # Cliente de Supabase (servidor)
│   │           └── middleware.ts   # Middleware de Supabase
│   ├── types/
│   │   └── database.ts             # Tipos TypeScript para la BD
│   └── middleware.ts               # Middleware de Next.js
├── .env.local                      # Variables de entorno (configurado)
├── tsconfig.json                   # Configuración de TypeScript
└── package.json
```

## 🗄️ Esquema de Base de Datos

La tabla `products` en Supabase tiene la siguiente estructura:

```sql
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  stock int4 NOT NULL DEFAULT 0,
  category text,
  created_at timestamptz DEFAULT now()
);
```

## 🔧 Tecnologías Utilizadas

- **Next.js 15**: Framework de React para aplicaciones web
- **TypeScript**: Lenguaje tipado
- **Tailwind CSS**: Framework de CSS utility-first
- **Supabase**: Backend-as-a-Service con PostgreSQL
- **@supabase/ssr**: SSR support para Supabase

## 📝 Funcionalidades Implementadas

### ✅ CRUD Completo de Productos

#### Página de Inicio (`/`)

- Vista en tarjetas de todos los productos
- Muestra imagen, nombre, descripción, precio y stock
- Diseño responsive con grid adaptativo

#### Lista de Productos (`/products`)

- Vista en tabla de todos los productos
- Ordenados por fecha de creación (más recientes primero)
- Indicadores visuales de stock (verde/amarillo/rojo)
- Botones de acciones (Ver/Editar)
- Botón para crear nuevo producto

#### Crear Producto (`/products/new`)

- Formulario completo para agregar productos
- Validación de campos requeridos
- Campos: nombre, descripción, precio, stock, categoría, imagen

#### Ver Producto (`/products/[id]`)

- Vista detallada de un producto específico
- Muestra toda la información del producto
- Imagen en tamaño grande
- Botones para editar o eliminar

#### Editar Producto (`/products/[id]/edit`)

- Formulario precargado con los datos actuales
- Actualización en tiempo real
- Misma validación que crear producto

#### Eliminar Producto

- Confirmación antes de eliminar
- Eliminación permanente de la base de datos
- Redirección automática a la lista

## 🚀 Próximas Funcionalidades

- [ ] Búsqueda y filtrado de productos
- [ ] Paginación de resultados
- [ ] Autenticación de usuarios
- [ ] Carga de imágenes directa (no solo URL)
- [ ] Dashboard con estadísticas
- [ ] Exportar datos a CSV/Excel
- [ ] Historial de cambios

## 📄 Licencia

Este proyecto es privado y pertenece a InGlobalStore.

## 👤 Autor

Jairo Vera - [@JairoVera01](https://github.com/JairoVera01)
