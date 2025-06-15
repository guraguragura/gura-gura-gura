
import React, { useState, useEffect } from 'react';
import { useDriverOrders } from '@/hooks/useDriverOrders';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import type { Database } from '@/integrations/supabase/types';
import DashboardHeader from '@/components/driver/DashboardHeader';
import DashboardStats from '@/components/driver/DashboardStats';
import AvailableOrdersList from '@/components/driver/AvailableOrdersList';
import CurrentDeliveries from '@/components/driver/CurrentDeliveries';
import RecentActivity from '@/components/driver/RecentActivity';
import ErrorBoundary from '@/components/driver/ErrorBoundary';
import { OfflineIndicator } from '@/components/driver/OfflineIndicator';
import { DashboardStatsSkeleton } from '@/components/driver/LoadingSkeleton';

type UnifiedOrderStatus = Database["public"]["Enums"]["unified_order_status_enum"];

const DriverDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { 
    availableOrders, 
    activeOrders, 
    loading, 
    acceptOrder, 
    refuseOrder, 
    updateOrderStatus,
    refreshOrders 
  } = useDriverOrders();
  const { withErrorHandling } = useErrorHandler();

  const handleAcceptOrder = withErrorHandling(async (orderId: string) => {
    await acceptOrder(orderId);
  });

  const handleRefuseOrder = withErrorHandling(async (orderId: string) => {
    await refuseOrder(orderId, "Driver declined");
  });

  const handleStatusUpdate = withErrorHandling(async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus as UnifiedOrderStatus);
  });

  const handleRefresh = withErrorHandling(async () => {
    setRefreshing(true);
    try {
      await refreshOrders();
    } finally {
      setRefreshing(false);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
            <p className="text-gray-600 mt-2">Loading your orders and delivery information...</p>
          </div>
          
          <DashboardStatsSkeleton />
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">New Orders Available</h2>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallbackMessage="We're having trouble loading your dashboard. Please try refreshing the page.">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader onRefresh={handleRefresh} refreshing={refreshing} />
          
          <OfflineIndicator />
          
          <AvailableOrdersList 
            orders={availableOrders}
            onAcceptOrder={handleAcceptOrder}
            onRefuseOrder={handleRefuseOrder}
            onRefresh={handleRefresh}
            refreshing={refreshing}
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
    </ErrorBoundary>
  );
};

export default DriverDashboard;
