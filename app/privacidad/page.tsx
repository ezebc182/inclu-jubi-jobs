export const metadata = {
  title: "Política de Privacidad - JubiJobs",
  description: "Cómo protegemos tus datos en JubiJobs",
};

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 transition-colors dark:bg-gray-900">
      <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
        Política de Privacidad
      </h1>
      <p className="mb-8 text-base text-gray-600 dark:text-gray-400">
        Última actualización: {new Date().toLocaleDateString("es-AR")}
      </p>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Información que recopilamos
        </h2>
        <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
          En JubiJobs recopilamos la siguiente información:
        </p>
        <ul className="space-y-3 text-lg text-gray-700 dark:text-gray-300">
          <li>
            <strong>Información de cuenta:</strong> Nombre, email (a través de
            OAuth de Google o Microsoft).
          </li>
          <li>
            <strong>Perfil de candidato:</strong> Ubicación, año de nacimiento,
            teléfono (opcional), información de discapacidad (opcional),
            respuestas a las 3 preguntas.
          </li>
          <li>
            <strong>Perfil de empresa:</strong> Nombre de la empresa, sitio web
            (opcional), ubicación (opcional), descripción.
          </li>
          <li>
            <strong>Empleos y postulaciones:</strong> Datos de los empleos
            publicados y postulaciones realizadas.
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Cómo usamos tu información
        </h2>
        <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
          Usamos tu información para:
        </p>
        <ul className="space-y-2 text-lg text-gray-700 dark:text-gray-300">
          <li>• Conectar candidatos con empresas</li>
          <li>• Mostrar empleos relevantes según ubicación y preferencias</li>
          <li>
            • Enviar notificaciones sobre postulaciones (emails transaccionales)
          </li>
          <li>• Mejorar la plataforma y la experiencia del usuario</li>
          <li>• Cumplir con requisitos legales</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Compartir información
        </h2>
        <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
          <strong>No vendemos tu información.</strong> Solo compartimos datos en
          estos casos:
        </p>
        <ul className="space-y-2 text-lg text-gray-700 dark:text-gray-300">
          <li>
            • <strong>Con empresas:</strong> Tu perfil y respuestas cuando te
            postulás a un empleo.
          </li>
          <li>
            • <strong>Con candidatos:</strong> Datos de contacto de la empresa
            cuando solicitan contactarte.
          </li>
          <li>
            • <strong>Por ley:</strong> Si es requerido por autoridades legales.
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Seguridad
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Implementamos medidas de seguridad para proteger tu información:
        </p>
        <ul className="mt-4 space-y-2 text-lg text-gray-700 dark:text-gray-300">
          <li>• Autenticación OAuth segura (Google y Microsoft)</li>
          <li>• Conexión HTTPS cifrada</li>
          <li>• Base de datos protegida con acceso restringido</li>
          <li>• Validaciones de seguridad en todas las operaciones</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Tus derechos
        </h2>
        <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
          Tenés derecho a:
        </p>
        <ul className="space-y-2 text-lg text-gray-700 dark:text-gray-300">
          <li>• Acceder a tu información personal</li>
          <li>• Corregir datos incorrectos</li>
          <li>• Eliminar tu cuenta y datos asociados</li>
          <li>• Exportar tus datos</li>
          <li>• Rechazar el procesamiento de tus datos</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Cookies
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          JubiJobs usa cookies esenciales para autenticación y funcionamiento
          básico. No usamos cookies de publicidad o seguimiento de terceros.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Cambios a esta política
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Podemos actualizar esta política de privacidad ocasionalmente. Te
          notificaremos por email sobre cambios significativos.
        </p>
      </section>

      <section className="rounded-lg bg-primary-50 p-6 transition-colors dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Contacto
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Para preguntas sobre esta política de privacidad o para ejercer tus
          derechos, contactanos a través de nuestro email de soporte.
        </p>
      </section>
    </div>
  );
}
