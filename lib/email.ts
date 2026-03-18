import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  const verificationUrl = `${appUrl}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Verifica tu correo electrónico",
      html: getVerificationEmailTemplate(name, verificationUrl),
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error };
  }
}

// Template de email con el estilo de tu app
function getVerificationEmailTemplate(name: string, verificationUrl: string) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifica tu correo</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0d1117; color: #e6edf3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #161b22; border: 1px solid #30363d; border-radius: 8px;" cellspacing="0" cellpadding="0" border="0">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 32px; text-align: center; border-bottom: 1px solid #30363d;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #e6edf3;">
                Verifica tu correo electrónico
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px 40px;">
              <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5; color: #e6edf3;">
                Hola <strong>${name}</strong>,
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5; color: #8b949e;">
                Gracias por registrarte. Para completar tu registro y activar tu cuenta, por favor verifica tu correo electrónico haciendo clic en el botón de abajo.
              </p>
              
              <!-- Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-radius: 6px; background-color: #29c5e8;">
                    <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; font-size: 14px; font-weight: 500; color: #0d1117; text-decoration: none; border-radius: 6px;">
                      Verificar correo electrónico
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; font-size: 14px; line-height: 1.5; color: #8b949e;">
                O copia y pega este enlace en tu navegador:
              </p>
              <p style="margin: 8px 0 0; font-size: 13px; color: #29c5e8; word-break: break-all;">
                ${verificationUrl}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #30363d;">
              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #8b949e;">
                Este enlace expirará en <strong>24 horas</strong>. Si no solicitaste esta verificación, puedes ignorar este correo de forma segura.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Bottom text -->
        <table role="presentation" style="max-width: 600px; margin: 24px auto 0;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #8b949e;">
                Este correo fue enviado automáticamente, por favor no respondas.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
