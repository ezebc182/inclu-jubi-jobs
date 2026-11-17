import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentPortal } from "@/lib/portal";
import { unsubscribeSecret, verifyLeadToken } from "@/lib/unsubscribe";

export const metadata: Metadata = {
  title: "Darse de baja de la lista",
  robots: { index: false, follow: false },
};

/**
 * Baja de la lista de espera desde el link del mail. Pide confirmar con un
 * botón (POST) en vez de borrar al abrir: los filtros de correo abren los
 * links solos y darían de baja a gente que no lo pidió.
 */
async function confirmUnsubscribe(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const token = String(formData.get("t") ?? "");
  if (!id || !verifyLeadToken(id, token, unsubscribeSecret())) {
    redirect("/baja?estado=invalido");
  }
  await prisma.lead.deleteMany({ where: { id } });
  redirect("/baja?estado=listo");
}

export default async function BajaPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; t?: string; estado?: string }>;
}) {
  const { id = "", t = "", estado } = await searchParams;
  const usted = (await getCurrentPortal()) === "JUBI";

  const valid =
    estado === undefined &&
    id !== "" &&
    verifyLeadToken(id, t, unsubscribeSecret());

  let titulo: string;
  let texto: string;
  if (estado === "listo") {
    titulo = "Listo, ya no está en la lista";
    texto = usted
      ? "Borramos su correo. No le vamos a escribir más."
      : "Borramos tu correo. No te vamos a escribir más.";
  } else if (!valid) {
    titulo = "Este link no funciona";
    texto = usted
      ? "Puede que esté incompleto. Ábralo de nuevo desde el correo que le mandamos."
      : "Puede que esté incompleto. Abrilo de nuevo desde el correo que te mandamos.";
  } else {
    titulo = "¿Dejar de recibir nuestros avisos?";
    texto = usted
      ? "Vamos a borrar su correo de la lista de espera y no le escribiremos más."
      : "Vamos a borrar tu correo de la lista de espera y no te escribiremos más.";
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl md:text-4xl">{titulo}</h1>
      <p className="mt-4 text-lg text-ink-soft">{texto}</p>
      {valid && (
        <form action={confirmUnsubscribe} className="mt-8">
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="t" value={t} />
          <button
            type="submit"
            className="min-h-[48px] rounded-md bg-primary-600 px-6 text-lg font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Sí, darme de baja
          </button>
        </form>
      )}
    </div>
  );
}
