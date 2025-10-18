import { createClient } from "@/lib/utils/supabase/server";

export async function createProductWithImages(formData: FormData) {
  "use server";

  const supabase = await createClient();

  // Obtener datos del formulario
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const category = formData.get("category") as string;
  const imageUrl = formData.get("image_url") as string;
  const imagesJson = formData.get("images_json") as string;

  // Parsear el array de imágenes
  let images = [];
  try {
    images = imagesJson ? JSON.parse(imagesJson) : [];
  } catch (e) {
    console.error("Error parsing images:", e);
  }

  // Insertar producto
  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      description,
      price,
      stock,
      category,
      image_url: imageUrl, // URL de la imagen principal
      images: images, // Array completo de imágenes en JSONB
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }

  return data;
}

export async function updateProductWithImages(
  productId: string,
  formData: FormData
) {
  "use server";

  const supabase = await createClient();

  // Obtener datos del formulario
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const category = formData.get("category") as string;
  const imageUrl = formData.get("image_url") as string;
  const imagesJson = formData.get("images_json") as string;

  // Parsear el array de imágenes
  let images = [];
  try {
    images = imagesJson ? JSON.parse(imagesJson) : [];
  } catch (e) {
    console.error("Error parsing images:", e);
  }

  // Actualizar producto
  const { data, error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
      stock,
      category,
      image_url: imageUrl, // URL de la imagen principal
      images: images, // Array completo de imágenes en JSONB
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    throw error;
  }

  return data;
}
