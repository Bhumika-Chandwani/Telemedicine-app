const BASE_URL = "http://localhost:5000";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "http://localhost:5173/login";
    return null;
  }
  return res.json();
};

/* ─────────────────────────────────────────
   AUTH
───────────────────────────────────────── */
export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const getAuthProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const res = await fetch(`${BASE_URL}/api/auth/profile`, {
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout error:", err);
  }
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  localStorage.removeItem("role");
};

/* ─────────────────────────────────────────
   PATIENT PROFILE
───────────────────────────────────────── */
export const getPatientProfile = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/patient/profile`, {
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Get patient profile error:", err);
    return null;
  }
};

export const updatePatientProfile = async (data) => {
  const res = await fetch(`${BASE_URL}/api/patient/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

/* ─────────────────────────────────────────
   DOCTORS
───────────────────────────────────────── */
export const getVerifiedDoctors = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/patient/doctors`, {
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("Get doctors error:", err);
    return [];
  }
};

/* ─────────────────────────────────────────
   APPOINTMENTS
───────────────────────────────────────── */
export const bookAppointment = async (appointmentData) => {
  const res = await fetch(`${BASE_URL}/api/patient/appointments`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(appointmentData),
  });
  return handleResponse(res);
};

export const getMyAppointments = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/patient/appointments`, {
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error("Get appointments error:", err);
    return [];
  }
};
/* ─────────────────────────────────────────
   SLOTS  (new)
───────────────────────────────────────── */
export const getAvailableSlots = async (doctorId, date) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/patient/doctors/${doctorId}/slots?date=${date}`,
      { headers: getAuthHeaders(), credentials: "include" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Get slots error:", err);
    return null;
  }
};
