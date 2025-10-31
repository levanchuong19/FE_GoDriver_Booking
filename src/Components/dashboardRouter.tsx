import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../Model/User";
import DashboardLayout from "./dashboardLayout";

const DashboardGuard = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded: JwtPayload = jwtDecode(token);
    // Giả sử role nằm ở decoded.role hoặc decoded.roles
    const role = decoded.role;
    if (role === "admin") {
      return <DashboardLayout />;
    }
    // Không đúng quyền
    return <Navigate to="/" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

export default DashboardGuard;
