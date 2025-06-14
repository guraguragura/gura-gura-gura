
import React from 'react';
import { Check, Clock, Package, Truck, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DriverOrder } from '@/hooks/useDriverOrders';

interface StatusTimelineProps {
  order: DriverOrder;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ order }) => {
  const steps = [
    {
      key: 'ready_for_pickup',
      label: 'Ready for Pickup',
      icon: Package,
      description: 'Order is prepared and ready'
    },
    {
      key: 'assigned_to_driver',
      label: 'Assigned to Driver',
      icon: Clock,
      description: 'Driver has accepted the order'
    },
    {
      key: 'picked_up',
      label: 'Picked Up',
      icon: Check,
      description: 'Order collected from restaurant'
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      icon: Truck,
      description: 'On the way to customer'
    },
    {
      key: 'delivered',
      label: 'Delivered',
      icon: MapPin,
      description: 'Order delivered successfully'
    }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.key === order.unified_status);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const IconComponent = step.icon;
            
            return (
              <div key={step.key} className="flex items-center gap-3">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2
                  ${isCompleted 
                    ? 'bg-green-100 border-green-500 text-green-600' 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                  }
                  ${isCurrent ? 'ring-2 ring-blue-200' : ''}
                `}>
                  <IconComponent className="h-4 w-4" />
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                    {step.label}
                  </p>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                
                {isCompleted && (
                  <div className="text-xs text-gray-500">
                    {isCurrent ? 'Current' : 'Completed'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
