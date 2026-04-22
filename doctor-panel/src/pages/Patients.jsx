import { useState } from "react";
import { Search } from "lucide-react";

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");

  const patientsData = [
    {
      id: "MD0001",
      name: "Riya Sharma",
      age: 28,
      gender: "F",
      lastVisit: "12 Oct 2023",
      status: "Active",
    },
    {
      id: "MD0002",
      name: "Arjun Mehta",
      age: 35,
      gender: "M",
      lastVisit: "05 Oct 2023",
      status: "Inactive",
    },
    {
      id: "MD0003",
      name: "Sneha Patel",
      age: 42,
      gender: "F",
      lastVisit: "01 Oct 2023",
      status: "Active",
    },
  ];

  const filteredPatients = patientsData.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 p-8 karla-font">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl text-black">Patients</h1>
        <p className="text-sm text-black/60 mt-1">
          Manage and review patient records
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative w-[300px] mb-6">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50"
        />
        <input
          type="text"
          placeholder="Search patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full
            pl-10 pr-4 py-2
            rounded-lg
            border border-teal-500/30
            bg-teal-50/40
            text-sm
            outline-none
            focus:ring-2 focus:ring-teal-400
          "
        />
      </div>

      {/* Patients Table */}
      <div className="bg-teal-50/40 border border-teal-500/30 rounded-2xl shadow-sm overflow-hidden">

        {/* Table Header */}
        <div className="grid grid-cols-7 px-6 py-4 text-sm text-black font-medium border-b border-black/10">
          <div>ID</div>
          <div>Name</div>
          <div>Age</div>
          <div>Gender</div>
          <div>Last Visit</div>
          <div>Status</div>
          <div>Action</div>
        </div>

        {/* Table Rows */}
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="
              grid grid-cols-7
              px-6 py-4
              text-sm
              text-black
              border-b border-black/10
              hover:bg-white
              transition-all
            "
          >
            <div className="text-black/70">{patient.id}</div>
            <div>{patient.name}</div>
            <div>{patient.age}</div>
            <div>{patient.gender}</div>
            <div>{patient.lastVisit}</div>

            <div>
              <span
                className={`
                  px-2 py-1 rounded-md text-xs
                  ${
                    patient.status === "Active"
                      ? "bg-teal-100 text-teal-700"
                      : "bg-gray-200 text-gray-600"
                  }
                `}
              >
                {patient.status}
              </span>
            </div>

            <div>
              <button className="text-teal-700 text-sm hover:underline">
                View
              </button>
            </div>
          </div>
        ))}

        {filteredPatients.length === 0 && (
          <div className="px-6 py-6 text-sm text-black/50 text-center">
            No patients found.
          </div>
        )}

      </div>

    </div>
  );
}
