import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes - JubiJobs",
  description:
    "Respuestas a las preguntas más frecuentes sobre cómo funciona JubiJobs para jubilados y empresas.",
};

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 transition-colors dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-gray-100 md:text-5xl">
          Preguntas Frecuentes
        </h1>
        <p className="mb-16 text-xl leading-relaxed text-gray-700 dark:text-gray-300">
          Encontrá respuestas a las preguntas más comunes sobre JubiJobs
        </p>

        <div className="space-y-12">
          {/* Sección: Para Candidatos */}
          <section>
            <h2 className="mb-8 text-3xl font-bold text-primary-600 dark:text-primary-400">
              Para Candidatos
            </h2>

            <div className="space-y-6">
              <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ¿Un jubilado argentino puede trabajar sin perder su
                  jubilación?
                </h3>
                <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                  <strong>Sí, en la mayoría de los casos.</strong> Tanto
                  jubilados nacionales como provinciales pueden trabajar sin
                  perder su jubilación, aunque existen diferencias según la caja
                  previsional y el tipo de empleo.
                </p>

                <h4 className="mb-3 mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  1. Jubilados Nacionales (ANSES - SIPA)
                </h4>
                <p className="mb-3 text-lg text-gray-700 dark:text-gray-300">
                  <strong>¿Pueden trabajar?</strong> Sí. Los jubilados del
                  Sistema Integrado Previsional Argentino (SIPA) pueden trabajar
                  sin perder su jubilación.
                </p>
                <p className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Condiciones:
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-lg text-gray-700 dark:text-gray-300">
                  <li>
                    <strong>En relación de dependencia:</strong> Pueden trabajar
                    libremente. La empresa debe realizar aportes previsionales
                    normales, pero el jubilado NO genera un segundo haber
                    jubilatorio con esos aportes.
                  </li>
                  <li>
                    <strong>Como monotributista o autónomo:</strong> Pueden
                    trabajar bajo estas modalidades sin perder su jubilación.
                  </li>
                </ul>
                <p className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Importante:
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-lg text-gray-700 dark:text-gray-300">
                  <li>
                    Los aportes que realicen como trabajadores activos NO se
                    acumulan para una segunda jubilación.
                  </li>
                  <li>
                    El haber jubilatorio se mantiene intacto, no se reduce ni se
                    suspende.
                  </li>
                </ul>

                <h4 className="mb-3 mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  2. Jubilados Provinciales (Ejemplo: Córdoba)
                </h4>
                <p className="mb-3 text-lg text-gray-700 dark:text-gray-300">
                  <strong>¿Pueden trabajar?</strong> Depende de la caja
                  previsional provincial. En <strong>Córdoba (APROSS)</strong>,
                  por ejemplo:
                </p>
                <p className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Condiciones:
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-lg text-gray-700 dark:text-gray-300">
                  <li>
                    Pueden trabajar en relación de dependencia en el sector
                    privado sin perder su jubilación.
                  </li>
                  <li>
                    <strong>NO pueden</strong> trabajar en relación de
                    dependencia en el sector público provincial (hay suspensión
                    del haber).
                  </li>
                  <li>
                    Pueden trabajar como monotributistas o autónomos sin
                    restricciones.
                  </li>
                </ul>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  <strong>Recomendación:</strong> Cada provincia tiene sus
                  propias reglas. Es importante consultar con la caja
                  previsional correspondiente (APROSS en Córdoba, IPS en Santa
                  Fe, etc.).
                </p>

                <h4 className="mb-3 mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  3. ¿Qué pasa si trabajo en otra jurisdicción?
                </h4>
                <p className="mb-3 text-lg text-gray-700 dark:text-gray-300">
                  <strong>
                    Jubilado Nacional trabajando en cualquier provincia:
                  </strong>{" "}
                  Sin problema. Puede trabajar en todo el país.
                </p>
                <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                  <strong>
                    Jubilado Provincial trabajando en otra provincia:
                  </strong>{" "}
                  Generalmente puede trabajar sin restricciones, pero debe
                  verificar las normas específicas de su caja provincial.
                </p>

                <h4 className="mb-3 mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  4. ¿Se descuenta algo de mi jubilación si trabajo?
                </h4>
                <p className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Jubilados Nacionales (ANSES):
                </p>
                <ul className="mb-4 ml-6 list-disc space-y-2 text-lg text-gray-700 dark:text-gray-300">
                  <li>
                    <strong>No se descuenta nada</strong> del haber jubilatorio.
                  </li>
                  <li>
                    La empresa debe hacer aportes previsionales, pero esos
                    aportes no generan un segundo beneficio.
                  </li>
                </ul>
                <p className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Jubilados Provinciales:
                </p>
                <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
                  Varía según la provincia. En algunas, trabajar en el sector
                  público provincial puede suspender temporalmente el haber.
                </p>

                <h4 className="mb-3 mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Resumen: ¿Puedo trabajar sin perder mi jubilación?
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-2 border-gray-300 dark:border-gray-700">
                    <thead className="bg-primary-100 dark:bg-primary-950">
                      <tr>
                        <th className="border-2 border-gray-300 px-4 py-3 text-left text-lg font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                          Tipo de Jubilación
                        </th>
                        <th className="border-2 border-gray-300 px-4 py-3 text-left text-lg font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                          Relación de dependencia (privado)
                        </th>
                        <th className="border-2 border-gray-300 px-4 py-3 text-left text-lg font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                          Relación de dependencia (público)
                        </th>
                        <th className="border-2 border-gray-300 px-4 py-3 text-left text-lg font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                          Monotributista/Autónomo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-gray-800">
                        <td className="border-2 border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                          Nacional (ANSES)
                        </td>
                        <td className="border-2 border-gray-300 px-4 py-3 text-lg text-gray-700 dark:border-gray-700 dark:text-gray-300">
                          ✅ Sí, sin restricciones
                        </td>
                        <td className="border-2 border-gray-300 px-4 py-3 text-lg text-gray-700 dark:border-gray-700 dark:text-gray-300">
                          ✅ Sí, sin restricciones
                        </td>
                        <td className="border-2 border-gray-300 px-4 py-3 text-lg text-gray-700 dark:border-gray-700 dark:text-gray-300">
                          ✅ Sí, sin restricciones
                        </td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <td className="border-2 border-gray-300 px-4 py-3 text-lg font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                          Provincial (Ej: Córdoba)
                        </td>
                        <td className="border-2 border-gray-300 px-4 py-3 text-lg text-gray-700 dark:border-gray-700 dark:text-gray-300">
                          ✅ Sí (sector privado)
                        </td>
                        <td className="border-2 border-gray-300 px-4 py-3 text-lg text-gray-700 dark:border-gray-700 dark:text-gray-300">
                          ❌ Puede suspenderse (sector público provincial)
                        </td>
                        <td className="border-2 border-gray-300 px-4 py-3 text-lg text-gray-700 dark:border-gray-700 dark:text-gray-300">
                          ✅ Sí, sin restricciones
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-950">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Conclusión:
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    La gran mayoría de los jubilados argentinos pueden trabajar
                    sin perder su jubilación. Si tenés dudas sobre tu caso
                    específico, consultá con ANSES (130) o con tu caja
                    provincial.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ¿Cómo me postulo a un empleo?
                </h3>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  Ingresá con tu cuenta de Google, Facebook, Microsoft o tu
                  número de teléfono. Luego, buscá empleos que te interesen y
                  hacé click en &quot;Postularme&quot;. Respondé 3 preguntas
                  simples y listo. Tu postulación será enviada.
                </p>
              </div>

              <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ¿Necesito CV o LinkedIn?
                </h3>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  No. En JubiJobs no necesitás CV en PDF ni perfil de LinkedIn.
                  Solo respondés 3 preguntas sobre tu experiencia: qué hiciste,
                  qué sabés hacer y qué te gustaría hacer.
                </p>
              </div>

              <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ¿Es gratis para candidatos?
                </h3>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  Sí, 100% gratis. Nunca te vamos a cobrar por buscar trabajo o
                  postularte a empleos.
                </p>
              </div>

              <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ¿Qué tipo de empleos hay?
                </h3>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  Empleos part-time, flexibles, por día, presenciales, remotos e
                  híbridos. Todos pensados para personas con experiencia que
                  buscan trabajos adaptables.
                </p>
              </div>
            </div>
          </section>

          {/* Sección: Para Empresas */}
          <section className="mt-16">
            <h2 className="mb-8 text-3xl font-bold text-primary-600 dark:text-primary-400">
              Para Empresas
            </h2>

            <div className="space-y-6">
              <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ¿Cuánto cuesta publicar empleos?
                </h3>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  Es gratis. Sin costos ocultos ni comisiones.
                </p>
              </div>

              <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ¿Cuánto tarda en publicarse un empleo?
                </h3>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  5 minutos para cargarlo, publicación instantánea.
                </p>
              </div>

              <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ¿Puedo editar o pausar un empleo?
                </h3>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  Sí, desde tu dashboard en cualquier momento.
                </p>
              </div>

              <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ¿Cómo contacto a los candidatos?
                </h3>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  Un click y les enviamos un email con tus datos de contacto.
                </p>
              </div>

              <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ¿Tienen que ser jubilados oficialmente?
                </h3>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  No. Pueden ser personas próximas a jubilarse o mayores de 50
                  que buscan trabajos flexibles.
                </p>
              </div>

              <div className="rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ¿Qué pasa con personas con discapacidad?
                </h3>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  Ves su perfil completo, incluyendo necesidades de
                  accesibilidad, antes de contactarlos.
                </p>
              </div>
            </div>
          </section>

          {/* Sección: Contacto */}
          <section className="mt-16">
            <div className="rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 p-10 shadow-sm transition-colors dark:from-gray-800 dark:to-gray-700">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
                ¿Tenés otra pregunta?
              </h2>
              <p className="mb-8 text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                Si no encontraste la respuesta que buscás, escribinos y te
                ayudamos.
              </p>
              <div className="space-y-4">
                <p className="text-lg text-gray-900 dark:text-gray-100">
                  <strong className="text-xl">Email:</strong>{" "}
                  <a
                    href="mailto:hola@jubijobs.com"
                    className="font-semibold text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    hola@jubijobs.com
                  </a>
                </p>
                <p className="text-lg text-gray-900 dark:text-gray-100">
                  <strong className="text-xl">WhatsApp:</strong>{" "}
                  <a
                    href="https://wa.me/5491123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    +54 9 11 2345-6789
                  </a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
