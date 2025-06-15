
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDriverOrders } from '@/hooks/useDriverOrders';
import { OrderDetailsHeader } from '@/components/driver/order-details/OrderDetailsHeader';
import { CustomerSection } from '@/components/driver/order-details/CustomerSection';
import { StatusTimeline } from '@/components/driver/order-details/StatusTimeline';
import { OrderActions } from '@/components/driver/order-details/OrderActions';
import { DeliveryAttemptsHistory } from '@/components/driver/DeliveryAttemptsHistory';
import { LoadingSpinner } from '@/components/driver/order-details/LoadingSpinner';
import type { UnifiedOrderStatus } from '@/hooks/useDriverOrders';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const { availableOrders, activeOrders, loading, updateOrderStatus } = useDriverOrders();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!orderId) {
    return <Navigate to="/orders" replace />;
  }

  // Find the order in either available or active orders
  const order = [...availableOrders, ...activeOrders].find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600">The order you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = async (orderId: string, newStatus: UnifiedOrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <OrderDetailsHeader order={order} />
        
        <div className="grid gap-6 md:grid-cols-2">
          <CustomerSection order={order} />
          <StatusTimeline order={order} />
        </div>
        
        <OrderActions 
          order={order} 
          onStatusUpdate={handleStatusUpdate}
        />

        <DeliveryAttemptsHistory orderId={order.id} />
      </div>
    </div>
  );
};

export default OrderDetailsPage;
