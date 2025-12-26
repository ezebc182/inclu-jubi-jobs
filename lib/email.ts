import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_EMAIL = process.env.EMAIL_FROM || "noreply@jubijobs.com";

export async function sendApplicationConfirmation({
  to,
  candidateName,
  jobTitle,
  companyName,
}: {
  to: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
}) {
  if (!process.env.SMTP_USER) {
    console.log("⚠️  Email no enviado (SMTP no configurado):", {
      to,
      subject: "Confirmación de postulación",
    });
    return;
  }

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: "Confirmación de postulación - JubiJobs",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">¡Postulación enviada con éxito!</h2>
          <p>Hola ${candidateName},</p>
          <p>Tu postulación para el puesto de <strong>${jobTitle}</strong> en <strong>${companyName}</strong> fue enviada correctamente.</p>
          <p>La empresa revisará tu perfil y se pondrá en contacto si tu perfil se ajusta a lo que buscan.</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Gracias por usar JubiJobs - Trabajos para jubilados<br>
            <a href="${process.env.BETTER_AUTH_URL || "http://localhost:3000"}" style="color: #0ea5e9;">Ver mis postulaciones</a>
          </p>
        </div>
      `,
    });
    console.log("✅ Email de confirmación enviado a:", to);
  } catch (error) {
    console.error("❌ Error enviando email de confirmación:", error);
  }
}

export async function sendNewApplicationNotification({
  to,
  companyName,
  jobTitle,
  candidateName,
  dashboardUrl,
}: {
  to: string;
  companyName: string;
  jobTitle: string;
  candidateName: string;
  dashboardUrl: string;
}) {
  if (!process.env.SMTP_USER) {
    console.log("⚠️  Email no enviado (SMTP no configurado):", {
      to,
      subject: "Nueva postulación recibida",
    });
    return;
  }

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      subject: `Nueva postulación - ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">Nueva postulación recibida</h2>
          <p>Hola ${companyName},</p>
          <p><strong>${candidateName}</strong> se postuló para el puesto de <strong>${jobTitle}</strong>.</p>
          <p>
            <a href="${dashboardUrl}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Ver postulación
            </a>
          </p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            JubiJobs - Plataforma de empleos para jubilados
          </p>
        </div>
      `,
    });
    console.log("✅ Email de notificación enviado a:", to);
  } catch (error) {
    console.error("❌ Error enviando email de notificación:", error);
  }
}

export async function sendContactRequest({
  to,
  candidateName,
  jobTitle,
  companyName,
  companyEmail,
  companyPhone,
}: {
  to: string;
  candidateName: string;
  jobTitle: string;
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
}) {
  if (!process.env.SMTP_USER) {
    console.log("⚠️  Email no enviado (SMTP no configurado):", {
      to,
      subject: "Solicitud de contacto",
    });
    return;
  }

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to,
      replyTo: companyEmail,
      subject: `${companyName} quiere contactarte - ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">¡Buenas noticias!</h2>
          <p>Hola ${candidateName},</p>
          <p><strong>${companyName}</strong> revisó tu postulación para <strong>${jobTitle}</strong> y quiere ponerse en contacto con vos.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Datos de contacto:</h3>
            <p style="margin: 5px 0;"><strong>Empresa:</strong> ${companyName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${companyEmail}">${companyEmail}</a></p>
            ${companyPhone ? `<p style="margin: 5px 0;"><strong>Teléfono:</strong> ${companyPhone}</p>` : ""}
          </div>
          <p>Podés responder este email o contactarlos directamente.</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            JubiJobs - Trabajos para jubilados<br>
            <a href="${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/postulaciones" style="color: #0ea5e9;">Ver mis postulaciones</a>
          </p>
        </div>
      `,
    });
    console.log("✅ Email de solicitud de contacto enviado a:", to);
  } catch (error) {
    console.error("❌ Error enviando email de solicitud de contacto:", error);
  }
}
