import express from "express";
import {
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
  deleteDoctor,
  getAllUsers,
  getDashboardStats
} from "../controllers/adminController.js";

import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();
console.log("Admin Routes Loaded");

/* DASHBOARD */
router.get("/stats", adminAuth, getDashboardStats);

/* USERS */
router.get("/users", adminAuth, getAllUsers);

/* DOCTORS */
router.get("/doctors", adminAuth, getAllDoctors);

// ✅ IMPORTANT: use SAME param name everywhere
router.put("/doctor/approve/:doctorId", adminAuth, approveDoctor);
router.put("/doctor/reject/:doctorId", adminAuth, rejectDoctor);
router.delete("/doctor/:doctorId", adminAuth, deleteDoctor);

export default router;