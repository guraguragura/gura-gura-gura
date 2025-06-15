
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthPage from "@/pages/AuthPage";
import DriverDashboard from "@/pages/DriverDashboard";
import DriverOrders from "@/pages/DriverOrders";
import DriverProfile from "@/pages/DriverProfile";
import OrderDetailsPage from "@/pages/OrderDetailsPage";
import DriverNavbar from "@/components/layout/DriverNavbar";

const DriverAppContent = () => {
  return (
    <>
      <Routes>
        {/* Authentication */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Driver Routes */}
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
        
        <Route path="/orders/:orderId" element={
          <>
            <DriverNavbar />
            <OrderDetailsPage />
          </>
        } />
        
        <Route path="/profile" element={
          <>
            <DriverNavbar />
            <DriverProfile />
          </>
        } />
        
        {/* Default redirect to driver dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toaster />
    </>
  );
};

function DriverApp() {
  return (
    <AuthProvider>
      <DriverAppContent />
    </AuthProvider>
  );
}

export default DriverApp;
