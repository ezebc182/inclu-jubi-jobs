import type { Metadata } from "next";
import type { LeadKind } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { allPortals, type PortalId } from "@/lib/portal";
import { LeadAnnounceButton } from "@/components/admin/LeadAnnounceButton";

export const metadata: Metadata = {
  title: "Lista de espera",
  robots: { index: false, follow: false },
};

/** Cuántos leads hay por portal y tipo, y cuántos faltan avisar. */
async function loadGroups() {
  const portalIds: PortalId[] = ["JUBI", "INCLU"];
  const kinds: LeadKind[] = ["CANDIDATE", "COMPANY"];

  return Promise.all(
    portalIds.flatMap((portal) =>
      kinds.map(async (kind) => {
        const [total, pending] = await Promise.all([
          prisma.lead.count({ where: { portal, kind } }),
          prisma.lead.count({ where: { portal, kind, notifiedAt: null } }),
        ]);
        return { portal, kind, total, pending };
      })
    )
  );
}

const DATE_FORMAT = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default async function AdminLeadsPage() {
  await requireAdmin();

  const [groups, leads] = await Promise.all([
    loadGroups(),
    // Los más recientes primero. Sin paginar por ahora: con una lista de
    // cientos esto va a necesitar paginado, pero inventarlo antes de tener
    // los datos es resolver un problema imaginario.
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
  ]);

  const portals = allPortals();
  const totalLeads = groups.reduce((sum, group) => sum + group.total, 0);

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h2 className="text-2xl font-bold text-ink">Lista de espera</h2>
        <p className="mt-2 text-lg text-ink-soft">
          Personas y empresas que dejaron su correo sin registrarse. El aviso se
          envía a mano: disparar uno por cada aviso publicado sería mandar diez
          correos en una semana a la misma persona.
        </p>
      </header>

      <section aria-labelledby="grupos">
        <h3 id="grupos" className="mb-4 text-xl font-bold text-ink">
          Por portal y tipo
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {groups.map((group) => {
            const config = portals.find((p) => p.id === group.portal)!;
            const isCandidate = group.kind === "CANDIDATE";

            return (
              <article
                key={`${group.portal}-${group.kind}`}
                className="flex flex-col gap-4 rounded-xl border border-rule bg-surface p-6"
              >
                <div>
                  <h4 className="text-xl font-bold text-ink">
                    {config.name} · {isCandidate ? "Candidatos" : "Empresas"}
                  </h4>
                  <dl className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-base text-ink-soft">Anotados</dt>
                      <dd className="text-3xl font-bold text-ink">
                        {group.total.toLocaleString("es-AR")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-base text-ink-soft">Sin avisar</dt>
                      <dd className="text-3xl font-bold text-ink">
                        {group.pending.toLocaleString("es-AR")}
                      </dd>
                    </div>
                  </dl>
                </div>

                <LeadAnnounceButton
                  portal={group.portal}
                  portalName={config.name}
                  kind={group.kind}
                  pending={group.pending}
                />
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="detalle">
        <h3 id="detalle" className="mb-4 text-xl font-bold text-ink">
          Detalle
        </h3>

        {totalLeads === 0 ? (
          <p className="rounded-xl border border-rule bg-surface p-6 text-lg text-ink-soft">
            Todavía no se anotó nadie.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-rule">
            <table className="w-full border-collapse bg-surface text-left">
              <caption className="sr-only">
                Correos anotados en la lista de espera, del más reciente al más
                antiguo
              </caption>
              <thead>
                <tr className="border-b-2 border-rule">
                  <th scope="col" className="p-4 text-base font-bold text-ink">
                    Correo
                  </th>
                  <th scope="col" className="p-4 text-base font-bold text-ink">
                    Portal
                  </th>
                  <th scope="col" className="p-4 text-base font-bold text-ink">
                    Tipo
                  </th>
                  <th scope="col" className="p-4 text-base font-bold text-ink">
                    Ubicación
                  </th>
                  <th scope="col" className="p-4 text-base font-bold text-ink">
                    Se anotó
                  </th>
                  <th scope="col" className="p-4 text-base font-bold text-ink">
                    Aviso
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-rule">
                    <td className="p-4 text-base text-ink">{lead.email}</td>
                    <td className="p-4 text-base text-ink-soft">
                      {portals.find((p) => p.id === lead.portal)?.name ??
                        lead.portal}
                    </td>
                    <td className="p-4 text-base text-ink-soft">
                      {lead.kind === "CANDIDATE" ? "Candidato" : "Empresa"}
                    </td>
                    <td className="p-4 text-base text-ink-soft">
                      {/* Ubicación y remoto son dos cosas distintas: alguien
                          puede querer lo de su provincia Y lo remoto. */}
                      {[
                        lead.province,
                        lead.wantsRemote ? "También remoto" : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "Sin indicar"}
                    </td>
                    <td className="p-4 text-base text-ink-soft">
                      {DATE_FORMAT.format(lead.createdAt)}
                    </td>
                    <td className="p-4 text-base text-ink-soft">
                      {/* Nunca solo por color: el estado se lee escrito. */}
                      {lead.notifiedAt
                        ? `Avisado el ${DATE_FORMAT.format(lead.notifiedAt)}`
                        : "Sin avisar"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
