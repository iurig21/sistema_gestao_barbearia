import express from "express";
import cors from "cors";
import sql from "mssql";
import connecttoDB from "./db.js";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 3000;

// ensure uploads directory exists inside backend
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      !file.mimetype.startsWith("image/") &&
      file.mimetype !== "application/pdf"
    ) {
      return cb(new Error("Only image and PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email.trim() || !password.trim()) {
      return res
        .status(400)
        .json({ message: "O email e password são obrigatórios" });
    }

    const result =
      await sql.query`SELECT * FROM utilizadores WHERE email = ${email}`;
    console.log(result);

    if (result.recordset.length == 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const storedPassword = result.recordset[0].password;
    const isPasswordCorrect = bcrypt.compareSync(password, storedPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Credenciais inválidos" });
    }

    const token = jwt.sign(
      { id: result.recordset[0].id, role: result.recordset[0].role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json(token);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server error" });
  }
});

app.post("/register", async (req, res) => {
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

    const { rowsAffected } =
      await sql.query`SELECT * FROM utilizadores WHERE email = ${email}`;

    if (rowsAffected[0] > 0) {
      return res.status(400).json({ message: "O email está a ser usado" });
    }

    const hashedPassword = bcrypt.hashSync(password);

    const result =
      await sql.query`INSERT INTO utilizadores(nome,datanascimento,morada,email,telefone,genero,fotografia,documento,password) VALUES (${nome},${datanascimento},${morada},${email},${telefone},${genero},${fotografia},${documento},${hashedPassword})`;

    if (result.rowsAffected[0] == 0) {
      return res.status(400).json({ message: "Erro ao registar usuário" });
    }

    res.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (err) {
    console.error("Error signing up:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    res.status(201).json({ filename: req.file.filename });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

connecttoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
