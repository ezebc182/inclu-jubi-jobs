"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { sendOTPWithRateLimit } from "@/app/actions/auth";
import { toast } from "sonner";

export function PhoneLogin() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validar formato de teléfono (Argentina: +54 + código de área + número)
      const cleanPhone = phoneNumber.replace(/\D/g, "");
      if (cleanPhone.length < 10 || cleanPhone.length > 13) {
        setError("Ingresá un número de teléfono válido");
        setLoading(false);
        return;
      }

      const formattedPhone = cleanPhone.startsWith("54")
        ? `+${cleanPhone}`
        : cleanPhone.startsWith("0")
        ? `+54${cleanPhone.substring(1)}`
        : `+54${cleanPhone}`;

      // Check rate limit before sending OTP
      const rateLimitResult = await sendOTPWithRateLimit(formattedPhone);

      if (!rateLimitResult.success) {
        setError(rateLimitResult.error!);
        toast.error("Demasiados intentos", {
          description: rateLimitResult.error,
          duration: 6000,
        });
        setLoading(false);
        return;
      }

      // Rate limit passed - send OTP
      await authClient.phoneNumber.sendOtp({
        phoneNumber: formattedPhone,
      });

      setPhoneNumber(formattedPhone);
      setStep("otp");

      toast.info("Código enviado", {
        description: `Revisá tu teléfono. Tenés ${rateLimitResult.remaining} intentos más en los próximos 15 minutos.`,
        duration: 5000,
      });
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      setError(err?.message || "Error al enviar el código. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.phoneNumber.verify({
        phoneNumber,
        code: otpCode,
      });

      if (result.error) {
        setError(result.error.message || "Código incorrecto");
        setLoading(false);
        return;
      }

      // Redirigir después de login exitoso
      // La página /onboarding tiene la lógica para redirigir según el rol y estado del usuario
      router.push("/onboarding");
      router.refresh();
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      setError(err?.message || "Código incorrecto o expirado");
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("phone");
    setOtpCode("");
    setError("");
  };

  return (
    <div className="space-y-4">
      {step === "phone" ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label
              htmlFor="phoneNumber"
              className="mb-2 block text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              Número de teléfono
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+54 11 1234-5678"
              className="min-h-[56px] w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              required
              autoFocus
            />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Incluí el código de área sin el 0. Ej: 11 para CABA
            </p>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
              <p className="text-base font-semibold text-red-800 dark:text-red-300">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !phoneNumber}
            className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-lg border-2 border-primary-600 bg-primary-600 px-6 py-4 text-lg font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            {loading ? (
              <>
                <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent"></div>
                <span>Enviando código...</span>
              </>
            ) : (
              <span>Enviar código de verificación</span>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label
              htmlFor="otpCode"
              className="mb-2 block text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              Código de verificación
            </label>
            <input
              type="text"
              id="otpCode"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              maxLength={6}
              className="min-h-[56px] w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-center text-2xl font-bold tracking-widest focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              required
              autoFocus
            />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Ingresá el código de 6 dígitos enviado a {phoneNumber}
            </p>
            {process.env.NODE_ENV !== "production" && (
              <div className="mt-3 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950">
                <p className="text-center text-base font-bold text-yellow-800 dark:text-yellow-300">
                  🔧 MODO DESARROLLO
                </p>
                <p className="mt-2 text-center text-sm text-yellow-700 dark:text-yellow-400">
                  El código OTP se muestra en la <strong>consola del servidor</strong>
                </p>
                <p className="mt-1 text-center text-xs text-yellow-600 dark:text-yellow-500">
                  Buscá en la terminal donde corre <code>npm run dev</code>
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
              <p className="text-base font-semibold text-red-800 dark:text-red-300">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otpCode.length !== 6}
            className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-lg border-2 border-primary-600 bg-primary-600 px-6 py-4 text-lg font-semibold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            {loading ? (
              <>
                <div className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent"></div>
                <span>Verificando...</span>
              </>
            ) : (
              <span>Verificar e ingresar</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleBack}
            className="w-full text-center text-base font-semibold text-primary-600 underline-offset-4 hover:underline dark:text-primary-400"
          >
            ← Cambiar número de teléfono
          </button>
        </form>
      )}
    </div>
  );
}
