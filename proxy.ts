import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 requires the function to be named "proxy" instead of "middleware"
export function proxy(request: NextRequest) {
  // Proteger rutas privadas
  const { pathname } = request.nextUrl;

  // Las rutas de onboarding, empresa y postulaciones requieren autenticación
  const protectedRoutes = ["/empresa", "/postulaciones", "/onboarding"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Better-Auth maneja la autenticación internamente
    // Si el usuario no está autenticado, será redirigido por las páginas mismas
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
