"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    image_url: formData.get("image_url") as string,
    stock: parseInt(formData.get("stock") as string),
    category: formData.get("category") as string,
  };

  const { error } = await supabase.from("products").insert([data]);

  if (error) {
    console.error("Error creating product:", error);
    throw new Error(error.message);
  }

  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  const data = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    image_url: formData.get("image_url") as string,
    stock: parseInt(formData.get("stock") as string),
    category: formData.get("category") as string,
  };

  const { error } = await supabase.from("products").update(data).eq("id", id);

  if (error) {
    console.error("Error updating product:", error);
    throw new Error(error.message);
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
