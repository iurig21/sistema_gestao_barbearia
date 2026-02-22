import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import barbeiroController from "../controllers/barbeiroController.js";

const router = express.Router();

router.get("/barbeiros", authMiddleware, barbeiroController.getBarbeiros);
router.post(
  "/barbeiro",
  authMiddleware,
  roleMiddleware,
  barbeiroController.createBarbeiro,
);
router.delete(
  "/barbeiro/:id",
  authMiddleware,
  roleMiddleware,
  barbeiroController.deleteBarbeiro,
);

export default router;
