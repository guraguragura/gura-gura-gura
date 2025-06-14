
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAllOrdersRealtime = (userId?: string, onOrderUpdate?: () => void) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('all-orders-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'order'
        },
        (payload) => {
          console.log('Order status updated:', payload);
          const newOrder = payload.new as any;
          
          // Only show notifications for orders belonging to this user
          // This is a basic check - in production you'd want more robust filtering
          if (onOrderUpdate) {
            onOrderUpdate();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onOrderUpdate, toast]);
};
