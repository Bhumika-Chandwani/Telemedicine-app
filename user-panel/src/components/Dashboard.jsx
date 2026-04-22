import React, { useState, useEffect } from "react";
import {
  User, Bell, Calendar, Activity, FileText,
  Pill, MessageSquare, Heart, Clock, ChevronRight,
  AlertCircle, ArrowRight,
} from "lucide-react";
import { getPatientProfile, getMyAppointments } from "../services/api";

export default function Dashboard({ patientName = "Patient", navigateTo, profileComplete }) {
  const [patient,      setPatient]      = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, apptRes] = await Promise.all([
          getPatientProfile(),
          getMyAppointments(),
        ]);
        if (profileRes?.patient) setPatient(profileRes.patient);
        if (Array.isArray(apptRes)) setAppointments(apptRes);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const quickLinks = [
    { label:"Book Appointment",   icon:Calendar,      screen:"appointments", bg:"bg-blue-50",   text:"text-blue-600"   },
    { label:"Symptom Checker",    icon:Activity,      screen:"symptoms",     bg:"bg-purple-50", text:"text-purple-600" },
    { label:"Medical Records",    icon:FileText,      screen:"records",      bg:"bg-orange-50", text:"text-orange-600" },
    { label:"Prescriptions",      icon:Pill,          screen:"prescriptions",bg:"bg-green-50",  text:"text-green-600"  },
    { label:"Messages",           icon:MessageSquare, screen:"messages",     bg:"bg-pink-50",   text:"text-pink-600"   },
    { label:"Video Consultation", icon:Calendar,      screen:"video",        bg:"bg-teal-50",   text:"text-teal-600"   },
  ];

  const PROTECTED = ["appointments","symptoms","video","records","prescriptions","messages"];
  const isLocked = (screen) => PROTECTED.includes(screen) && !profileComplete;

  const statusColors = {
    pending:   "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* ── Top Bar ── */}
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-gray-800 text-lg sm:text-xl font-semibold">Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome back, {patientName} 👋</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="flex-1 p-4 sm:p-6">

        {/* ── Profile Incomplete Banner ── */}
        {profileComplete === false && (
          <div className="mb-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-start sm:items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-amber-900 font-semibold text-sm">Complete Your Profile</p>
                <p className="text-amber-700 text-xs mt-0.5">
                  Fill in your profile details to unlock appointments, symptom checker, and all other features.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo("settings")}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors flex-shrink-0"
            >
              Complete Profile <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Profile Summary Card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 sm:p-6 mb-5 sm:mb-6 text-white shadow-lg">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-emerald-100 text-xs sm:text-sm">Patient</p>
              <h2 className="text-lg sm:text-2xl font-bold truncate">{patientName}</h2>
              {patient && (
                <div className="flex flex-wrap gap-2 mt-1 text-xs sm:text-sm text-emerald-100">
                  {patient.bloodGroup && (
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {patient.bloodGroup}
                    </span>
                  )}
                  {patient.gender && <span>• {patient.gender}</span>}
                  {patient.phone  && <span className="hidden sm:inline">• {patient.phone}</span>}
                </div>
              )}
            </div>
            <button
              onClick={() => navigateTo("settings")}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-xs sm:text-sm transition-all flex-shrink-0"
            >
              Edit Profile
            </button>
          </div>

          {patient && (
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-4 pt-4 border-t border-white border-opacity-20">
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold">{patient.height ?? "—"}</p>
                <p className="text-emerald-100 text-xs">Height (cm)</p>
              </div>
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold">{patient.weight ?? "—"}</p>
                <p className="text-emerald-100 text-xs">Weight (kg)</p>
              </div>
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold">{appointments.length}</p>
                <p className="text-emerald-100 text-xs">Appointments</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links Grid */}
        <h3 className="text-gray-700 font-semibold mb-3 text-sm sm:text-base">Quick Access</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
          {quickLinks.map(({ label, icon: Icon, screen, bg, text }) => {
            const locked = isLocked(screen);
            return (
              <button
                key={screen}
                onClick={() => navigateTo(screen)}
                title={locked ? "Complete your profile to unlock" : label}
                className={`relative ${bg} rounded-xl p-3 sm:p-4 flex flex-col items-center gap-1.5 sm:gap-2
                  hover:scale-105 transition-transform shadow-sm
                  ${locked ? "opacity-50" : ""}`}
              >
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${text}`} />
                <span className={`text-xs font-medium ${text} text-center leading-tight`}>{label}</span>
                {locked && (
                  <span className="absolute top-1.5 right-1.5 text-xs">🔒</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-semibold text-sm sm:text-base">Recent Appointments</h3>
            <button
              onClick={() => navigateTo("appointments")}
              className="text-emerald-600 text-xs sm:text-sm flex items-center hover:underline"
            >
              Book new <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8 sm:py-10">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No appointments yet</p>
              {profileComplete && (
                <button
                  onClick={() => navigateTo("appointments")}
                  className="mt-3 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors"
                >
                  Book your first appointment
                </button>
              )}
              {!profileComplete && (
                <button
                  onClick={() => navigateTo("settings")}
                  className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition-colors"
                >
                  Complete profile first
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {appointments.slice(0, 5).map((appt) => (
                <div key={appt._id}
                  className="flex items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-xs sm:text-sm font-medium truncate">
                      {appt.doctorId?.name ?? "Doctor"}
                    </p>
                    <p className="text-gray-500 text-xs hidden sm:block">
                      {appt.doctorId?.specialization ?? ""}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-gray-400 text-xs">
                      <Clock className="w-3 h-3" />
                      {appt.date} • {appt.timeSlot}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    statusColors[appt.status] ?? "bg-gray-100 text-gray-600"
                  }`}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
