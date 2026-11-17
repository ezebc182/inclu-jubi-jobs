import { createAuthClient } from "better-auth/react";
import { phoneNumberClient } from "better-auth/client/plugins";

/**
 * Base del cliente de auth.
 *
 * En el navegador usamos el origen actual: los dos portales se sirven desde
 * el mismo deploy, y `NEXT_PUBLIC_BETTER_AUTH_URL` se congela en tiempo de
 * build con un solo dominio — con ella, el login andaría en jubijobs.com y
 * fallaría en inclujobs.com (o al revés).
 *
 * El fallback solo aplica en render de servidor y en desarrollo.
 */
function resolveBaseUrl(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
}

export const authClient = createAuthClient({
  baseURL: resolveBaseUrl(),
  plugins: [phoneNumberClient()],
});

export const { signIn, signOut, useSession } = authClient;

/**
 * Borra las páginas e imágenes que guardó el service worker. Se llama al
 * cerrar sesión: en un dispositivo compartido, lo cacheado durante la sesión
 * (nombre en el header, avatar) no debe quedar para la próxima persona.
 * Shell y assets con hash no tienen datos personales y se conservan.
 * Nunca lanza: un fallo acá no puede bloquear el logout.
 */
export async function clearSessionCaches(): Promise<void> {
  try {
    if (typeof caches === "undefined") return;
    const names = await caches.keys();
    await Promise.all(
      names
        .filter(
          (name) => name.startsWith("pages-") || name.startsWith("images-")
        )
        .map((name) => caches.delete(name))
    );
  } catch {
    // Sin permisos de storage (modo privado, etc.): no hay nada que borrar.
  }
}
