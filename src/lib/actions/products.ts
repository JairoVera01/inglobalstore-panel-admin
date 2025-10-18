"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ImageData } from "@/types/database";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  // Parsear el array de imágenes
  const imagesJson = formData.get("images_json") as string;
  let images = [];
  try {
    images = imagesJson ? JSON.parse(imagesJson) : [];
  } catch (e) {
    console.error("Error parsing images:", e);
  }

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    image_url: formData.get("image_url") as string,
    stock: parseInt(formData.get("stock") as string),
    category: formData.get("category") as string,
  };

  // Insertar el producto
  const { data: newProduct, error } = await supabase
    .from("products")
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw new Error(error.message);
  }

  // Guardar las imágenes en la tabla product_images
  if (images.length > 0 && newProduct) {
    const productImages = images.map((img: ImageData, index: number) => ({
      product_id: newProduct.id,
      image_url: img.url,
      is_primary: img.isPrimary || index === 0,
      display_order: img.order ?? index,
      alt_text: newProduct.name,
    }));

    const { error: imagesError } = await supabase
      .from("product_images")
      .insert(productImages);

    if (imagesError) {
      console.error("Error inserting product images:", imagesError);
      // No lanzar error, el producto ya está creado
    }
  }

  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  // Parsear el array de imágenes
  const imagesJson = formData.get("images_json") as string;
  let images = [];
  try {
    images = imagesJson ? JSON.parse(imagesJson) : [];
  } catch (e) {
    console.error("Error parsing images:", e);
  }

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    image_url: formData.get("image_url") as string,
    stock: parseInt(formData.get("stock") as string),
    category: formData.get("category") as string,
  };

  // Actualizar el producto
  const { error } = await supabase.from("products").update(data).eq("id", id);

  if (error) {
    console.error("Error updating product:", error);
    throw new Error(error.message);
  }

  // Eliminar las imágenes antiguas
  const { error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", id);

  if (deleteError) {
    console.error("Error deleting old product images:", deleteError);
  }

  // Insertar las nuevas imágenes
  if (images.length > 0) {
    const productImages = images.map((img: ImageData, index: number) => ({
      product_id: id,
      image_url: img.url,
      is_primary: img.isPrimary || index === 0,
      display_order: img.order ?? index,
      alt_text: data.name,
    }));

    const { error: imagesError } = await supabase
      .from("product_images")
      .insert(productImages);

    if (imagesError) {
      console.error("Error inserting product images:", imagesError);
    }
  }

  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  redirect("/products");
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    throw new Error(error.message);
  }

  revalidatePath("/products");
  redirect("/products");
}
