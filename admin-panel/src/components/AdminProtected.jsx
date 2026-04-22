import { useEffect } from "react";

const AdminProtected = ({ children }) => {
  
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "admin") {
      window.location.href = "http://localhost:5173/login";
    }
  }, [token, role]);

  if (!token || role !== "admin") return null;

  return children;
};

export default AdminProtected;