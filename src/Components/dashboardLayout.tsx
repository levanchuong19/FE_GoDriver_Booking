import { Outlet } from "react-router-dom";
import DashboardHeader from "./dashboardHeader";
import DashboardSidebar from "./dashboardSidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 ml-64 ">
        <DashboardHeader />
        <Outlet />
      </main>
    </div>
  );
}
