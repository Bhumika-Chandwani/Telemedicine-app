import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPatientProfile,
  updatePatientProfile,
  getVerifiedDoctors,
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
} from "../controllers/patientController.js";

const router = express.Router();

/* ── PATIENT PROFILE ── */
router.get("/profile",  protect, getPatientProfile);
router.put("/profile",  protect, updatePatientProfile);

/* ── DOCTORS ── */
router.get("/doctors",                           protect, getVerifiedDoctors);
router.get("/doctors/:doctorId/slots",           protect, getAvailableSlots);

/* ── APPOINTMENTS ── */
router.post("/appointments", protect, bookAppointment);
router.get("/appointments",  protect, getMyAppointments);

export default router;
