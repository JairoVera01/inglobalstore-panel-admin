require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function cleanDatabase() {
  console.log("🧹 Limpiando base de datos...\n");

  // Obtener todas las imágenes con example.com
  const { data: exampleImages } = await supabase
    .from("product_images")
    .select("id, image_url")
    .filter("image_url", "not.like", "%supabase.co%");

  console.log(`Encontradas ${exampleImages?.length || 0} imágenes de ejemplo`);

  if (exampleImages && exampleImages.length > 0) {
    // Eliminar una por una
    for (const img of exampleImages) {
      const { error } = await supabase
        .from("product_images")
        .delete()
        .eq("id", img.id);

      if (error) {
        console.error(`❌ Error eliminando ${img.id}:`, error);
      } else {
        console.log(`✅ Eliminada: ${img.image_url.substring(0, 50)}...`);
      }
    }
  }

  console.log("\n📊 Estado final:");
  const { count } = await supabase
    .from("product_images")
    .select("*", { count: "exact", head: true });

  console.log(`Total de product_images: ${count}`);
}

cleanDatabase().catch(console.error);
