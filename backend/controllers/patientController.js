import Patient     from "../models/Patient.js";
import Doctor      from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */

// "HH:MM" → minutes since midnight
const toMins = (t) => {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

// minutes → "HH:MM"
const toTime = (mins) =>
  `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

// "Monday" from a YYYY-MM-DD string
const dayOfWeek = (dateStr) => {
  const d = new Date(dateStr + "T00:00:00");
  return ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()];
};

/**
 * Generate 30-min slots between startTime and endTime,
 * excluding the break window, and marking already-booked ones.
 */
const buildSlots = (startTime, endTime, breakStart, breakEnd, bookedLabels = []) => {
  const start      = toMins(startTime);
  const end        = toMins(endTime);
  const brkStart   = toMins(breakStart);
  const brkEnd     = toMins(breakEnd);

  if (start === null || end === null || end <= start) return [];

  const slots = [];
  for (let t = start; t + 30 <= end; t += 30) {
    const sEnd = t + 30;

    // Skip slots that overlap with break
    if (brkStart !== null && brkEnd !== null) {
      if (t < brkEnd && sEnd > brkStart) continue;
    }

    const label     = `${toTime(t)} – ${toTime(sEnd)}`;
    const available = !bookedLabels.includes(label);
    slots.push({ startTime: toTime(t), endTime: toTime(sEnd), label, available });
  }
  return slots;
};

/* ─────────────────────────────────────────
   GET PATIENT PROFILE
───────────────────────────────────────── */
export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });
    if (!patient)
      return res.status(404).json({ message: "Patient profile not found" });
    res.json({ patient });
  } catch (err) {
    console.error("Get patient profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ─────────────────────────────────────────
   UPDATE PATIENT PROFILE
───────────────────────────────────────── */
export const updatePatientProfile = async (req, res) => {
  try {
    const {
      name, phone, dob, gender, bloodGroup,
      height, weight, hasChronicDisease, chronicDiseaseDetail, emergencyContact,
    } = req.body;

    const patient = await Patient.findOneAndUpdate(
      { userId: req.user.id },
      {
        name, phone, dob, gender, bloodGroup,
        height: height ? Number(height) : undefined,
        weight: weight ? Number(weight) : undefined,
        hasChronicDisease, chronicDiseaseDetail, emergencyContact,
      },
      { new: true, runValidators: false }
    );

    if (!patient)
      return res.status(404).json({ message: "Patient profile not found" });

    res.json({ message: "Profile updated successfully", patient });
  } catch (err) {
    console.error("Update patient profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ─────────────────────────────────────────
   GET VERIFIED DOCTORS
───────────────────────────────────────── */
export const getVerifiedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isVerified: true }).select(
      "-medicalLicense -identityProof -userId"
    );
    res.json(doctors);
  } catch (err) {
    console.error("Get doctors error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ─────────────────────────────────────────
   GET AVAILABLE SLOTS FOR A DOCTOR ON A DATE
   GET /api/patient/doctors/:doctorId/slots?date=YYYY-MM-DD
───────────────────────────────────────── */
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date }     = req.query;   // "2025-05-10"

    if (!date) return res.status(400).json({ message: "date query param required" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isVerified)
      return res.status(404).json({ message: "Doctor not found" });

    // Match availability for this day of week
    const weekDay    = dayOfWeek(date);
    const avail      = doctor.availability.find(a => a.day === weekDay);

    if (!avail || !avail.slots?.length) {
      return res.json({ available: false, day: weekDay, slots: [] });
    }

    // Doctor may have multiple slot ranges per day — we use the first (most common setup)
    const { startTime, endTime } = avail.slots[0];

    // Fetch already-booked (non-cancelled) appointments for this doctor on this date
    const booked = await Appointment.find({
      doctorId,
      date,
      status: { $nin: ["cancelled"] },
    }).select("timeSlot");

    const bookedLabels = booked.map(a => a.timeSlot);

    const slots = buildSlots(
      startTime,
      endTime,
      doctor.breakTime?.startTime,
      doctor.breakTime?.endTime,
      bookedLabels
    );

    res.json({
      available: true,
      day: weekDay,
      breakTime: doctor.breakTime,
      slots,
    });
  } catch (err) {
    console.error("Get available slots error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ─────────────────────────────────────────
   BOOK APPOINTMENT
───────────────────────────────────────── */
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, consultationType, notes } = req.body;

    if (!doctorId || !date || !timeSlot)
      return res.status(400).json({ message: "doctorId, date and timeSlot are required" });

    // Verify doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isVerified)
      return res.status(404).json({ message: "Doctor not found or not verified" });

    // ── Double-booking guard ─────────────────────────────────────────────────
    const conflict = await Appointment.findOne({
      doctorId,
      date,
      timeSlot,
      status: { $nin: ["cancelled"] },
    });
    if (conflict)
      return res.status(409).json({
        message: "This time slot is already booked. Please choose another slot.",
      });
    // ────────────────────────────────────────────────────────────────────────

    // Validate slot is within doctor's schedule and not in break
    const weekDay = dayOfWeek(date);
    const avail   = doctor.availability.find(a => a.day === weekDay);
    if (!avail) {
      return res.status(400).json({ message: `Doctor is not available on ${weekDay}.` });
    }

    const { startTime, endTime } = avail.slots[0];
    const validSlots = buildSlots(
      startTime, endTime,
      doctor.breakTime?.startTime,
      doctor.breakTime?.endTime,
      []
    );
    const isValid = validSlots.some(s => s.label === timeSlot);
    if (!isValid) {
      return res.status(400).json({ message: "Selected time slot is not valid for this doctor." });
    }

    // Get patient
    const patient = await Patient.findOne({ userId: req.user.id });
    if (!patient)
      return res.status(404).json({ message: "Patient profile not found" });

    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId,
      date,
      timeSlot,
      consultationType: consultationType || "video",
      notes: notes || "",
      status: "pending",
    });

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    console.error("Book appointment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ─────────────────────────────────────────
   GET MY APPOINTMENTS
───────────────────────────────────────── */
export const getMyAppointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });
    if (!patient)
      return res.status(404).json({ message: "Patient profile not found" });

    const appointments = await Appointment.find({ patientId: patient._id })
      .populate("doctorId", "name specialization profilePhoto experience")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    console.error("Get appointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
