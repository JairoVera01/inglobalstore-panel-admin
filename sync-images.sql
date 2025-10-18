-- ============================================
-- Script para verificar y sincronizar imágenes
-- ============================================

-- Ver el estado actual de las imágenes
SELECT 
  id,
  name,
  image_url,
  images,
  created_at
FROM products
ORDER BY created_at DESC;

-- ============================================
-- Sincronizar image_url con images para todos los productos
-- ============================================

-- Si images es NULL o vacío, crear array con image_url
UPDATE products
SET images = jsonb_build_array(
  jsonb_build_object(
    'url', image_url,
    'isPrimary', true,
    'order', 0
  )
)
WHERE (images IS NULL OR images = '[]'::jsonb)
  AND image_url IS NOT NULL 
  AND image_url != '';

-- Si images tiene datos pero image_url no coincide con la imagen principal, actualizar
UPDATE products
SET image_url = (images->0->>'url')
WHERE images IS NOT NULL 
  AND images != '[]'::jsonb
  AND image_url != (images->0->>'url');

-- ============================================
-- Ver resultado después de la sincronización
-- ============================================

SELECT 
  id,
  name,
  image_url,
  images,
  CASE 
    WHEN images IS NULL OR images = '[]'::jsonb THEN 'Sin imágenes'
    WHEN jsonb_array_length(images) = 1 THEN '1 imagen'
    ELSE jsonb_array_length(images)::text || ' imágenes'
  END as total_images
FROM products
ORDER BY created_at DESC;

-- ============================================
-- Estadísticas de imágenes
-- ============================================

SELECT 
  COUNT(*) as total_productos,
  COUNT(CASE WHEN images IS NOT NULL AND images != '[]'::jsonb THEN 1 END) as con_imagenes,
  COUNT(CASE WHEN images IS NULL OR images = '[]'::jsonb THEN 1 END) as sin_imagenes,
  ROUND(AVG(CASE WHEN images IS NOT NULL THEN jsonb_array_length(images) ELSE 0 END), 2) as promedio_imagenes
FROM products;
