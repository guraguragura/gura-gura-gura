
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import OrderCard from './OrderCard';
import { NoCompletedOrders } from './EmptyStates';
import { OrderListSkeleton } from './LoadingSkeleton';
import type { DriverOrder } from '@/hooks/useDriverOrders';

interface CompletedOrdersListProps {
  orders: DriverOrder[];
  loading?: boolean;
}

const CompletedOrdersList = ({ orders, loading = false }: CompletedOrdersListProps) => {
  if (loading) {
    return <OrderListSkeleton />;
  }

  if (orders.length === 0) {
    return <NoCompletedOrders />;
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
