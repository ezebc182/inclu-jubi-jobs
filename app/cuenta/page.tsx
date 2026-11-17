import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getCurrentPortal } from "@/lib/portal";
import { DeleteAccount } from "@/components/account/DeleteAccount";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

export default async function CuentaPage() {
  const session = await getSession();
  if (!session) redirect("/ingresar");

  const usted = (await getCurrentPortal()) === "JUBI";

  const company = await prisma.company.findUnique({
    where: { ownerId: session.user.id },
    select: {
      name: true,
      _count: { select: { jobs: true } },
      jobs: { select: { _count: { select: { applicants: true } } } },
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:py-16">
      <h1 className="text-3xl md:text-4xl">Mi cuenta</h1>
      <p className="mt-3 text-lg text-ink-soft">{session.user.email}</p>

      <section className="mt-12">
        <h2 className="text-2xl">Descargar mis datos</h2>
        <p className="mt-4 text-lg text-ink-soft">
          {usted
            ? "Un archivo con todo lo que guardamos de usted: perfil, postulaciones, búsquedas guardadas y empresa, si tiene."
            : "Un archivo con todo lo que guardamos de vos: perfil, postulaciones, búsquedas guardadas y empresa, si tenés."}
        </p>
        <a
          href="/api/cuenta/exportar"
          className="mt-6 inline-flex min-h-[48px] items-center rounded-md bg-primary-600 px-6 text-lg font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Descargar mis datos
        </a>
      </section>

      <section className="mt-12 border-t border-rule pt-12">
        <h2 className="text-2xl">Eliminar mi cuenta</h2>
        <DeleteAccount
          usted={usted}
          company={
            company && {
              name: company.name,
              jobs: company._count.jobs,
              applications: company.jobs.reduce(
                (n, job) => n + job._count.applicants,
                0
              ),
            }
          }
        />
      </section>
    </div>
  );
}
