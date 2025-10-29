import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/Home";
import LoginPage from "./Pages/Login";
import RegisterPage from "./Pages/Register";
import Layout from "./Components/Layout";
import AuthLayout from "./Components/AuthLayout";
import SearchPage from "./Pages/Search";
import MapPage from "./Pages/Map";
import RegisterPartner from "./Pages/RegisterPartner";
import DashboardGuard from "./Components/dashboardRouter";
import Dashboard from "./Pages/Dashboard/dashboard";
import DriverDashboard from "./Pages/Dashboard/driverApplication";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "/search",
          element: <SearchPage />,
        },
        {
          path: "/map",
          element: <MapPage />,
        },
        {
          path: "/register-partner",
          element: <RegisterPartner />,
        },
      ],
    },

    {
      element: <AuthLayout />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
      ],
    },
    {
      path: "dashboard",
      element: <DashboardGuard />,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "/dashboard/driver-application", element: <DriverDashboard /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
