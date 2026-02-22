import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import serviceController from "../controllers/serviceController.js";

const router = express.Router();

router.get("/services", authMiddleware, serviceController.getServices);
router.post(
  "/services",
  authMiddleware,
  roleMiddleware,
  serviceController.createService,
);
router.put(
  "/services/:id",
  authMiddleware,
  roleMiddleware,
  serviceController.updateService,
);
router.delete(
  "/services/:id",
  authMiddleware,
  roleMiddleware,
  serviceController.deleteService,
);

export default router;
