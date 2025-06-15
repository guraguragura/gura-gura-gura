
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Truck, MapPin, AlertTriangle } from 'lucide-react';
import { DeliveryConfirmationModal } from '@/components/driver/delivery-confirmation/DeliveryConfirmationModal';
import { FailedDeliveryModal } from '@/components/driver/FailedDeliveryModal';
import { deliveryVerificationService } from '@/services/deliveryVerificationService';
import { useToast } from '@/hooks/use-toast';
import type { DriverOrder, UnifiedOrderStatus } from '@/hooks/useDriverOrders';

interface OrderActionsProps {
  order: DriverOrder;
  onStatusUpdate: (orderId: string, newStatus: UnifiedOrderStatus) => Promise<void>;
}

export const OrderActions: React.FC<OrderActionsProps> = ({ order, onStatusUpdate }) => {
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showFailedDeliveryModal, setShowFailedDeliveryModal] = useState(false);
  const { toast } = useToast();

  const handleStatusUpdate = (newStatus: UnifiedOrderStatus) => {
    onStatusUpdate(order.id, newStatus);
  };

  const handleDeliveryConfirmation = async (verificationCode: string, notes?: string) => {
    try {
      // For mock orders, use simplified validation
      if (order.id.startsWith('mock_')) {
        console.log('Mock delivery confirmation with code:', verificationCode);
        await onStatusUpdate(order.id, 'delivered');
        
        toast({
          title: "Demo Delivery Confirmed",
          description: `Order delivered with verification code: ${verificationCode}`,
        });
        return;
      }

      // For real orders, use the verification service
      const result = await deliveryVerificationService.validateAndCompleteDelivery(
        order.id, 
        verificationCode, 
        notes
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      // Refresh the order data
      await onStatusUpdate(order.id, 'delivered');
      
      toast({
        title: "Delivery Confirmed",
        description: "Order has been successfully delivered to the customer.",
      });
    } catch (error) {
      console.error('Delivery confirmation error:', error);
      // Re-throw the error so the modal can handle it
      throw new Error(error instanceof Error ? error.message : 'Invalid verification code');
    }
  };

  const getAvailableActions = () => {
    switch (order.unified_status) {
      case 'assigned_to_driver':
        return [
          {
            label: 'Mark as Picked Up',
            status: 'picked_up' as UnifiedOrderStatus,
            icon: Check,
            variant: 'default' as const,
            className: 'bg-[#84D1D3] hover:bg-[#6bb6b9]',
            action: () => handleStatusUpdate('picked_up')
          }
        ];
      case 'picked_up':
        return [
          {
            label: 'Start Delivery',
            status: 'out_for_delivery' as UnifiedOrderStatus,
            icon: Truck,
            variant: 'default' as const,
            className: 'bg-yellow-600 hover:bg-yellow-700',
            action: () => handleStatusUpdate('out_for_delivery')
          }
        ];
      case 'out_for_delivery':
        return [
          {
            label: 'Confirm Delivery',
            status: 'delivered' as UnifiedOrderStatus,
            icon: MapPin,
            variant: 'default' as const,
            className: 'bg-green-600 hover:bg-green-700',
            action: () => setShowDeliveryModal(true)
          },
          {
            label: 'Report Failed Delivery',
            status: 'failed_delivery' as UnifiedOrderStatus,
            icon: AlertTriangle,
            variant: 'destructive' as const,
            className: 'bg-red-600 hover:bg-red-700',
            action: () => setShowFailedDeliveryModal(true)
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
    <>
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
                  onClick={action.action}
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

      <DeliveryConfirmationModal
        isOpen={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        onConfirm={handleDeliveryConfirmation}
        customerName={order.customer_name}
        deliveryAddress={order.delivery_address}
      />

      <FailedDeliveryModal
        isOpen={showFailedDeliveryModal}
        onClose={() => setShowFailedDeliveryModal(false)}
        orderId={order.id}
        customerName={order.customer_name}
        deliveryAddress={order.delivery_address}
      />
    </>
  );
};
