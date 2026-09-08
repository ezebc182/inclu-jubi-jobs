import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { phoneNumber } from "better-auth/plugins";
import { prisma } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: false, // Solo OAuth para simplificar
  },
  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_ID || "",
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET || "",
      enabled: !!process.env.BETTER_AUTH_GOOGLE_ID,
    },
    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_ID || "",
      clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET || "",
      enabled: !!process.env.BETTER_AUTH_GITHUB_ID,
    },
    microsoft: {
      clientId: process.env.BETTER_AUTH_MICROSOFT_ID || "",
      clientSecret: process.env.BETTER_AUTH_MICROSOFT_SECRET || "",
      enabled: !!process.env.BETTER_AUTH_MICROSOFT_ID,
    },
    facebook: {
      clientId: process.env.BETTER_AUTH_FACEBOOK_ID || "",
      clientSecret: process.env.BETTER_AUTH_FACEBOOK_SECRET || "",
      enabled: !!process.env.BETTER_AUTH_FACEBOOK_ID,
    },
  },
  plugins: [
    phoneNumber({
      otpLength: 6,
      expiresIn: 300, // 5 minutos
      sendOTP: async ({ phoneNumber, code }, request) => {
        const isDevelopment = process.env.NODE_ENV !== "production";

        if (isDevelopment) {
          console.log(`\n${"=".repeat(60)}`);
          console.log(`📱 CÓDIGO OTP DE DESARROLLO`);
          console.log(`${"=".repeat(60)}`);
          console.log(`   Teléfono: ${phoneNumber}`);
          console.log(`   Código:   ${code}`);
          console.log(`   ⚠️  Copiá este código para usarlo`);
          console.log(`${"=".repeat(60)}\n`);
        } else {
          // En producción, integrar con servicio de SMS
          // await twilioClient.messages.create({
          //   body: `Tu código de verificación JubiJobs es: ${code}`,
          //   from: process.env.TWILIO_PHONE_NUMBER,
          //   to: phoneNumber
          // });
        }
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => `${phoneNumber}@jubijobs.temp`,
        getTempName: (phoneNumber) => phoneNumber,
      },
    }),
  ],
  secret: process.env.AUTH_SECRET || "development-secret-min-32-chars-long",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  /**
   * Los dos portales se sirven desde el mismo deploy, pero `baseURL` es un
   * solo valor. Sin declarar los orígenes de confianza, el login funciona
   * en el dominio de `BETTER_AUTH_URL` y falla en el otro.
   */
  trustedOrigins: [
    "https://jubijobs.com",
    "https://www.jubijobs.com",
    "https://inclujobs.com",
    "https://www.inclujobs.com",
    ...(process.env.NODE_ENV !== "production" ? ["http://localhost:3000"] : []),
  ],
});

export type Session = typeof auth.$Infer.Session;
