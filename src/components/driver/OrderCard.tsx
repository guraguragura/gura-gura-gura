
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Package, Clock } from 'lucide-react';
import type { DriverOrder } from '@/hooks/useDriverOrders';

interface OrderCardProps {
  order: DriverOrder;
  onStatusUpdate?: (orderId: string, newStatus: string) => Promise<void>;
  showActions?: boolean;
  showRating?: boolean;
}

const OrderCard = ({ order, onStatusUpdate, showActions = false, showRating = false }: OrderCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned_to_driver':
        return <Badge variant="secondary">Assigned</Badge>;
      case 'picked_up':
        return <Badge className="bg-blue-100 text-blue-800">Picked Up</Badge>;
      case 'out_for_delivery':
        return <Badge className="bg-yellow-100 text-yellow-800">In Transit</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    if (onStatusUpdate) {
      onStatusUpdate(order.id, newStatus);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.id.slice(-6)}</CardTitle>
            <p className="text-gray-600">{order.customer_name}</p>
          </div>
          {showRating ? (
            <Badge className="bg-green-100 text-green-800">Completed</Badge>
          ) : (
            getStatusBadge(order.unified_status)
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{order.delivery_address}</span>
          </div>
          {!showRating && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{order.customer_phone}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{order.items_count} items</span>
              </div>
              {!showRating && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{order.estimated_delivery_time}</span>
                </div>
              )}
              {showRating && (
                <span className="text-sm">Delivered</span>
              )}
            </div>
            <span className="font-semibold">{order.total_amount}</span>
          </div>
          
          {showActions && (
            <div className="flex space-x-2 pt-2">
              {order.unified_status === 'assigned_to_driver' && (
                <Button 
                  size="sm" 
                  className="bg-[#84D1D3] hover:bg-[#6bb6b9]"
                  onClick={() => handleStatusUpdate('picked_up')}
                >
                  Mark Picked Up
                </Button>
              )}
              {order.unified_status === 'picked_up' && (
                <Button 
                  size="sm" 
                  className="bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => handleStatusUpdate('out_for_delivery')}
                >
                  Out for Delivery
                </Button>
              )}
              {order.unified_status === 'out_for_delivery' && (
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusUpdate('delivered')}
                >
                  Mark Delivered
                </Button>
              )}
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          )}
          
          {showRating && (
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-1">
                <span className="text-sm">Rating:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="text-sm text-yellow-400"
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Receipt
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
