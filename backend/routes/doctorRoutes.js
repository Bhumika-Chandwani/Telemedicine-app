import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerDoctor,
  loginDoctor,
  createDoctorProfile,
  getDoctorProfile,
  getTodayAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  getMonthlyAnalytics,
  getDoctorPatients,
  assignConsultation,
} from "../controllers/doctorController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Auth
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.post("/profile/:id", upload.fields([{ name: "profilePhoto" }, { name: "medicalLicense" }, { name: "identityProof" }]), createDoctorProfile);
router.get("/profile", getDoctorProfile);

// Dashboard & Appointments
router.get("/appointments/today", protect, getTodayAppointments);
router.get("/appointments", protect, getAllAppointments);
router.patch("/appointments/:appointmentId/status", protect, updateAppointmentStatus);
router.patch("/appointments/:appointmentId/assign", protect, assignConsultation);

// Analytics
router.get("/analytics/monthly", protect, getMonthlyAnalytics);

// Patients
router.get("/patients", protect, getDoctorPatients);

export default router;
