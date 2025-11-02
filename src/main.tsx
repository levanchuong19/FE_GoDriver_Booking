import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import "./global.css";
import { ToastContainer } from "react-toastify";
import FloatingFacebookButton from "./Components/FloatingFacebookButton.tsx";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer />
      <FloatingFacebookButton />
    </Provider>
  </React.StrictMode>
);
