
import { useEffect, useCallback } from 'react';
import { useOrderFetching } from './driver-orders/useOrderFetching';
import { useOrderActions } from './driver-orders/useOrderActions';
import { useRealtimeUpdates } from './driver-orders/useRealtimeUpdates';

export const useDriverOrders = () => {
  const {
    availableOrders,
    activeOrders,
    loading,
    setLoading,
    fetchAvailableOrders,
    fetchActiveOrders,
    useMockData
  } = useOrderFetching();

  const {
    acceptOrder,
    refuseOrder,
    updateOrderStatus
  } = useOrderActions(fetchAvailableOrders, fetchActiveOrders, useMockData);

  useRealtimeUpdates(fetchAvailableOrders);

  const refreshOrders = useCallback(() => 
    Promise.all([fetchAvailableOrders(), fetchActiveOrders()]), 
    [fetchAvailableOrders, fetchActiveOrders]
  );

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchAvailableOrders(), fetchActiveOrders()]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [fetchAvailableOrders, fetchActiveOrders, setLoading]);

  return {
    availableOrders,
    activeOrders,
    loading,
    acceptOrder,
    refuseOrder,
    updateOrderStatus,
    refreshOrders,
    useMockData
  };
};

// Re-export types for convenience
export type { DriverOrder, UnifiedOrderStatus } from './driver-orders/types';
