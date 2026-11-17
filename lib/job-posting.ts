/**
 * Datos estructurados `JobPosting` (schema.org) para el detalle de un aviso.
 * Es lo que lee Google for Jobs. Sin imports de valores a propósito: lo
 * prueba tests/unit directo con Node.
 */

type JobForLd = {
  title: string;
  description: string;
  createdAt: Date;
  moderatedAt: Date | null;
  expiresAt: Date | null;
  schedule: "PART_TIME" | "FLEX" | "POR_DIA";
  modality: "PRESENCIAL" | "HIBRIDO" | "REMOTO";
  province: string;
  city: string | null;
  company: { name: string; website: string | null; logoUrl: string | null };
};

const EMPLOYMENT_TYPE = {
  PART_TIME: "PART_TIME",
  POR_DIA: "PER_DIEM",
  FLEX: "OTHER",
} as const;

export function jobPostingLd(job: JobForLd) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    // Fecha de aprobación si la hay: es cuando el aviso se hizo público.
    datePosted: (job.moderatedAt ?? job.createdAt).toISOString(),
    ...(job.expiresAt && { validThrough: job.expiresAt.toISOString() }),
    employmentType: EMPLOYMENT_TYPE[job.schedule],
    hiringOrganization: {
      "@type": "Organization",
      name: job.company.name,
      ...(job.company.website && { sameAs: job.company.website }),
      ...(job.company.logoUrl && { logo: job.company.logoUrl }),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(job.city && { addressLocality: job.city }),
        addressRegion: job.province,
        addressCountry: "AR",
      },
    },
    ...(job.modality === "REMOTO" && {
      jobLocationType: "TELECOMMUTE",
      applicantLocationRequirements: { "@type": "Country", name: "AR" },
    }),
  };
}

/**
 * JSON listo para `<script type="application/ld+json">`. Los datos los escribe
 * la empresa: sin escapar `<`, un título con `</script>` cierra el bloque e
 * inyecta HTML en la página.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
