
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthPage from "@/pages/AuthPage";
import PlaceOrderPage from "@/pages/PlaceOrderPage";
import DriverDashboard from "@/pages/DriverDashboard";
import DriverOrders from "@/pages/DriverOrders";
import DriverProfile from "@/pages/DriverProfile";
import OrderDetailsPage from "@/pages/OrderDetailsPage";
import AdminDashboard from "@/pages/AdminDashboard";
import DriverManagement from "@/pages/DriverManagement";
import CreateDriver from "@/pages/CreateDriver";
import DriverNavbar from "@/components/layout/DriverNavbar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ErrorBoundary from "@/components/driver/ErrorBoundary";

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
        
        {/* Driver Routes - TEMPORARILY UNPROTECTED */}
        <Route path="/dashboard" element={
          <ErrorBoundary fallbackMessage="Driver dashboard is temporarily unavailable. Please try again later.">
            <DriverNavbar />
            <DriverDashboard />
          </ErrorBoundary>
        } />
        
        <Route path="/orders" element={
          <ErrorBoundary fallbackMessage="Orders page is temporarily unavailable. Please try again later.">
            <DriverNavbar />
            <DriverOrders />
          </ErrorBoundary>
        } />
        
        <Route path="/orders/:orderId" element={
          <ErrorBoundary fallbackMessage="Order details are temporarily unavailable. Please try again later.">
            <DriverNavbar />
            <OrderDetailsPage />
          </ErrorBoundary>
        } />
        
        <Route path="/profile" element={
          <ErrorBoundary fallbackMessage="Driver profile is temporarily unavailable. Please try again later.">
            <DriverNavbar />
            <DriverProfile />
          </ErrorBoundary>
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
