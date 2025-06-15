
import React from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package, 
  Truck 
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { OrderStatus } from '../Orders';
import { RealTimeOrderStatus } from '@/components/order-tracking/RealTimeOrderStatus';
import { DetailedOrderTimeline } from '@/components/order-tracking/DetailedOrderTimeline';
import { ChatWithDriverButton } from '@/components/order-tracking/ChatWithDriverButton';
import { useOrderRealtime } from '@/hooks/useOrderRealtime';

interface OrderStatusCardProps {
  order: {
    id: string;
    status: OrderStatus;
    date: string;
    unified_status?: string;
    timestamps?: {
      paid_at?: string;
      assigned_at?: string;
      picked_up_at?: string;
      delivered_at?: string;
    };
    driver_name?: string;
  };
  currentStepIndex: number;
  isOrderCanceled: boolean;
}

export const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ 
  order, 
  currentStepIndex, 
  isOrderCanceled 
}) => {
  const { verificationCode } = useOrderRealtime(order.id);
  const isDriverAssigned = ['assigned_to_driver', 'picked_up', 'out_for_delivery'].includes(order.unified_status || '');

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
          <CardDescription>Placed on {order.date}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RealTimeOrderStatus 
            orderId={order.id}
            initialStatus={order.status}
            initialUnifiedStatus={order.unified_status}
          />
          
          {/* Chat with Driver Button */}
          {!isOrderCanceled && isDriverAssigned && (
            <div className="pt-2">
              <ChatWithDriverButton
                orderId={order.id}
                driverName={order.driver_name}
                orderStatus={order.unified_status}
                isDriverAssigned={isDriverAssigned}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {!isOrderCanceled && order.unified_status && (
        <DetailedOrderTimeline 
          unifiedStatus={order.unified_status}
          timestamps={order.timestamps}
          verificationCode={verificationCode}
        />
      )}
      
      {isOrderCanceled && (
        <Card>
          <CardContent className="p-6">
            <div className="border border-red-200 bg-red-50 rounded-md p-4 text-red-500">
              <p>This order has been canceled. If you have any questions, please contact our customer support.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
