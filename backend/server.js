import express from "express";
import cors from "cors";
import sql from "mssql";
import connecttoDB from "./db.js";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/authMiddleware.js";
import roleMiddleware from "./middleware/roleMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import { isDateValid, isValidTime } from "./utils/index.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 3000;

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

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

    const emailCheckResult =
      await sql.query`SELECT * FROM utilizadores WHERE email = ${email}`;

    if (emailCheckResult.recordset.length > 0) {
      return res.status(400).json({ message: "O email está a ser usado" });
    }

    const hashedPassword = bcrypt.hashSync(password);

    const result =
      await sql.query`INSERT INTO utilizadores(nome,datanascimento,morada,email,telefone,genero,fotografia,documento,password) OUTPUT INSERTED.id VALUES (${nome},${datanascimento},${morada},${email},${telefone},${genero},${fotografia},${documento},${hashedPassword})`;

    if (result.recordset.length == 0) {
      return res.status(400).json({ message: "Erro ao registar usuário" });
    }

    res
      .status(201)
      .json({ message: "Usuário criado com sucesso", success: true });
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

app.post("/check-auth", authMiddleware, (req, res) =>
  res.status(200).json(req.user)
);

app.post("/services", authMiddleware, roleMiddleware, async (req, res) => {
  try {
    const { nome, descricao, preco, imagem } = req.body;

    if (!nome.trim() || !imagem.trim() || !preco) {
      return res
        .status(400)
        .json({ message: "O nome,preco e imagem são obrigatórios" });
    }

    const result =
      await sql.query`INSERT INTO servicos(nome,descricao,preco,imagem) OUTPUT INSERTED.* VALUES (${nome},${descricao},${preco},${imagem})`;

    if (result.recordset.length == 0) {
      return res.status(400).json({ message: "Erro a criar serviço" });
    }

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Eror creating a new service:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/services", authMiddleware, async (_, res) => {
  try {
    const { recordset: services } =
      await sql.query`SELECT * FROM servicos ORDER BY preco ASC`;

    res.status(200).json(services);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete(
  "/services/:id",
  authMiddleware,
  roleMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.trim()) {
        return res.status(400).json({ message: "Service ID not provided" });
      }

      const { rowsAffected } =
        await sql.query`DELETE FROM servicos WHERE id = ${id}`;

      if (rowsAffected[0] == 0) {
        return res.status(400).json({ message: "Error deleting service" });
      }

      res.sendStatus(204);
    } catch (err) {
      console.error("Error deleting service:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.put("/services/:id", authMiddleware, roleMiddleware, async (req, res) => {
  try {
    const { newName, newDescription, newPrice, newImage } = req.body;

    const { id: serviceID } = req.params;

    const { rowsAffected } =
      await sql.query`UPDATE servicos SET nome = ${newName}, descricao = ${newDescription}, preco = ${newPrice},imagem = ${newImage} WHERE id = ${serviceID}`;

    if (rowsAffected[0] == 0) {
      return res.status(400).json({ message: "Erro ao atualizar serviço" });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/appointments", authMiddleware, async (req, res) => {
  try {
    const { id: userID } = req.user;

    const { recordset: appointments } =
      await sql.query`SELECT m.id,m.user_id,s.nome AS nome_servico,CONVERT(VARCHAR(10), m.data, 103) AS data_formatada,CONVERT(VARCHAR(5), m.hora, 108) AS hora_formatada FROM marcacoes m INNER JOIN servicos s ON m.servico_id = s.id WHERE m.user_id = ${userID} ORDER BY m.data ASC, m.hora ASC`;

    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/appointments/all", authMiddleware, roleMiddleware, async (_, res) => {
  try {
    const { recordset: appointments } =
      await sql.query`SELECT m.id, u.nome AS usuario_nome, s.nome AS servico_nome, CONVERT(VARCHAR(10), m.data, 103) AS data_formatada, CONVERT(VARCHAR(5), m.hora, 108) AS hora_formatada FROM utilizadores u INNER JOIN marcacoes m ON u.id = m.user_id INNER JOIN servicos s ON m.servico_id = s.id ORDER BY m.data ASC, m.hora ASC`;

    res.status(200).json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/appointments/booked/:date", authMiddleware, async (req, res) => {
  try {
    const { date } = req.params;

    if (!date || !isDateValid(date)) {
      return res.status(400).json({ message: "Data inválida" });
    }

    const { recordset: bookedSlots } =
      await sql.query`SELECT CONVERT(VARCHAR(5), hora, 108) AS hora FROM marcacoes WHERE data = ${date}`;

    const bookedHours = bookedSlots.map((slot) => slot.hora);
    res.status(200).json(bookedHours);
  } catch (err) {
    console.error("Error fetching booked slots:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/appointments", authMiddleware, async (req, res) => {
  try {
    const { id: userID } = req.user;
    const { servicoID, data, hora,barbeiroID } = req.body;

    if (!data.trim() || !hora.trim()) {
      return res
        .status(400)
        .json({ message: "A data e hora são obrigatórios" });
    }

    if (!isDateValid(data)) {
      return res.status(400).json({ message: "A data está inválida" });
    }

    const inputDate = new Date(data);

    const currentDate = new Date();

    if (inputDate < currentDate) {
      return res.status(400).json({
        message: "A data de marcação não pode ser anterior à data atual.",
      });
    }

    if (!isValidTime(hora)) {
      return res.status(400).json({ message: "Hora inválida" });
    }

    const hours = hora.split(":").map(Number)[0];

    if (hours < 9 || hours >= 18) {
      return res
        .status(400)
        .json({ message: "O horário deve estar entre 09:00 e 18:00" });
    }

    const availabilityCheck =
      await sql.query`SELECT * FROM marcacoes WHERE data = ${data} AND hora = ${hora}`;

    if (availabilityCheck.recordset.length > 0) {
      return res.status(400).json({ message: "Sem disponibilidade" });
    }

    const result =
      await sql.query`INSERT INTO marcacoes(user_id,servico_id,data,hora) OUTPUT INSERTED.* VALUES (${userID},${servicoID},${data},${hora})`;

    if (result.recordset.length == 0) {
      return res.status(400).json({ message: "Erro ao criar marcação" });
    }

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Error creating an appointment:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/appointments/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.trim()) {
      return res.status(400).json({ message: "AppointmentID not provided" });
    }

    const { rowsAffected } =
      await sql.query`DELETE FROM marcacoes WHERE id = ${id}`;

    if (rowsAffected[0] == 0) {
      return res.status(400).json({ message: "Erro ao deletar marcação" });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error("Eror deleting appointment:", err);
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
