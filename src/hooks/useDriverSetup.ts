
import { useMemo } from 'react';
import { useDriverProfile } from './useDriverProfile';

interface SetupStatus {
  isComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
  isFirstTimeUser: boolean;
}

export const useDriverSetup = (): SetupStatus => {
  const { driverProfile, loading } = useDriverProfile();

  const setupStatus = useMemo(() => {
    if (loading || !driverProfile) {
      return {
        isComplete: false,
        completionPercentage: 0,
        missingFields: [],
        isFirstTimeUser: true
      };
    }

    const requiredFields = [
      { key: 'vehicle_make', label: 'Vehicle Make' },
      { key: 'vehicle_model', label: 'Vehicle Model' },
      { key: 'vehicle_year', label: 'Vehicle Year' },
      { key: 'plate_number', label: 'Plate Number' },
      { key: 'vehicle_color', label: 'Vehicle Color' }
    ];

    const missingFields: string[] = [];
    let completedFields = 0;

    requiredFields.forEach(field => {
      const value = driverProfile[field.key as keyof typeof driverProfile];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        missingFields.push(field.label);
      } else {
        completedFields++;
      }
    });

    const completionPercentage = Math.round((completedFields / requiredFields.length) * 100);
    const isComplete = missingFields.length === 0;
    const isFirstTimeUser = completionPercentage === 0;

    return {
      isComplete,
      completionPercentage,
      missingFields,
      isFirstTimeUser
    };
  }, [driverProfile, loading]);

  return setupStatus;
};
