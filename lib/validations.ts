import { z } from "zod";

export const threeQuestionsSchema = z.object({
  did: z
    .string()
    .min(10, "Por favor, contanos un poco más (mínimo 10 caracteres)")
    .max(1000, "Por favor, resumí tu respuesta (máximo 1000 caracteres)"),
  canDo: z
    .string()
    .min(10, "Por favor, contanos un poco más (mínimo 10 caracteres)")
    .max(1000, "Por favor, resumí tu respuesta (máximo 1000 caracteres)"),
  wantToDo: z
    .string()
    .min(10, "Por favor, contanos un poco más (mínimo 10 caracteres)")
    .max(1000, "Por favor, resumí tu respuesta (máximo 1000 caracteres)"),
});

export const candidateOnboardingSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  phoneNumber: z
    .string()
    .min(8, "Ingresá un teléfono válido")
    .optional()
    .or(z.literal("")),
  location: z.string().min(2, "Por favor, seleccioná tu ubicación"),
  birthYear: z.number().min(1920).max(2010).optional(),
  isDisabled: z.boolean(),
  disabilityType: z.enum(["NONE", "MOTRIZ", "VISUAL", "AUDITIVA", "COGNITIVA", "OTRA"]).optional(),
  accessibilityNeeds: z.string().max(500).optional(),
  did: z.string().min(10).max(1000),
  canDo: z.string().min(10).max(1000),
  wantToDo: z.string().min(10).max(1000),
});

export const companyProfileSchema = z.object({
  name: z.string().min(2, "El nombre de la empresa es muy corto"),
  website: z.string().url("Ingresá una URL válida").optional().or(z.literal("")),
  about: z.string().max(1000, "Máximo 1000 caracteres").optional(),
  location: z.string().optional(),
  whatsappNumber: z.string().optional(),
});

export const jobFormSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres").max(100),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres").max(3000),
  province: z.string().min(2, "Seleccioná una provincia"),
  city: z.string().optional(),
  schedule: z.enum(["PART_TIME", "FLEX", "POR_DIA"]),
  modality: z.enum(["PRESENCIAL", "REMOTO", "HIBRIDO"]),
  salaryArsMin: z.number().positive().optional(),
  salaryArsMax: z.number().positive().optional(),
  tags: z.array(z.string()).max(10, "Máximo 10 etiquetas"),
});

export const applicationSchema = threeQuestionsSchema.extend({
  jobId: z.string().cuid(),
});
