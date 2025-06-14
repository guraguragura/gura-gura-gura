
import React from 'react';
import { useDriverOrders } from '@/hooks/useDriverOrders';
import type { Database } from '@/integrations/supabase/types';
import DashboardHeader from '@/components/driver/DashboardHeader';
import DashboardStats from '@/components/driver/DashboardStats';
import AvailableOrdersList from '@/components/driver/AvailableOrdersList';
import CurrentDeliveries from '@/components/driver/CurrentDeliveries';
import RecentActivity from '@/components/driver/RecentActivity';
import TestDriverAuth from '@/components/driver/TestDriverAuth';
import { useAuth } from '@/contexts/AuthContext';

type UnifiedOrderStatus = Database["public"]["Enums"]["unified_order_status_enum"];

const DriverDashboard = () => {
  const { user } = useAuth();
  const { 
    availableOrders, 
    activeOrders, 
    loading, 
    acceptOrder, 
    refuseOrder, 
    updateOrderStatus,
    refreshOrders 
  } = useDriverOrders();

  const handleAcceptOrder = async (orderId: string) => {
    await acceptOrder(orderId);
  };

  const handleRefuseOrder = async (orderId: string) => {
    await refuseOrder(orderId, "Driver declined");
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus as UnifiedOrderStatus);
  };

  // Show test authentication helper if no user is signed in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
            <p className="text-gray-600 mt-2">Sign in to access your driver dashboard</p>
          </div>

          <TestDriverAuth />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <TestDriverAuth />
        
        <DashboardHeader onRefresh={refreshOrders} />
        
        <AvailableOrdersList 
          orders={availableOrders}
          onAcceptOrder={handleAcceptOrder}
          onRefuseOrder={handleRefuseOrder}
        />

        <DashboardStats 
          availableCount={availableOrders.length}
          activeCount={activeOrders.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CurrentDeliveries 
            orders={activeOrders}
            onUpdateStatus={handleStatusUpdate}
          />
          
          <RecentActivity orders={activeOrders} />
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
