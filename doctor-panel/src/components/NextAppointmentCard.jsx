import { useState } from "react";
import { X } from "lucide-react";
import { updateAppointmentStatus } from "../api/api";

export default function NextAppointmentCard({ appointment, loading = false, onUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleAccept = async () => {
    if (!appointment) return;
    setAccepting(true);
    try {
      const res = await updateAppointmentStatus(appointment.appointmentId, "confirmed");
      setAccepted(true);
      if (onUpdate) onUpdate({ ...appointment, status: "confirmed" });
    } catch (err) {
      console.error("Accept error:", err);
      alert("Failed to accept consultation. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="karla-font w-[420px] bg-teal-50/40 border border-teal-500/30 rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-5 bg-teal-200/50 rounded w-1/2 mb-2" />
        <div className="h-3 bg-teal-100/50 rounded w-1/3 mb-6" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-3 bg-teal-100/40 rounded mb-3" />
        ))}
        <div className="h-9 bg-teal-300/40 rounded-lg mt-6" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="karla-font w-[420px] bg-teal-50/40 border border-teal-500/30 rounded-2xl p-6 shadow-sm">
        <p className="text-black/60 text-sm">No upcoming appointments.</p>
      </div>
    );
  }

  const isConfirmed = appointment.status === "confirmed" || accepted;

  return (
    <>
      <div className="karla-font w-[420px] bg-teal-50/40 backdrop-blur-sm border border-teal-500/30 rounded-2xl p-6 shadow-sm">
        {/* TOP */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl text-black">{appointment.name}</h2>
            <p className="text-xs text-black/60 mt-1">#{appointment.patientDisplayId}</p>
          </div>
          <p className="text-sm text-black/70 whitespace-nowrap">{appointment.timeSlot}</p>
        </div>

        {/* DETAILS */}
        <div className="space-y-3 text-sm">
          <DetailRow label="Age" value={`${appointment.age ?? "—"} yrs • ${appointment.gender ?? "—"}`} />
          <DetailRow label="Blood Group" value={appointment.bloodGroup ?? "—"} />
          <DetailRow label="AI Diagnosis" value={appointment.aiDiagnosis ?? "—"} />
          <DetailRow label="Symptoms" value={appointment.notes || "—"} />
          <DetailRow label="Chronic Disease" value={appointment.hasChronicDisease != null ? (appointment.hasChronicDisease ? `Yes — ${appointment.chronicDiseaseDetail || ""}` : "No") : "—"} />
          <DetailRow label="Type" value={appointment.consultationType} />
        </div>

        {/* BUTTON */}
        <div className="mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-2 rounded-lg bg-teal-600 text-white text-sm transition-all duration-200 hover:bg-teal-700"
          >
            Medical Card →
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{appointment.name}</h2>
                <p className="text-xs text-gray-400 mt-1">#{appointment.patientDisplayId}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Timing */}
              <div className="bg-teal-50 rounded-xl p-4">
                <p className="text-xs text-teal-600 font-medium uppercase tracking-wide mb-1">Appointment Timing</p>
                <p className="text-base font-semibold text-teal-800">{appointment.date} · {appointment.timeSlot}</p>
                <p className="text-xs text-teal-600 mt-1 capitalize">{appointment.consultationType} consultation</p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                  isConfirmed ? "bg-teal-100 text-teal-700" :
                  appointment.status === "completed" ? "bg-gray-100 text-gray-600" :
                  appointment.status === "cancelled" ? "bg-red-100 text-red-600" :
                  "bg-yellow-100 text-yellow-700"
                }`}>
                  {isConfirmed ? "Confirmed" : appointment.status}
                </span>
              </div>

              {/* Patient Details */}
              <div className="grid grid-cols-2 gap-3">
                <ModalField label="Age" value={`${appointment.age ?? "—"} yrs`} />
                <ModalField label="Gender" value={appointment.gender ?? "—"} />
                <ModalField label="Blood Group" value={appointment.bloodGroup ?? "—"} />
                <ModalField label="Chronic Disease" value={appointment.hasChronicDisease != null ? (appointment.hasChronicDisease ? "Yes" : "No") : "—"} />
              </div>

              {appointment.hasChronicDisease && appointment.chronicDiseaseDetail && (
                <ModalField label="Chronic Disease Detail" value={appointment.chronicDiseaseDetail} />
              )}

              <ModalField label="AI Diagnosis" value={appointment.aiDiagnosis ?? "Not available"} />
              <ModalField label="Symptoms / Notes" value={appointment.notes || "None provided"} />

              {appointment.meetingLink && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Meeting Link</p>
                  <a href={appointment.meetingLink} target="_blank" rel="noreferrer"
                    className="text-teal-600 text-sm hover:underline break-all">
                    {appointment.meetingLink}
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0 flex gap-3">
              {isConfirmed ? (
                <div className="flex-1 py-2.5 rounded-lg bg-teal-100 text-teal-700 text-sm font-medium text-center">
                  ✓ Consultation Accepted
                </div>
              ) : appointment.status === "completed" || appointment.status === "cancelled" ? null : (
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="flex-1 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-60"
                >
                  {accepting ? "Accepting..." : "Accept Consultation Request"}
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <span className="font-medium text-black">{label}: </span>
      <span className="text-black/80">{value}</span>
    </div>
  );
}

function ModalField({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  );
}
