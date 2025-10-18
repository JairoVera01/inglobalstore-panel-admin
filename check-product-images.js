require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkStatus() {
  console.log("📊 Verificando estado de product_images...\n");

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .order("created_at", { ascending: false });

  console.log(`Total: ${images?.length || 0} registros\n`);

  images?.forEach((img, i) => {
    console.log(`${i + 1}. Product ID: ${img.product_id.substring(0, 8)}...`);
    console.log(`   URL: ${img.image_url}`);
    console.log(`   Primary: ${img.is_primary}, Order: ${img.display_order}`);
    console.log(`   Created: ${new Date(img.created_at).toLocaleString()}\n`);
  });
}

checkStatus().catch(console.error);
