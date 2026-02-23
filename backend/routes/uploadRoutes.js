import express from "express";
import uploadController from "../controllers/uploadController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload",authMiddleware, uploadController.uploadFile);

export default router;
