
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeUpdates = (invalidateOrders: () => void) => {
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
          invalidateOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invalidateOrders]);
};
