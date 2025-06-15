
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface OrderRating {
  id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export const useOrderRating = (orderId?: string) => {
  const [orderRating, setOrderRating] = useState<OrderRating | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOrderRating = async () => {
    if (!orderId || !user) return;

    try {
      setLoading(true);

      // Get customer ID from user email
      const { data: customerData, error: customerError } = await supabase
        .from('customer')
        .select('id')
        .eq('email', user.email)
        .single();

      if (customerError || !customerData) {
        return;
      }

      const { data: ratingData, error: ratingError } = await supabase
        .from('customer_ratings')
        .select('id, rating, comment, created_at')
        .eq('order_id', orderId)
        .eq('customer_id', customerData.id)
        .single();

      if (ratingError && ratingError.code !== 'PGRST116') {
        throw ratingError;
      }

      setOrderRating(ratingData || null);
    } catch (error) {
      console.error('Error fetching order rating:', error);
      toast({
        title: "Error",
        description: "Failed to check rating status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderRating();
  }, [orderId, user]);

  return {
    orderRating,
    loading,
    hasRating: !!orderRating,
    refetch: fetchOrderRating
  };
};
