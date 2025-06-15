
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
        
        {/* Admin Routes - TEMPORARILY UNPROTECTED FOR TESTING */}
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
        
        {/* Driver Routes */}
        <Route path="/dashboard" element={
          <RoleBasedGuard allowedRoles={['driver']}>
            <DriverNavbar />
            <DriverDashboard />
          </RoleBasedGuard>
        } />
        
        <Route path="/orders" element={
          <RoleBasedGuard allowedRoles={['driver']}>
            <DriverNavbar />
            <DriverOrders />
          </RoleBasedGuard>
        } />
        
        <Route path="/orders/:orderId" element={
          <RoleBasedGuard allowedRoles={['driver']}>
            <DriverNavbar />
            <OrderDetailsPage />
          </RoleBasedGuard>
        } />
        
        <Route path="/profile" element={
          <RoleBasedGuard allowedRoles={['driver']}>
            <DriverNavbar />
            <DriverSetupGuard>
              <DriverProfile />
            </DriverSetupGuard>
          </RoleBasedGuard>
        } />
        
        {/* Default redirect based on role */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        
        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
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
