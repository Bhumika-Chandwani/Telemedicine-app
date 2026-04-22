import { useState } from "react";

export default function Appointments() {
  const [filter, setFilter] = useState("All");

  const appointmentsData = [
    {
      id: "MD0001",
      name: "Riya Sharma",
      age: 28,
      gender: "F",
      time: "09:00 - 10:00",
      status: "Upcoming",
    },
    {
      id: "MD0002",
      name: "Arjun Mehta",
      age: 35,
      gender: "M",
      time: "10:00 - 11:00",
      status: "Completed",
    },
    {
      id: "MD0003",
      name: "Sneha Patel",
      age: 42,
      gender: "F",
      time: "11:00 - 12:00",
      status: "Upcoming",
    },
  ];

  const filteredAppointments =
    filter === "All"
      ? appointmentsData
      : appointmentsData.filter((appt) => appt.status === filter);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-100 p-8 karla-font">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl text-black">Appointments</h1>
        <p className="text-sm text-black/60 mt-1">{today}</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        {["All", "Upcoming", "Completed"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`
              px-4 py-2 rounded-lg text-sm transition-all
              ${
                filter === type
                  ? "bg-teal-600 text-white"
                  : "bg-teal-50 text-black hover:bg-teal-100"
              }
            `}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Appointments Table */}
      <div className="bg-teal-50/40 border border-teal-500/30 rounded-2xl shadow-sm overflow-hidden">

        {/* Table Header */}
        <div className="grid grid-cols-6 px-6 py-4 text-sm text-black font-medium border-b border-black/10">
          <div>Patient</div>
          <div>Age</div>
          <div>Gender</div>
          <div>Time Slot</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {/* Table Rows */}
        {filteredAppointments.map((appt) => (
          <div
            key={appt.id}
            className="
              grid grid-cols-6
              px-6 py-4
              text-sm
              text-black
              border-b border-black/10
              hover:bg-white
              transition-all
            "
          >
            <div>{appt.name}</div>
            <div>{appt.age}</div>
            <div>{appt.gender}</div>
            <div>{appt.time}</div>

            <div>
              <span
                className={`
                  px-2 py-1 rounded-md text-xs
                  ${
                    appt.status === "Upcoming"
                      ? "bg-teal-100 text-teal-700"
                      : "bg-gray-200 text-gray-600"
                  }
                `}
              >
                {appt.status}
              </span>
            </div>

            <div>
              <button className="text-teal-700 text-sm hover:underline">
                View
              </button>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}
