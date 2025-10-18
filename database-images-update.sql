-- ============================================
-- Actualización de Base de Datos para Múltiples Imágenes
-- ============================================

-- OPCIÓN 1: Usar JSONB para múltiples URLs de imágenes (Simple)
-- ============================================

-- Agregar columna para múltiples imágenes (si no existe)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Migrar la imagen existente al array de imágenes
UPDATE products 
SET images = jsonb_build_array(
  jsonb_build_object(
    'url', image_url,
    'isPrimary', true,
    'order', 0
  )
)
WHERE image_url IS NOT NULL AND image_url != '';

-- Crear índice para búsquedas más rápidas
CREATE INDEX IF NOT EXISTS idx_products_images ON products USING GIN (images);

-- ============================================
-- OPCIÓN 2: Tabla separada para imágenes (Más robusto)
-- ============================================

-- Crear tabla de imágenes de productos
CREATE TABLE IF NOT EXISTS product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_primary_per_product UNIQUE NULLS NOT DISTINCT (product_id, is_primary)
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(product_id, is_primary);

-- Migrar imágenes existentes a la nueva tabla
INSERT INTO product_images (product_id, image_url, is_primary, display_order)
SELECT 
  id as product_id,
  image_url,
  true as is_primary,
  0 as display_order
FROM products
WHERE image_url IS NOT NULL AND image_url != ''
ON CONFLICT DO NOTHING;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_product_images_updated_at ON product_images;
CREATE TRIGGER update_product_images_updated_at
    BEFORE UPDATE ON product_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- POLÍTICAS RLS para product_images
-- ============================================

-- Habilitar RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública
CREATE POLICY "Allow public read access to product images"
ON product_images
FOR SELECT
TO public
USING (true);

-- Permitir que usuarios autenticados inserten imágenes
CREATE POLICY "Allow authenticated users to insert product images"
ON product_images
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permitir que usuarios autenticados actualicen imágenes
CREATE POLICY "Allow authenticated users to update product images"
ON product_images
FOR UPDATE
TO authenticated
USING (true);

-- Permitir que usuarios autenticados eliminen imágenes
CREATE POLICY "Allow authenticated users to delete product images"
ON product_images
FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver estructura de la tabla
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'product_images'
ORDER BY ordinal_position;

-- Ver políticas
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'product_images';

-- Ver imágenes migradas
SELECT 
  p.id,
  p.name,
  pi.image_url,
  pi.is_primary,
  pi.display_order
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
ORDER BY p.created_at DESC, pi.display_order ASC
LIMIT 10;
