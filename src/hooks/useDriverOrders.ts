
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
    useMockData,
    driverProfile,
    isDriver
  } = useOrderFetching();

  const {
    acceptOrder,
    refuseOrder,
    updateOrderStatus
  } = useOrderActions(fetchAvailableOrders, fetchActiveOrders, useMockData, driverProfile);

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

    if (isDriver) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [fetchAvailableOrders, fetchActiveOrders, setLoading, isDriver]);

  return {
    availableOrders,
    activeOrders,
    loading,
    acceptOrder,
    refuseOrder,
    updateOrderStatus,
    refreshOrders,
    useMockData,
    driverProfile,
    isDriver
  };
};

// Re-export types for convenience
export type { DriverOrder, UnifiedOrderStatus } from './driver-orders/types';
