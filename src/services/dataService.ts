
import { supabase } from '@/integrations/supabase/client';
import { mockDriverOrders } from '@/data/mockDriverOrders';
import type { DriverOrder, UnifiedOrderStatus } from '@/hooks/useDriverOrders';

interface DataServiceConfig {
  useMockData: boolean;
  driverProfile: any;
}

export class DataService {
  private config: DataServiceConfig;

  constructor(config: DataServiceConfig) {
    this.config = config;
  }

  async fetchAvailableOrders(): Promise<DriverOrder[]> {
    if (this.config.useMockData) {
      return mockDriverOrders.filter(order => order.unified_status === 'ready_for_pickup');
    }

    try {
      const { data, error } = await supabase
        .from('order')
        .select(`
          *,
          customer_profiles!inner(first_name, last_name, phone)
        `)
        .eq('unified_status', 'ready_for_pickup')
        .is('driver_id', null);

      if (error) throw error;
      return this.transformOrderData(data || []);
    } catch (error) {
      console.error('Error fetching available orders:', error);
      throw error;
    }
  }

  async fetchActiveOrders(): Promise<DriverOrder[]> {
    if (this.config.useMockData) {
      return mockDriverOrders.filter(order => 
        ['assigned_to_driver', 'picked_up', 'out_for_delivery'].includes(order.unified_status)
      );
    }

    if (!this.config.driverProfile?.id) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('order')
        .select(`
          *,
          customer_profiles!inner(first_name, last_name, phone)
        `)
        .eq('driver_id', this.config.driverProfile.id)
        .in('unified_status', ['assigned_to_driver', 'picked_up', 'out_for_delivery', 'delivered']);

      if (error) throw error;
      return this.transformOrderData(data || []);
    } catch (error) {
      console.error('Error fetching active orders:', error);
      throw error;
    }
  }

  async acceptOrder(orderId: string): Promise<void> {
    if (this.config.useMockData) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    if (!this.config.driverProfile?.id) {
      throw new Error('Driver profile not found');
    }

    const { error } = await supabase.rpc('accept_driver_order', {
      p_order_id: orderId,
      p_driver_id: this.config.driverProfile.id
    });

    if (error) throw error;
  }

  async refuseOrder(orderId: string, reason: string): Promise<void> {
    if (this.config.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }

    if (!this.config.driverProfile?.id) {
      throw new Error('Driver profile not found');
    }

    const { error } = await supabase.rpc('refuse_driver_order', {
      p_order_id: orderId,
      p_driver_id: this.config.driverProfile.id,
      p_reason: reason
    });

    if (error) throw error;
  }

  async updateOrderStatus(orderId: string, newStatus: UnifiedOrderStatus): Promise<void> {
    if (this.config.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }

    const { error } = await supabase
      .from('order')
      .update({ unified_status: newStatus })
      .eq('id', orderId);

    if (error) throw error;
  }

  private transformOrderData(data: any[]): DriverOrder[] {
    return data.map(order => ({
      id: order.id,
      customer_name: `${order.customer_profiles.first_name} ${order.customer_profiles.last_name}`,
      customer_phone: order.customer_profiles.phone,
      delivery_address: order.shipping_address?.address_1 || 'Address not available',
      items_count: order.metadata?.items_count || 1,
      estimated_delivery_time: order.metadata?.estimated_delivery_time || '30-45 min',
      distance: order.metadata?.distance || '2.5 km',
      total_amount: order.metadata?.total || '$25.99',
      unified_status: order.unified_status,
      rating: order.metadata?.rating || null,
      created_at: order.created_at,
      updated_at: order.updated_at
    }));
  }
}
