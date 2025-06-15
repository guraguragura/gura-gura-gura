
import { useOrderQueries } from './driver-orders/useOrderQueries';
import { useOrderMutations } from './driver-orders/useOrderMutations';
import { useRealtimeUpdates } from './driver-orders/useRealtimeUpdates';
import { useDriverProfile } from './useDriverProfile';

export const useDriverOrdersRefactored = () => {
  const { isDriver } = useDriverProfile();
  const {
    availableOrders,
    activeOrders,
    loading,
    error,
    refreshOrders,
    invalidateOrders
  } = useOrderQueries();

  const {
    acceptOrder,
    refuseOrder,
    updateOrderStatus,
    isAccepting,
    isRefusing,
    isUpdating
  } = useOrderMutations();

  // Set up real-time updates
  useRealtimeUpdates(invalidateOrders);

  return {
    availableOrders,
    activeOrders,
    loading,
    error,
    acceptOrder,
    refuseOrder,
    updateOrderStatus,
    refreshOrders,
    isDriver,
    isAccepting,
    isRefusing,
    isUpdating
  };
};

// Re-export types for convenience
export type { DriverOrder, UnifiedOrderStatus } from './driver-orders/types';
