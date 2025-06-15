
import { useMemo } from 'react';
import { useOfflineDataService } from './useOfflineDataService';

export const useDataService = () => {
  const { dataService } = useOfflineDataService();
  return dataService;
};
