
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DriverOrder } from '@/hooks/useDriverOrders';

interface RecentActivityProps {
  orders: DriverOrder[];
}

const RecentActivity = ({ orders }: RecentActivityProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-[#84D1D3] rounded-full"></div>
              <p className="text-sm">
                {order.unified_status === 'assigned_to_driver' && `Accepted order #${order.id.slice(-6)}`}
                {order.unified_status === 'picked_up' && `Picked up order #${order.id.slice(-6)}`}
                {order.unified_status === 'out_for_delivery' && `Out for delivery #${order.id.slice(-6)}`}
              </p>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-gray-500 text-sm">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
