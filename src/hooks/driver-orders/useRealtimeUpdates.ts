
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeUpdates = (fetchAvailableOrders: () => Promise<void>) => {
  useEffect(() => {
    const channel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order',
          filter: 'unified_status=eq.ready_for_pickup'
        },
        () => {
          console.log('Order update detected, refreshing...');
          fetchAvailableOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAvailableOrders]);
};
