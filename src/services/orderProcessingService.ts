import { supabase } from '@/integrations/supabase/client';

export interface OrderCreationData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  itemsDescription: string;
  itemsCount: number;
  totalAmount: number;
  specialInstructions?: string;
  urgency: 'normal' | 'urgent';
  paymentMethod: string;
}

export interface ProcessPaymentData {
  orderId: string;
  paymentSessionId?: string;
  paymentMethod?: string;
  paymentAmount?: number;
}

export class OrderProcessingService {
  // Helper functions to generate unique IDs
  private generateCustomerId = () => 'cus_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  private generateAddressId = () => 'addr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  private generateOrderId = () => 'ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

  // Generate 2-digit verification code
  private generateVerificationCode = () => Math.floor(Math.random() * 90 + 10).toString();

  async createOrder(orderData: OrderCreationData): Promise<{ success: boolean; orderId?: string; message: string }> {
    try {
      // Check if customer exists
      const { data: existingCustomer } = await supabase
        .from('customer')
        .select('id')
        .eq('phone', orderData.customerPhone)
        .single();

      let customerId = existingCustomer?.id;

      if (!customerId) {
        // Create new customer
        const newCustomerId = this.generateCustomerId();
        const { data: newCustomer, error: customerError } = await supabase
          .from('customer')
          .insert({
            id: newCustomerId,
            first_name: orderData.customerName.split(' ')[0] || '',
            last_name: orderData.customerName.split(' ').slice(1).join(' ') || '',
            phone: orderData.customerPhone,
            email: orderData.customerEmail || null,
            has_account: false
          })
          .select('id')
          .single();

        if (customerError) throw new Error('Failed to create customer');
        customerId = newCustomer.id;
      }

      // Create shipping address
      const addressId = this.generateAddressId();
      const { data: shippingAddress, error: addressError } = await supabase
        .from('order_address')
        .insert({
          id: addressId,
          first_name: orderData.customerName.split(' ')[0] || '',
          last_name: orderData.customerName.split(' ').slice(1).join(' ') || '',
          phone: orderData.customerPhone,
          address_1: orderData.deliveryAddress,
          customer_id: customerId
        })
        .select('id')
        .single();

      if (addressError) throw new Error('Failed to create delivery address');

      // Create the order
      const orderId = this.generateOrderId();
      const estimatedDeliveryTime = orderData.urgency === 'urgent' ? '15-20 mins' : '25-30 mins';
      
      const { error: orderError } = await supabase
        .from('order')
        .insert({
          id: orderId,
          customer_id: customerId,
          shipping_address_id: shippingAddress.id,
          currency_code: 'RWF',
          email: orderData.customerEmail || null,
          unified_status: 'pending_payment',
          status: 'pending',
          metadata: {
            items_count: orderData.itemsCount,
            total_amount: orderData.totalAmount,
            estimated_delivery_time: estimatedDeliveryTime,
            distance: '2.5 km',
            items_description: orderData.itemsDescription,
            special_instructions: orderData.specialInstructions,
            urgency: orderData.urgency,
            created_via: 'customer_checkout'
          }
        });

      if (orderError) throw new Error('Failed to create order');

      return {
        success: true,
        orderId,
        message: 'Order created successfully'
      };

    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create order'
      };
    }
  }

  async processPayment(paymentData: ProcessPaymentData): Promise<{ success: boolean; message: string }> {
    try {
      // Since the RPC function doesn't exist in types, we'll update the order directly
      const { error } = await supabase
        .from('order')
        .update({
          unified_status: 'ready_for_pickup',
          paid_at: new Date().toISOString()
        })
        .eq('id', paymentData.orderId);

      if (error) {
        console.error('Error processing payment:', error);
        throw new Error('Failed to process payment');
      }

      return {
        success: true,
        message: 'Payment processed successfully'
      };

    } catch (error) {
      console.error('Error in processPayment:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }

  async updateOrderStatus(orderId: string, newStatus: string): Promise<{ success: boolean; message: string; verificationCode?: string }> {
    try {
      let updateData: any = {
        unified_status: newStatus,
        updated_at: new Date().toISOString()
      };

      // Generate verification code when order goes out for delivery
      let verificationCode: string | undefined;
      if (newStatus === 'out_for_delivery') {
        verificationCode = this.generateVerificationCode();
        
        // Get existing metadata
        const { data: existingOrder } = await supabase
          .from('order')
          .select('metadata')
          .eq('id', orderId)
          .single();

        const existingMetadata = (existingOrder?.metadata as Record<string, any>) || {};
        
        updateData.metadata = {
          ...existingMetadata,
          delivery_verification_code: verificationCode
        };
      }

      // Set failed_delivery_at timestamp for failed deliveries
      if (newStatus === 'failed_delivery') {
        updateData.failed_delivery_at = new Date().toISOString();
      }

      // Clear failed_delivery_at when moving to other statuses from failed_delivery
      if (newStatus === 'assigned_to_driver' || newStatus === 'picked_up' || newStatus === 'out_for_delivery') {
        updateData.failed_delivery_at = null;
      }

      const { error } = await supabase
        .from('order')
        .update(updateData)
        .eq('id', orderId);

      if (error) {
        throw new Error('Failed to update order status');
      }

      return {
        success: true,
        message: 'Order status updated successfully',
        verificationCode
      };

    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update order status'
      };
    }
  }

  async getOrderStatus(orderId: string) {
    try {
      const { data: order, error } = await supabase
        .from('order')
        .select(`
          id,
          unified_status,
          status,
          created_at,
          metadata,
          customer:customer_id (
            first_name,
            last_name
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;

      return {
        success: true,
        order
      };
    } catch (error) {
      console.error('Error getting order status:', error);
      return {
        success: false,
        message: 'Failed to get order status'
      };
    }
  }
}

export const orderProcessingService = new OrderProcessingService();
