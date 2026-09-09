"use client";

import { useState } from "react";
import { esCuitValido, esDniValido, formatearCuit } from "@/lib/identificacion";

/**
 * Quién publica el empleo, y con qué responsabilidad.
 *
 * Antes el formulario pedía un nombre de empresa y nada más. Cualquiera
 * escribía "Empresa SA" y ya podía subir avisos que ven personas jubiladas y
 * personas con discapacidad buscando trabajo.
 *
 * Los datos no prueban identidad —no se consulta a AFIP ni a RENAPER—, pero
 * dejan rastro y disuaden. La defensa real es la moderación: los avisos entran
 * en PENDING y alguien los aprueba. Esto le da a esa persona con qué decidir.
 *
 * Se admiten particulares a propósito: mucho trabajo por día para esta
 * audiencia lo ofrece una casa que busca cuidador, no una empresa formal.
 * Dejarlos afuera sería dejar afuera el trabajo real.
 */
export function EmployerIdentityFields() {
  const [tipo, setTipo] = useState<"EMPRESA" | "PARTICULAR">("EMPRESA");
  const [documento, setDocumento] = useState("");
  const esEmpresa = tipo === "EMPRESA";

  // Se valida mientras se escribe, pero el error solo se muestra cuando el
  // número está completo: marcar en rojo al segundo dígito es hostigar.
  const digitos = documento.replace(/\D/g, "");
  const largoEsperado = esEmpresa ? 11 : 8;
  const completo = digitos.length >= largoEsperado;
  const valido = esEmpresa ? esCuitValido(digitos) : esDniValido(digitos);
  const mostrarError = completo && !valido;

  return (
    <>
      <fieldset className="flex flex-col gap-3">
        <legend className="text-lg font-bold text-ink">
          ¿Quién publica el empleo?
        </legend>

        {(
          [
            {
              value: "EMPRESA" as const,
              label: "Una empresa",
              hint: "Comercio, pyme, organización o institución.",
            },
            {
              value: "PARTICULAR" as const,
              label: "Una persona",
              hint: "Ofrecés trabajo por tu cuenta: cuidado, tareas del hogar, changas.",
            },
          ] satisfies Array<{
            value: "EMPRESA" | "PARTICULAR";
            label: string;
            hint: string;
          }>
        ).map((opcion) => (
          <label
            key={opcion.value}
            className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors ${
              tipo === opcion.value
                ? "border-primary-600 bg-primary-50 dark:bg-primary-900/25"
                : "border-rule hover:border-primary-300"
            }`}
          >
            <input
              type="radio"
              name="employerType"
              value={opcion.value}
              checked={tipo === opcion.value}
              onChange={() => {
                setTipo(opcion.value);
                // El documento cambia de tipo: dejarlo escrito mostraría un
                // CUIT en el campo de DNI.
                setDocumento("");
              }}
              className="mt-1.5 h-5 w-5 shrink-0 accent-primary-600"
            />
            <span>
              <span className="block text-lg font-semibold text-ink">
                {opcion.label}
              </span>
              <span className="mt-0.5 block text-base text-ink-soft">
                {opcion.hint}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={esEmpresa ? "taxId" : "nationalId"}
          className="text-lg font-bold text-ink"
        >
          {esEmpresa ? "CUIT de la empresa" : "Tu DNI"}
          <span className="ml-1 text-red-600 dark:text-red-400">*</span>
        </label>

        {/* El name cambia con el tipo para que el servidor reciba solo el campo
            que corresponde, y el otro llegue vacío. */}
        <input
          type="text"
          inputMode="numeric"
          id={esEmpresa ? "taxId" : "nationalId"}
          name={esEmpresa ? "taxId" : "nationalId"}
          required
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          aria-invalid={mostrarError}
          aria-describedby={
            mostrarError ? "documento-error" : "documento-ayuda"
          }
          className={`min-h-[48px] rounded-lg border px-4 py-3 text-lg focus:outline-none focus:ring-2 ${
            mostrarError
              ? "border-red-600 focus:ring-red-300"
              : "border-rule focus:border-primary-600 focus:ring-primary-300"
          }`}
          placeholder={esEmpresa ? "30-12345678-9" : "12345678"}
        />

        {mostrarError ? (
          <p
            id="documento-error"
            role="alert"
            className="text-base text-red-700 dark:text-red-400"
          >
            {esEmpresa
              ? "Revisá el CUIT: son 11 dígitos y el último no coincide."
              : "El DNI tiene entre 7 y 8 dígitos, sin puntos."}
          </p>
        ) : (
          <p id="documento-ayuda" className="text-base text-ink-soft">
            {esEmpresa
              ? "Con o sin guiones, como te resulte más cómodo."
              : "Sin puntos ni espacios."}
            {esEmpresa && valido && completo && (
              <span className="ml-1 font-semibold text-ink">
                {formatearCuit(digitos)}
              </span>
            )}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contactName" className="text-lg font-bold text-ink">
          Tu nombre y apellido
          <span className="ml-1 text-red-600 dark:text-red-400">*</span>
        </label>
        <input
          type="text"
          id="contactName"
          name="contactName"
          required
          minLength={3}
          autoComplete="name"
          className="min-h-[48px] rounded-lg border border-rule px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
          placeholder="María González"
        />
        <p className="text-base text-ink-soft">
          Un aviso lo firma una persona, no una razón social.
        </p>
      </div>

      {esEmpresa && (
        <div className="flex flex-col gap-2">
          <label htmlFor="contactRole" className="text-lg font-bold text-ink">
            Tu cargo en la empresa
          </label>
          <input
            type="text"
            id="contactRole"
            name="contactRole"
            autoComplete="organization-title"
            className="min-h-[48px] rounded-lg border border-rule px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="Encargada de personal"
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="contactPhone" className="text-lg font-bold text-ink">
          Teléfono de contacto
          <span className="ml-1 text-red-600 dark:text-red-400">*</span>
        </label>
        <input
          type="tel"
          inputMode="tel"
          id="contactPhone"
          name="contactPhone"
          required
          autoComplete="tel"
          className="min-h-[48px] rounded-lg border border-rule px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
          placeholder="351 234 5678"
        />
        <p className="text-base text-ink-soft">
          Con código de área. No se publica: lo usamos para verificar el aviso
          si hace falta.
        </p>
      </div>
    </>
  );
}
