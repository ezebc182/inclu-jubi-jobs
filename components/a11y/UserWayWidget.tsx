import Script from "next/script";

/**
 * Widget de accesibilidad de UserWay.
 *
 * Una aclaración que conviene dejar escrita: UserWay es una AYUDA, no un
 * sustituto de hacer las cosas bien. Un overlay no arregla HTML semántico
 * roto, contraste insuficiente ni orden de foco desprolijo — eso se resuelve
 * en el código, y así está hecho acá. El widget suma controles cómodos
 * (tamaño de texto, contraste, guía de lectura) sobre una base que ya cumple
 * WCAG 2.2 AA por sí misma.
 *
 * El account id es público por diseño: viaja en el HTML de todas las páginas.
 */
const ACCOUNT_ID = process.env.NEXT_PUBLIC_USERWAY_ACCOUNT_ID ?? "6s9F7XAeLa";

export function UserWayWidget() {
  if (!ACCOUNT_ID) return null;

  return (
    <Script
      id="userway-widget"
      src="https://cdn.userway.org/widget.js"
      data-account={ACCOUNT_ID}
      // Después de que la página sea interactiva: el widget es una mejora,
      // no debe competir con el contenido por el ancho de banda.
      strategy="lazyOnload"
    />
  );
}
