
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDataService } from '@/hooks/useDataService';
import type { DriverOrder } from './types';

export const useOrderQueries = () => {
  const dataService = useDataService();
  const queryClient = useQueryClient();

  const {
    data: availableOrders = [],
    isLoading: availableOrdersLoading,
    error: availableOrdersError,
    refetch: refetchAvailableOrders
  } = useQuery({
    queryKey: ['availableOrders'],
    queryFn: () => dataService.fetchAvailableOrders(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const {
    data: activeOrders = [],
    isLoading: activeOrdersLoading,
    error: activeOrdersError,
    refetch: refetchActiveOrders
  } = useQuery({
    queryKey: ['activeOrders'],
    queryFn: () => dataService.fetchActiveOrders(),
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  const refreshOrders = async () => {
    await Promise.all([
      refetchAvailableOrders(),
      refetchActiveOrders()
    ]);
  };

  const invalidateOrders = () => {
    queryClient.invalidateQueries({ queryKey: ['availableOrders'] });
    queryClient.invalidateQueries({ queryKey: ['activeOrders'] });
  };

  return {
    availableOrders,
    activeOrders,
    loading: availableOrdersLoading || activeOrdersLoading,
    error: availableOrdersError || activeOrdersError,
    refreshOrders,
    invalidateOrders
  };
};
