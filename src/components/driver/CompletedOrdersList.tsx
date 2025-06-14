
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OrderCard from './OrderCard';
import type { DriverOrder } from '@/hooks/useDriverOrders';

interface CompletedOrdersListProps {
  orders: DriverOrder[];
}

const CompletedOrdersList = ({ orders }: CompletedOrdersListProps) => {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No completed orders yet
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
          showActions={false}
          showRating={true}
        />
      ))}
    </div>
  );
};

export default CompletedOrdersList;
