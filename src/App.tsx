
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ComingSoonPage from "@/pages/ComingSoonPage";
import AuthPage from "@/pages/AuthPage";
import DriverDashboard from "@/pages/DriverDashboard";
import DriverOrders from "@/pages/DriverOrders";
import DriverProfile from "@/pages/DriverProfile";
import DriverNavbar from "@/components/layout/DriverNavbar";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading...</div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <>
      <DriverNavbar />
      {children}
    </>
  );
};

const AppContent = () => {
  const isDevelopment = import.meta.env.DEV;
  
  // If in development, only show coming soon page for now
  if (isDevelopment) {
    return (
      <>
        <Routes>
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route path="*" element={<Navigate to="/coming-soon" replace />} />
        </Routes>
        <Toaster />
      </>
    );
  }

  // Driver portal routes (production)
  return (
    <>
      <Routes>
        {/* Driver authentication */}
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected driver routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DriverDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/orders" element={
          <ProtectedRoute>
            <DriverOrders />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <DriverProfile />
          </ProtectedRoute>
        } />
        
        {/* Coming soon page for testing */}
        <Route path="/coming-soon" element={<ComingSoonPage />} />
        
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
