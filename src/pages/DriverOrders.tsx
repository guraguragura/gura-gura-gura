
import React, { useState } from 'react';
import { useDriverOrders } from '@/hooks/useDriverOrders';
import OrderTabs from '@/components/driver/OrderTabs';
import TestDataHelper from '@/components/driver/TestDataHelper';
import type { Database } from '@/integrations/supabase/types';

type UnifiedOrderStatus = Database["public"]["Enums"]["unified_order_status_enum"];

const DriverOrders = () => {
  const [activeTab, setActiveTab] = useState('active');
  const { 
    activeOrders, 
    loading, 
    updateOrderStatus 
  } = useDriverOrders();

  const completedOrders = activeOrders.filter(order => order.unified_status === 'delivered');
  const currentOrders = activeOrders.filter(order => order.unified_status !== 'delivered');

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus as UnifiedOrderStatus);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Manage your delivery assignments</p>
        </div>

        <TestDataHelper />

        <OrderTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentOrders={currentOrders}
          completedOrders={completedOrders}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
};

export default DriverOrders;
