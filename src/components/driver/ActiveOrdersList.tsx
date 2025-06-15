
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OrderCard from './OrderCard';
import { NoActiveOrders, OrderListSkeleton } from './EmptyStates';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import type { DriverOrder } from '@/hooks/useDriverOrders';

interface ActiveOrdersListProps {
  orders: DriverOrder[];
  onStatusUpdate: (orderId: string, newStatus: string) => Promise<void>;
  loading?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const ActiveOrdersList = ({ 
  orders, 
  onStatusUpdate, 
  loading = false,
  onRefresh,
  refreshing = false
}: ActiveOrdersListProps) => {
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const { withErrorHandling } = useErrorHandler();

  const handleStatusUpdate = withErrorHandling(async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await onStatusUpdate(orderId, newStatus);
    } finally {
      setUpdatingOrderId(null);
    }
  }, {
    fallbackMessage: 'Failed to update order status. Please try again.'
  });

  if (loading) {
    return <OrderListSkeleton />;
  }

  if (orders.length === 0) {
    return <NoActiveOrders onRefresh={onRefresh} refreshing={refreshing} />;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="relative">
          {updatingOrderId === order.id && (
            <div className="absolute inset-0 bg-white bg-opacity-75 z-10 flex items-center justify-center rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#84D1D3]"></div>
                <span className="text-sm text-gray-600">Updating...</span>
              </div>
            </div>
          )}
          <OrderCard 
            order={order} 
            onStatusUpdate={handleStatusUpdate}
            showActions={true}
          />
        </div>
      ))}
    </div>
  );
};

export default ActiveOrdersList;
