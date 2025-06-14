
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

export const useDriverOrders = () => {
  const [availableOrders, setAvailableOrders] = useState<DriverOrder[]>([]);
  const [activeOrders, setActiveOrders] = useState<DriverOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAvailableOrders = async () => {
    try {
      // Fetch orders that are ready for pickup and not assigned to any driver
      const { data, error } = await supabase
        .from('order')
        .select(`
          id,
          unified_status,
          created_at,
          customer:customer_id (
            first_name,
            last_name,
            phone
          ),
          shipping_address:shipping_address_id (
            address_1,
            address_2,
            city,
            phone
          ),
          order_line_item:order_line_item (
            quantity,
            unit_price,
            title
          )
        `)
        .eq('unified_status', 'ready_for_pickup')
        .is('driver_id', null)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedOrders: DriverOrder[] = data?.map(order => ({
        id: order.id,
        customer_name: `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim(),
        customer_phone: order.customer?.phone || order.shipping_address?.phone || '',
        delivery_address: `${order.shipping_address?.address_1 || ''} ${order.shipping_address?.address_2 || ''}, ${order.shipping_address?.city || ''}`.trim(),
        items_count: order.order_line_item?.length || 0,
        total_amount: `RWF ${order.order_line_item?.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0).toLocaleString() || '0'}`,
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
      const { data, error } = await supabase
        .from('order')
        .select(`
          id,
          unified_status,
          created_at,
          customer:customer_id (
            first_name,
            last_name,
            phone
          ),
          shipping_address:shipping_address_id (
            address_1,
            address_2,
            city,
            phone
          ),
          order_line_item:order_line_item (
            quantity,
            unit_price,
            title
          )
        `)
        .eq('driver_id', user.id)
        .in('unified_status', ['assigned_to_driver', 'picked_up', 'out_for_delivery'])
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedOrders: DriverOrder[] = data?.map(order => ({
        id: order.id,
        customer_name: `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim(),
        customer_phone: order.customer?.phone || order.shipping_address?.phone || '',
        delivery_address: `${order.shipping_address?.address_1 || ''} ${order.shipping_address?.address_2 || ''}, ${order.shipping_address?.city || ''}`.trim(),
        items_count: order.order_line_item?.length || 0,
        total_amount: `RWF ${order.order_line_item?.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0).toLocaleString() || '0'}`,
        estimated_delivery_time: '25-30 mins',
        distance: '2.5 km',
        unified_status: order.unified_status,
        created_at: order.created_at
      })) || [];

      setActiveOrders(formattedOrders);
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
      const { data, error } = await supabase.rpc('accept_driver_order', {
        p_order_id: orderId,
        p_driver_id: user.id
      });

      if (error) throw error;

      if (data?.success) {
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
          description: data?.message || "Failed to accept order",
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
      const { data, error } = await supabase.rpc('refuse_driver_order', {
        p_order_id: orderId,
        p_driver_id: user.id,
        p_reason: reason
      });

      if (error) throw error;

      if (data?.success) {
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
          description: data?.message || "Failed to refuse order",
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
      const { error } = await supabase
        .from('order')
        .update({ 
          unified_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('driver_id', user?.id);

      if (error) throw error;

      // Add to status history
      await supabase
        .from('order_status_history')
        .insert({
          order_id: orderId,
          new_status: newStatus,
          changed_by: user?.id,
          changed_by_type: 'driver',
          notes: `Status updated to ${newStatus} by driver`
        });

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
      await Promise.all([fetchAvailableOrders(), fetchActiveOrders()]);
      setLoading(false);
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
