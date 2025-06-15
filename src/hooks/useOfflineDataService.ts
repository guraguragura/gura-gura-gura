
import { useMemo } from 'react';
import { OfflineDataService } from '@/services/offlineDataService';
import { useDriverProfile } from '@/hooks/useDriverProfile';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export const useOfflineDataService = () => {
  const { driverProfile, isDriver } = useDriverProfile();
  const { isOnline } = useNetworkStatus();
  
  const dataService = useMemo(() => {
    return new OfflineDataService({
      useMockData: !isDriver || !driverProfile,
      driverProfile,
      isOnline
    });
  }, [isDriver, driverProfile, isOnline]);

  return { dataService, isOnline };
};
