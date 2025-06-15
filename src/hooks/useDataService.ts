
import { useMemo } from 'react';
import { DataService } from '@/services/dataService';
import { useDriverProfile } from '@/hooks/useDriverProfile';

export const useDataService = () => {
  const { driverProfile, isDriver } = useDriverProfile();
  
  const dataService = useMemo(() => {
    return new DataService({
      useMockData: !isDriver || !driverProfile,
      driverProfile
    });
  }, [isDriver, driverProfile]);

  return dataService;
};
