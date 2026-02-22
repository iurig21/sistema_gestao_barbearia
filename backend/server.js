import express from "express";
import cors from "cors";
import connecttoDB from "./db.js";
import { uploadsDir } from "./services/uploadService.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import barbeiroRoutes from "./routes/barbeiroRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 3000;

app.use("/uploads", express.static(uploadsDir));

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", serviceRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/", barbeiroRoutes);
app.use("/", uploadRoutes);

connecttoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
