-- ============================================
-- Diagnóstico de Imágenes en Base de Datos
-- ============================================

-- Ver los últimos productos con sus imágenes
SELECT 
  id,
  name,
  image_url,
  images,
  created_at
FROM products
ORDER BY created_at DESC
LIMIT 5;

-- Ver el tipo de datos del campo images
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'products' 
  AND column_name IN ('image_url', 'images');

-- Verificar si hay productos con imágenes NULL o vacías
SELECT 
  COUNT(*) as total_productos,
  COUNT(CASE WHEN image_url IS NULL OR image_url = '' THEN 1 END) as sin_image_url,
  COUNT(CASE WHEN images IS NULL THEN 1 END) as sin_images_null,
  COUNT(CASE WHEN images = '[]'::jsonb THEN 1 END) as images_vacio
FROM products;
