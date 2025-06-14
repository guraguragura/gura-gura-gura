
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import ComingSoonPage from "@/pages/ComingSoonPage";
import AuthPage from "@/pages/AuthPage";

function App() {
  // Check if we're in development mode
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
        
        {/* Driver dashboard - will be implemented */}
        <Route path="/dashboard" element={<div>Driver Dashboard - Coming Soon</div>} />
        
        {/* Driver orders - will be implemented */}
        <Route path="/orders" element={<div>Driver Orders - Coming Soon</div>} />
        
        {/* Driver profile - will be implemented */}
        <Route path="/profile" element={<div>Driver Profile - Coming Soon</div>} />
        
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
}

export default App;
