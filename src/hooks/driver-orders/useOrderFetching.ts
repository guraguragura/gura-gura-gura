import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useDriverProfile } from '@/hooks/useDriverProfile';
import type { DriverOrder } from './types';
import { mockDataManager } from '@/services/mockDataManager';

export const useOrderFetching = () => {
  const [availableOrders, setAvailableOrders] = useState<DriverOrder[]>([]);
  const [activeOrders, setActiveOrders] = useState<DriverOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);
  const { toast } = useToast();
  const { driverProfile, isDriver, loading: driverLoading } = useDriverProfile();

  const formatOrder = (order: any): DriverOrder => {
    const customer = Array.isArray(order.customer) ? order.customer[0] : order.customer;
    const shippingAddress = Array.isArray(order.shipping_address) ? order.shipping_address[0] : order.shipping_address;
    
    // Extract metadata values with fallbacks
    const metadata = order.metadata || {};
    const totalAmount = metadata.total_amount || 15000;
    const itemsCount = metadata.items_count || 1;
    const estimatedDeliveryTime = metadata.estimated_delivery_time || '25-30 mins';
    const distance = metadata.distance || '2.5 km';
    
    return {
      id: order.id,
      customer_name: customer ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown Customer' : 'Unknown Customer',
      customer_phone: customer?.phone || shippingAddress?.phone || '+250788000000',
      delivery_address: shippingAddress ? 
        `${shippingAddress.address_1 || ''} ${shippingAddress.address_2 || ''}, ${shippingAddress.city || ''}`.trim() || 'No address provided' : 
        'No address provided',
      items_count: itemsCount,
      total_amount: `RWF ${totalAmount.toLocaleString()}`,
      estimated_delivery_time: estimatedDeliveryTime,
      distance: distance,
      unified_status: order.unified_status,
      created_at: order.created_at
    };
  };

  const fetchAvailableOrders = useCallback(async () => {
    // Wait for driver profile to load
    if (driverLoading) return;
    
    // Check if user is authenticated as a driver
    if (!isDriver || !driverProfile) {
      console.log('User is not authenticated as a driver');
      setAvailableOrders([]);
      setUseMockData(false);
      return;
    }

    try {
      console.log('Fetching available orders for driver:', driverProfile.id);
      
      const { data: orders, error } = await supabase
        .from('order')
        .select(`
          id,
          customer_id,
          shipping_address_id,
          unified_status,
          created_at,
          metadata,
          driver_id,
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
        .is('driver_id', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching available orders:', error);
        throw error;
      }

      console.log('Available orders data:', orders);
      
      if (!orders || orders.length === 0) {
        console.log('No real orders found, using mock data for available orders');
        const mockOrders = await mockDataManager.getAvailableOrders();
        setAvailableOrders(mockOrders);
        setUseMockData(true);
      } else {
        const formattedOrders: DriverOrder[] = orders.map(formatOrder);
        setAvailableOrders(formattedOrders);
        setUseMockData(false);
      }
    } catch (error) {
      console.error('Error fetching available orders:', error);
      console.log('Falling back to mock data for available orders');
      const mockOrders = await mockDataManager.getAvailableOrders();
      setAvailableOrders(mockOrders);
      setUseMockData(true);
      
      toast({
        title: "Using Demo Data",
        description: "Showing demo orders with real-time route calculations",
      });
    }
  }, [toast, isDriver, driverProfile, driverLoading]);

  const fetchActiveOrders = useCallback(async () => {
    // Wait for driver profile to load
    if (driverLoading) return;
    
    // Check if user is authenticated as a driver
    if (!isDriver || !driverProfile) {
      console.log('User is not authenticated as a driver');
      setActiveOrders([]);
      return;
    }

    try {
      console.log('Fetching active orders for driver:', driverProfile.id);
      
      const { data: orders, error } = await supabase
        .from('order')
        .select(`
          id,
          customer_id,
          shipping_address_id,
          unified_status,
          created_at,
          metadata,
          driver_id,
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
        .in('unified_status', ['assigned_to_driver', 'picked_up', 'out_for_delivery', 'delivered'])
        .eq('driver_id', driverProfile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching active orders:', error);
        throw error;
      }

      console.log('Active orders data:', orders);
      
      if (!orders || orders.length === 0) {
        console.log('No real active orders found, using mock data');
        const mockOrders = await mockDataManager.getActiveOrders();
        setActiveOrders(mockOrders);
      } else {
        const formattedOrders: DriverOrder[] = orders.map(formatOrder);
        setActiveOrders(formattedOrders);
      }
    } catch (error) {
      console.error('Error fetching active orders:', error);
      console.log('Falling back to mock data for active orders');
      const mockOrders = await mockDataManager.getActiveOrders();
      setActiveOrders(mockOrders);
    }
  }, [isDriver, driverProfile, driverLoading]);

  return {
    availableOrders,
    activeOrders,
    loading,
    setLoading,
    fetchAvailableOrders,
    fetchActiveOrders,
    useMockData,
    driverProfile,
    isDriver
  };
};
