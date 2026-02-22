import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import appointmentController from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/", authMiddleware, appointmentController.getAppointments);
router.get(
  "/all",
  authMiddleware,
  roleMiddleware,
  appointmentController.getAllAppointments,
);
router.get(
  "/booked/:date",
  authMiddleware,
  appointmentController.getBookedSlots,
);
router.post("/", authMiddleware, appointmentController.createAppointment);
router.delete("/:id", authMiddleware, appointmentController.deleteAppointment);

export default router;
