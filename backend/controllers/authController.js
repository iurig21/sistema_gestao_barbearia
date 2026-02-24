import crypto from "crypto";
import UserService from "../services/userService.js";
import AuthService from "../services/authService.js";
import EmailService from "../services/emailService.js";
import MessageService from "../services/messageService.js";
import validator from "validator";

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email.trim() || !password.trim()) {
        return res
          .status(400)
          .json({ message: "O email e password são obrigatórios" });
      }

      const user = await UserService.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const isPasswordCorrect = AuthService.isPasswordCorrect(
        password,
        user.password,
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Credenciais inválidos" });
      }

      const token = AuthService.generateToken(user.id, user.role);

      res.json(token);
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Internal Server error" });
    }
  },

  register: async (req, res) => {
    const {
      nome,
      datanascimento,
      morada,
      email,
      telefone,
      genero,
      fotografia,
      password,
    } = req.body;

    try {
      if (
        !nome.trim() ||
        !datanascimento.trim() ||
        !morada.trim() ||
        !email.trim() ||
        !telefone.trim() ||
        !genero.trim() ||
        !fotografia.trim() ||
        !password.trim()
      ) {
        return res
          .status(400)
          .json({ message: "Todos os inputs são obrigatórios" });
      }

      if(!validator.isEmail(email)){
        return res.status(400).json({message: "Email inválido"})
      }

      const isValidPhone = (phone) => /^9\d{8}$/.test(phone);

      if(!isValidPhone(telefone)){
        return res.status(400).json({message: "Telefone inválido"})
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "A password deve ter pelo menos 6 caracteres" });
      }

      const existingUser = await UserService.getUserByEmail(email);

      if (existingUser) {
        return res.status(400).json({ message: "O email está a ser usado" });
      }

      const hashedPassword = AuthService.hashPassword(password);

      const newUser = await UserService.createUser({
        nome,
        datanascimento,
        morada,
        email,
        telefone,
        genero,
        fotografia,
        password: hashedPassword,
      });

      if (!newUser) {
        return res.status(400).json({ message: "Erro ao registar usuário" });
      }

      const token = crypto.randomBytes(32).toString("hex");
      await UserService.setEmailToken(newUser.id, token);

      EmailService.sendVerificationEmail(email, token).catch((err) =>
        console.error("Erro ao enviar email de verificação:", err)
      );

      const phoneCode = Math.floor(100000 + Math.random() * 900000).toString();
      await UserService.setPhoneCode(newUser.id, phoneCode);

      MessageService.sendWhatsAppCode(telefone, phoneCode).catch((err) => {
        console.error("Erro ao enviar código WhatsApp:", err);
      });

      res
        .status(201)
        .json({ message: "Usuário criado com sucesso. Verifique o seu email e WhatsApp.", success: true, userId: newUser.id });
    } catch (err) {
      console.error("Error signing up:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ message: "Token não fornecido" });
      }

      const user = await UserService.getUserByEmailToken(token);

      if (!user) {
        return res.status(400).json({ message: "Token inválido ou expirado" });
      }

      await UserService.verifyUserEmail(user.id);

      res.status(200).json({ message: "Email verificado com sucesso" });
    } catch (err) {
      console.error("Erro ao verificar email:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  verifyPhone: async (req, res) => {
    try {
      const { userId, code } = req.body;

      if (!userId || !code) {
        return res.status(400).json({ message: "Código e ID são obrigatórios" });
      }

      const user = await UserService.getUserByPhoneCode(userId, code);

      if (!user) {
        return res.status(400).json({ message: "Código inválido" });
      }

      await UserService.verifyUserPhone(user.id);

      res.status(200).json({ message: "Telefone verificado com sucesso" });
    } catch (err) {
      console.error("Erro ao verificar telefone:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  resendPhoneCode: async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "ID do utilizador é obrigatório" });
      }

      const user = await UserService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "Utilizador não encontrado" });
      }

      if (user.telefone_verificado) {
        return res.status(400).json({ message: "Telefone já verificado" });
      }

      const phoneCode = Math.floor(100000 + Math.random() * 900000).toString();
      await UserService.setPhoneCode(user.id, phoneCode);

      await MessageService.sendWhatsAppCode(user.telefone, phoneCode);

      res.status(200).json({ message: "Código reenviado com sucesso" });
    } catch (err) {
      console.error("Erro ao reenviar código:", err);
      const isTwilioError = err?.code === 21608 || err?.message?.includes("Twilio");
      res.status(500).json({
        message: isTwilioError
          ? "Não foi possível enviar o código. Confirme que adicionou o número do Twilio sandbox no WhatsApp."
          : "Erro ao reenviar código",
      });
    }
  },

  checkAuth: (req, res) => {
    res.status(200).json(req.user);
  },
};

export default authController;
