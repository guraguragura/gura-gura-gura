
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
  };
  currentStepIndex: number;
  isOrderCanceled: boolean;
}

const statusConfig: Record<OrderStatus, { icon: React.ReactNode; color: string; label: string }> = {
  pending: { 
    icon: <Clock className="h-5 w-5" />, 
    color: 'text-yellow-500', 
    label: 'Pending' 
  },
  processing: { 
    icon: <Package className="h-5 w-5" />, 
    color: 'text-blue-500', 
    label: 'Processing' 
  },
  out_for_delivery: { 
    icon: <Truck className="h-5 w-5" />, 
    color: 'text-indigo-500', 
    label: 'Out for Delivery' 
  },
  delivered: { 
    icon: <CheckCircle className="h-5 w-5" />, 
    color: 'text-green-500', 
    label: 'Delivered' 
  },
  canceled: { 
    icon: <XCircle className="h-5 w-5" />, 
    color: 'text-red-500', 
    label: 'Canceled' 
  }
};

export const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ 
  order, 
  currentStepIndex, 
  isOrderCanceled 
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
          <CardDescription>Placed on {order.date}</CardDescription>
        </CardHeader>
        <CardContent>
          <RealTimeOrderStatus 
            orderId={order.id}
            initialStatus={order.status}
            initialUnifiedStatus={order.unified_status}
          />
        </CardContent>
      </Card>

      {!isOrderCanceled && order.unified_status && (
        <DetailedOrderTimeline 
          unifiedStatus={order.unified_status}
          timestamps={order.timestamps}
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
