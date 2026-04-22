import { Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "../pages/AdminPanel";
import Dashboard from "../pages/Dashboard";
import User from "../pages/User";
import Doctor from "../pages/Doctor";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminPanel />}>
        {/* Default → /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Pages */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<User />} />
        <Route path="doctors" element={<Doctor />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;