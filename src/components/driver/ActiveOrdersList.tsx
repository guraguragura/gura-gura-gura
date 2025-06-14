
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OrderCard from './OrderCard';
import type { DriverOrder } from '@/hooks/useDriverOrders';

interface ActiveOrdersListProps {
  orders: DriverOrder[];
  onStatusUpdate: (orderId: string, newStatus: string) => Promise<void>;
}

const ActiveOrdersList = ({ orders, onStatusUpdate }: ActiveOrdersListProps) => {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No active orders at the moment
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard 
          key={order.id} 
          order={order} 
          onStatusUpdate={onStatusUpdate}
          showActions={true}
        />
      ))}
    </div>
  );
};

export default ActiveOrdersList;
