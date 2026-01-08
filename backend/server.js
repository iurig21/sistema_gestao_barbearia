import express from "express";
import cors from "cors";
import sql from "mssql";
import connecttoDB from "./db.js";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

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
  const { username, password } = req.body;
  try {
    if (!username.trim() || !password.trim()) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const result =
      await sql.query`SELECT * FROM utilizadores WHERE username = ${username} AND password = ${password}`;
    console.log(result);
    if (result.recordset.length > 0) {
      const token = jwt.sign({ id: result.recordset[0].id }, "ksdadasd", {
        expiresIn: "1h",
      });
      res.json(token);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server error" });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username.trim() || !password.trim()) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must have at least 6 characters" });
    }

    const { rowsAffected } =
      await sql.query`SELECT * FROM utilizadores WHERE username = ${username}`;

    if (rowsAffected[0] > 0) {
      return res.status(400).json({ message: "Username is being used" });
    }

    const result =
      await sql.query`INSERT INTO utilizadores(username,password) VALUES (${username},${password})`;

    if (result.rowsAffected[0] > 0) {
      res.status(201).json({ message: "User created succesfully" });
    } else {
      res.status(400).json({ message: "Error signing up" });
    }
  } catch (err) {
    console.error("Error signing up:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post(
  "/upload",
  authMiddleware,
  upload.single("myfile"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });
      res.status(201).json({ filename: req.file.filename });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);




connecttoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
