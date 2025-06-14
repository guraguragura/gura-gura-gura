
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { DriverOrder, UnifiedOrderStatus } from '@/hooks/useDriverOrders';

interface CurrentDeliveriesProps {
  orders: DriverOrder[];
  onUpdateStatus: (orderId: string, newStatus: string) => Promise<void>;
}

const CurrentDeliveries = ({ orders, onUpdateStatus }: CurrentDeliveriesProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned_to_driver':
        return <Badge variant="secondary">Assigned</Badge>;
      case 'picked_up':
        return <Badge className="bg-blue-100 text-blue-800">Picked Up</Badge>;
      case 'out_for_delivery':
        return <Badge className="bg-yellow-100 text-yellow-800">Out for Delivery</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Deliveries ({orders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No active deliveries</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(-6)}</p>
                    <p className="text-sm text-gray-600">{order.customer_name}</p>
                    <p className="text-sm text-gray-600">{order.delivery_address}</p>
                  </div>
                  {getStatusBadge(order.unified_status)}
                </div>
                <div className="flex space-x-2">
                  {order.unified_status === 'assigned_to_driver' && (
                    <Button 
                      size="sm" 
                      onClick={() => onUpdateStatus(order.id, 'picked_up')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Mark Picked Up
                    </Button>
                  )}
                  {order.unified_status === 'picked_up' && (
                    <Button 
                      size="sm" 
                      onClick={() => onUpdateStatus(order.id, 'out_for_delivery')}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      Out for Delivery
                    </Button>
                  )}
                  {order.unified_status === 'out_for_delivery' && (
                    <Button 
                      size="sm" 
                      onClick={() => onUpdateStatus(order.id, 'delivered')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark Delivered
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentDeliveries;
