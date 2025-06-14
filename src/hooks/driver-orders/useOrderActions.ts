
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UnifiedOrderStatus } from './types';
import { mockDataManager } from '@/services/mockDataManager';

export const useOrderActions = (
  fetchAvailableOrders: () => Promise<void>, 
  fetchActiveOrders: () => Promise<void>,
  useMockData?: boolean
) => {
  const { toast } = useToast();

  const acceptOrder = async (orderId: string) => {
    try {
      console.log('Accepting order:', orderId);
      
      // If using mock data, use the mock data manager
      if (useMockData || orderId.startsWith('mock_')) {
        console.log('Using mock data manager to accept order');
        const success = mockDataManager.acceptOrder(orderId);
        
        if (success) {
          toast({
            title: "Demo Mode",
            description: "Order accepted successfully (demo)",
          });
          
          // Refresh both lists to reflect the state change
          await Promise.all([fetchAvailableOrders(), fetchActiveOrders()]);
          return true;
        } else {
          throw new Error('Order not found in available orders');
        }
      }
      
      // For real orders, update the database
      const { error } = await supabase
        .from('order')
        .update({ 
          unified_status: 'assigned_to_driver' as UnifiedOrderStatus,
          driver_accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Order accepted successfully",
      });
      
      await Promise.all([fetchAvailableOrders(), fetchActiveOrders()]);
      return true;
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
    try {
      console.log('Refusing order:', orderId);
      
      // If using mock data, use the mock data manager
      if (useMockData || orderId.startsWith('mock_')) {
        console.log('Using mock data manager to refuse order');
        const success = mockDataManager.refuseOrder(orderId);
        
        if (success) {
          toast({
            title: "Demo Mode",
            description: "Order refusal recorded (demo)",
          });
          
          await fetchAvailableOrders();
          return true;
        }
      }
      
      toast({
        title: "Order Refused",
        description: "Order refusal has been recorded",
      });
      
      await fetchAvailableOrders();
      return true;
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
      
      // If using mock data, use the mock data manager
      if (useMockData || orderId.startsWith('mock_')) {
        console.log('Using mock data manager to update order status');
        const success = mockDataManager.updateOrderStatus(orderId, newStatus);
        
        if (success) {
          toast({
            title: "Demo Mode",
            description: "Order status updated successfully (demo)",
          });
          
          await fetchActiveOrders();
          return true;
        } else {
          throw new Error('Order not found');
        }
      }
      
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
        .eq('id', orderId);

      if (error) {
        console.error('Update error:', error);
        throw error;
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
