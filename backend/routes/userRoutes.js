import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import userController from "../controllers/userController.js";

const router = express.Router();

router.get("/users", authMiddleware, roleMiddleware, userController.getUsers);
router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware,
  userController.deleteUser,
);
router.put("/users/:id",authMiddleware,userController.updateUser);

export default router;
