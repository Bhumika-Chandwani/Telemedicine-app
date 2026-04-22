import express from "express";
import multer from "multer";
import {
  registerDoctor,
  loginDoctor,
  createDoctorProfile,
  getDoctorProfile
} from "../controllers/doctorController.js";

const router = express.Router();

/* ================== MULTER CONFIG ================== */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================== ROUTES ================== */
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);

router.post(
  "/profile/:id",
  upload.fields([
    { name: "profilePhoto" },
    { name: "medicalLicense" },
    { name: "identityProof" },
  ]),
  createDoctorProfile
);

router.get("/profile", getDoctorProfile);

export default router;