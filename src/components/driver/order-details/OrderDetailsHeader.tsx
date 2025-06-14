
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { DriverOrder } from '@/hooks/useDriverOrders';

interface OrderDetailsHeaderProps {
  order: DriverOrder;
}

export const OrderDetailsHeader: React.FC<OrderDetailsHeaderProps> = ({ order }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready_for_pickup':
        return <Badge variant="outline">Ready for Pickup</Badge>;
      case 'assigned_to_driver':
        return <Badge variant="secondary">Assigned</Badge>;
      case 'picked_up':
        return <Badge className="bg-blue-100 text-blue-800">Picked Up</Badge>;
      case 'out_for_delivery':
        return <Badge className="bg-yellow-100 text-yellow-800">In Transit</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>
        {getStatusBadge(order.unified_status)}
      </div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Package className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.id.slice(-6)}
          </h1>
          <p className="text-gray-600">
            {new Date(order.created_at).toLocaleDateString()} at{' '}
            {new Date(order.created_at).toLocaleTimeString()}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600">Items</p>
          <p className="font-semibold">{order.items_count}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total</p>
          <p className="font-semibold">{order.total_amount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Distance</p>
          <p className="font-semibold">{order.distance}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Est. Time</p>
          <p className="font-semibold">{order.estimated_delivery_time}</p>
        </div>
      </div>
    </div>
  );
};
