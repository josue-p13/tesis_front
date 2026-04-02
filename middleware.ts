import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/lib/jwt";

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/login", "/register", "/verify-email", "/forgot-password"];

// Rutas de autenticación (si estás logueado, redirigir a home)
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener el token de las cookies
  const token = request.cookies.get("auth-token")?.value;

  // Verificar si el usuario está autenticado usando la versión Edge-compatible
  let isAuthenticated = false;
  if (token) {
    try {
      const payload = await verifyTokenEdge(token);
      isAuthenticated = payload !== null;
    } catch {
      isAuthenticated = false;
    }
  }

  // Si el usuario está autenticado y trata de acceder a rutas de auth (login/register)
  // redirigirlo al home PRIMERO (antes de cualquier otra validación)
  if (isAuthenticated && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Si la ruta es pública, permitir acceso
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Si la ruta no es pública y el usuario no está autenticado
  // redirigirlo al login
  if (!isPublicRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Permitir el acceso
  return NextResponse.next();
}

// Configurar qué rutas debe procesar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
