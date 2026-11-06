import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import "./global.css";
import "./styles/landing.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingFacebookButton from "./Components/FloatingFacebookButton.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        limit={4}
      />
      <FloatingFacebookButton />
    </Provider>
  </React.StrictMode>
);
