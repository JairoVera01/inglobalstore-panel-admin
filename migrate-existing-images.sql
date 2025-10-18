-- Script para limpiar y preparar las tablas de imágenes
-- Este script elimina las entradas de ejemplo y permite que el sistema
-- funcione solo con las imágenes reales subidas al storage

-- 1. Eliminar todas las imágenes de ejemplo de la tabla product_images
DELETE FROM product_images WHERE image_url LIKE 'https://example.com/%';

-- 2. Actualizar image_url de productos que tengan URLs de ejemplo
UPDATE products 
SET image_url = NULL 
WHERE image_url LIKE 'https://example.com/%';

-- 3. Ver el estado actual
SELECT 
    COUNT(*) as total_productos,
    COUNT(image_url) as productos_con_image_url,
    COUNT(*) FILTER (WHERE image_url IS NOT NULL AND image_url NOT LIKE 'https://example.com/%') as productos_con_url_real
FROM products;

SELECT 
    COUNT(*) as total_product_images,
    COUNT(*) FILTER (WHERE image_url LIKE 'https://example.com/%') as imagenes_ejemplo,
    COUNT(*) FILTER (WHERE image_url LIKE '%supabase.co%') as imagenes_reales
FROM product_images;
