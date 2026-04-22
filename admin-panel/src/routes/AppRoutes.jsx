import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import AdminRoutes from "./AdminRoutes";

// ✅ Redirects to before-login app
const ExternalRedirect = ({ to }) => {
  useEffect(() => {
    window.location.href = to;
  }, [to]);
  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#f9fafb",
    }}>
      <p style={{ color: "#9ca3af", fontSize: 14 }}>Redirecting to login...</p>
    </div>
  );
};

// ✅ Guard for /admin/* routes
const AdminRoute = ({ children }) => {
  // Read synchronously — main.jsx already wrote these before React mounted
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  console.log("🔐 AdminRoute → token:", token ? "exists ✅" : "MISSING ❌");
  console.log("🔐 AdminRoute → role:", role);

  if (token && role === "admin") {
    return children;
  }

  return <ExternalRedirect to="http://localhost:5173/login" />;
};

const AppRoutes = () => {
  // ✅ Read synchronously — no useState/useEffect/timer needed
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  console.log("📦 AppRoutes → token:", token ? "exists ✅" : "MISSING ❌");
  console.log("📦 AppRoutes → role:", role);

  const isAdmin = token && role === "admin";

  return (
    <Routes>
      {/* Root: go to dashboard if logged in, else login */}
      <Route
        path="/"
        element={
          isAdmin
            ? <Navigate to="/admin/dashboard" replace />
            : <ExternalRedirect to="http://localhost:5173/login" />
        }
      />

      {/* Admin pages — protected */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminRoutes />
          </AdminRoute>
        }
      />

      {/* Catch-all */}
      <Route
        path="*"
        element={<ExternalRedirect to="http://localhost:5173/login" />}
      />
    </Routes>
  );
};

export default AppRoutes;