import { useState, useEffect } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { fetchDoctorProfile, fetchDoctorPatients, assignConsultation, updateAppointmentStatus } from "../api/api";

export default function Patients() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignData, setAssignData] = useState({ date: "", timeSlot: "", meetingLink: "" });
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, patientsRes] = await Promise.all([
          fetchDoctorProfile(),
          fetchDoctorPatients(),
        ]);
        setDoctor(profileRes);
        setPatients(patientsRes);
      } catch (err) {
        console.error("Patients load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = patients.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patientDisplayId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const consultationStatusConfig = {
    done: { label: "Consulted", color: "bg-gray-100 text-gray-600" },
    assigned: { label: "Assigned", color: "bg-teal-100 text-teal-700" },
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
    unassigned: { label: "Unassigned", color: "bg-red-50 text-red-500" },
  };

  const handleAssign = async () => {
    if (!assignData.date || !assignData.timeSlot) {
      alert("Please provide date and time slot.");
      return;
    }
    const apptId = selectedPatient?.latestAppointment?.appointmentId;
    if (!apptId) return;
    setAssigning(true);
    try {
      await assignConsultation(apptId, assignData);
      // Refresh patients
      const updated = await fetchDoctorPatients();
      setPatients(updated);
      // Update selected patient
      const updatedPatient = updated.find((p) => String(p.patientId) === String(selectedPatient.patientId));
      if (updatedPatient) setSelectedPatient(updatedPatient);
      setShowAssignForm(false);
      setAssignData({ date: "", timeSlot: "", meetingLink: "" });
    } catch (err) {
      alert("Failed to assign consultation.");
    } finally {
      setAssigning(false);
    }
  };

  const handleMarkDone = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, "completed");
      const updated = await fetchDoctorPatients();
      setPatients(updated);
      const updatedPatient = updated.find((p) => String(p.patientId) === String(selectedPatient.patientId));
      if (updatedPatient) setSelectedPatient(updatedPatient);
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 relative">
      <Sidebar doctor={doctor} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      <div className={`transition-all duration-300 ${isExpanded ? "ml-64" : "ml-20"} p-8 karla-font`}>
        <div className="mb-6">
          <h1 className="text-2xl text-black">Patients</h1>
          <p className="text-sm text-black/60 mt-1">Manage and review patient records</p>
        </div>

        {/* Search */}
        <div className="relative w-[300px] mb-6">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-teal-500/30 bg-teal-50/40 text-sm outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Table */}
        <div className="bg-teal-50/40 border border-teal-500/30 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-6 px-6 py-4 text-sm text-black font-medium border-b border-black/10">
            <div>ID</div>
            <div>Name</div>
            <div>Age</div>
            <div>Gender</div>
            <div>Consultation</div>
            <div>Action</div>
          </div>

          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="grid grid-cols-6 px-6 py-4 border-b border-black/10 animate-pulse">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="h-4 bg-teal-100/50 rounded mr-4" />
                ))}
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="px-6 py-8 text-sm text-black/50 text-center">No patients found.</div>
          ) : (
            filtered.map((patient) => {
              const statusCfg = consultationStatusConfig[patient.consultationStatus] || consultationStatusConfig.unassigned;
              return (
                <div
                  key={String(patient.patientId)}
                  onClick={() => setSelectedPatient(patient)}
                  className="grid grid-cols-6 px-6 py-4 text-sm text-black border-b border-black/10 hover:bg-white transition-all cursor-pointer"
                >
                  <div className="text-black/60">{patient.patientDisplayId}</div>
                  <div className="font-medium">{patient.name}</div>
                  <div>{patient.age ?? "—"}</div>
                  <div>{patient.gender ?? "—"}</div>
                  <div>
                    <span className={`px-2 py-1 rounded-md text-xs ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  <div>
                    <button
                      className="flex items-center gap-1 text-teal-700 text-sm hover:underline"
                      onClick={(e) => { e.stopPropagation(); setSelectedPatient(patient); }}
                    >
                      View <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Patient Detail Drawer */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedPatient.name}</h2>
                <p className="text-xs text-gray-400 mt-1">{selectedPatient.patientDisplayId}</p>
              </div>
              <button
                onClick={() => { setSelectedPatient(null); setShowAssignForm(false); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 flex-1">
              {/* Consultation Status Banner */}
              {(() => {
                const cfg = consultationStatusConfig[selectedPatient.consultationStatus];
                return (
                  <div className={`rounded-xl px-4 py-3 ${cfg.color} flex items-center justify-between`}>
                    <span className="text-sm font-medium">Consultation: {cfg.label}</span>
                    {selectedPatient.latestAppointment && (
                      <span className="text-xs opacity-80">
                        {selectedPatient.latestAppointment.date} · {selectedPatient.latestAppointment.timeSlot}
                      </span>
                    )}
                  </div>
                );
              })()}

              {/* Basic Info */}
              <div>
                <SectionTitle>Patient Information</SectionTitle>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Field label="Age" value={`${selectedPatient.age ?? "—"} yrs`} />
                  <Field label="Gender" value={selectedPatient.gender ?? "—"} />
                  <Field label="Blood Group" value={selectedPatient.bloodGroup ?? "—"} />
                  <Field label="Chronic Disease" value={selectedPatient.hasChronicDisease != null ? (selectedPatient.hasChronicDisease ? "Yes" : "No") : "—"} />
                </div>
                {selectedPatient.hasChronicDisease && selectedPatient.chronicDiseaseDetail && (
                  <div className="mt-3">
                    <Field label="Chronic Disease Detail" value={selectedPatient.chronicDiseaseDetail} />
                  </div>
                )}
              </div>

              {/* Medical */}
              <div>
                <SectionTitle>Medical Details</SectionTitle>
                <div className="mt-3 space-y-3">
                  <Field label="AI Prediction / Diagnosis" value={selectedPatient.aiDiagnosis ?? "Not available"} />
                  {selectedPatient.latestAppointment?.notes && (
                    <Field label="Symptoms / Notes" value={selectedPatient.latestAppointment.notes} />
                  )}
                </div>
              </div>

              {/* Consultation History */}
              {selectedPatient.appointments?.length > 0 && (
                <div>
                  <SectionTitle>Appointment History ({selectedPatient.appointments.length})</SectionTitle>
                  <div className="mt-3 space-y-2">
                    {selectedPatient.appointments.map((appt) => (
                      <div key={String(appt.appointmentId)} className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{appt.date}</p>
                          <p className="text-xs text-gray-500">{appt.timeSlot} · {appt.consultationType}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-md ${
                            appt.status === "completed" ? "bg-gray-100 text-gray-600" :
                            appt.status === "confirmed" ? "bg-teal-100 text-teal-700" :
                            appt.status === "cancelled" ? "bg-red-100 text-red-500" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {appt.status}
                          </span>
                          {appt.status === "confirmed" && (
                            <button
                              onClick={() => handleMarkDone(appt.appointmentId)}
                              className="text-xs text-gray-500 hover:text-gray-800 underline"
                            >
                              Mark done
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assign Consultation Form */}
              {selectedPatient.consultationStatus === "pending" && !showAssignForm && (
                <button
                  onClick={() => setShowAssignForm(true)}
                  className="w-full py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  Assign Consultation Slot
                </button>
              )}

              {showAssignForm && (
                <div className="border border-teal-200 rounded-xl p-4 space-y-3 bg-teal-50/30">
                  <SectionTitle>Assign Consultation</SectionTitle>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Date</label>
                    <input
                      type="date"
                      value={assignData.date}
                      onChange={(e) => setAssignData((d) => ({ ...d, date: e.target.value }))}
                      className="w-full border border-teal-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Time Slot (e.g. 10:00 - 11:00)</label>
                    <input
                      type="text"
                      placeholder="10:00 - 11:00"
                      value={assignData.timeSlot}
                      onChange={(e) => setAssignData((d) => ({ ...d, timeSlot: e.target.value }))}
                      className="w-full border border-teal-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Meeting Link (optional)</label>
                    <input
                      type="text"
                      placeholder="https://meet.google.com/..."
                      value={assignData.meetingLink}
                      onChange={(e) => setAssignData((d) => ({ ...d, meetingLink: e.target.value }))}
                      className="w-full border border-teal-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-400"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAssign}
                      disabled={assigning}
                      className="flex-1 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-60 transition-colors"
                    >
                      {assigning ? "Assigning..." : "Confirm & Assign"}
                    </button>
                    <button
                      onClick={() => setShowAssignForm(false)}
                      className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{children}</h3>;
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  );
}
