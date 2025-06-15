
import React, { useState, useEffect } from 'react';
import { useDriverSetup } from '@/hooks/useDriverSetup';
import VehicleSetupModal from './VehicleSetupModal';
import { useNavigate } from 'react-router-dom';

interface DriverSetupGuardProps {
  children: React.ReactNode;
  requireCompleteSetup?: boolean;
}

const DriverSetupGuard = ({ children, requireCompleteSetup = false }: DriverSetupGuardProps) => {
  const { isComplete, completionPercentage, missingFields, isFirstTimeUser } = useDriverSetup();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show modal for first-time users or when setup is required and incomplete
    if (isFirstTimeUser || (requireCompleteSetup && !isComplete)) {
      setShowSetupModal(true);
    }
  }, [isFirstTimeUser, isComplete, requireCompleteSetup]);

  const handleSetupVehicle = () => {
    setShowSetupModal(false);
    navigate('/profile', { state: { openVehicleTab: true } });
  };

  const handleCloseModal = () => {
    // Only allow closing if it's not a first-time user
    if (!isFirstTimeUser) {
      setShowSetupModal(false);
    }
  };

  return (
    <>
      {children}
      <VehicleSetupModal
        isOpen={showSetupModal}
        onClose={handleCloseModal}
        onSetupVehicle={handleSetupVehicle}
        completionPercentage={completionPercentage}
        missingFields={missingFields}
        isFirstTimeUser={isFirstTimeUser}
      />
    </>
  );
};

export default DriverSetupGuard;
