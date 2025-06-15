
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, MapPin, CheckCircle, RefreshCw, Truck } from 'lucide-react';

interface EmptyStateProps {
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const NoAvailableOrders: React.FC<EmptyStateProps> = ({ onRefresh, refreshing }) => (
  <Card>
    <CardContent className="p-8 text-center">
      <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders available</h3>
      <p className="text-gray-600 mb-4">
        There are currently no new orders ready for pickup. Check back soon or refresh to see new orders.
      </p>
      {onRefresh && (
        <Button 
          onClick={onRefresh} 
          disabled={refreshing}
          className="bg-[#84D1D3] hover:bg-[#6bb6b9]"
        >
          {refreshing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Orders
            </>
          )}
        </Button>
      )}
    </CardContent>
  </Card>
);

export const NoActiveOrders: React.FC<EmptyStateProps> = ({ onRefresh, refreshing }) => (
  <Card>
    <CardContent className="p-8 text-center">
      <Truck className="h-16 w-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No active deliveries</h3>
      <p className="text-gray-600 mb-4">
        You don't have any active deliveries at the moment. Accept new orders to start delivering.
      </p>
      {onRefresh && (
        <Button 
          onClick={onRefresh} 
          disabled={refreshing}
          variant="outline"
        >
          {refreshing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      )}
    </CardContent>
  </Card>
);

export const NoCompletedOrders: React.FC = () => (
  <Card>
    <CardContent className="p-8 text-center">
      <CheckCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed orders yet</h3>
      <p className="text-gray-600">
        Once you complete your first delivery, it will appear here along with customer ratings.
      </p>
    </CardContent>
  </Card>
);

export const OrderNotFound: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-4">
          The order you're looking for doesn't exist or may have been removed.
        </p>
        <Button onClick={() => window.history.back()} variant="outline">
          Go Back
        </Button>
      </CardContent>
    </Card>
  </div>
);
