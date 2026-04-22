export const logout = async (navigate) => {
  try {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",   // ✅ clears HttpOnly cookie
    });
  } catch (err) {
    console.error("Logout error:", err);
  }

  // ✅ Clear localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  // ✅ Redirect
  if (navigate) {
    navigate("/login");
  } else {
    window.location.href = "/login";
  }
};