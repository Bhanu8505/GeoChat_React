import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import PresenceProvider from "./context/PresenceProvider.jsx";
import NotificationProvider from "./context/NotificationProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <PresenceProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </PresenceProvider>
    </AuthProvider>
  </StrictMode>,
);
