/**
 * Lógica pura de la postulación: el avance del estado y la opción
 * "Prefiero que me llamen". Sin imports con alias a propósito, para que la
 * corran los tests de node sin pasar por Next.
 */
import { z } from "zod";
import { esTelefonoValido, soloDigitos } from "./identificacion.ts";

type FlowStatus = "SUBMITTED" | "REVIEWED" | "CONTACTED";

/** Enviada → vista → contactado. Solo avanza. */
const FLOW: FlowStatus[] = ["SUBMITTED", "REVIEWED", "CONTACTED"];

/**
 * Estados desde los que se puede pasar a `target`. Va en el `where` del
 * update: si la fila ya está en `target` o más adelante no se toca, y el
 * estado no retrocede aunque dos pedidos lleguen a la vez.
 */
export function statusesBefore(target: FlowStatus): FlowStatus[] {
  return FLOW.slice(0, FLOW.indexOf(target));
}

export const CALL_SLOT_LABELS = {
  MORNING: "Por la mañana (de 9 a 13 h)",
  AFTERNOON: "Por la tarde (de 14 a 18 h)",
  ANYTIME: "En cualquier horario",
} as const;

export type CallSlot = keyof typeof CALL_SLOT_LABELS;

const PHONE_ERROR =
  "El teléfono tiene que incluir el código de área (por ejemplo, 11 4567 8901)";

export const callPreferenceSchema = z.object({
  // Solo dígitos, espacios, guiones, paréntesis y un + inicial. Se guarda
  // normalizado: con + si vino en formato internacional, para que el tel:
  // marque bien.
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]+$/, PHONE_ERROR)
    .refine(esTelefonoValido, PHONE_ERROR)
    .transform((v) => (v.startsWith("+") ? "+" : "") + soloDigitos(v)),
  slot: z.enum(["MORNING", "AFTERNOON", "ANYTIME"], {
    errorMap: () => ({ message: "Falta elegir el horario para la llamada" }),
  }),
});
