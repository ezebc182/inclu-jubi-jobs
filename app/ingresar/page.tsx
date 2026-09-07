import { Metadata } from "next";
import { LoginOptions } from "@/components/auth/LoginOptions";

export const metadata: Metadata = {
  title: "Ingresar - JubiJobs",
  description:
    "Ingresá a tu cuenta de JubiJobs con Google, Facebook, Microsoft o tu número de teléfono",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-primary-50 to-white px-4 py-12 transition-colors dark:from-paper dark:to-surface">
      <div className="w-full max-w-md">
        <div className="rounded-xl border-2 border-rule bg-white p-10 shadow-lg transition-colors">
          <h1 className="mb-3 text-center text-4xl font-bold text-ink">
            Ingresá a JubiJobs
          </h1>
          <p className="mb-10 text-center text-xl text-ink-soft">
            Usá tu cuenta de Google, Facebook, Microsoft o tu número de teléfono
          </p>

          <LoginOptions />

          <div className="mt-10 rounded-lg bg-primary-50 p-6 transition-colors">
            <p className="text-center text-lg leading-relaxed text-ink">
              <strong className="text-xl">
                ¿Por qué no usamos contraseñas?
              </strong>
              <br />
              <span className="mt-2 block text-ink-soft">
                Para que sea más simple y seguro. Ingresás con tu cuenta de
                Google, Facebook o Microsoft, o recibís un código por SMS, sin
                necesidad de recordar contraseñas.
              </span>
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg text-ink-soft">
              ¿Primera vez?{" "}
              <a
                href="/como-funciona"
                className="font-semibold text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Mirá cómo funciona
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
