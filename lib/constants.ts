export const PROVINCIAS_AR = [
  "CABA",
  "Buenos Aires",
  "Córdoba",
  "Santa Fe",
  "Mendoza",
  "Tucumán",
  "Entre Ríos",
  "Salta",
  "Misiones",
  "Chaco",
  "Chubut",
  "Corrientes",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Neuquén",
  "Río Negro",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santiago del Estero",
  "Tierra del Fuego",
] as const;

export const MODALITIES = [
  { value: "PRESENCIAL", label: "Presencial" },
  { value: "REMOTO", label: "Remoto" },
  { value: "HIBRIDO", label: "Híbrido" },
] as const;

export const SCHEDULES = [
  { value: "PART_TIME", label: "Part-time" },
  { value: "FLEX", label: "Flexible" },
  { value: "POR_DIA", label: "Por día" },
] as const;

export const DISABILITY_TYPES = [
  { value: "NONE", label: "Ninguna" },
  { value: "MOTRIZ", label: "Motriz" },
  { value: "VISUAL", label: "Visual" },
  { value: "AUDITIVA", label: "Auditiva" },
  { value: "COGNITIVA", label: "Cognitiva" },
  { value: "OTRA", label: "Otra" },
] as const;

export const APP_STATUS_LABELS = {
  SUBMITTED: "Enviada",
  REVIEWED: "Revisada",
  CONTACTED: "Contactado/a",
  REJECTED: "Rechazada",
} as const;

export const JOB_STATUS_LABELS = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicada",
  PAUSED: "Pausada",
  CLOSED: "Cerrada",
} as const;

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(date));
};
