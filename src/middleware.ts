import { updateSession } from "@/lib/utils/supabase/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/utils/supabase/server";

export async function middleware(request: NextRequest) {
  // Actualizar la sesión
  const response = await updateSession(request);

  // Rutas públicas que no requieren autenticación
  const publicPaths = ["/auth/login", "/auth/register", "/auth/verify-email"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return response;
  }

  // Verificar si el usuario está autenticado
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si no hay usuario y no es una ruta pública, redirigir al login
  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Si hay usuario y está en una ruta de auth, redirigir al home
  if (user && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
