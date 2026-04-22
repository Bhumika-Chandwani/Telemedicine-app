const BASE_URL = "http://localhost:5000/api";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...(options.headers || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
};

// Doctor
export const fetchDoctorProfile = () => apiFetch("/doctor/profile");
export const fetchTodayAppointments = () => apiFetch("/doctor/appointments/today");
export const fetchAllAppointments = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return apiFetch(`/doctor/appointments${q ? "?" + q : ""}`);
};
export const fetchMonthlyAnalytics = () => apiFetch("/doctor/analytics/monthly");
export const fetchDoctorPatients = () => apiFetch("/doctor/patients");
export const updateAppointmentStatus = (appointmentId, status, meetingLink) =>
  apiFetch(`/doctor/appointments/${appointmentId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, meetingLink }),
  });
export const assignConsultation = (appointmentId, data) =>
  apiFetch(`/doctor/appointments/${appointmentId}/assign`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
