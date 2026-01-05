import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "./AppShell";
import StudioPage from "../pages/StudioPage";
import AboutPage from "../pages/AboutPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/studio" replace />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/studio" replace />} />
      </Routes>
    </AppShell>
  );
}
