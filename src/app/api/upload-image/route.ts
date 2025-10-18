import { createClient } from "@/lib/utils/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Validar autenticación
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    // Obtener el archivo del FormData
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucketName = (formData.get("bucket") as string) || "images_products";

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "El archivo debe ser una imagen" },
        { status: 400 }
      );
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: "La imagen no debe superar los 5MB" },
        { status: 400 }
      );
    }

    // Generar nombre único para el archivo
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Convertir File a ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Subir a Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Error al subir archivo:", uploadError);
      return NextResponse.json(
        { ok: false, error: uploadError.message || "Error al subir la imagen" },
        { status: 500 }
      );
    }

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return NextResponse.json({
      ok: true,
      publicUrl,
      path: filePath,
      fileName,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Error en upload-image:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Endpoint para eliminar imágenes
export async function DELETE(request: Request) {
  try {
    // Validar autenticación
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    // Obtener parámetros
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");
    const bucketName = searchParams.get("bucket") || "images_products";

    if (!filePath) {
      return NextResponse.json(
        { ok: false, error: "No se proporcionó la ruta del archivo" },
        { status: 400 }
      );
    }

    // Eliminar de Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (deleteError) {
      console.error("Error al eliminar archivo:", deleteError);
      return NextResponse.json(
        {
          ok: false,
          error: deleteError.message || "Error al eliminar la imagen",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Imagen eliminada correctamente",
    });
  } catch (error) {
    const err = error as Error;
    console.error("Error en delete image:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}
