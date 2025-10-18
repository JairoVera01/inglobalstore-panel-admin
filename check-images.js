require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log("📍 Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

async function checkImages() {
  console.log("🔍 Verificando productos y sus imágenes...\n");

  // Verificar productos con image_url
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, image_url")
    .limit(5);

  if (productsError) {
    console.error("Error fetching products:", productsError);
    return;
  }

  console.log("📦 Productos con image_url:");
  products.forEach((p) => {
    console.log(`- ${p.name}:`);
    console.log(`  URL: ${p.image_url || "N/A"}`);
  });

  console.log("\n📸 Verificando tabla product_images...");

  // Verificar product_images
  const { data: productImages, error: imagesError } = await supabase
    .from("product_images")
    .select("*")
    .limit(10);

  if (imagesError) {
    console.error("Error fetching product_images:", imagesError);
    return;
  }

  console.log(
    `\n Total de registros en product_images: ${productImages.length}`
  );
  productImages.forEach((img) => {
    console.log(`\nProducto ID: ${img.product_id}`);
    console.log(`  URL: ${img.image_url}`);
    console.log(`  Primary: ${img.is_primary}`);
    console.log(`  Order: ${img.display_order}`);
  });

  console.log("\n🗂️  Verificando archivos en Storage...");

  // Listar archivos en el bucket
  const { data: files, error: storageError } = await supabase.storage
    .from("images_products")
    .list("products", {
      limit: 100,
      offset: 0,
    });

  if (storageError) {
    console.error("Error listing storage files:", storageError);
    return;
  }

  console.log(`\nArchivos en storage/images_products/products:`);
  files.forEach((file) => {
    const publicUrl = supabase.storage
      .from("images_products")
      .getPublicUrl(`products/${file.name}`);
    console.log(`  - ${file.name}`);
    console.log(`    URL: ${publicUrl.data.publicUrl}`);
  });
}

checkImages().catch(console.error);
