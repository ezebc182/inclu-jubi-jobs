/**
 * Lógica pura de la lista de espera.
 *
 * Vive fuera de `app/actions/leads.ts` porque un archivo `"use server"` solo
 * puede exportar funciones async: cualquier otro export lo rechaza el build
 * con "Server Actions must be async functions". Y separarlo es lo correcto
 * igual — esto no habla con la base ni con el request, es una decisión sobre
 * datos que ya están en memoria.
 */

/** Un aviso, reducido a lo que entra en el correo. */
export interface SampleJob {
  id: string;
  title: string;
  province: string;
  city: string | null;
  isRemoteFriendly: boolean;
}

/** Cuántos avisos de muestra entran en el correo. */
export const SAMPLE_SIZE = 3;

/**
 * Elige los avisos de muestra para una persona.
 *
 * Prioridad: su provincia, después remotos si los pidió, después los más
 * recientes para completar. Si no queda nada de su zona, el correo lo dice
 * —ver `lib/email.ts`— en vez de mostrar tres avisos de la otra punta del
 * país como si fueran para ella.
 */
export function pickSample(
  jobs: SampleJob[],
  province: string | null,
  wantsRemote: boolean
): SampleJob[] {
  const chosen: SampleJob[] = [];
  const seen = new Set<string>();

  const add = (candidates: SampleJob[]) => {
    for (const job of candidates) {
      if (chosen.length >= SAMPLE_SIZE) return;
      if (seen.has(job.id)) continue;
      seen.add(job.id);
      chosen.push(job);
    }
  };

  if (province) add(jobs.filter((job) => job.province === province));
  if (wantsRemote) add(jobs.filter((job) => job.isRemoteFriendly));
  add(jobs);

  return chosen;
}
