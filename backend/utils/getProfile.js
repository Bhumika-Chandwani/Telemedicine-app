export const getProfile = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:5000/api/auth/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user;

  } catch (err) {
    console.error("Profile error:", err);
    return null;
  }
};