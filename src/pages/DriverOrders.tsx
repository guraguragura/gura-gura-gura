
import React, { useState } from 'react';
import { useDriverOrders } from '@/hooks/useDriverOrders';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import OrderTabs from '@/components/driver/OrderTabs';
import ErrorBoundary from '@/components/driver/ErrorBoundary';
import type { Database } from '@/integrations/supabase/types';

type UnifiedOrderStatus = Database["public"]["Enums"]["unified_order_status_enum"];

const DriverOrders = () => {
  const [activeTab, setActiveTab] = useState('active');
  const { 
    activeOrders, 
    loading, 
    updateOrderStatus 
  } = useDriverOrders();
  const { withErrorHandling } = useErrorHandler();

  const completedOrders = activeOrders.filter(order => order.unified_status === 'delivered');
  const currentOrders = activeOrders.filter(order => order.unified_status !== 'delivered');

  const handleStatusUpdate = withErrorHandling(async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus as UnifiedOrderStatus);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#84D1D3] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallbackMessage="We're having trouble loading your orders. Please try refreshing the page.">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">Manage your delivery assignments</p>
          </div>

          <OrderTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentOrders={currentOrders}
            completedOrders={completedOrders}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DriverOrders;
