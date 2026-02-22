import express from "express";
import uploadController from "../controllers/uploadController.js";

const router = express.Router();

router.post("/upload", uploadController.uploadFile);

export default router;
