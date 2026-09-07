import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PORTAL_HEADER, resolvePortalFromHost } from "@/lib/portal";

/**
 * Rutas que exigen sesión. El chequeo fino de rol (CANDIDATE / COMPANY / ADMIN)
 * vive en cada página y en cada server action, donde sí se puede consultar la
 * base. Acá solo cortamos el tráfico anónimo antes de llegar al servidor.
 */
const PROTECTED_PREFIXES = [
  "/empresa",
  "/postulaciones",
  "/onboarding",
  "/admin",
] as const;

/**
 * Cookie de sesión de Better Auth. En producción va con prefijo `__Secure-`.
 * La presencia de la cookie NO valida la sesión — solo evita renderizar rutas
 * privadas a alguien que claramente no inició sesión.
 */
const SESSION_COOKIES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

// En Next.js 16 la función debe llamarse "proxy", no "middleware".
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Resolver el portal por dominio y propagarlo en un header interno.
  //    Todo el código de servidor lo lee con `getCurrentPortal()`.
  const portal = resolvePortalFromHost(request.headers.get("host"));

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(PORTAL_HEADER, portal);

  // 2. Cortar rutas privadas sin sesión.
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected) {
    const hasSession = SESSION_COOKIES.some((name) =>
      request.cookies.has(name)
    );

    if (!hasSession) {
      const loginUrl = new URL("/ingresar", request.url);
      // Volvemos a donde quería ir, después de iniciar sesión.
      loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // 3. Exponer el portal al cliente (lo usa el registro del service worker
  //    y cualquier lógica de branding en el navegador).
  response.headers.set(PORTAL_HEADER, portal);

  // 4. Cabeceras de seguridad. Van acá para cubrir todas las respuestas,
  //    incluidas las que Next sirve sin pasar por next.config.ts.
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");

  return response;
}

export const config = {
  matcher: [
    /*
     * Todas las rutas excepto:
     * - api            (route handlers; resuelven el portal por Host)
     * - _next/static   (assets compilados)
     * - _next/image    (optimizador de imágenes)
     * - sw.js          (service worker: debe servirse sin interferencia)
     * - archivos con extensión (favicon.ico, manifest.webmanifest, .png, ...)
     */
    "/((?!api|_next/static|_next/image|sw\\.js|.*\\.[\\w]+$).*)",
  ],
};
