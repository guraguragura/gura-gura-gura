
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthPage from "@/pages/AuthPage";
import DriverDashboard from "@/pages/DriverDashboard";
import DriverOrders from "@/pages/DriverOrders";
import DriverProfile from "@/pages/DriverProfile";
import OrderDetailsPage from "@/pages/OrderDetailsPage";
import AdminDashboard from "@/pages/AdminDashboard";
import DriverManagement from "@/pages/DriverManagement";
import CreateDriver from "@/pages/CreateDriver";
import DriverNavbar from "@/components/layout/DriverNavbar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import DriverSetupGuard from "@/components/driver/DriverSetupGuard";
import RoleBasedGuard from "@/components/auth/RoleBasedGuard";

const AppContent = () => {
  return (
    <>
      <Routes>
        {/* Authentication */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Admin Routes - TEMPORARILY UNPROTECTED */}
        <Route path="/admin" element={
          <>
            <AdminNavbar />
            <AdminDashboard />
          </>
        } />
        
        <Route path="/admin/drivers" element={
          <>
            <AdminNavbar />
            <DriverManagement />
          </>
        } />
        
        <Route path="/admin/drivers/new" element={
          <>
            <AdminNavbar />
            <CreateDriver />
          </>
        } />
        
        {/* Driver Routes - TEMPORARILY UNPROTECTED */}
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
        
        {/* Default redirect to driver dashboard for easy testing */}
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
