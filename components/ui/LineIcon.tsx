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
