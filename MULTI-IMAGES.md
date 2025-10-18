# Sistema de Múltiples Imágenes por Producto

Esta guía explica cómo funciona el sistema de galería de imágenes para productos, permitiendo múltiples fotos por producto como en una tienda real.

## 🎯 Características

- ✅ **Múltiples imágenes por producto** (sin límite)
- ✅ **Imagen principal** destacada
- ✅ **Reordenar imágenes** con drag controls
- ✅ **Preview en tiempo real**
- ✅ **Eliminar imágenes individualmente**
- ✅ **Compatibilidad con sistema existente** (campo `image_url`)

## 📊 Arquitectura

### Opción Implementada: Campo JSONB (Simple)

Mantenemos compatibilidad con el campo `image_url` existente mientras agregamos soporte para múltiples imágenes.

```sql
-- El producto sigue teniendo image_url para compatibilidad
image_url TEXT  -- URL de la imagen principal

-- Las imágenes múltiples se manejan en el cliente
-- La imagen principal siempre se sincroniza con image_url
```

### Opción Avanzada: Tabla Separada (Recomendado para producción)

Para un sistema más robusto, ejecuta `database-images-update.sql` que crea:

```sql
product_images
├── id (UUID)
├── product_id (UUID) → products.id
├── image_url (TEXT)
├── is_primary (BOOLEAN)
├── display_order (INTEGER)
├── alt_text (TEXT)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

## 🔧 Componentes

### 1. MultiImageUploader

**Archivo**: `src/components/MultiImageUploader.tsx`

Componente principal para gestionar múltiples imágenes:

```tsx
<MultiImageUploader
  onImagesChange={(imgs) => setImages(imgs)}
  initialImages={[{ url: "...", isPrimary: true, order: 0 }]}
/>
```

**Props**:

- `onImagesChange`: Callback cuando cambian las imágenes
- `initialImages`: Imágenes iniciales del producto
- `productId` (opcional): ID del producto

**Funcionalidades**:

- Subir nuevas imágenes
- Establecer imagen principal (★)
- Reordenar con flechas (↑ ↓)
- Eliminar imágenes (🗑️)
- Preview automático

### 2. ProductForm Actualizado

**Archivo**: `src/components/ProductForm.tsx`

Integra el `MultiImageUploader` y mantiene compatibilidad:

```tsx
const [images, setImages] = useState([
  { url: product?.image_url, isPrimary: true, order: 0 }
])

// Campo oculto mantiene compatibilidad con image_url
<input
  type="hidden"
  name="image_url"
  value={images.find(img => img.isPrimary)?.url || ''}
/>
```

## 🚀 Uso

### Crear Producto con Múltiples Imágenes

1. Ve a **Crear Producto** (`/products/new`)
2. Llena los datos del producto
3. En la sección "Imágenes del Producto":
   - Sube la primera imagen (será la principal automáticamente)
   - Haz clic de nuevo para agregar más imágenes
   - Reordena con las flechas si es necesario
4. Guarda el producto

### Editar Imágenes de un Producto

1. Ve a **Editar Producto** (`/products/[id]/edit`)
2. Verás las imágenes existentes en una galería
3. Puedes:
   - ✅ Agregar nuevas imágenes
   - ⭐ Cambiar la imagen principal (clic en estrella)
   - ↕️ Reordenar (flechas arriba/abajo)
   - 🗑️ Eliminar imágenes (botón rojo)

## 🎨 Interfaz de Usuario

### Galería de Imágenes

```
┌─────────────┬─────────────┬─────────────┐
│  Principal  │   Imagen 2  │   Imagen 3  │
│     ★       │             │             │
│   [Img 1]   │   [Img 2]   │   [Img 3]   │
│             │             │             │
│  ↓ 🗑️       │  ⭐ ↑ ↓ 🗑️  │  ⭐ ↑ 🗑️    │
└─────────────┴─────────────┴─────────────┘
```

### Controles al Hacer Hover

- **⭐ Estrella**: Establecer como imagen principal
- **↑ Flecha arriba**: Mover imagen hacia arriba
- **↓ Flecha abajo**: Mover imagen hacia abajo
- **🗑️ Papelera**: Eliminar imagen

## 📝 Flujo de Datos

### 1. Subir Primera Imagen

```
Usuario sube imagen
    ↓
ImageUploader → /api/upload-image
    ↓
Supabase Storage (images_products/products/...)
    ↓
URL pública retornada
    ↓
MultiImageUploader agrega a array
    ↓
{
  url: "https://...supabase.co/.../imagen.jpg",
  isPrimary: true,  // Primera imagen
  order: 0
}
    ↓
