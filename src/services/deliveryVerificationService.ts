
import { supabase } from '@/integrations/supabase/client';

export const deliveryVerificationService = {
  /**
   * Validate the delivery verification code and complete the delivery
   */
  async validateAndCompleteDelivery(
    orderId: string, 
    providedCode: string, 
    notes?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // First, get the order with its verification code
      const { data: order, error: fetchError } = await supabase
        .from('order')
        .select('delivery_verification_code, unified_status')
        .eq('id', orderId)
        .single();

      if (fetchError) {
        console.error('Error fetching order:', fetchError);
        return { success: false, message: 'Order not found' };
      }

      if (!order.delivery_verification_code) {
        return { success: false, message: 'No verification code found for this order' };
      }

      if (order.unified_status !== 'out_for_delivery') {
        return { success: false, message: 'Order is not ready for delivery confirmation' };
      }

      // Validate the provided code
      if (providedCode !== order.delivery_verification_code) {
        return { success: false, message: 'Invalid verification code' };
      }

      // Code is valid, update the order status to delivered
      const updateData: any = {
        unified_status: 'delivered',
        delivered_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add delivery notes if provided
      if (notes) {
        updateData.metadata = {
          delivery_notes: notes,
          delivery_confirmed_at: new Date().toISOString()
        };
      }

      const { error: updateError } = await supabase
        .from('order')
        .update(updateData)
        .eq('id', orderId);

      if (updateError) {
        console.error('Error updating order:', updateError);
        return { success: false, message: 'Failed to update order status' };
      }

      return { success: true, message: 'Delivery confirmed successfully' };
    } catch (error) {
      console.error('Error in delivery verification:', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  },

  /**
   * Generate a new verification code for an order
   */
  generateVerificationCode(): string {
    return Math.floor(Math.random() * 90 + 10).toString(); // Generates 10-99
  }
};
