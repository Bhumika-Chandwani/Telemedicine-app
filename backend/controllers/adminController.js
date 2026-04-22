import Doctor from "../models/Doctor.js";
import Patient from "../models/Patient.js";
import Signup from "../models/Signup.js";
import sendEmail from "../utils/sendEmail.js";

/* ================= DASHBOARD ================= */
export const getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments({ isVerified: true });
    const pendingApprovals = await Doctor.countDocuments({ isVerified: false });

    res.status(200).json({
      totalPatients,
      totalDoctors,
      pendingApprovals,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= USERS ================= */
export const getAllUsers = async (req, res) => {
  try {
    const patients = await Patient.find()
      .select("name email createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(patients);
  } catch (error) {
    console.error("Users Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= DOCTORS ================= */
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Doctors Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= APPROVE DOCTOR ================= */
export const approveDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      {
        isVerified: true,
        rejectionReason: "",
      },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // ✅ UPDATE USER TABLE
    await Signup.findByIdAndUpdate(doctor.userId, {
      isVerified: true,
    });

    // ✅ EMAIL (SAFE)
    try {
      await sendEmail({
        email: doctor.email,
        subject: "Telemed Account Approved ✅",
        message: `Hello ${doctor.name},

Your profile has been approved.

You can now login.

Telemed Team`,
      });
    } catch (e) {
      console.error("Email error:", e.message);
    }

    return res.status(200).json({
      message: "Doctor approved successfully",
      doctor,
    });

  } catch (error) {
    console.error("Approve Error:", error);
    return res.status(500).json({ message: "Internal server error in email" });
  }
};

/* ================= REJECT DOCTOR ================= */
export const rejectDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason required" });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId,
      {
        isVerified: false,
        rejectionReason: reason,
      },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // ✅ UPDATE USER TABLE
    await Signup.findByIdAndUpdate(doctor.userId, {
      isVerified: false,
    });

    // ✅ EMAIL
    try {
      await sendEmail({
        email: doctor.email,
        subject: "Telemed Profile Rejected ❌",
        message: `Hello ${doctor.name},

Your profile has been rejected.

Reason: ${reason}

Please update and try again.`,
      });
    } catch (e) {
      console.error("Email error:", e.message);
    }

    return res.status(200).json({
      message: "Doctor rejected successfully",
      doctor,
    });

  } catch (error) {
    console.error("Reject Error:", error);
    return res.status(500).json({ message: "Internal server error In emil" });
  }
};

/* ================= DELETE DOCTOR ================= */
export const deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findByIdAndDelete(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // ✅ DELETE USER ALSO
    await Signup.findByIdAndDelete(doctor.userId);

    return res.status(200).json({
      message: "Doctor and user deleted successfully",
    });

  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};