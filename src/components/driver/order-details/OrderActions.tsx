
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Truck, MapPin } from 'lucide-react';
import type { DriverOrder } from '@/hooks/useDriverOrders';

interface OrderActionsProps {
  order: DriverOrder;
  onStatusUpdate: (orderId: string, newStatus: string) => Promise<void>;
}

export const OrderActions: React.FC<OrderActionsProps> = ({ order, onStatusUpdate }) => {
  const handleStatusUpdate = (newStatus: string) => {
    onStatusUpdate(order.id, newStatus);
  };

  const getAvailableActions = () => {
    switch (order.unified_status) {
      case 'assigned_to_driver':
        return [
          {
            label: 'Mark as Picked Up',
            status: 'picked_up',
            icon: Check,
            variant: 'default' as const,
            className: 'bg-[#84D1D3] hover:bg-[#6bb6b9]'
          }
        ];
      case 'picked_up':
        return [
          {
            label: 'Start Delivery',
            status: 'out_for_delivery',
            icon: Truck,
            variant: 'default' as const,
            className: 'bg-yellow-600 hover:bg-yellow-700'
          }
        ];
      case 'out_for_delivery':
        return [
          {
            label: 'Mark as Delivered',
            status: 'delivered',
            icon: MapPin,
            variant: 'default' as const,
            className: 'bg-green-600 hover:bg-green-700'
          }
        ];
      default:
        return [];
    }
  };

  const availableActions = getAvailableActions();

  if (availableActions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {availableActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.status}
                onClick={() => handleStatusUpdate(action.status)}
                variant={action.variant}
                className={`flex items-center gap-2 ${action.className}`}
              >
                <IconComponent className="h-4 w-4" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
