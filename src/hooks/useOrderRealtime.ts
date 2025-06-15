
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OrderUpdate {
  id: string;
  status: string;
  unified_status: string;
  delivered_at?: string;
  picked_up_at?: string;
  assigned_at?: string;
  metadata?: Record<string, any>;
}

export const useOrderRealtime = (orderId?: string) => {
  const [orderUpdate, setOrderUpdate] = useState<OrderUpdate | null>(null);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel('order-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'order',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          console.log('Order update received:', payload);
          const newOrder = payload.new as OrderUpdate;
          setOrderUpdate(newOrder);
          
          // Extract verification code from metadata
          const metadata = newOrder.metadata || {};
          const deliveryCode = metadata.delivery_verification_code;
          
          if (deliveryCode && newOrder.unified_status === 'out_for_delivery') {
            setVerificationCode(deliveryCode);
            
            // Show prominent toast with verification code
            toast({
              title: "🚚 Driver is on the way!",
              description: (
                <div className="space-y-2">
                  <p>Your delivery verification code is:</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-center">
                    <span className="text-2xl font-bold text-blue-600">{deliveryCode}</span>
                  </div>
                  <p className="text-sm text-gray-600">Show this code to your delivery driver</p>
                </div>
              ),
              duration: 10000, // Show for 10 seconds
            });
          }
          
          // Show other status notifications
          if (newOrder.unified_status === 'picked_up') {
            toast({
              title: "Order Picked Up",
              description: "Your order has been picked up and is on its way!",
            });
          } else if (newOrder.unified_status === 'delivered') {
            toast({
              title: "Order Delivered",
              description: "Your order has been successfully delivered!",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, toast]);

  return { orderUpdate, verificationCode };
};
