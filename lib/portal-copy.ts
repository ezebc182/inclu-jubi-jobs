import "server-only";

import type { IconName } from "@/components/ui/LineIcon";
import type { PortalId } from "@/lib/portal";

/**
 * Contenido de la home por portal.
 *
 * Está separado del JSX porque las dos audiencias necesitan que se les
 * hable distinto. A una persona jubilada le importa que su experiencia
 * valga y que el trámite sea corto; a una persona con discapacidad le
 * importa saber, antes de invertir tiempo, si el lugar está preparado.
 * Mismo producto, promesa distinta.
 */

export interface Benefit {
  icon: IconName;
  title: string;
  body: string;
}

export interface PortalCopy {
  /** Titular del hero. Corto: tiene que entrar en dos líneas. */
  heroTitle: string;
  heroLead: string;
  heroFootnote: string;
  /** Imagen del hero. Provisoria de Unsplash, ver next.config.ts. */
  heroImage: { src: string; alt: string; credit: string };
  benefitsTitle: string;
  benefitsLead: string;
  benefits: Benefit[];
  stepsTitle: string;
  /** Tres pasos: acá el orden SÍ importa, por eso van numerados. */
  steps: Array<{ title: string; body: string }>;
  trustTitle: string;
  trustPoints: Array<{ icon: IconName; label: string; body: string }>;
  ctaTitle: string;
  ctaLead: string;
}

const JUBI: PortalCopy = {
  heroTitle: "Tu experiencia no se jubila.",
  heroLead:
    "Empresas argentinas buscan gente con oficio para trabajos part-time, por día y flexibles. Sin currículum y sin LinkedIn: contestás tres preguntas y te postulás.",
  heroFootnote: "Entrás con Google o con tu teléfono. No hay contraseñas.",
  heroImage: {
    src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80&auto=format&fit=crop",
    alt: "Mujer de unos sesenta años trabajando en una oficina luminosa",
    credit: "Unsplash",
  },
  benefitsTitle: "Trabajar después de jubilarse cambia las cosas",
  benefitsLead:
    "No es solo el ingreso. Es tener adónde ir, con quién hablar y qué contar.",
  benefits: [
    {
      icon: "wallet",
      title: "Un ingreso que se suma",
      body: "Trabajos part-time, por día o con horario flexible. Elegís cuánto trabajar según lo que necesités este mes.",
    },
    {
      icon: "route",
      title: "Rutina y gente alrededor",
      body: "Un lugar adonde ir, compañeros de trabajo y algo para contar a la noche. Eso no aparece en el recibo de sueldo.",
    },
    {
      icon: "medal",
      title: "Cuarenta años de oficio",
      body: "Puntualidad, criterio y saber tratar a la gente. Es exactamente lo que las empresas dicen que no encuentran.",
    },
  ],
  stepsTitle: "Cómo postularse",
  steps: [
    {
      title: "Entrás con Google o con tu teléfono",
      body: "Sin crear contraseña ni completar formularios largos. Si tenés Gmail, ya está.",
    },
    {
      title: "Contestás tres preguntas",
      body: "Qué hiciste, qué sabés hacer y qué te gustaría hacer. En tus palabras, como se lo contarías a un conocido.",
    },
    {
      title: "Te postulás con un clic",
      body: "Tus tres respuestas quedan guardadas. Para el siguiente aviso no las escribís de nuevo.",
    },
  ],
  trustTitle: "Antes de que nos dejés tus datos",
  trustPoints: [
    {
      icon: "shield",
      label: "No vendemos tus datos",
      body: "Solo la empresa a la que te postulás ve tu perfil. A nadie más.",
    },
    {
      icon: "check",
      label: "Publicar es gratis para las empresas",
      body: "No cobramos comisión ni por postularte ni por conseguir el puesto.",
    },
    {
      icon: "chat",
      label: "Hay alguien del otro lado",
      body: "Escribís a hola@jubijobs.com y te contesta una persona.",
    },
  ],
  ctaTitle: "Mirá qué hay disponible",
  ctaLead:
    "No hace falta registrarse para ver los avisos. Entrás, mirás y decidís después.",
};

const INCLU: PortalCopy = {
  heroTitle: "Las condiciones, antes de la entrevista.",
  heroLead:
    "Cada aviso dice si el lugar es accesible, si el horario se puede ajustar y si se puede trabajar desde casa. Lo sabés antes de postularte, no cuando ya llegaste.",
  heroFootnote: "Compatible con lectores de pantalla y navegación por teclado.",
  heroImage: {
    src: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=1200&q=80&auto=format&fit=crop",
    alt: "Persona trabajando con una computadora en un espacio de oficina accesible",
    credit: "Unsplash",
  },
  benefitsTitle: "Lo que cambia acá",
  benefitsLead:
    "El problema no es encontrar avisos. Es descubrir a mitad del proceso que el lugar nunca pensó en recibirte.",
  benefits: [
    {
      icon: "accessible",
      title: "Accesibilidad declarada",
      body: "Instalaciones adaptadas, horarios ajustables, trabajo remoto. Publicar acá obliga a decirlo: es requisito, no opción.",
    },
    {
      icon: "medal",
      title: "Tu perfil habla de tu trabajo",
      body: "Lo primero que ve la empresa es qué sabés hacer. Tus necesidades de accesibilidad las contás si querés y cuando querés.",
    },
    {
      icon: "shield",
      title: "Empresas que ya se prepararon",
      body: "Si publicaron acá, es porque tuvieron que revisar sus condiciones primero.",
    },
  ],
  stepsTitle: "Cómo postularse",
  steps: [
    {
      title: "Entrás con Google o con tu teléfono",
      body: "Sin contraseñas. Todo el proceso funciona con teclado y con lector de pantalla.",
    },
    {
      title: "Contestás tres preguntas",
      body: "Qué hiciste, qué sabés hacer y qué te gustaría hacer. Sumás tus necesidades de accesibilidad solo si te sirve.",
    },
    {
      title: "Filtrás por lo que necesitás",
      body: "Instalaciones accesibles, horario flexible o remoto. Solo vas a ver los avisos que cumplen.",
    },
  ],
  trustTitle: "Cómo trabajamos",
  trustPoints: [
    {
      icon: "shield",
      label: "Tu diagnóstico no es tu perfil",
      body: "Nunca es obligatorio informarlo, y nunca es lo primero que ve una empresa.",
    },
    {
      icon: "accessible",
      label: "El sitio cumple WCAG 2.2 AA",
      body: "Navegación completa por teclado, foco visible y movimiento reducido si tu sistema lo pide.",
    },
    {
      icon: "chat",
      label: "Hay alguien del otro lado",
      body: "Escribís a hola@inclujobs.com y te contesta una persona.",
    },
  ],
  ctaTitle: "Mirá qué hay disponible",
  ctaLead:
    "No hace falta registrarse para ver los avisos ni sus condiciones de accesibilidad.",
};

const COPY: Record<PortalId, PortalCopy> = { JUBI, INCLU };

export function getPortalCopy(portal: PortalId): PortalCopy {
  return COPY[portal];
}
