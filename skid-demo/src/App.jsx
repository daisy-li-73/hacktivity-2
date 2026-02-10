import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import EstablishPassword from "./components/graphical-password/EstablishPassword";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<CreateAccountPage />} />

      {/* Create password (5 drawings) */}
      <Route
        path="/signup/password"
        element={
          <EstablishPassword
            onComplete={(drawings) => {
              // frontend-only: you could stash in localStorage for demo
              localStorage.setItem("skid_drawings", JSON.stringify(drawings));
            }}
          />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
