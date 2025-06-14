
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface DriverOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  items_count: number;
  total_amount: string;
  estimated_delivery_time: string;
  distance: string;
  unified_status: string;
  created_at: string;
}

// Type for RPC function returns
interface RpcResult {
  success: boolean;
  message: string;
  order_id?: string;
}

// Type for database function result
interface DbOrderResult {
  order_id: string;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  items_count: number;
  total_amount: number;
  unified_status: string;
  created_at: string;
}

export const useDriverOrders = () => {
  const [availableOrders, setAvailableOrders] = useState<DriverOrder[]>([]);
  const [activeOrders, setActiveOrders] = useState<DriverOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAvailableOrders = async () => {
    try {
      console.log('Fetching available orders...');
      
      // Use the database function for more reliable queries
      const { data, error } = await supabase.rpc('get_driver_orders', {
        p_status: 'ready_for_pickup'
      });

      if (error) {
        console.error('Error fetching available orders:', error);
        throw error;
      }

      console.log('Available orders data:', data);

      const formattedOrders: DriverOrder[] = (data as DbOrderResult[])?.map(order => ({
        id: order.order_id,
        customer_name: order.customer_name || 'Unknown Customer',
        customer_phone: order.customer_phone || '',
        delivery_address: order.delivery_address || 'No address provided',
        items_count: order.items_count || 0,
        total_amount: `RWF ${(order.total_amount || 0).toLocaleString()}`,
        estimated_delivery_time: '25-30 mins',
        distance: '2.5 km',
        unified_status: order.unified_status,
        created_at: order.created_at
      })) || [];

      setAvailableOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching available orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available orders",
        variant: "destructive"
      });
    }
  };

  const fetchActiveOrders = async () => {
    if (!user) return;

    try {
      console.log('Fetching active orders for driver:', user.id);
      
      // Use the database function for active orders
      const { data, error } = await supabase.rpc('get_driver_orders', {
        p_driver_id: user.id
      });

      if (error) {
        console.error('Error fetching active orders:', error);
        throw error;
      }

      console.log('Active orders data:', data);

      const formattedOrders: DriverOrder[] = (data as DbOrderResult[])?.map(order => ({
        id: order.order_id,
        customer_name: order.customer_name || 'Unknown Customer',
        customer_phone: order.customer_phone || '',
        delivery_address: order.delivery_address || 'No address provided',
        items_count: order.items_count || 0,
        total_amount: `RWF ${(order.total_amount || 0).toLocaleString()}`,
        estimated_delivery_time: '25-30 mins',
        distance: '2.5 km',
        unified_status: order.unified_status,
        created_at: order.created_at
      })) || [];

      // Filter out delivered orders for active orders
      const filteredActiveOrders = formattedOrders.filter(order => 
        ['assigned_to_driver', 'picked_up', 'out_for_delivery'].includes(order.unified_status)
      );

      setActiveOrders(filteredActiveOrders);
    } catch (error) {
      console.error('Error fetching active orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch active orders",
        variant: "destructive"
      });
    }
  };

  const acceptOrder = async (orderId: string) => {
    if (!user) return false;

    try {
      console.log('Accepting order:', orderId, 'for driver:', user.id);
      
      const { data, error } = await supabase.rpc('accept_driver_order', {
        p_order_id: orderId,
        p_driver_id: user.id
      });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }

      console.log('Accept order response:', data);
      
      // Type assertion for RPC result
      const result = data as RpcResult;
      
      if (result?.success) {
        toast({
          title: "Success",
          description: "Order accepted successfully",
        });
        
        // Refresh both lists
        await Promise.all([fetchAvailableOrders(), fetchActiveOrders()]);
        return true;
      } else {
        toast({
          title: "Error",
          description: result?.message || "Failed to accept order",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      toast({
        title: "Error",
        description: "Failed to accept order",
        variant: "destructive"
      });
      return false;
    }
  };

  const refuseOrder = async (orderId: string, reason?: string) => {
    if (!user) return false;

    try {
      console.log('Refusing order:', orderId, 'for driver:', user.id);
      
      const { data, error } = await supabase.rpc('refuse_driver_order', {
        p_order_id: orderId,
        p_driver_id: user.id,
        p_reason: reason
      });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }

      console.log('Refuse order response:', data);
      
      // Type assertion for RPC result
      const result = data as RpcResult;
      
      if (result?.success) {
        toast({
          title: "Order Refused",
          description: "Order refusal has been recorded",
        });
        
        // Refresh available orders
        await fetchAvailableOrders();
        return true;
      } else {
        toast({
          title: "Error",
          description: result?.message || "Failed to refuse order",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error refusing order:', error);
      toast({
        title: "Error",
        description: "Failed to refuse order",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      console.log('Updating order status:', orderId, 'to:', newStatus);
      
      // Cast newStatus to the proper enum type
      const validStatuses = [
        'ready_for_pickup', 'assigned_to_driver', 'picked_up', 
        'out_for_delivery', 'delivered', 'cancelled', 'pending_payment',
        'paid', 'processing', 'failed_delivery', 'refunded'
      ] as const;
      
      if (!validStatuses.includes(newStatus as any)) {
        throw new Error(`Invalid status: ${newStatus}`);
      }

      const { error } = await supabase
        .from('order')
        .update({ 
          unified_status: newStatus as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('driver_id', user?.id);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      // Add to status history - simplified without foreign key for now
      try {
        await supabase
          .from('order_status_history')
          .insert({
            order_id: orderId,
            new_status: newStatus as any,
            changed_by: user?.id,
            changed_by_type: 'driver',
            notes: `Status updated to ${newStatus} by driver`
          });
      } catch (historyError) {
        console.warn('Failed to insert status history:', historyError);
        // Don't fail the main operation if history insert fails
      }

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      
      // Refresh active orders
      await fetchActiveOrders();
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchAvailableOrders(), fetchActiveOrders()]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Set up real-time subscription for order updates
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
  }, []);

  return {
    availableOrders,
    activeOrders,
    loading,
    acceptOrder,
    refuseOrder,
    updateOrderStatus,
    refreshOrders: () => Promise.all([fetchAvailableOrders(), fetchActiveOrders()])
  };
};
