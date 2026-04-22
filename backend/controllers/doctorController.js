import Doctor from "../models/Doctor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =========================================================
   REGISTER DOCTOR (Step 1)
========================================================= */
export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor already registered with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      specialization,
      isVerified: false,
    });

    res.status(201).json({
      message: "Doctor registered successfully. Complete your profile.",
      doctorId: doctor._id,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   CREATE / UPDATE PROFILE (Step 2)
========================================================= */
export const createDoctorProfile = async (req, res) => {
  try {
    const { qualification, experience, bio, phone } = req.body;
    const doctorId = req.params.id;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    /* ---------- BASIC INFO ---------- */
    doctor.qualification = qualification || doctor.qualification;
    doctor.experience = experience || doctor.experience;
    doctor.bio = bio || doctor.bio;
    doctor.phone = phone || doctor.phone;

    /* ---------- FILE HANDLING (SAFE) ---------- */
    if (req.files?.profilePhoto?.[0]?.filename) {
      doctor.profilePhoto = `uploads/${req.files.profilePhoto[0].filename}`;
    }

    if (req.files?.medicalLicense?.[0]?.filename) {
      doctor.medicalLicense = `uploads/${req.files.medicalLicense[0].filename}`;
    }

    if (req.files?.identityProof?.[0]?.filename) {
      doctor.identityProof = `uploads/${req.files.identityProof[0].filename}`;
    }

    await doctor.save();

    res.status(200).json({
      message: "Profile created successfully",
      doctor,
    });

  } catch (error) {
    console.error("Profile creation error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   LOGIN DOCTOR
========================================================= */
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });

    if (!doctor)
      return res.status(404).json({ message: "Doctor not found" });

    if (!doctor.isVerified)
      return res.status(403).json({
        message: "Your account is not approved by admin",
      });

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: doctor._id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      doctor: {
        _id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        isVerified: doctor.isVerified,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =========================================================
   GET DOCTOR PROFILE
========================================================= */
export const getDoctorProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const doctor = await Doctor.findById(decoded.id).select("-password");

    if (!doctor)
      return res.status(404).json({ message: "Doctor profile not found" });

    res.status(200).json(doctor);

  } catch (error) {
    console.error("Profile error:", error);
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};