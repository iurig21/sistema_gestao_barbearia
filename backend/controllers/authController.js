import crypto from "crypto";
import UserService from "../services/userService.js";
import AuthService from "../services/authService.js";
import EmailService from "../services/emailService.js";

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
      documento,
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
        !documento.trim() ||
        !password.trim()
      ) {
        return res
          .status(400)
          .json({ message: "Todos os inputs são obrigatórios" });
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
        documento,
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

      res
        .status(201)
        .json({ message: "Usuário criado com sucesso. Verifique o seu email.", success: true });
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

  checkAuth: (req, res) => {
    res.status(200).json(req.user);
  },
};

export default authController;
