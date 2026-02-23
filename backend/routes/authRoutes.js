import express from 'express'
import authController from "../controllers/authController.js"
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router()

router.post("/login",authController.login);
router.post("/register",authController.register);
router.get("/verify-email",authController.verifyEmail);
router.post("/verify-phone",authController.verifyPhone);
router.post("/resend-phone-code",authController.resendPhoneCode);
router.post("/check-auth",authMiddleware,authController.checkAuth);

export default router