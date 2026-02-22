import express from 'express'
import authController from "../controllers/authController.js"
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router()

router.post("/login",authController.login);
router.post("/register",authController.register);
router.post("/check-auth",authMiddleware,authController.checkAuth);

export default router