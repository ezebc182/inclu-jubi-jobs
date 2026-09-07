import "server-only";

import type { PortalId } from "@/lib/portal";

/**
 * Textos de la home por portal.
 *
 * Están acá y no incrustados en el JSX porque las dos audiencias necesitan
 * que se les hable distinto. A una persona jubilada le importa que su
 * experiencia valga y que el trámite sea corto; a una persona con
 * discapacidad le importa saber, antes de gastar tiempo en postularse, si el
 * lugar está realmente preparado. Mismo producto, promesa distinta.
 */
export interface Benefit {
  emoji: string;
  title: string;
  body: string;
}

export interface PortalCopy {
  heroTitle: string;
  heroSubtitle: string;
  heroNote: string;
  benefitsTitle: string;
  benefits: Benefit[];
  promiseTitle: string;
  promises: Array<{ label: string; body: string }>;
  ctaTitle: string;
  ctaSubtitle: string;
}

const JUBI: PortalCopy = {
  heroTitle: "Trabajos para jubilados.\nSimple, claro y sin vueltas.",
  heroSubtitle:
    "Conectamos tu experiencia con empresas que la valoran. Sin currículum, sin LinkedIn, sin formularios eternos. Tres preguntas y listo.",
  heroNote:
    "Ingresás con Google o con tu teléfono. Sin contraseñas que recordar.",
  benefitsTitle: "¿Por qué JubiJobs?",
  benefits: [
    {
      emoji: "🤝",
      title: "Mantenete activo",
      body: "Seguí en movimiento, conocé gente y mantenete involucrado en la vida laboral. Trabajar no es solo el dinero, es tener un propósito.",
    },
    {
      emoji: "💰",
      title: "Complementá tu jubilación",
      body: "Ingresos extra con trabajos flexibles, part-time o por día. Vos decidís cuánto querés trabajar y cuándo.",
    },
    {
      emoji: "🏆",
      title: "Tu experiencia vale",
      body: "Las empresas buscan tu conocimiento, tu responsabilidad y tu criterio. Décadas de oficio tienen valor real en el mercado.",
    },
  ],
  promiseTitle: "Sin LinkedIn, sin vueltas",
  promises: [
    {
      label: "Tres preguntas simples",
      body: "¿Qué hiciste? ¿Qué sabés hacer? ¿Qué te gustaría hacer? Eso es todo el perfil.",
    },
    {
      label: "Registro en un paso",
      body: "Entrás con Google o con tu número de teléfono. No hay contraseñas ni verificaciones raras.",
    },
    {
      label: "Pensado para leerse bien",
      body: "Letra grande, buen contraste y navegación clara. Podés agrandar el texto cuando quieras.",
    },
    {
      label: "Gratis para las empresas",
      body: "Publican en minutos y reciben postulaciones claras, sin intermediarios.",
    },
  ],
  ctaTitle: "¿Listo para empezar?",
  ctaSubtitle: "Encontrá tu próximo trabajo en menos de cinco minutos.",
};

const INCLU: PortalCopy = {
  heroTitle: "Trabajo real, con las condiciones que necesitás.",
  heroSubtitle:
    "Cada aviso dice de antemano si el lugar es accesible, si hay horarios flexibles y si se puede trabajar de forma remota. Te enterás antes de postularte, no después de la entrevista.",
  heroNote:
    "Ingresás con Google o con tu teléfono. Compatible con lectores de pantalla.",
  benefitsTitle: "¿Por qué InclúJobs?",
  benefits: [
    {
      emoji: "📋",
      title: "Las condiciones, por adelantado",
      body: "Instalaciones adaptadas, horarios flexibles, trabajo remoto. Cada aviso lo declara antes de que inviertas tu tiempo.",
    },
    {
      emoji: "🎯",
      title: "Se busca lo que sabés hacer",
      body: "Tu perfil habla de tus capacidades y tu experiencia. Contás tus necesidades de accesibilidad solo si querés, y para que el espacio esté listo.",
    },
    {
      emoji: "🔎",
      title: "Empresas que ya se prepararon",
      body: "Publicar acá exige declarar las condiciones del puesto. No llegás a un lugar que nunca pensó en recibirte.",
    },
  ],
  promiseTitle: "Cómo trabajamos",
  promises: [
    {
      label: "Accesibilidad declarada en cada aviso",
      body: "Si una empresa publica acá, tiene que decir qué condiciones ofrece. Es requisito, no una opción.",
    },
    {
      label: "Navegación completa por teclado",
      body: "Todo el sitio se usa sin mouse, con foco siempre visible y estructura correcta para lectores de pantalla.",
    },
    {
      label: "Tu diagnóstico no es tu perfil",
      body: "Contás tus necesidades de accesibilidad si querés y cuando quieras. Lo que se muestra primero es qué sabés hacer.",
    },
    {
      label: "Sin animaciones que molesten",
      body: "Si tu sistema pide movimiento reducido, lo respetamos. Nada parpadea ni se mueve sin tu permiso.",
    },
  ],
  ctaTitle: "Empecemos",
  ctaSubtitle:
    "Mirá los empleos disponibles y sus condiciones de accesibilidad.",
};

const COPY: Record<PortalId, PortalCopy> = { JUBI, INCLU };

export function getPortalCopy(portal: PortalId): PortalCopy {
  return COPY[portal];
}
