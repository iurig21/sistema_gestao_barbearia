import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY?.trim();
const resend = apiKey ? new Resend(apiKey) : null;

const fromEmail =
  process.env.EMAIL_FROM || "Barbearia <onboarding@resend.dev>";

const EmailService = {
  sendVerificationEmail: async (toEmail, token) => {
    if (!resend) {
      throw new Error(
        "RESEND_API_KEY não está definido. Adiciona a variável de ambiente no Railway."
      );
    }
    const verificationUrl = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: "Verifique o seu email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Bem-vindo à Barbearia!</h2>
          <p style="color: #555; font-size: 16px;">Obrigado por se registar. Por favor, clique no botão abaixo para verificar o seu email:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="display: inline-block; padding: 14px 28px; background-color: #4CAF50; 
                      color: white; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
              Verificar Email
            </a>
          </div>
          <p style="color: #888; font-size: 14px;">Se não criou esta conta, ignore este email.</p>
        </div>
      `,
    });

    if (error) throw error;
  },
};

export default EmailService;
