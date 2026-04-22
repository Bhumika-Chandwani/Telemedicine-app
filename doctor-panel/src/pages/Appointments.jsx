import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { fetchDoctorProfile, fetchAllAppointments, updateAppointmentStatus } from "../api/api";
import { X } from "lucide-react";

export default function Appointments() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, apptRes] = await Promise.all([
          fetchDoctorProfile(),
          fetchAllAppointments(),
        ]);
        setDoctor(profileRes);
        setAppointments(apptRes);
      } catch (err) {
        console.error("Appointments load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getDisplayStatus = (status) => {
    if (status === "pending" || status === "confirmed") return "Upcoming";
    if (status === "completed") return "Completed";
    if (status === "cancelled") return "Cancelled";
    return status;
  };

  const filtered = appointments.filter((a) => {
    if (filter === "All") return true;
    if (filter === "Upcoming") return a.status === "pending" || a.status === "confirmed";
    if (filter === "Completed") return a.status === "completed";
    if (filter === "Cancelled") return a.status === "cancelled";
    return true;
  });

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    setUpdating(true);
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      setAppointments((prev) =>
        prev.map((a) => a.appointmentId === appointmentId ? { ...a, status: newStatus } : a)
      );
      if (selectedAppt?.appointmentId === appointmentId) {
        setSelectedAppt((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  const statusBadge = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-teal-100 text-teal-700",
      completed: "bg-gray-200 text-gray-600",
      cancelled: "bg-red-100 text-red-500",
    };
    return map[status] || "bg-gray-100 text-gray-500";
  };

  return (
    <div className="min-h-screen bg-slate-100 relative">
      <Sidebar doctor={doctor} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      <div className={`transition-all duration-300 ${isExpanded ? "ml-64" : "ml-20"} p-8 karla-font`}>
        <div className="mb-6">
          <h1 className="text-2xl text-black">Appointments</h1>
          <p className="text-sm text-black/60 mt-1">{today}</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          {["All", "Upcoming", "Completed", "Cancelled"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm transition-all
                ${filter === type ? "bg-teal-600 text-white" : "bg-teal-50 text-black hover:bg-teal-100"}`}
            >
              {type}
              {type === "All" && !loading && (
                <span className="ml-1.5 text-xs opacity-70">({appointments.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-teal-50/40 border border-teal-500/30 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 px-6 py-4 text-sm text-black font-medium border-b border-black/10">
            <div>Date</div>
            <div>Patient</div>
            <div>Age</div>
            <div>Gender</div>
            <div>Time Slot</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="grid grid-cols-7 px-6 py-4 border-b border-black/10 animate-pulse">
                {[...Array(7)].map((_, j) => (
                  <div key={j} className="h-4 bg-teal-100/50 rounded mr-4" />
                ))}
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="px-6 py-8 text-sm text-black/50 text-center">No appointments found.</div>
          ) : (
            filtered.map((appt) => (
              <div
                key={appt.appointmentId}
                className="grid grid-cols-7 px-6 py-4 text-sm text-black border-b border-black/10 hover:bg-white transition-all cursor-pointer"
                onClick={() => setSelectedAppt(appt)}
              >
                <div className="text-black/60">{appt.date}</div>
                <div className="font-medium">{appt.name}</div>
                <div>{appt.age ?? "—"}</div>
                <div>{appt.gender ?? "—"}</div>
                <div>{appt.timeSlot}</div>
                <div>
                  <span className={`px-2 py-1 rounded-md text-xs ${statusBadge(appt.status)}`}>
                    {getDisplayStatus(appt.status)}
                  </span>
                </div>
                <div>
                  <button
                    className="text-teal-700 text-sm hover:underline"
                    onClick={(e) => { e.stopPropagation(); setSelectedAppt(appt); }}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-semibold">{selectedAppt.name}</h2>
                <p className="text-xs text-gray-400 mt-1">#{selectedAppt.patientDisplayId}</p>
              </div>
              <button onClick={() => setSelectedAppt(null)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-teal-50 rounded-xl p-4">
                <p className="text-xs text-teal-600 font-medium uppercase tracking-wide mb-1">Appointment</p>
                <p className="font-semibold text-teal-800">{selectedAppt.date} · {selectedAppt.timeSlot}</p>
                <p className="text-xs text-teal-600 mt-1 capitalize">{selectedAppt.consultationType}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`text-xs px-2 py-1 rounded-md font-medium ${statusBadge(selectedAppt.status)}`}>
                  {getDisplayStatus(selectedAppt.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Age" value={`${selectedAppt.age ?? "—"} yrs`} />
                <Field label="Gender" value={selectedAppt.gender ?? "—"} />
                <Field label="Blood Group" value={selectedAppt.bloodGroup ?? "—"} />
                <Field label="Chronic Disease" value={selectedAppt.hasChronicDisease != null ? (selectedAppt.hasChronicDisease ? "Yes" : "No") : "—"} />
              </div>

              <Field label="AI Diagnosis" value={selectedAppt.aiDiagnosis ?? "Not available"} />
              <Field label="Symptoms / Notes" value={selectedAppt.notes || "None"} />

              {/* Status Actions */}
              {(selectedAppt.status === "pending") && (
                <div className="flex gap-3 pt-2">
                  <button
                    disabled={updating}
                    onClick={() => handleStatusUpdate(selectedAppt.appointmentId, "confirmed")}
                    className="flex-1 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-60"
                  >
                    {updating ? "..." : "Confirm Appointment"}
                  </button>
                  <button
                    disabled={updating}
                    onClick={() => handleStatusUpdate(selectedAppt.appointmentId, "cancelled")}
                    className="px-4 py-2.5 rounded-lg border border-red-200 text-red-500 text-sm hover:bg-red-50 transition-colors disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {selectedAppt.status === "confirmed" && (
                <button
                  disabled={updating}
                  onClick={() => handleStatusUpdate(selectedAppt.appointmentId, "completed")}
                  className="w-full py-2.5 rounded-lg bg-gray-700 text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-60"
                >
                  {updating ? "..." : "Mark as Completed"}
                </button>
              )}
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setSelectedAppt(null)}
                className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  );
}