ProductForm actualiza campo hidden "image_url"
    ↓
Al guardar → Database (image_url actualizado)
```

### 2. Agregar Más Imágenes

```
Usuario sube otra imagen
    ↓
Nueva URL de Supabase
    ↓
Se agrega al array de imágenes
    ↓
[
  { url: "...", isPrimary: true, order: 0 },   // Original
  { url: "...", isPrimary: false, order: 1 }    // Nueva
]
    ↓
La imagen principal (isPrimary: true) se guarda en image_url
```

### 3. Cambiar Imagen Principal

```
Usuario hace clic en ⭐ de Imagen 2
    ↓
Array se actualiza:
[
  { url: "...", isPrimary: false, order: 0 },   // Ya no es principal
  { url: "...", isPrimary: true, order: 1 }     // Ahora es principal
]
    ↓
Campo hidden "image_url" se actualiza con nueva URL principal
```

## 🔄 Migración de Datos

Si ejecutaste `database-images-update.sql`, tus productos existentes se migraron automáticamente:

```sql
-- Antes
products.image_url = "https://example.com/producto.jpg"

-- Después (tabla separada)
product_images
├── product_id = [id del producto]
├── image_url = "https://example.com/producto.jpg"
├── is_primary = true
└── display_order = 0

-- Y mantiene compatibilidad
products.image_url = "https://example.com/producto.jpg"
```

## 📦 Estructura de Datos

### Estado del Componente

```typescript
type ImageData = {
  url: string; // URL de Supabase Storage
  isPrimary: boolean; // ¿Es la imagen principal?
  order: number; // Orden de visualización
};

const [images, setImages] = useState<ImageData[]>([
  {
    url: "https://rjzfaimdifosilvsmmtu.supabase.co/storage/v1/object/public/images_products/products/1760795874108-56zcf.png",
    isPrimary: true,
    order: 0,
  },
  {
    url: "https://...otra-imagen.jpg",
    isPrimary: false,
    order: 1,
  },
]);
```

### Compatibilidad con Database

```typescript
// Al guardar el formulario
const primaryImage = images.find((img) => img.isPrimary);
const image_url = primaryImage?.url || images[0]?.url || "";

// Este valor va al campo image_url de la base de datos
```

## 🎯 Visualización en el Frontend

### Home Page (Tarjetas)

```tsx
// En page.tsx muestra siempre image_url (la principal)
<ProductImage
  src={product.image_url} // Siempre la imagen principal
  alt={product.name}
/>
```

### Página de Detalle

Para mostrar todas las imágenes en la página de detalle del producto, necesitarías:

```tsx
// Si usas tabla separada
const { data: images } = await supabase
  .from('product_images')
  .select('*')
  .eq('product_id', productId)
  .order('display_order')

// Renderizar galería
<div className="grid grid-cols-4 gap-2">
  {images?.map(img => (
    <Image key={img.id} src={img.image_url} ... />
  ))}
</div>
```

## ⚙️ Configuración Requerida

### 1. Variables de Entorno

Ya configuradas en `.env.local`:

```bash
SUPABASE_S3_ENDPOINT=...
SUPABASE_S3_ACCESS_KEY_ID=...
SUPABASE_S3_SECRET_ACCESS_KEY=...
SUPABASE_STORAGE_BUCKET=images_products
```

### 2. Políticas de Storage

Ya ejecutadas en `supabase-storage-setup.sql`:

✅ Upload (INSERT) - Usuarios autenticados
✅ Read (SELECT) - Público
✅ Update (UPDATE) - Usuarios autenticados
✅ Delete (DELETE) - Usuarios autenticados

### 3. Next.js Config

Ya configurado en `next.config.ts`:

```typescript
remotePatterns: [
  {
    protocol: "https",
    hostname: "**.supabase.co",
  },
];
```

## 🚀 Próximas Mejoras

### Galería en Página de Detalle

Crear un componente `ProductGallery.tsx`:

```tsx
- Imagen principal grande
- Miniaturas clickeables
- Zoom al hacer hover
- Navegación con flechas
- Lightbox para pantalla completa
```

### Lazy Loading

```tsx
- Cargar imágenes bajo demanda
- Thumbnails optimizados
- Progressive images
```

### Drag & Drop para Reordenar

```tsx
- Biblioteca: react-beautiful-dnd
- Arrastrar y soltar para reordenar
- Más intuitivo que flechas
```

### Compresión Automática

```tsx
- Comprimir imágenes antes de subir
- Generar thumbnails automáticos
- Optimización de peso
```

## 📚 Referencias

- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [React State Management](https://react.dev/learn/managing-state)

---

**Última actualización**: 18 de octubre de 2025
