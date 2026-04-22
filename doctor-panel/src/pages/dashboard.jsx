import { useState } from "react";
import Sidebar from "../components/Sidebar";
import WelcomeCard from "../components/WelcomeCard";
import AppointmentsCard from "../components/AppointmentsCard";
import NextAppointmentCard from "../components/NextAppointmentCard";
import AnalyticsCard from "../components/AnalyticsCard";
import ImportantUpdatesCard from "../components/ImportantUpdatesCard";

export default function Dashboard() {
  // Auth guard
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || role !== "doctor") {
    window.location.href = "http://localhost:5173/login";
    return null;
  }

  const [isExpanded, setIsExpanded] = useState(false);

  const doctorData = {
    name: "Dr. Arjun Sharma",
    specialization: "Cardiologist",
  };

  const appointmentsData = [
    { name: "Riya Sharma", age: 28, gender: "F", time: "9:00 - 10:00" },
    { name: "Arjun Mehta", age: 35, gender: "M", time: "10:00 - 11:00" },
    { name: "Sneha Patel", age: 32, gender: "F", time: "11:00 - 12:00" },
    { name: "Rahul Verma", age: 50, gender: "M", time: "12:00 - 1:00" },
    { name: "Ananya Gupta", age: 31, gender: "F", time: "2:00 - 3:00" },
  ];

  const nextAppointmentData = {
    name: "Sneha Patel",
    patientId: "MD000854033",
    age: 32,
    gender: "F",
    Bloodgroup: "A+",
    AnyChronicDisease: "No",
    time: "09:40 - 10:20 am",
    diagnosis: "Food allergy (?)",
    symptoms: "Severe itching, rash all over the face.",
    type: "New appointment",
    comment: "Patient has severe itching and rash. Possible food allergy.",
  };

  const analyticsData = {
    attended: 230,
    missed: 30,
    avgPerDay: 8,
    avgPerMonth: 230,
    hoursSpent: 160,
    growth: 15,
  };

  const updatesData = [
    {
      category: "Research",
      date: "23.10.2023",
      title: "New managing chronic inflammation with psoriasis",
      preview:
        "Medical News Today has published an article about a new method of chronic inflammation management in psoriasis.",
    },
    {
      category: "Clinic",
      date: "23.10.2023",
      title: "Updated database",
      preview:
        "It will be updated on October 24-25. This may lead to slight slowdown in the program.",
    },
    {
      category: "Ministry of Health",
      date: "20.10.2023",
      title: "CoronaVac approved for emergency use",
      preview:
        "The Ministry of Health has approved Sinovac's CoronaVac vaccine for emergency use.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 relative">
      <Sidebar
        doctor={doctorData}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      <div
        className={`
          transition-all duration-300
          ${isExpanded ? "ml-0" : "ml-20"}
          p-8
        `}
      >
        <WelcomeCard
          doctor={doctorData}
          appointmentsToday={appointmentsData.length}
        />
        <div className="mt-6 flex gap-6">
          <AppointmentsCard appointments={appointmentsData} />
          <NextAppointmentCard appointment={nextAppointmentData} />
          <AnalyticsCard stats={analyticsData} />
          <ImportantUpdatesCard updates={updatesData} />
          <div className="flex-1"></div>
        </div>
      </div>
    </div>
  );
}