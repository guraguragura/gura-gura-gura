
import { useEffect } from 'react';
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
  }, []);

  return {
    availableOrders,
    activeOrders,
    loading,
    acceptOrder,
    refuseOrder,
    updateOrderStatus,
    refreshOrders: () => Promise.all([fetchAvailableOrders(), fetchActiveOrders()]),
    useMockData
  };
};

// Re-export types for convenience
export type { DriverOrder, UnifiedOrderStatus } from './driver-orders/types';
