import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/Home";
import LoginPage from "./Pages/Login";
import RegisterPage from "./Pages/Register";
import AuthLayout from "./Components/AuthLayout";
import DashboardGuard from "./Components/dashboardRouter";
import Dashboard from "./Pages/Dashboard/dashboard";
import AdminDriverApplications from "./Pages/Dashboard/AdminDriverApplications";
import AdminDriverApplicationDetail from "./Pages/Dashboard/AdminDriverApplicationDetail";
import RegisterPartner from "./Pages/RegisterPartner";
import Layout from "./Components/Layout";

import AdminLayout from "./Components/Layout/AdminLayout";
import UsersPage from "./Pages/Admin/Users";
import PricingPage from "./Pages/Admin/Pricing";

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
        //   {
        //     path: "/search",
        //     element: <SearchPage />,
        //   },
        //   {
        //     path: "/map",
        //     element: <MapPage />,
        //   },
        {
          path: "/register-partner",
          element: <RegisterPartner />,
        },
      ],
    },

    {
      path: "/dashboard",
      element: <AdminLayout />,
      children: [
        { path: "users", element: <UsersPage /> },
        { path: "pricing", element: <PricingPage /> },
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
        {
          path: "/dashboard/driver-application",
          element: <AdminDriverApplications />,
        },
        {
          path: "/dashboard/driver-application/:id",
          element: <AdminDriverApplicationDetail />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
