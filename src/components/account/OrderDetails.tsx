
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/hooks/useCurrency';
import { toast } from '@/hooks/use-toast';
import { useOrderDetails } from '@/hooks/useOrderDetails';
import { useOrderRating } from '@/hooks/useOrderRating';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

// Import refactored components
import { OrderStatusCard } from './order-details/OrderStatusCard';
import { OrderInfoCard } from './order-details/OrderInfoCard';
import { OrderItemsTable } from './order-details/OrderItemsTable';
import { OrderActions } from './order-details/OrderActions';
import { OrderNotFound } from './order-details/OrderNotFound';
import { OrderStatus } from './Orders';

const orderSteps = [
  { status: 'pending', label: 'Order Placed' },
  { status: 'processing', label: 'Processing' },
  { status: 'out_for_delivery', label: 'Out for Delivery' },
  { status: 'delivered', label: 'Delivered' }
];

export const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatPrice, isLoading: currencyLoading } = useCurrency();
  const { orderDetails: order, loading, error, retryFetch } = useOrderDetails(orderId);
  const { orderRating, hasRating, refetch: refetchRating } = useOrderRating(orderId);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const goBack = () => {
    navigate('/account/orders');
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    await retryFetch();
    setIsRetrying(false);
  };

  const handleCancelOrder = () => {
    toast({
      title: "Order cancellation requested",
      description: `Cancellation request for order #${order?.display_id} has been submitted.`,
    });
  };

  const handleReturnOrder = () => {
    if (order && order.items.length > 0) {
      navigate(`/account/returns/new/${order.id}/${order.items[0].id}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={goBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={goBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
        
        {error ? (
          <div className="border rounded-lg p-6 text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Unable to Load Order Details
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button 
              onClick={handleRetry} 
              disabled={isRetrying}
              className="gap-2"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </>
              )}
            </Button>
          </div>
        ) : (
          <OrderNotFound onGoBack={goBack} />
        )}
      </div>
    );
  }

  const currentStepIndex = orderSteps.findIndex(step => step.status === order.status);
  const isOrderCanceled = order.status === 'canceled';
  const isOrderDelivered = order.status === 'delivered';

  // Get customer ID for rating purposes
  const getCustomerId = async () => {
    if (!user?.email) return null;
    
    try {
      const { data } = await supabase
        .from('customer')
        .select('id')
        .eq('email', user.email)
        .single();
      
      return data?.id || null;
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={goBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <h2 className="text-2xl font-bold">Order #{order.display_id}</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <OrderStatusCard 
          order={order} 
          currentStepIndex={currentStepIndex}
          isOrderCanceled={isOrderCanceled}
        />
        <OrderInfoCard order={order} />
      </div>

      <OrderItemsTable 
        order={order} 
        formatPrice={formatPrice} 
        isLoading={currencyLoading} 
      />

      <OrderActions 
        isOrderCanceled={isOrderCanceled}
        isOrderDelivered={isOrderDelivered}
        onReturnOrder={handleReturnOrder}
        onCancelOrder={handleCancelOrder}
        order={{
          id: order.id,
          driver_id: (order as any).driver_id,
          driver_name: (order as any).driver_name,
          customer_id: user?.id,
          hasRating: hasRating
        }}
      />
    </div>
  );
};
