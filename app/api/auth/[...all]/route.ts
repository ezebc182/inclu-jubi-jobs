import type { NextRequest } from "next/server";
import { getAuthForPortal } from "@/lib/auth";
import { resolvePortalFromHost } from "@/lib/portal";

/**
 * Endpoint de autenticación, resuelto por dominio.
 *
 * Acá se decide el `redirect_uri` que se le manda a Google, así que la
 * instancia NO puede ser fija: tiene que ser la del portal por el que entró
 * el usuario. Con `toNextJsHandler(auth)` — la forma habitual — el handler
 * queda atado a una sola instancia y el login de un dominio arma el callback
 * del otro.
 *
 * El `Host` se lee del request en vez de `headers()` porque en un route
 * handler ya viene en el objeto y evita el salto asíncrono.
 */
function handler(request: NextRequest) {
  const host = request.headers.get("host") ?? request.nextUrl.host ?? undefined;
  const portal = resolvePortalFromHost(host);

  return getAuthForPortal(portal).handler(request);
}

export { handler as GET, handler as POST };
