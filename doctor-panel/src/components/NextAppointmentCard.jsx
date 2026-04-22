export default function NextAppointmentCard({ appointment }) {
  if (!appointment) {
    return (
      <div className="karla-font w-[420px] bg-teal-50/40 border border-teal-500/30 rounded-2xl p-6">
        <p className="text-black/60 text-sm">No upcoming appointments.</p>
      </div>
    );
  }

  return (
    <div
      className="
        karla-font
        w-[420px]
        bg-teal-50/40
        backdrop-blur-sm
        border border-teal-500/30
        rounded-2xl
        p-6
        shadow-sm
      "
    >
      {/* TOP SECTION */}
      <div className="flex justify-between items-start mb-4">

        <div>
          {/* Name */}
          <h2 className="text-xl text-black">
            {appointment.name}
          </h2>

          {/* Patient ID */}
          <p className="text-xs text-black/60 mt-1">
            #{appointment.patientId}
          </p>
        </div>

        {/* Slot Time */}
        <p className="text-sm text-black/70 whitespace-nowrap">
          {appointment.time}
        </p>

      </div>

      {/* DETAILS SECTION */}
      <div className="space-y-3 text-sm">

        <DetailRow label="Age" value={`${appointment.age} yrs • ${appointment.gender}`} />
        <DetailRow label="Blood Group" value={appointment.Bloodgroup} />
        <DetailRow label="AI Diagnosis" value={appointment.diagnosis} />
        <DetailRow label="Symptoms" value={appointment.symptoms} />
        <DetailRow label="Chronic Disease" value={appointment.AnyChronicDisease} />
        <DetailRow label="Type" value={appointment.type} />
        <DetailRow label="Comment" value={appointment.comment} />

      </div>

      {/* BUTTON */}
      <div className="mt-6">
        <button
          className="
            w-full
            py-2
            rounded-lg
            bg-teal-600
            text-white
            text-sm
            transition-all duration-200
            hover:bg-teal-700
          "
        >
          Medical Card →
        </button>
      </div>
    </div>
  );
}


/* Reusable Row Component */
function DetailRow({ label, value }) {
  return (
    <div>
      <span className="font-medium text-black">{label}: </span>
      <span className="text-black/80">{value}</span>
    </div>
  );
}
