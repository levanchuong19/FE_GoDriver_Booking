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
import DeleteAccount from "./Pages/DeleteAccount";
import TransactionsPage from "./Pages/Dashboard/Transactions";
import RideDriverRegistrations from "./Pages/Dashboard/RideDriverRegistrations";
import RideDriverRegistrationDetail from "./Pages/Dashboard/RideDriverRegistrationDetail";
import UsedCarsPage from "./Pages/Dashboard/UsedCars";
import UsedCarDetailPage from "./Pages/Dashboard/UsedCarDetail";
import UsedCarFormPage from "./Pages/Dashboard/UsedCarForm";
import UsedCarReportsPage from "./Pages/Dashboard/UsedCarReports";
import AdminRidesPage from "./Pages/Dashboard/AdminRides";
import AdminRideDetailPage from "./Pages/Dashboard/AdminRideDetail";
import RideCategoriesPage from "./Pages/Dashboard/RideCategories";
import OnlineDriversPage from "./Pages/Dashboard/OnlineDrivers";
import SharedRidesPage from "./Pages/Dashboard/SharedRides";
import SharedRideDetailPage from "./Pages/Dashboard/SharedRideDetail";
import SharedRideCharterPage from "./Pages/Dashboard/SharedRideCharter";
import SelfDrivePage from "./Pages/Dashboard/SelfDrive";
import PricingPlansPage from "./Pages/Dashboard/PricingPlans";
import VehicleCatalogPage from "./Pages/Dashboard/VehicleCatalog";
import ChatSupportPage from "./Pages/Dashboard/ChatSupport";
import ChatbotAdminPage from "./Pages/Dashboard/ChatbotAdmin";
import NotificationsPage from "./Pages/Dashboard/Notifications";
import DriverWalletsPage from "./Pages/Dashboard/DriverWallets";

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
        {
          path: "/delete-account",
          element: <DeleteAccount />,
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
          path: "/dashboard/bookings",
          element: <BookingPage />,
        },
        {
          path: "/dashboard/pricing",
          element: <PricingPage />,
        },
        {
          path: "/dashboard/transactions",
          element: <TransactionsPage />,
        },
        {
          path: "/dashboard/ride-drivers",
          element: <RideDriverRegistrations />,
        },
        {
          path: "/dashboard/ride-drivers/:userId",
          element: <RideDriverRegistrationDetail />,
        },
        {
          path: "/dashboard/used-cars",
          element: <UsedCarsPage />,
        },
        {
          path: "/dashboard/used-cars/new",
          element: <UsedCarFormPage />,
        },
        {
          path: "/dashboard/used-cars/:id/edit",
          element: <UsedCarFormPage />,
        },
        {
          path: "/dashboard/used-cars/:id",
          element: <UsedCarDetailPage />,
        },
        {
          path: "/dashboard/used-car-reports",
          element: <UsedCarReportsPage />,
        },
        {
          path: "/dashboard/rides",
          element: <AdminRidesPage />,
        },
        {
          path: "/dashboard/rides/:id",
          element: <AdminRideDetailPage />,
        },
        {
          path: "/dashboard/ride-categories",
          element: <RideCategoriesPage />,
        },
        {
          path: "/dashboard/online-drivers",
          element: <OnlineDriversPage />,
        },
        {
          path: "/dashboard/shared-rides",
          element: <SharedRidesPage />,
        },
        {
          path: "/dashboard/shared-rides/charter",
          element: <SharedRideCharterPage />,
        },
        {
          path: "/dashboard/shared-rides/:tripId",
          element: <SharedRideDetailPage />,
        },
        {
          path: "/dashboard/self-drive",
          element: <SelfDrivePage />,
        },
        {
          path: "/dashboard/pricing-plans",
          element: <PricingPlansPage />,
        },
        {
          path: "/dashboard/vehicle-catalog",
          element: <VehicleCatalogPage />,
        },
        {
          path: "/dashboard/chat-support",
          element: <ChatSupportPage />,
        },
        {
          path: "/dashboard/chatbot",
          element: <ChatbotAdminPage />,
        },
        {
          path: "/dashboard/notifications",
          element: <NotificationsPage />,
        },
        {
          path: "/dashboard/driver-wallets",
          element: <DriverWalletsPage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
