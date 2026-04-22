import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import WelcomeCard from "../components/WelcomeCard";
import AppointmentsCard from "../components/AppointmentsCard";
import NextAppointmentCard from "../components/NextAppointmentCard";
import AnalyticsCard from "../components/AnalyticsCard";
import ImportantUpdatesCard from "../components/ImportantUpdatesCard";
import {
  fetchDoctorProfile,
  fetchTodayAppointments,
  fetchMonthlyAnalytics,
} from "../api/api";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token || role !== "doctor") {
    window.location.href = "http://localhost:5173/login";
    return null;
  }

  const [isExpanded, setIsExpanded] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, apptRes, analyticsRes] = await Promise.all([
          fetchDoctorProfile(),
          fetchTodayAppointments(),
          fetchMonthlyAnalytics(),
        ]);
        setDoctor(profileRes);
        setTodayAppointments(apptRes.appointments || []);
        setAnalyticsData(analyticsRes);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Next upcoming appointment = first pending or confirmed
  const nextAppointment = todayAppointments.find(
    (a) => a.status === "pending" || a.status === "confirmed"
  ) || null;

  const handleAppointmentUpdate = (updatedAppt) => {
    setTodayAppointments((prev) =>
      prev.map((a) =>
        a.appointmentId === updatedAppt.appointmentId ? updatedAppt : a
      )
    );
  };

  const updatesData = [
    {
      category: "Research",
      date: "23.10.2023",
      title: "New managing chronic inflammation with psoriasis",
      preview: "Medical News Today has published an article about a new method of chronic inflammation management in psoriasis.",
    },
    {
      category: "Clinic",
      date: "23.10.2023",
      title: "Updated database",
      preview: "It will be updated on October 24-25. This may lead to slight slowdown in the program.",
    },
    {
      category: "Ministry of Health",
      date: "20.10.2023",
      title: "CoronaVac approved for emergency use",
      preview: "The Ministry of Health has approved Sinovac's CoronaVac vaccine for emergency use.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 relative">
      <Sidebar
        doctor={doctor}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      <div className={`transition-all duration-300 ${isExpanded ? "ml-0" : "ml-20"} p-8`}>
        <WelcomeCard
          doctor={doctor}
          appointmentsToday={todayAppointments.length}
          loading={loading}
        />
        <div className="mt-6 flex gap-6 flex-wrap">
          <AppointmentsCard appointments={todayAppointments} loading={loading} />
          <NextAppointmentCard
            appointment={nextAppointment}
            loading={loading}
            onUpdate={handleAppointmentUpdate}
          />
          <AnalyticsCard stats={analyticsData} loading={loading} />
          <ImportantUpdatesCard updates={updatesData} />
        </div>
      </div>
    </div>
  );
}
