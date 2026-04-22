import Signup  from "../models/Signup.js";
import Patient from "../models/Patient.js";
import Doctor  from "../models/Doctor.js";
import bcrypt  from "bcryptjs";
import jwt     from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const COOKIE_OPTIONS = {
  httpOnly: true,                                        // JS cannot read (XSS safe)
  secure:   process.env.NODE_ENV === "production",       // HTTPS only in prod
  sameSite: "Lax",
  maxAge:   7 * 24 * 60 * 60 * 1000,                    // 7 days in ms
  path:     "/",
};

/* =====================================================
    SIGNUP CONTROLLER
    Accepts optional patient health fields from Step 3
    of the signup flow (dob, gender, hasChronicDisease,
    chronicDiseaseDetail). All are optional — skipping
    Step 3 leaves them null and the patient can fill
    them in Settings later.
===================================================== */
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["patient", "doctor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await Signup.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create auth record
    const user = await Signup.create({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: role === "patient",
    });

    // Create patient profile
    if (role === "patient") {
      // Pull optional Step 3 fields — all default to null if not provided
      const { dob, gender, hasChronicDisease, chronicDiseaseDetail } = req.body;

      // hasChronicDisease arrives as the string "true"/"false" from FormData
      // or as a real boolean from JSON. Normalise to Boolean | null.
      let chronicBool = null;
      if (hasChronicDisease === "true"  || hasChronicDisease === true)  chronicBool = true;
      if (hasChronicDisease === "false" || hasChronicDisease === false) chronicBool = false;

      await Patient.create({
        userId:               user._id,
        name,
        email,
        dob:                  dob || null,
        gender:               gender || null,
        hasChronicDisease:    chronicBool,
        chronicDiseaseDetail: chronicBool && chronicDiseaseDetail
                                ? chronicDiseaseDetail
                                : null,
      });
    }

    // Create doctor profile
    if (role === "doctor") {
      await Doctor.create({
        userId:         user._id,
        name,
        email,
        phone:          req.body.phone          || null,
        qualification:  req.body.qualification  || null,
        specialization: req.body.specialization || null,
        experience:     req.body.experience     || null,
        bio:            req.body.bio            || null,
        languagesSpoken: req.body.languagesSpoken
          ? JSON.parse(req.body.languagesSpoken)
          : [],
        availability: req.body.availability
          ? JSON.parse(req.body.availability)
          : [],
        breakTime: req.body.breakTime
          ? JSON.parse(req.body.breakTime)
          : null,
        profilePhoto:   req.files?.profilePhoto?.[0]?.path   || null,
        medicalLicense: req.files?.medicalLicense?.[0]?.path || null,
        identityProof:  req.files?.identityProof?.[0]?.path  || null,
      });
    }

    return res.status(201).json({ message: "Signup successful. Please login." });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


/* =====================================================
    LOGIN CONTROLLER  — sets HttpOnly cookie
===================================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await Signup.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.role === "doctor" && !user.isVerified) {
      return res.status(403).json({ message: "Your account is not verified yet." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set token as HttpOnly cookie
    res.cookie("token", token, COOKIE_OPTIONS);

    // Return token in body too (for localStorage fallback)
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id:       user._id,
        name:     user.name,
        email:    user.email,
        role:     user.role,
        verified: user.isVerified,   // fixed: was user.verified in Doc 1
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


/* =====================================================
    LOGOUT CONTROLLER  — clears the cookie
===================================================== */
export const logout = (req, res) => {
  res.clearCookie("token", { path: "/" });
  return res.status(200).json({ message: "Logged out successfully" });
};


/* =====================================================
    GET LOGGED-IN USER PROFILE (TOKEN BASED)
===================================================== */
export const getProfile = async (req, res) => {
  try {
    const user = await Signup.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error("Profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


/* =====================================================
    GET ALL USERS (ADMIN PANEL)
===================================================== */
export const getAllUsers = async (req, res) => {
  try {
    const users = await Signup.find().select("-password");
    return res.json({ users });
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};