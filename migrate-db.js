require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function migrate() {
  console.log("🔧 Iniciando migración de imágenes...\n");

  // 1. Eliminar imágenes de ejemplo de product_images
  console.log("📸 Eliminando imágenes de ejemplo de product_images...");
  const { data: deleted, error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .like("image_url", "https://example.com/%")
    .select();

  if (deleteError) {
    console.error("❌ Error:", deleteError);
  } else {
    console.log(`✅ Eliminadas ${deleted?.length || 0} imágenes de ejemplo\n`);
  }

  // 2. Actualizar image_url en products
  console.log("📦 Actualizando URLs de ejemplo en products...");
  const { data: updated, error: updateError } = await supabase
    .from("products")
    .update({ image_url: null })
    .like("image_url", "https://example.com/%")
    .select();

  if (updateError) {
    console.error("❌ Error:", updateError);
  } else {
    console.log(`✅ Actualizados ${updated?.length || 0} productos\n`);
  }

  // 3. Ver el estado final
  console.log("📊 Estado final de la base de datos:\n");

  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: productsWithUrl } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .not("image_url", "is", null);

  const { count: totalImages } = await supabase
    .from("product_images")
    .select("*", { count: "exact", head: true });

  console.log(`📦 Total de productos: ${totalProducts}`);
  console.log(`   - Con image_url: ${productsWithUrl}`);
  console.log(`   - Sin image_url: ${totalProducts - productsWithUrl}`);
  console.log(`\n📸 Total de product_images: ${totalImages}`);

  console.log("\n✨ Migración completada!");
}

migrate().catch(console.error);
