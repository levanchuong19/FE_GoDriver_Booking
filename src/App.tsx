import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/Home";
import LoginPage from "./Pages/Login";
import RegisterPage from "./Pages/Register";
import Layout from "./Components/Layout";
import AuthLayout from "./Components/AuthLayout";
import SearchPage from "./Pages/Search";
import MapPage from "./Pages/Map";
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
        {
          path: "/search",
          element: <SearchPage />,
        },
        {
          path: "/map",
          element: <MapPage />,
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
  ]);
  return <RouterProvider router={router} />;
}

export default App;
