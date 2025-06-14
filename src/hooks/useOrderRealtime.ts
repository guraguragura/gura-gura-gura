
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
}

export const useOrderRealtime = (orderId?: string) => {
  const [orderUpdate, setOrderUpdate] = useState<OrderUpdate | null>(null);
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
          
          // Show toast notifications for key status changes
          if (newOrder.unified_status === 'picked_up') {
            toast({
              title: "Order Picked Up",
              description: "Your order has been picked up and is on its way!",
            });
          } else if (newOrder.unified_status === 'out_for_delivery') {
            toast({
              title: "Out for Delivery",
              description: "Your order is out for delivery and will arrive soon!",
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

  return { orderUpdate };
};
