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
import RegisterPartnerStatus from "./Pages/RegisterPartner/Status";
import Layout from "./Components/Layout";
import UsersPage from "./Pages/Dashboard/Users";
import BookingPage from "./Pages/Dashboard/Booking";
import PricingPage from "./Pages/Dashboard/Pricing";
import PrivacyPolicy from "./Pages/PrivacyPolicy";

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
        {
          path: "/register-partner/status",
          element: <RegisterPartnerStatus />,
        },
        {
          path: "/privacy-policy",
          element: <PrivacyPolicy />,
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
        {
          path: "/dashboard/driver-application",
          element: <AdminDriverApplications />,
        },
        {
          path: "/dashboard/driver-application/:id",
          element: <AdminDriverApplicationDetail />,
        },
        {
          path: "/dashboard/user",
          element: <UsersPage />,
        },
        {
          path: "/dashboard/court",
          element: <BookingPage />,
        },
        {
          path: "/dashboard/pricing",
          element: <PricingPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
