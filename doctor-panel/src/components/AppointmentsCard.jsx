export default function AppointmentsCard({ appointments = [] }) {
  const limitedAppointments = appointments.slice(0, 7);

  return (
    <div
      className="
        karla-font
        w-[400px]
        bg-teal-50/40
        backdrop-blur-sm
        rounded-2xl
        shadow-sm
        border border-teal-500/30
        px-4
        py-4
      "
    >
      {/* Centered Heading */}
      <h2 className="text-lg text-black text-center mb-4 tracking-wide">
        Appointments
      </h2>

      {/* List */}
      <div className="space-y-2">
        {limitedAppointments.length > 0 ? (
          limitedAppointments.map((appt, index) => (
            <div
              key={index}
              className="
                flex items-center justify-between
                px-3 py-2
                rounded-lg
                transition-all duration-200
                hover:bg-white
                hover:border
                hover:border-black/10
                hover:shadow-sm
              "
            >
              {/* LEFT: Name + Age */}
              <div>
                <p className="text-[18px] text-black">
                  {appt.name}
                </p>
                <p className="text-[14px] text-black/60 mt-[2px]">
                  {appt.age} yrs • {appt.gender}
                </p>
              </div>

              {/* RIGHT: Time */}
              <p className="text-[14px] text-black/70 whitespace-nowrap">
                {appt.time}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-black/40 text-center">
            No appointments today
          </p>
        )}
      </div>
    </div>
  );
}
