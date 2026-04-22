export default function AppointmentsCard({ appointments = [], loading = false }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "bg-teal-100 text-teal-700";
      case "completed": return "bg-gray-100 text-gray-600";
      case "cancelled": return "bg-red-100 text-red-600";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="karla-font w-[280px] bg-teal-50/40 backdrop-blur-sm border border-teal-500/30 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg text-center text-black mb-4">Appointments</h2>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-teal-200/50 rounded w-3/4 mb-1" />
              <div className="h-3 bg-teal-100/50 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <p className="text-sm text-black/50 text-center py-4">No appointments today.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt, i) => (
            <div key={appt.appointmentId || i} className="flex justify-between items-start border-b border-black/5 pb-3 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-black">{appt.name}</p>
                <p className="text-xs text-black/50 mt-0.5">
                  {appt.age ? `${appt.age} yrs` : ""}
                  {appt.age && appt.gender ? " • " : ""}
                  {appt.gender}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-black/70">{appt.timeSlot}</p>
                <span className={`mt-1 inline-block text-[10px] px-1.5 py-0.5 rounded-md ${getStatusColor(appt.status)}`}>
                  {appt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
