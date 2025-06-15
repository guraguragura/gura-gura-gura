
import React from 'react';

interface DriverSetupGuardProps {
  children: React.ReactNode;
  requireCompleteSetup?: boolean;
}

const DriverSetupGuard = ({ children }: DriverSetupGuardProps) => {
  // Simply render children without any setup modal or guard logic
  return <>{children}</>;
};

export default DriverSetupGuard;
