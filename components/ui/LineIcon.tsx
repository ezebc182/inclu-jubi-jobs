/**
 * Iconografía de trazo.
 *
 * Reemplaza los emojis que había antes. Un emoji se renderiza distinto en
 * cada sistema operativo, no hereda el color de marca y tiene un peso
 * visual que no se puede controlar — es el detalle que más delata una
 * plantilla. Estos comparten grosor de trazo, terminaciones y grilla de
 * 24px, así que leen como una familia.
 */

type IconName =
  | "clock" // jornada / horario
  | "wallet" // ingresos
  | "medal" // experiencia
  | "route" // trayectoria
  | "shield" // confianza
  | "accessible" // accesibilidad
  | "chat" // contacto
  | "phone" // ingreso por SMS
  | "whatsapp" // contacto por WhatsApp
  | "mail" // contacto por correo
  | "chevron-down" // acordeón abierto
  | "chevron-right" // acordeón cerrado
  | "check";

const PATHS: Record<IconName, React.ReactNode> = {
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10.5h18" />
      <path d="M15.5 15h2.5" />
    </>
  ),
  medal: (
    <>
      <circle cx="12" cy="15.5" r="5" />
      <path d="M12 13.5l.8 1.6 1.7.25-1.25 1.2.3 1.7-1.55-.85-1.55.85.3-1.7-1.25-1.2 1.7-.25.8-1.6Z" />
      <path d="M8 10.2L6 3.5h12l-2 6.7" />
    </>
  ),
  /**
   * Calendario con una jornada marcada. El intento anterior era un camino
   * serpenteante que a 32px no se leía como nada reconocible: la metáfora
   * de "trayectoria" necesitaba más trazo del que este tamaño permite.
   */
  route: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v3.5" />
      <path d="M16 3v3.5" />
      <path d="M9 14.5l2 2 4-4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 2.5v6c0 4.2-2.8 7.6-7 9.5-4.2-1.9-7-5.3-7-9.5v-6L12 3Z" />
      <path d="M9 12l2.2 2.2L15.5 10" />
    </>
  ),
  accessible: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 9v5" />
      <path d="M7.5 10.5l4.5 1.2 4.5-1.2" />
      <path d="M9.5 14l-1.5 6" />
      <path d="M14.5 14l1.5 6" />
    </>
  ),
  chat: (
    <>
      <path d="M20 12.5c0 3.6-3.6 6.5-8 6.5-1 0-2-.15-2.9-.43L4 20.5l1.4-3.6A6.5 6.5 0 0 1 4 12.5C4 8.9 7.6 6 12 6s8 2.9 8 6.5Z" />
    </>
  ),
  /**
   * Celular, no el auricular de teléfono fijo: el código llega por SMS y la
   * metáfora tiene que coincidir con el objeto que la persona tiene en la mano.
   */
  phone: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
      <path d="M10.5 18.5h3" />
    </>
  ),
  /**
   * WhatsApp: el auricular dentro de la burbuja con la cola quebrada, que es
   * la silueta que la marca hace reconocible. Va en trazo como el resto de la
   * familia — el logo oficial en verde lo reservamos para donde haga falta
   * respetar la marca, no para un botón de contacto.
   */
  whatsapp: (
    <>
      <path d="M20 11.7c0 4-3.4 7.2-7.6 7.2-1.2 0-2.4-.27-3.4-.75L4.5 19.5l1.4-4.2A7 7 0 0 1 4.8 11.7c0-4 3.4-7.2 7.6-7.2s7.6 3.2 7.6 7.2Z" />
      <path d="M9.6 9.1c.2-.1.5 0 .7.3l.6 1c.1.3.1.5-.1.7l-.4.4c-.1.2-.2.3 0 .6.5.8 1.2 1.4 2 1.8.3.1.4 0 .5-.1l.4-.5c.2-.2.4-.2.6-.1l1 .5c.3.2.4.4.3.7-.2.7-.9 1.2-1.7 1.1-2-.3-4.1-2.3-4.5-4.3-.1-.7.2-1.4.6-2.1Z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="M3.6 7.2l7.6 5.3c.5.35 1.1.35 1.6 0l7.6-5.3" />
    </>
  ),
  "chevron-down": <path d="M6 9.5l6 6 6-6" />,
  "chevron-right": <path d="M9.5 6l6 6-6 6" />,
  check: <path d="M4.5 12.5l4.5 4.5L19.5 6.5" />,
};

export function LineIcon({
  name,
  size = 28,
  className = "",
  strokeWidth = 1.6,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}

export type { IconName };
