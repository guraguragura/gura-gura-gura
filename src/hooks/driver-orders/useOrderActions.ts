
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { UnifiedOrderStatus, RpcResult } from './types';

export const useOrderActions = (fetchAvailableOrders: () => Promise<void>, fetchActiveOrders: () => Promise<void>) => {
  const { user } = useAuth();
  const { toast } = useToast();

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
      
      const result = data as unknown;
      if (result && typeof result === 'object' && 'success' in result && 'message' in result) {
        const rpcResult = result as RpcResult;
        
        if (rpcResult.success) {
          toast({
            title: "Success",
            description: "Order accepted successfully",
          });
          
          await Promise.all([fetchAvailableOrders(), fetchActiveOrders()]);
          return true;
        } else {
          toast({
            title: "Error",
            description: rpcResult.message || "Failed to accept order",
            variant: "destructive"
          });
          return false;
        }
      } else {
        throw new Error('Invalid response format');
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
      
      const result = data as unknown;
      if (result && typeof result === 'object' && 'success' in result && 'message' in result) {
        const rpcResult = result as RpcResult;
        
        if (rpcResult.success) {
          toast({
            title: "Order Refused",
            description: "Order refusal has been recorded",
          });
          
          await fetchAvailableOrders();
          return true;
        } else {
          toast({
            title: "Error",
            description: rpcResult.message || "Failed to refuse order",
            variant: "destructive"
          });
          return false;
        }
      } else {
        throw new Error('Invalid response format');
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

  const updateOrderStatus = async (orderId: string, newStatus: UnifiedOrderStatus) => {
    try {
      console.log('Updating order status:', orderId, 'to:', newStatus);
      
      const validStatuses: UnifiedOrderStatus[] = [
        'ready_for_pickup', 'assigned_to_driver', 'picked_up', 
        'out_for_delivery', 'delivered', 'cancelled', 'pending_payment',
        'paid', 'processing', 'failed_delivery', 'refunded'
      ];
      
      if (!validStatuses.includes(newStatus)) {
        throw new Error(`Invalid status: ${newStatus}`);
      }

      const { error } = await supabase
        .from('order')
        .update({ 
          unified_status: newStatus as UnifiedOrderStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('driver_id', user?.id);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      try {
        await supabase
          .from('order_status_history')
          .insert({
            order_id: orderId,
            new_status: newStatus as UnifiedOrderStatus,
            changed_by: user?.id,
            changed_by_type: 'driver',
            notes: `Status updated to ${newStatus} by driver`
          });
      } catch (historyError) {
        console.warn('Failed to insert status history:', historyError);
      }

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      
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

  return {
    acceptOrder,
    refuseOrder,
    updateOrderStatus
  };
};
