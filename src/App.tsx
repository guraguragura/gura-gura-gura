
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthPage from "@/pages/AuthPage";
import PlaceOrderPage from "@/pages/PlaceOrderPage";
import AdminDashboard from "@/pages/AdminDashboard";
import DriverManagement from "@/pages/DriverManagement";
import CreateDriver from "@/pages/CreateDriver";
import AdminNavbar from "@/components/admin/AdminNavbar";

const AppContent = () => {
  return (
    <>
      <Routes>
        {/* Authentication */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Order Placement (standalone) */}
        <Route path="/place-order" element={<PlaceOrderPage />} />
        
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
        
        {/* Default redirect to place order for main app */}
        <Route path="/" element={<Navigate to="/place-order" replace />} />
        
        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/place-order" replace />} />
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
