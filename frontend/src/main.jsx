import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { AssistantProvider } from "./context/AssistantContext";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import "./index.css";

const FloatingAssistant = lazy(() => import("./components/assistant/FloatingAssistant"));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <AssistantProvider>
            <AppRoutes />
            <Suspense fallback={null}>
              <FloatingAssistant />
            </Suspense>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          </AssistantProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
