import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import googleController from "../controllers/googleController.js";

const router = express.Router();

router.get("/google/auth-url", authMiddleware, googleController.getAuthUrl);
router.get("/google/callback", googleController.handleCallback);
router.get("/google/status", authMiddleware, googleController.getStatus);
router.delete("/google/disconnect", authMiddleware, googleController.disconnect);

export default router;
