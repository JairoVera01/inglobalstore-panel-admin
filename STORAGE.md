# Configuración de Supabase Storage para Imágenes

Esta guía te ayudará a configurar correctamente el bucket de Supabase Storage para gestionar las imágenes de productos.

## 📦 Bucket Configurado

- **Nombre**: `images_products`
- **Endpoint S3**: `https://rjzfaimdifosilvsmmtu.storage.supabase.co/storage/v1/s3`
- **Región**: `us-east-2`

## 🔐 Credenciales S3

Las credenciales están configuradas en `.env.local`:

```bash
SUPABASE_S3_ENDPOINT=https://rjzfaimdifosilvsmmtu.storage.supabase.co/storage/v1/s3
SUPABASE_S3_REGION=us-east-2
SUPABASE_S3_ACCESS_KEY_ID=6551ab8015a6696807e8d24938dfd2e1
SUPABASE_S3_SECRET_ACCESS_KEY=50976e77f67ca03aa64413acdf798c88e941205507ef1b3fe0cc29f63444234a
SUPABASE_STORAGE_BUCKET=images_products
```

## ⚙️ Configuración Requerida en Supabase

### 1. Crear el Bucket (si no existe)

Ve a Supabase Dashboard → Storage → New bucket

- **Name**: `images_products`
- **Public bucket**: ✅ **SÍ** (para que las imágenes sean accesibles públicamente)
- **Allowed MIME types**: `image/*`
- **File size limit**: `5 MB`

### 2. Configurar Políticas de Acceso (Policies)

Ve a Storage → `images_products` → Policies

#### Política 1: Permitir subida de imágenes (INSERT)

```sql
-- Nombre: Allow authenticated users to upload images
-- Operation: INSERT

CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images_products'
  AND (storage.foldername(name))[1] = 'products'
);
```

#### Política 2: Permitir lectura pública (SELECT)

```sql
-- Nombre: Allow public read access
-- Operation: SELECT

CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images_products');
```

#### Política 3: Permitir actualización (UPDATE)

```sql
-- Nombre: Allow authenticated users to update images
-- Operation: UPDATE

CREATE POLICY "Allow authenticated users to update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images_products'
  AND (storage.foldername(name))[1] = 'products'
);
```

#### Política 4: Permitir eliminación (DELETE)

```sql
-- Nombre: Allow authenticated users to delete images
-- Operation: DELETE

CREATE POLICY "Allow authenticated users to delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'images_products'
  AND (storage.foldername(name))[1] = 'products'
);
```

## 📁 Estructura de Archivos

Las imágenes se guardan con la siguiente estructura:

```
images_products/
└── products/
    ├── 1729234567890-abc123.jpg
    ├── 1729234567891-def456.png
    └── 1729234567892-ghi789.webp
```

## 🎯 Componentes Implementados

### 1. ImageUploader Component

- **Archivo**: `src/components/ImageUploader.tsx`
- **Funcionalidad**: Subir imágenes con drag & drop
- **Validaciones**: Tipo de archivo, tamaño máximo 5MB
- **Preview**: Vista previa en tiempo real

### 2. API Endpoint

- **Ruta**: `/api/upload-image`
- **Archivo**: `src/app/api/upload-image/route.ts`
- **Métodos**:
  - `POST`: Subir imagen
  - `DELETE`: Eliminar imagen

### 3. ProductForm Integration

- **Archivo**: `src/components/ProductForm.tsx`
- **Feature**: Reemplazo del input de URL por uploader visual

## 🚀 Uso

### En el formulario de productos

El componente `ImageUploader` se usa automáticamente en:

- `/products/new` - Crear nuevo producto
- `/products/[id]/edit` - Editar producto

### Subir una imagen

1. Haz clic en la zona de upload o arrastra la imagen
2. La imagen se sube automáticamente a Supabase Storage
3. Se muestra un preview de la imagen
4. La URL pública se guarda en el campo `image_url`

## 🔍 URLs Generadas

Las imágenes subidas tendrán URLs del tipo:

```
https://rjzfaimdifosilvsmmtu.supabase.co/storage/v1/object/public/images_products/products/1729234567890-abc123.jpg
```

## 📊 Validaciones Implementadas

### En el Cliente (ImageUploader)

- ✅ Tipo de archivo debe ser imagen (`image/*`)
- ✅ Tamaño máximo: 5MB
- ✅ Preview antes de subir

### En el Servidor (API)

- ✅ Autenticación requerida
- ✅ Validación de tipo MIME
- ✅ Validación de tamaño
- ✅ Nombres únicos (timestamp + random)

## 🎨 Formatos Soportados

- ✅ JPEG / JPG
- ✅ PNG
- ✅ WEBP
- ✅ GIF
- ✅ SVG

## ⚡ Optimizaciones

### Image Transformation (Supabase)

Si tienes habilitada la transformación de imágenes en Supabase Pro, puedes usar:

```typescript
const { data } = supabase.storage
  .from("images_products")
  .getPublicUrl("products/image.jpg", {
    transform: {
      width: 800,
      height: 800,
      quality: 80,
    },
  });
```

### Next.js Image Optimization

Las imágenes de Supabase ya están configuradas en `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.supabase.co',
    },
  ],
}
```

## 🐛 Troubleshooting

### Error: "No se pudo subir la imagen"

1. **Verifica las políticas**:

   - Ve a Supabase Dashboard → Storage → images_products → Policies
   - Asegúrate de tener las 4 políticas creadas

2. **Verifica el bucket**:

   - El bucket debe ser público
   - El nombre debe ser exactamente `images_products`

3. **Verifica autenticación**:
   - El usuario debe estar logueado
   - Las credenciales S3 deben estar en `.env.local`

### Error: "Forbidden" o 403

- Las políticas de Storage no están configuradas correctamente
- El usuario no está autenticado
- El bucket no es público

### Error: "File too large"

- El archivo supera los 5MB
- Comprime la imagen antes de subirla

### Las imágenes no se ven (404)

- Verifica que el bucket sea público
- Comprueba que la URL sea correcta
- Verifica la política SELECT para acceso público

## 📚 Referencias

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [S3 Protocol](https://supabase.com/docs/guides/storage/s3/authentication)

---

**Última actualización**: 18 de octubre de 2025
