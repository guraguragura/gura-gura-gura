import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CustomerRatingForm } from '@/components/driver/CustomerRatingForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface OrderActionsProps {
  isOrderCanceled: boolean;
  isOrderDelivered: boolean;
  onReturnOrder: () => void;
  onCancelOrder: () => void;
  order?: {
    id: string;
    driver_id?: string;
    driver_name?: string;
    customer_id?: string;
    hasRating?: boolean;
  };
}

export const OrderActions: React.FC<OrderActionsProps> = ({
  isOrderCanceled,
  isOrderDelivered,
  onReturnOrder,
  onCancelOrder,
  order
}) => {
  const [showRatingForm, setShowRatingForm] = useState(false);

  const canRateDriver = isOrderDelivered && order?.driver_id && order?.customer_id && !order?.hasRating;
  const hasRatedDriver = isOrderDelivered && order?.hasRating;

  const handleRatingSubmitted = () => {
    setShowRatingForm(false);
    // The rating form will handle the success toast
  };

  return (
    <div className="space-y-4">
      {/* Driver Rating Section */}
      {isOrderDelivered && order?.driver_id && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Rate Your Driver
            </CardTitle>
          </CardHeader>
          <CardContent>
            {canRateDriver && !showRatingForm && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  How was your delivery experience with {order.driver_name || 'your driver'}?
                </p>
                <Button 
                  onClick={() => setShowRatingForm(true)}
                  className="bg-[#84D1D3] hover:bg-[#6bb6b9]"
                >
                  Rate Driver
                </Button>
              </div>
            )}
            
            {canRateDriver && showRatingForm && (
              <div className="space-y-3">
                <CustomerRatingForm
                  orderId={order.id}
                  driverId={order.driver_id}
                  customerId={order.customer_id}
                  driverName={order.driver_name || 'Your driver'}
                  onRatingSubmitted={handleRatingSubmitted}
                />
                <Button 
                  variant="outline" 
                  onClick={() => setShowRatingForm(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            )}
            
            {hasRatedDriver && (
              <div className="text-center py-3">
                <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">Driver Rated</span>
                </div>
                <p className="text-xs text-gray-500">
                  Thank you for rating your delivery experience!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Existing Actions */}
      <div className="flex justify-end">
        <Button variant="outline" className="mr-2">
          Need Help?
        </Button>
        {!isOrderCanceled && (
          isOrderDelivered ? (
            <Button 
              onClick={onReturnOrder}
              className="bg-[#F2FCE2] text-green-700 hover:bg-green-100 border border-green-200"
            >
              Return Order
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={onCancelOrder}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Cancel Order
            </Button>
          )
        )}
      </div>
    </div>
  );
};
