
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActiveOrdersList from './ActiveOrdersList';
import CompletedOrdersList from './CompletedOrdersList';
import type { DriverOrder } from '@/hooks/useDriverOrders';
import type { Database } from '@/integrations/supabase/types';

type UnifiedOrderStatus = Database["public"]["Enums"]["unified_order_status_enum"];

interface OrderTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentOrders: DriverOrder[];
  completedOrders: DriverOrder[];
  onStatusUpdate: (orderId: string, newStatus: string) => Promise<void>;
}

const OrderTabs = ({ 
  activeTab, 
  setActiveTab, 
  currentOrders, 
  completedOrders, 
  onStatusUpdate 
}: OrderTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="active">Active Orders ({currentOrders.length})</TabsTrigger>
        <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="mt-6">
        <ActiveOrdersList orders={currentOrders} onStatusUpdate={onStatusUpdate} />
      </TabsContent>

      <TabsContent value="completed" className="mt-6">
        <CompletedOrdersList orders={completedOrders} />
      </TabsContent>
    </Tabs>
  );
};

export default OrderTabs;
