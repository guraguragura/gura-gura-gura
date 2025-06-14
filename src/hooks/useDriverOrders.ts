
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
    fetchActiveOrders
  } = useOrderFetching();

  const {
    acceptOrder,
    refuseOrder,
    updateOrderStatus
  } = useOrderActions(fetchAvailableOrders, fetchActiveOrders);

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
    refreshOrders: () => Promise.all([fetchAvailableOrders(), fetchActiveOrders()])
  };
};

// Re-export types for convenience
export type { DriverOrder, UnifiedOrderStatus } from './driver-orders/types';
