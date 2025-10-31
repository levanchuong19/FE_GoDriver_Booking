import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../Model/User";
import DashboardLayout from "./dashboardLayout";

const AdminGuard = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded: JwtPayload = jwtDecode(token);
    const role = decoded.role;
    if (role === "admin" || role === "staff") {
      return <DashboardLayout />;
    }
    return <Navigate to="/" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

export default AdminGuard;


