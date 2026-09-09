import Link from "next/link";
import { LineIcon } from "@/components/ui/LineIcon";

/**
 * Aviso cuando el ingreso falla.
 *
 * Better-Auth devuelve a la portada con `?error=<codigo>` y nada más. Sin este
 * bloque, la persona ve la página de inicio como si no hubiera pasado nada,
 * con un parámetro raro en la barra de direcciones: intentó entrar, algo falló
 * en silencio, y no sabe si fue culpa suya.
 *
 * Para esta audiencia eso es peor que un error visible. Alguien de 70 años que
 * cree que "hizo algo mal" no vuelve a intentar.
 */

/** Mensajes en castellano llano. Nunca el código crudo de Better-Auth. */
const MENSAJES: Record<string, { titulo: string; detalle: string }> = {
  unable_to_link_account: {
    titulo: "No pudimos terminar de crear tu cuenta",
    detalle:
      "Ya había un registro a medias con ese correo. Volvé a intentar en un minuto: esta vez debería andar.",
  },
  state_not_found: {
    titulo: "Se venció el intento de ingreso",
    detalle:
      "Pasó demasiado tiempo entre que empezaste y volviste. Probá de nuevo, es rápido.",
  },
  access_denied: {
    titulo: "No nos diste permiso",
    detalle:
      "Cancelaste el permiso en la pantalla de Google. Para entrar hace falta aceptarlo: solo pedimos tu nombre y tu correo.",
  },
  invalid_client: {
    titulo: "El ingreso está fuera de servicio",
    detalle:
      "Es un problema nuestro, no tuyo. Ya lo estamos viendo. Mientras tanto podés seguir mirando los empleos publicados.",
  },
};

const GENERICO = {
  titulo: "No pudimos completar el ingreso",
  detalle:
    "Volvé a intentar en un momento. Si sigue sin andar, escribinos y lo resolvemos.",
};

export function AuthErrorNotice({
  code,
  contactEmail,
}: {
  code: string;
  contactEmail: string;
}) {
  const { titulo, detalle } = MENSAJES[code] ?? GENERICO;

  return (
    // role="alert" para que un lector de pantalla lo anuncie al cargar: quien
    // no ve la pantalla necesita enterarse de que el intento falló.
    <div role="alert" className="border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="mt-0.5 shrink-0 text-primary-700 dark:text-primary-200">
            <LineIcon name="shield" size={24} />
          </span>
          <div>
            <p className="font-semibold text-ink">{titulo}</p>
            <p className="mt-1 max-w-measure text-base text-ink-soft">
              {detalle}{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="link-text font-semibold text-primary-700 dark:text-primary-200"
              >
                {contactEmail}
              </a>
            </p>
          </div>
        </div>

        <Link
          href="/ingresar"
          className="press inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-md bg-primary-600 px-6 font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Probar de nuevo
        </Link>
      </div>
    </div>
  );
}
