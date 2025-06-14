
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthPage from "@/pages/AuthPage";
import DriverDashboard from "@/pages/DriverDashboard";
import DriverOrders from "@/pages/DriverOrders";
import DriverProfile from "@/pages/DriverProfile";
import DriverNavbar from "@/components/layout/DriverNavbar";

const AppContent = () => {
  return (
    <>
      <Routes>
        {/* Driver authentication - login only */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Driver routes with navbar */}
        <Route path="/dashboard" element={
          <>
            <DriverNavbar />
            <DriverDashboard />
          </>
        } />
        
        <Route path="/orders" element={
          <>
            <DriverNavbar />
            <DriverOrders />
          </>
        } />
        
        <Route path="/profile" element={
          <>
            <DriverNavbar />
            <DriverProfile />
          </>
        } />
        
        {/* Default redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
