export const metadata = {
  title: "Términos y Condiciones - JubiJobs",
  description: "Términos de uso de la plataforma JubiJobs",
};

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">
        Términos y Condiciones
      </h1>
      <p className="mb-8 text-base text-gray-600">
        Última actualización: {new Date().toLocaleDateString("es-AR")}
      </p>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Aceptación de los términos
        </h2>
        <p className="text-lg text-gray-700">
          Al acceder y usar JubiJobs, aceptás estos términos y condiciones. Si no estás de acuerdo, por favor no uses la plataforma.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Descripción del servicio
        </h2>
        <p className="mb-4 text-lg text-gray-700">
          JubiJobs es una plataforma que conecta personas jubiladas y con discapacidad que buscan trabajo con empresas que ofrecen empleos flexibles en Argentina.
        </p>
        <p className="text-lg text-gray-700">
          <strong>El servicio es gratuito</strong> tanto para candidatos como para empresas. No cobramos comisiones ni fees.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Registro y cuenta
        </h2>
        <ul className="space-y-3 text-lg text-gray-700">
          <li>
            • Debés tener al menos 18 años para usar JubiJobs.
          </li>
          <li>
            • La información que proporciones debe ser veraz y actualizada.
          </li>
          <li>
            • Sos responsable de mantener la seguridad de tu cuenta OAuth.
          </li>
          <li>
            • No podés crear múltiples cuentas o usar cuentas de otras personas.
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Para candidatos
        </h2>
        <ul className="space-y-3 text-lg text-gray-700">
          <li>
            • Debés proporcionar información honesta sobre tu experiencia y habilidades.
          </li>
          <li>
            • Sos responsable de las respuestas que envíes en tus postulaciones.
          </li>
          <li>
            • JubiJobs no garantiza que serás contactado o contratado por las empresas.
          </li>
          <li>
            • Podés retractarte de una postulación contactando directamente a la empresa.
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Para empresas
        </h2>
        <ul className="space-y-3 text-lg text-gray-700">
          <li>
            • Debés tener autorización legal para publicar empleos en nombre de la empresa.
          </li>
          <li>
            • Los empleos publicados deben ser reales y cumplir con la legislación laboral argentina.
          </li>
          <li>
            • No podés discriminar candidatos por edad, género, raza, religión, orientación sexual o discapacidad.
          </li>
          <li>
            • Sos responsable del proceso de selección y contratación posterior.
          </li>
          <li>
            • JubiJobs no es parte de la relación laboral entre empresa y candidato.
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Contenido prohibido
        </h2>
        <p className="mb-4 text-lg text-gray-700">
          No está permitido publicar:
        </p>
        <ul className="space-y-2 text-lg text-gray-700">
          <li>• Empleos falsos o fraudulentos</li>
          <li>• Contenido ofensivo, discriminatorio o ilegal</li>
          <li>• Spam o publicidad no relacionada</li>
          <li>• Esquemas piramidales o de marketing multinivel</li>
          <li>• Empleos que violen leyes laborales argentinas</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Propiedad intelectual
        </h2>
        <p className="text-lg text-gray-700">
          El contenido, diseño y código de JubiJobs están protegidos por derechos de autor. El código fuente está disponible bajo licencia MIT en GitHub.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Limitación de responsabilidad
        </h2>
        <p className="mb-4 text-lg text-gray-700">
          JubiJobs se proporciona &quot;tal cual&quot; sin garantías de ningún tipo:
        </p>
        <ul className="space-y-2 text-lg text-gray-700">
          <li>• No garantizamos que encontrarás trabajo o candidatos ideales</li>
          <li>• No somos responsables de las interacciones entre empresas y candidatos</li>
          <li>• No verificamos la identidad ni la veracidad de todos los usuarios</li>
          <li>• No somos parte de ninguna relación laboral que surja de la plataforma</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Suspensión y terminación
        </h2>
        <p className="text-lg text-gray-700">
          Nos reservamos el derecho de suspender o eliminar cuentas que violen estos términos o hagan uso indebido de la plataforma.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Modificaciones
        </h2>
        <p className="text-lg text-gray-700">
          Podemos modificar estos términos ocasionalmente. Los cambios significativos serán notificados por email. El uso continuado de la plataforma implica aceptación de los nuevos términos.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Ley aplicable
        </h2>
        <p className="text-lg text-gray-700">
          Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa será resuelta en los tribunales competentes de Argentina.
        </p>
      </section>

      <section className="rounded-lg bg-primary-50 p-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Contacto
        </h2>
        <p className="text-lg text-gray-700">
          Para preguntas sobre estos términos y condiciones, contactanos a través de nuestro email de soporte.
        </p>
      </section>
    </div>
  );
}
