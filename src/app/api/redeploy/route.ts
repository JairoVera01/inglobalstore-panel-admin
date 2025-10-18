import { createClient } from "@/lib/utils/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  // Validar autenticación de admin
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

  // Obtener el deploy hook de las variables de entorno
  const hook = process.env.CF_PAGES_DEPLOY_HOOK;
  if (!hook) {
    return NextResponse.json(
      { ok: false, error: "CF_PAGES_DEPLOY_HOOK no configurado" },
      { status: 500 }
    );
  }

  try {
    // Disparar el webhook de Cloudflare Pages
    const res = await fetch(hook, { method: "POST" });

    if (!res.ok) {
      const txt = await res.text();
      console.error("Error en deploy hook:", txt);
      return NextResponse.json(
        { ok: false, status: res.status, body: txt },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "Deploy iniciado correctamente" },
      { status: 200 }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Error al disparar deploy:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "fetch failed" },
      { status: 500 }
    );
  }
}
