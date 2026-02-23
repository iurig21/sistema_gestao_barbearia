import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const MessageService = {
  sendWhatsAppCode: async (phoneNumber, code) => {
    const formattedNumber = `whatsapp:+351${phoneNumber}`;

    await client.messages.create({
      body: `O seu código de verificação da Barbearia é: ${code}`,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: formattedNumber,
    });
  },
};

export default MessageService;