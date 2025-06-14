
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { OrderStatus } from '@/components/account/Orders';

interface Order {
  id: string;
  display_id: number;
  status: OrderStatus;
  date: string;
  total: number;
  thumbnail?: string;
  unified_status?: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('order')
        .select(`
          id,
          display_id,
          status,
          unified_status,
          created_at,
          metadata
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const formattedOrders: Order[] = data?.map(order => ({
        id: order.id,
        display_id: order.display_id || 0,
        status: order.status as OrderStatus,
        unified_status: order.unified_status,
        date: new Date(order.created_at).toLocaleDateString(),
        total: (order.metadata as any)?.total || 0,
        thumbnail: (order.metadata as any)?.thumbnail
      })) || [];

      setOrders(formattedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
      toast({
        title: "Error",
        description: "Failed to load your orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const retryFetch = () => {
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return {
    orders,
    loading,
    error,
    retryFetch,
    refetch: fetchOrders
  };
};
