import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const EmailService = {
  sendVerificationEmail: async (toEmail, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;

    const mailOptions = {
      from: `"Barbearia" <${process.env.EMAIL_USER}>`,
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
    };

    await transporter.sendMail(mailOptions);
  },
};

export default EmailService;
