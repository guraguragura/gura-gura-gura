
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { OrderStatus } from '@/components/account/Orders';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  thumbnail?: string;
}

interface OrderDetail {
  id: string;
  display_id: number;
  status: OrderStatus;
  unified_status?: string;
  date: string;
  total: number;
  items: OrderItem[];
  shipping: {
    address: string;
    method: string;
    cost: number;
  };
  payment: {
    method: string;
    last4?: string;
  };
  timestamps?: {
    paid_at?: string;
    assigned_at?: string;
    picked_up_at?: string;
    delivered_at?: string;
  };
}

export const useOrderDetails = (orderId?: string) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOrderDetails = async () => {
    if (!orderId || !user) {
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
          metadata,
          paid_at,
          assigned_at,
          picked_up_at,
          delivered_at,
          shipping_address_id,
          billing_address_id
        `)
        .eq('id', orderId)
        .eq('customer_id', user.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!data) {
        setError('Order not found');
        return;
      }

      // Parse metadata for order details
      const metadata = data.metadata as any || {};
      
      const orderDetail: OrderDetail = {
        id: data.id,
        display_id: data.display_id || 0,
        status: data.status as OrderStatus,
        unified_status: data.unified_status,
        date: new Date(data.created_at).toLocaleDateString(),
        total: metadata.total || 0,
        items: metadata.items || [],
        shipping: metadata.shipping || {
          address: 'Address not available',
          method: 'Standard Delivery',
          cost: 0
        },
        payment: metadata.payment || {
          method: 'Payment method not available'
        },
        timestamps: {
          paid_at: data.paid_at,
          assigned_at: data.assigned_at,
          picked_up_at: data.picked_up_at,
          delivered_at: data.delivered_at
        }
      };

      setOrderDetails(orderDetail);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details');
      toast({
        title: "Error",
        description: "Failed to load order details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const retryFetch = () => {
    fetchOrderDetails();
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId, user]);

  return {
    orderDetails,
    loading,
    error,
    retryFetch,
    refetch: fetchOrderDetails
  };
};
