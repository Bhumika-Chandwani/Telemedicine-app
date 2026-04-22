import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { body, validationResult } from "express-validator";

import authRoutes    from "./routes/authRoutes.js";
import adminRoutes   from "./routes/adminRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes  from "./routes/doctorRoutes.js";
import Contact       from "./models/Contact.js";
import Signup        from "./models/Signup.js";

dotenv.config();

const app      = express();
const PORT     = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/telemed";

/* ─────────────────────────────────────────
   MIDDLEWARES
───────────────────────────────────────── */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",,  // patient user panel
  ],
  credentials: true,          // required for cookies
}));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads")); // serve uploaded files

/* ─────────────────────────────────────────
   HEALTH CHECK
───────────────────────────────────────── */
app.get("/health", (req, res) => {
  res.json({ ok: true, dbState: mongoose.connection.readyState });
});

/* ─────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────── */
app.post(
  "/api/contact",
  [
    body("name").notEmpty().withMessage("Name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("message").notEmpty().withMessage("Message required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name, email, phone, subject, message, agree } = req.body;
      const c = new Contact({ name, email, phone, subject, message, agree: !!agree });
      const saved = await c.save();
      return res.status(201).json({ message: "Contact saved", id: saved._id });
    } catch (err) {
      console.error("Save error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

/* ─────────────────────────────────────────
   ROUTES
───────────────────────────────────────── */
app.use("/api/auth",    authRoutes);
app.use("/api/admin",   adminRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor",  doctorRoutes);

/* ALL USERS – quick admin helper */
app.get("/api/users", async (req, res) => {
  try {
    const users = await Signup.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ─────────────────────────────────────────
   CONNECT DB & START
───────────────────────────────────────── */
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected to Telemed");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
  console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "✅ YES" : "❌ NO - CHECK .env FILE");