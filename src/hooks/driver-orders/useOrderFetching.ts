
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { DriverOrder } from './types';

export const useOrderFetching = () => {
  const [availableOrders, setAvailableOrders] = useState<DriverOrder[]>([]);
  const [activeOrders, setActiveOrders] = useState<DriverOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const formatOrder = (order: any): DriverOrder => {
    const customer = Array.isArray(order.customer) ? order.customer[0] : order.customer;
    const shippingAddress = Array.isArray(order.shipping_address) ? order.shipping_address[0] : order.shipping_address;
    
    return {
      id: order.id,
      customer_name: customer ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown Customer' : 'Unknown Customer',
      customer_phone: customer?.phone || shippingAddress?.phone || '',
      delivery_address: shippingAddress ? 
        `${shippingAddress.address_1 || ''} ${shippingAddress.address_2 || ''}, ${shippingAddress.city || ''}`.trim() || 'No address provided' : 
        'No address provided',
      items_count: 0,
      total_amount: 'RWF 0',
      estimated_delivery_time: '25-30 mins',
      distance: '2.5 km',
      unified_status: order.unified_status,
      created_at: order.created_at
    };
  };

  const fetchAvailableOrders = async () => {
    try {
      console.log('Fetching available orders...');
      
      const { data: orders, error } = await supabase
        .from('order')
        .select(`
          id,
          customer_id,
          shipping_address_id,
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
          )
        `)
        .eq('unified_status', 'ready_for_pickup')
        .is('driver_id', null);

      if (error) {
        console.error('Error fetching available orders:', error);
        throw error;
      }

      console.log('Available orders data:', orders);
      const formattedOrders: DriverOrder[] = (orders || []).map(formatOrder);
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
      
      const { data: orders, error } = await supabase
        .from('order')
        .select(`
          id,
          customer_id,
          shipping_address_id,
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
          )
        `)
        .eq('driver_id', user.id)
        .in('unified_status', ['assigned_to_driver', 'picked_up', 'out_for_delivery', 'delivered']);

      if (error) {
        console.error('Error fetching active orders:', error);
        throw error;
      }

      console.log('Active orders data:', orders);
      const formattedOrders: DriverOrder[] = (orders || []).map(formatOrder);
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

  return {
    availableOrders,
    activeOrders,
    loading,
    setLoading,
    fetchAvailableOrders,
    fetchActiveOrders
  };
};
