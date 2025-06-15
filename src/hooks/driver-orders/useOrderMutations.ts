
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDataService } from '@/hooks/useDataService';
import { useToast } from '@/hooks/use-toast';
import type { UnifiedOrderStatus } from './types';

export const useOrderMutations = () => {
  const dataService = useDataService();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const acceptOrderMutation = useMutation({
    mutationFn: (orderId: string) => dataService.acceptOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availableOrders'] });
      queryClient.invalidateQueries({ queryKey: ['activeOrders'] });
      toast({
        title: "Success",
        description: "Order accepted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to accept order",
        variant: "destructive",
      });
    }
  });

  const refuseOrderMutation = useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) => 
      dataService.refuseOrder(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availableOrders'] });
      toast({
        title: "Order Refused",
        description: "Order has been refused",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to refuse order",
        variant: "destructive",
      });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: UnifiedOrderStatus }) => 
      dataService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeOrders'] });
      toast({
        title: "Status Updated",
        description: "Order status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      });
    }
  });

  return {
    acceptOrder: acceptOrderMutation.mutate,
    refuseOrder: refuseOrderMutation.mutate,
    updateOrderStatus: updateStatusMutation.mutate,
    isAccepting: acceptOrderMutation.isPending,
    isRefusing: refuseOrderMutation.isPending,
    isUpdating: updateStatusMutation.isPending
  };
};
