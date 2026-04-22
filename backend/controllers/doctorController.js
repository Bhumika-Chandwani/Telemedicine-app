import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Appointment from "../models/Appointment.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) return res.status(400).json({ message: "Doctor already registered with this email" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({ name, email, password: hashedPassword, specialization, isVerified: false });
    res.status(201).json({ message: "Doctor registered successfully. Complete your profile.", doctorId: doctor._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDoctorProfile = async (req, res) => {
  try {
    const { qualification, experience, bio, phone } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    doctor.qualification = qualification || doctor.qualification;
    doctor.experience = experience || doctor.experience;
    doctor.bio = bio || doctor.bio;
    doctor.phone = phone || doctor.phone;
    if (req.files?.profilePhoto?.[0]?.filename) doctor.profilePhoto = `uploads/${req.files.profilePhoto[0].filename}`;
    if (req.files?.medicalLicense?.[0]?.filename) doctor.medicalLicense = `uploads/${req.files.medicalLicense[0].filename}`;
    if (req.files?.identityProof?.[0]?.filename) doctor.identityProof = `uploads/${req.files.identityProof[0].filename}`;
    await doctor.save();
    res.status(200).json({ message: "Profile created successfully", doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    if (!doctor.isVerified) return res.status(403).json({ message: "Your account is not approved by admin" });
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: doctor._id, role: "doctor" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ message: "Login successful", token, doctor: { _id: doctor._id, name: doctor.name, email: doctor.email, specialization: doctor.specialization, isVerified: doctor.isVerified } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doctor = await Doctor.findById(decoded.id).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });
    res.status(200).json(doctor);
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const getAge = (dob) => {
  if (!dob) return null;
  return Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
};

const formatAppointment = (appt) => {
  const p = appt.patientId;
  return {
    appointmentId: appt._id,
    patientId: p?._id,
    patientDisplayId: p?._id ? `MD${String(p._id).slice(-9).toUpperCase()}` : "UNKNOWN",
    name: p?.name || "Unknown",
    age: getAge(p?.dob),
    gender: p?.gender,
    bloodGroup: p?.bloodGroup,
    hasChronicDisease: p?.hasChronicDisease,
    chronicDiseaseDetail: p?.chronicDiseaseDetail,
    aiDiagnosis: p?.predictionDetail,
    timeSlot: appt.timeSlot,
    consultationType: appt.consultationType,
    notes: appt.notes,
    status: appt.status,
    meetingLink: appt.meetingLink,
    date: appt.date,
  };
};

export const getTodayAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const today = new Date().toISOString().split("T")[0];
    const appointments = await Appointment.find({ doctorId, date: today, status: { $in: ["pending", "confirmed", "completed"] } })
      .populate("patientId", "name dob gender bloodGroup hasChronicDisease chronicDiseaseDetail predictionDetail")
      .sort({ timeSlot: 1 });
    const formatted = appointments.map(formatAppointment);
    res.json({ count: formatted.length, appointments: formatted });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { date, status } = req.query;
    const query = { doctorId };
    if (date) query.date = date;
    if (status) query.status = status;
    const appointments = await Appointment.find(query)
      .populate("patientId", "name dob gender bloodGroup hasChronicDisease chronicDiseaseDetail predictionDetail")
      .sort({ date: -1, timeSlot: 1 });
    res.json(appointments.map(formatAppointment));
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, meetingLink } = req.body;
    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, doctorId: req.user.id },
      { status, ...(meetingLink && { meetingLink }) },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Appointment updated", appointment });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMonthlyAnalytics = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const monthPrefix = `${year}-${month}`;
    const monthlyAppts = await Appointment.find({ doctorId, date: { $regex: `^${monthPrefix}` } });
    const total = monthlyAppts.length;
    const completed = monthlyAppts.filter((a) => a.status === "completed").length;
    const cancelled = monthlyAppts.filter((a) => a.status === "cancelled").length;
    const daysInMonth = now.getDate();
    const avgPerDay = daysInMonth > 0 ? +(total / daysInMonth).toFixed(1) : 0;
    const prevDate = new Date(year, now.getMonth() - 1, 1);
    const prevPrefix = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;
    const prevTotal = await Appointment.countDocuments({ doctorId, date: { $regex: `^${prevPrefix}` } });
    const growth = prevTotal > 0 ? +(((total - prevTotal) / prevTotal) * 100).toFixed(1) : 0;
    res.json({
      total, completed, cancelled,
      pending: monthlyAppts.filter((a) => a.status === "pending").length,
      confirmed: monthlyAppts.filter((a) => a.status === "confirmed").length,
      avgPerDay,
      avgPerMonth: total,
      hoursSpent: +(total * 0.5).toFixed(1),
      growth,
      attendanceRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getDoctorPatients = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const appointments = await Appointment.find({ doctorId })
      .populate("patientId", "name dob gender bloodGroup hasChronicDisease chronicDiseaseDetail predictionDetail")
      .sort({ date: -1 });
    const patientMap = new Map();
    for (const appt of appointments) {
      const p = appt.patientId;
      if (!p) continue;
      const pid = String(p._id);
      if (!patientMap.has(pid)) {
        patientMap.set(pid, {
          patientId: p._id,
          patientDisplayId: `MD${pid.slice(-9).toUpperCase()}`,
          name: p.name,
          age: getAge(p.dob),
          gender: p.gender,
          bloodGroup: p.bloodGroup,
          hasChronicDisease: p.hasChronicDisease,
          chronicDiseaseDetail: p.chronicDiseaseDetail,
          aiDiagnosis: p.predictionDetail,
          appointments: [],
        });
      }
      patientMap.get(pid).appointments.push({
        appointmentId: appt._id,
        date: appt.date,
        timeSlot: appt.timeSlot,
        consultationType: appt.consultationType,
        notes: appt.notes,
        status: appt.status,
        meetingLink: appt.meetingLink,
      });
    }
    const patients = Array.from(patientMap.values()).map((pt) => {
      const appts = pt.appointments;
      const sorted = [...appts].sort((a, b) => new Date(b.date) - new Date(a.date));
      let consultationStatus = "unassigned";
      if (appts.some((a) => a.status === "completed")) consultationStatus = "done";
      else if (appts.some((a) => a.status === "confirmed")) consultationStatus = "assigned";
      else if (appts.some((a) => a.status === "pending")) consultationStatus = "pending";
      return { ...pt, consultationStatus, latestAppointment: sorted[0] || null };
    });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const assignConsultation = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { date, timeSlot, meetingLink } = req.body;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, doctorId: req.user.id },
      { status: "confirmed", ...(date && { date }), ...(timeSlot && { timeSlot }), ...(meetingLink && { meetingLink }) },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ message: "Consultation assigned", appointment });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

