-- ============================================
-- Configuración de Políticas de Supabase Storage
-- Bucket: images_products
-- ============================================

-- NOTA: Ejecuta este script en Supabase Dashboard → SQL Editor

-- ============================================
-- 1. CREAR EL BUCKET (si no existe)
-- ============================================

-- Insertar el bucket si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images_products',
  'images_products',
  true, -- Público para acceso a las imágenes
  5242880, -- 5MB en bytes
  ARRAY['image/*']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. ELIMINAR POLÍTICAS EXISTENTES (opcional)
-- ============================================

-- Ejecuta esto solo si quieres limpiar y recrear las políticas
-- DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow authenticated users to update images" ON storage.objects;
-- DROP POLICY IF EXISTS "Allow authenticated users to delete images" ON storage.objects;

-- ============================================
-- 3. CREAR POLÍTICAS DE ACCESO
-- ============================================

-- Política 1: Permitir que usuarios autenticados suban imágenes
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images_products' 
  AND (storage.foldername(name))[1] = 'products'
);

-- Política 2: Permitir lectura pública de las imágenes
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images_products');

-- Política 3: Permitir que usuarios autenticados actualicen imágenes
CREATE POLICY "Allow authenticated users to update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images_products' 
  AND (storage.foldername(name))[1] = 'products'
);

-- Política 4: Permitir que usuarios autenticados eliminen imágenes
CREATE POLICY "Allow authenticated users to delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'images_products' 
  AND (storage.foldername(name))[1] = 'products'
);

-- ============================================
-- 4. VERIFICAR CONFIGURACIÓN
-- ============================================

-- Ver todas las políticas del bucket
SELECT 
  policyname,
  cmd as operation,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%images%'
ORDER BY policyname;

-- Ver configuración del bucket
SELECT 
  id,
  name,
  public,
  file_size_limit / 1048576 as "size_limit_mb",
  allowed_mime_types
FROM storage.buckets
WHERE id = 'images_products';

-- ============================================
-- RESULTADO ESPERADO
-- ============================================

-- Deberías ver 4 políticas:
-- 1. Allow authenticated users to upload images (INSERT)
-- 2. Allow public read access (SELECT)
-- 3. Allow authenticated users to update images (UPDATE)
-- 4. Allow authenticated users to delete images (DELETE)
--
-- Y el bucket configurado con:
-- - public: true
-- - size_limit_mb: 5
-- - allowed_mime_types: {image/*}

