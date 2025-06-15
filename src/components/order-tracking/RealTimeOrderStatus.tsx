
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, CheckCircle, Clock } from 'lucide-react';
import { useOrderRealtime } from '@/hooks/useOrderRealtime';
import { VerificationCodeDisplay } from './VerificationCodeDisplay';

interface RealTimeOrderStatusProps {
  orderId: string;
  initialStatus: string;
  initialUnifiedStatus?: string;
}

export const RealTimeOrderStatus: React.FC<RealTimeOrderStatusProps> = ({
  orderId,
  initialStatus,
  initialUnifiedStatus
}) => {
  const { orderUpdate, verificationCode } = useOrderRealtime(orderId);
  
  // Use real-time update if available, otherwise fall back to initial values
  const currentStatus = orderUpdate?.status || initialStatus;
  const currentUnifiedStatus = orderUpdate?.unified_status || initialUnifiedStatus;
  
  // Check for verification code in metadata
  const metadata = orderUpdate?.metadata || {};
  const displayCode = verificationCode || metadata.delivery_verification_code;

  const getStatusInfo = (status: string, unifiedStatus?: string) => {
    // If we have unified status, use it for more detailed info
    if (unifiedStatus) {
      switch (unifiedStatus) {
        case 'assigned_to_driver':
          return {
            icon: <Clock className="h-4 w-4" />,
            color: 'bg-blue-100 text-blue-800',
            label: 'Driver Assigned',
            description: 'A driver has been assigned to your order'
          };
        case 'picked_up':
          return {
            icon: <Package className="h-4 w-4" />,
            color: 'bg-yellow-100 text-yellow-800',
            label: 'Picked Up',
            description: 'Your order has been picked up from the restaurant'
          };
        case 'out_for_delivery':
          return {
            icon: <Truck className="h-4 w-4" />,
            color: 'bg-indigo-100 text-indigo-800',
            label: 'Out for Delivery',
            description: 'Your order is on its way to you'
          };
        case 'delivered':
          return {
            icon: <CheckCircle className="h-4 w-4" />,
            color: 'bg-green-100 text-green-800',
            label: 'Delivered',
            description: 'Your order has been successfully delivered'
          };
      }
    }

    // Fall back to basic status
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4" />,
          color: 'bg-yellow-100 text-yellow-800',
          label: 'Pending',
          description: 'Your order is being processed'
        };
      case 'processing':
        return {
          icon: <Package className="h-4 w-4" />,
          color: 'bg-blue-100 text-blue-800',
          label: 'Processing',
          description: 'Your order is being prepared'
        };
      case 'shipped':
        return {
          icon: <Truck className="h-4 w-4" />,
          color: 'bg-indigo-100 text-indigo-800',
          label: 'Out for Delivery',
          description: 'Your order is on its way'
        };
      case 'delivered':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: 'bg-green-100 text-green-800',
          label: 'Delivered',
          description: 'Order completed successfully'
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          color: 'bg-gray-100 text-gray-800',
          label: status,
          description: 'Order status'
        };
    }
  };

  const statusInfo = getStatusInfo(currentStatus, currentUnifiedStatus);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Badge className={`${statusInfo.color} flex items-center gap-1`}>
          {statusInfo.icon}
          {statusInfo.label}
        </Badge>
        <div className="text-sm text-gray-600">
          {statusInfo.description}
        </div>
      </div>
      
      {displayCode && currentUnifiedStatus === 'out_for_delivery' && (
        <VerificationCodeDisplay 
          code={displayCode} 
          orderStatus={currentUnifiedStatus} 
        />
      )}
    </div>
  );
};
