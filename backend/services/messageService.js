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

  sendMessageRemainder: async (phoneNumber,data,hour) => {
    const formattedNumber = `whatsapp:+351${phoneNumber}`;
    const [year,month,day] = data.split("-");
    const formattedData = `${day}/${month}/${year}`

    await client.messages.create({
      body: `Efetuou uma marcação na barbearia ás ${hour}h do dia ${formattedData}.`,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: formattedNumber,
    });
  }
};

export default MessageService;