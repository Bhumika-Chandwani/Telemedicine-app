import express from "express";
import upload  from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  signup,
  login,
  logout,
  getProfile,
  getAllUsers,
} from "../controllers/authController.js";
import Signup from "../models/Signup.js";

const router = express.Router();

/* ── SIGNUP – supports patient & doctor file uploads ── */
router.post(
  "/signup",
  upload.fields([
    { name: "profilePhoto",  maxCount: 1 },
    { name: "medicalLicense", maxCount: 1 },
    { name: "identityProof", maxCount: 1 },
  ]),
  signup
);

/* ── LOGIN ── */
router.post("/login", login);

/* ── LOGOUT ── */
router.post("/logout", logout);

/* ── PROFILE – logged-in user ── */
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await Signup.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile fetched successfully", user });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ── GET ALL USERS – admin/internal ── */
router.get("/all", getAllUsers);

export default router;